import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/settings_controller.dart';
import 'package:maps/app/global/language_selector.dart';
import 'package:maps/app/global/theme_switcher.dart';

class SettingsView extends GetView<SettingsController> {
  const SettingsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'settings'.tr,
          style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
        ),
        backgroundColor: Theme.of(context).colorScheme.background,
        centerTitle: true,
        iconTheme: IconThemeData(
          color: Theme.of(context).colorScheme.onBackground, // لون أيقونات AppBar
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // قسم تغيير اللغة
            ListTile(
              leading: LanguageSelector() // مكون لتحديد اللغة
            ),
            Divider(color: Theme.of(context).colorScheme.onBackground.withOpacity(0.3)),

            // قسم تغيير السمة
            ListTile(
              leading:ThemeSwitcher(), // مكون لتبديل السمة
            ),
            Divider(color: Theme.of(context).colorScheme.onBackground.withOpacity(0.3)),

            // قسم التحكم بالإشعارات
            GetBuilder<SettingsController>(
              builder: (controller) {
                return ListTile(
                  leading: Icon(Icons.notifications, color: Theme.of(context).colorScheme.onBackground),
                  title: Text(
                    'notifications'.tr,
                    style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
                  ),
                 /* trailing: Switch(
                    value: controller.notificationsEnabled.value,
                    onChanged: (value) => controller.toggleNotifications(value),
                    activeColor: Theme.of(context).colorScheme.primary,
                  ),*/
                );
              },
            ),
            Divider(color: Theme.of(context).colorScheme.onBackground.withOpacity(0.3)),
          ],
        ),
      ),
    );
  }
}
