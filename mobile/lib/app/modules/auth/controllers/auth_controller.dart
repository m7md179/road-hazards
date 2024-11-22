import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class AuthController extends GetxController {
  final GetStorage storage = GetStorage();

  // حالة تسجيل الدخول (للتحقق من تسجيل الدخول بشكل مباشر)
  bool get isLoggedIn => storage.read('isLoggedIn') ?? false;

  // بيانات المستخدم المحفوظة
  String get userEmail => storage.read('userEmail') ?? '';
  String get userName => storage.read('userName') ?? '';
  String get userPhone => storage.read('userPhone') ?? '';

  // تسجيل الدخول
  void login(String email, String password) {
    if (email == "qutibaone@gmail.com" && password == "Somo#6033") {
      // تخزين بيانات المستخدم بعد نجاح تسجيل الدخول
      storage.write('isLoggedIn', true);
      storage.write('userEmail', email);
      storage.write('userName', "John Doe"); // مثال، يمكن تغييره حسب البيانات
      storage.write('userPhone', "+962790000000"); // مثال
      Get.offAllNamed('/home');
    } else {
      Get.snackbar(
        "Login Failed",
        "Invalid email or password. Please try again.",
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  // تسجيل الحساب الجديد
  void signUp(String name, String email, String phone, String password) {
    // تسجيل البيانات في التخزين
    storage.write('isLoggedIn', true);
    storage.write('userName', name);
    storage.write('userEmail', email);
    storage.write('userPhone', phone);
    Get.offNamed('/otp'); // الانتقال إلى صفحة OTP
  }

  // التحقق من الرمز OTP
  void verifyOtp(String otp) {
    if (otp == "1234") { // تحقق ثابت، يمكن تغييره إلى تحقق ديناميكي
      Get.offAllNamed('/home');
    } else {
      Get.snackbar(
        "Error",
        "Invalid OTP. Please try again.",
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  // إعادة إرسال الرمز OTP
  void resendOtp() async {
    // إضافة مؤقت لمنع إعادة الإرسال بشكل مستمر
    await Future.delayed(Duration(seconds: 2));
    Get.snackbar(
      "OTP Sent",
      "A new OTP has been sent to your phone.",
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  // استعادة كلمة المرور
  void resetPassword(String email) {
    if (email.isEmpty || !GetUtils.isEmail(email)) {
      Get.snackbar(
        "Error",
        "Please enter a valid email address.",
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    // محاكاة إرسال رابط إعادة تعيين كلمة المرور
    Get.snackbar(
      "Success",
      "Password reset link sent to $email. Check your email.",
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  // تسجيل الخروج
  void logout() {
    storage.erase(); // حذف جميع البيانات
    Get.offAllNamed('/login');
  }

  // التحقق من حالة تسجيل الدخول
  bool isUserLoggedIn() {
    return storage.read('isLoggedIn') ?? false;
  }
}
