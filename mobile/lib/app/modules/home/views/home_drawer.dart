import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:maps/app/modules/home/controllers/drawer_controller.dart';

class MyDrawer extends StatelessWidget {
  final MyDrawerController controller = Get.put(MyDrawerController());

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Theme.of(context).colorScheme.background,
      child: Column(
        children: [
          // معلومات المستخدم في الأعلى
          UserAccountsDrawerHeader(
            accountName: Text(
              "user name".tr,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onBackground,
              ),
            ),
            accountEmail: Text(
              "grad24@gmail.com",
              style: TextStyle(
                color: Theme.of(context).colorScheme.onBackground.withOpacity(0.8),
              ),
            ),
            currentAccountPicture: CircleAvatar(
              backgroundImage: AssetImage("lib/app/assets/images/OIP.jpeg"),
            ),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.background,
            ),
          ),
          // العناصر الرئيسية
          ListTile(
            leading: Icon(Icons.person, color: Theme.of(context).colorScheme.onBackground),
            title: Text(
              "profile".tr,
              style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
            ),
            onTap: () => Get.toNamed('/profile'),
          ),
          ListTile(
            leading: Icon(Icons.archive, color: Theme.of(context).colorScheme.onBackground),
            title: Text(
              "archive".tr,
              style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
            ),
            onTap: () => Get.toNamed('/archive'),
          ),
          ListTile(
            leading: Icon(Icons.help_outline, color: Theme.of(context).colorScheme.onBackground),
            title: Text(
              "help".tr,
              style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
            ),
            onTap: () => Get.toNamed('/help'),
          ),
          ListTile(
            leading: Icon(Icons.contact_mail, color: Theme.of(context).colorScheme.onBackground),
            title: Text(
              "Call Us".tr,
              style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
            ),
            onTap: () => Get.toNamed('/contact'),
          ),
          ListTile(
            leading: Icon(Icons.settings, color: Theme.of(context).colorScheme.onBackground),
            title: Text(
              "settings".tr,
              style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
            ),
            onTap: () => Get.toNamed('/settings'),
          ),
          Spacer(),
          // زر تسجيل الخروج
          Padding(
            padding: const EdgeInsets.only(bottom: 16.0),
            child: ListTile(
              leading: Icon(Icons.logout, color: Colors.red),
              title: Text(
                "logout".tr,
                style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
              ),
              onTap: () => controller.logout(), // استدعاء دالة تسجيل الخروج
            ),
          ),
        ],
      ),
    );
  }
}
