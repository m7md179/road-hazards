import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class LoginController extends GetxController {
  // الحالة لإظهار/إخفاء النص في حقل الباسوورد
  RxBool isPasswordVisible = false.obs;

  // الأخطاء الخاصة بالإيميل والباسوورد
  RxString emailError = ''.obs;
  RxString passwordError = ''.obs;

  // حالة التحميل
  RxBool isLoading = false.obs;

  // التخزين المحلي
  final GetStorage storage = GetStorage();

  // التحقق من صيغة الإيميل
  bool validateEmail(String email) {
    final emailRegex =
        RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
    if (!emailRegex.hasMatch(email)) {
      emailError.value = "Invalid email format.".tr;
      return false;
    }
    emailError.value = '';
    return true;
  }

  // التحقق من شروط الباسوورد
  bool validatePassword(String password) {
    if (password.length < 8) {
      passwordError.value = "Password must be at least 8 characters.".tr;
      return false;
    }
    passwordError.value = '';
    return true;
  }

  // تنفيذ عملية تسجيل الدخول باستخدام Supabase
  void login(String email, String password) async {
    // التحقق من الإيميل والباسوورد
    if (!validateEmail(email) || !validatePassword(password)) {
      Get.snackbar(
        "Login Failed".tr,
        "Please correct the errors and try again.".tr,
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    // تعيين حالة التحميل إلى true
    isLoading.value = true;

    try {
      final response = await Supabase.instance.client.auth
          .signInWithPassword(email: email, password: password);

      if (response.user != null) {
        // حفظ حالة تسجيل الدخول والبيانات
        storage.write('isLoggedIn', true);
        storage.write('userEmail', email);

        // الانتقال إلى الصفحة الرئيسية
        Get.offAllNamed('/home');
      } else {
        Get.snackbar(
          "Login Failed".tr,
          "Invalid email or password. Please try again.".tr,
          snackPosition: SnackPosition.BOTTOM,
        );
      }
    } catch (e) {
      Get.snackbar(
        "Login Error".tr,
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      // تعيين حالة التحميل إلى false
      isLoading.value = false;
    }
  }

  // التبديل بين إظهار وإخفاء الباسوورد
  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  // إعادة تعيين الأخطاء عند تغيير النص
  void resetErrors() {
    emailError.value = '';
    passwordError.value = '';
  }
}
