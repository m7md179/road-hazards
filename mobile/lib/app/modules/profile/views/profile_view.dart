import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/profile_controller.dart';

class ProfileView extends StatelessWidget {
  final ProfileController controller = Get.find<ProfileController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "profile".tr,
          style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
        ),
        iconTheme: IconThemeData(
          color: Theme.of(context).colorScheme.onBackground,
        ),
        backgroundColor: Theme.of(context).colorScheme.background,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // الصورة الشخصية
            Center(
              child: Stack(
                children: [
                  Obx(() => CircleAvatar(
                        radius: 50,
                        backgroundImage: controller.profileImage.value == null
                            ? AssetImage("lib/app/assets/images/OIP.jpeg")
                                as ImageProvider
                            : FileImage(controller.profileImage.value!),
                      )),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: IconButton(
                      icon: Icon(
                        Icons.camera_alt,
                        color: Theme.of(context).colorScheme.onBackground,
                      ),
                      onPressed: () {
                        // فتح نافذة اختيار صورة
                      },
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),

            // اسم المستخدم
            Obx(() => Text(
                  controller.userName.value,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onBackground,
                  ),
                )),

            SizedBox(height: 20),

            // البريد الإلكتروني
            ListTile(
              leading: Icon(Icons.email,
                  color: Theme.of(context).colorScheme.onBackground),
              title: Text(
                "email".tr,
                style:
                    TextStyle(color: Theme.of(context).colorScheme.onBackground),
              ),
              subtitle: Obx(() => Text(
                    controller.email.value,
                    style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground),
                  )),
            ),

            // رقم الهاتف
            ListTile(
              leading: Icon(Icons.phone,
                  color: Theme.of(context).colorScheme.onBackground),
              title: Text(
                "phone".tr,
                style:
                    TextStyle(color: Theme.of(context).colorScheme.onBackground),
              ),
              subtitle: Obx(() => Text(
                    controller.phoneNumber.value,
                    style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground),
                  )),
            ),

            SizedBox(height: 20),

            // زر إعادة تعيين كلمة المرور
            ElevatedButton(
              onPressed: () => Get.toNamed('/rest-pass1'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.onBackground,
              ),
              child: Text(
                "reset_password".tr,
                style: TextStyle(color: Theme.of(context).colorScheme.background),
              ),
            ),

            SizedBox(height: 20),

            // زر حذف الحساب
            ElevatedButton(
              onPressed: () {
                // منطق حذف الحساب
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.error,
              ),
              child: Text(
                "delete_account".tr,
                style: TextStyle(color: Theme.of(context).colorScheme.background),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
