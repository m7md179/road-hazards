import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RestPass1Controller extends GetxController {
  final TextEditingController emailController = TextEditingController();

  void sendResetLink() {
    final email = emailController.text.trim();
    
    if (email.isEmpty) {
      Get.snackbar("Error", "Please enter your email".tr,
          backgroundColor: Colors.red, colorText: Colors.white);
      return;
    }

    // هنا يمكنك إضافة الكود لإرسال طلب استعادة كلمة المرور
    // مثلاً: الاتصال بواجهة API لإرسال رابط الاستعادة
    // سيتم الآن عرض رسالة تأكيد نجاح الإرسال
    Get.snackbar("Success", "Reset link sent to your email".tr,
        backgroundColor: Colors.green, colorText: Colors.white);
         Get.offAllNamed('/login');
  }

  @override
  void onClose() {
    emailController.dispose();
    super.onClose();
  }
}
