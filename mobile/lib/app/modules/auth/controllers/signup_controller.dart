import 'package:crypto/crypto.dart';
import 'dart:convert'; // لتحويل النصوص إلى UTF-8
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../routes/app_pages.dart';

class SignUpController extends GetxController {
  RxString nameError = ''.obs;
  RxString emailError = ''.obs;
  RxString phoneError = ''.obs;
  RxString passwordError = ''.obs;
  RxBool isPasswordVisible = false.obs;
  RxBool isLoading = false.obs;

  final GetStorage storage = GetStorage();

  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  bool validateName(String name) {
    if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(name)) {
      nameError.value = "Name must contain only letters and spaces.";
      return false;
    }
    nameError.value = '';
    return true;
  }

  bool validateEmail(String email) {
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email)) {
      emailError.value = "Invalid email format.";
      return false;
    }
    emailError.value = '';
    return true;
  }

  bool validatePhone(String phone) {
    if (!phone.startsWith("+962") ||
        !RegExp(r'^\+962[0-9]{9}$').hasMatch(phone)) {
      phoneError.value = "Phone must start with +962 and contain 9 digits.";
      return false;
    }
    phoneError.value = '';
    return true;
  }

  bool validatePassword(String password) {
    final hasUppercase = password.contains(RegExp(r'[A-Z]'));
    final hasDigits = password.contains(RegExp(r'[0-9]'));
    final hasSpecialCharacters =
        password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
    final hasMinLength = password.length >= 8;

    if (!hasUppercase || !hasDigits || !hasSpecialCharacters || !hasMinLength) {
      passwordError.value =
          "Password must be at least 8 characters long, contain uppercase letters, numbers, and special characters.";
      return false;
    }
    passwordError.value = '';
    return true;
  }

  bool validateForm(String name, String email, String phone, String password) {
    final isNameValid = validateName(name);
    final isEmailValid = validateEmail(email);
    final isPhoneValid = validatePhone(phone);
    final isPasswordValid = validatePassword(password);

    return isNameValid && isEmailValid && isPhoneValid && isPasswordValid;
  }

  String hashPassword(String password) {
    final bytes = utf8.encode(password); // تحويل النص إلى بايتات
    final hashed = sha256.convert(bytes); // تشفير النص باستخدام SHA-256
    return hashed.toString(); // إعادة النص المشفر
  }

  void signUp(String name, String email, String phone, String password) async {
    isLoading.value = true;

    try {
      // تشفير كلمة المرور قبل إرسالها
      final hashedPassword = hashPassword(password);

      // إنشاء حساب جديد في Supabase
      final AuthResponse response = await Supabase.instance.client.auth.signUp(
        email: email,
        password: password,
      );

      // التحقق إذا تم إنشاء المستخدم بنجاح
      if (response.user != null) {
        // إضافة بيانات المستخدم إلى جدول "users"
        await Supabase.instance.client.from('users').insert({
          'name': name,
          'email': email,
          'phone': phone,
          'password_hash': hashedPassword, // تخزين كلمة المرور المشفرة
        });

        // حفظ حالة تسجيل الدخول والبيانات في التخزين المحلي
        storage.write('isLoggedIn', true);
        storage.write('userName', name);
        storage.write('userEmail', email);
        storage.write('userPhone', phone);

        // الانتقال إلى الصفحة الرئيسية
        Get.offAllNamed(Routes.HOME);
      } else {
        throw Exception("Unexpected error occurred during sign-up.");
      }
    } catch (e) {
      // التعامل مع الأخطاء
      Get.snackbar(
        "Sign Up Error",
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }
}
