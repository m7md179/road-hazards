import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'dart:io';
//import 'package:image_picker/image_picker.dart';

class ProfileController extends GetxController {
  // متغيرات لمعلومات المستخدم
  var profileImage = Rx<File?>(null); // يجب أن تكون كـ Rx
  var userName = "User Name".obs; // يجب أن تكون كـ Rx
  var email = "example@gmail.com".obs; // يجب أن تكون كـ Rx
  var phoneNumber = "123456789".obs; // يجب أن تكون كـ Rx

  // الدالة لاختيار صورة جديدة
  /*Future<void> pickImage() async {
    final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      profileImage.value = File(pickedFile.path);
    }
  }*/

  // دالة حذف الحساب
  void deleteAccount() {
    // منطق حذف الحساب
    Get.snackbar("Account", "Account deleted successfully",
        backgroundColor: Colors.red, colorText: Colors.white);
  }
}
