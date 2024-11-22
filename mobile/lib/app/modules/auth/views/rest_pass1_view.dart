import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/rest_pass1_controller.dart';

class RestPass1View extends StatelessWidget {
  final RestPass1Controller controller = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
             iconTheme: IconThemeData(
    color: Theme.of(context).colorScheme.onBackground, // لون الأيقونة
  ),
        title: Text(
          "reset_password".tr,
          style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
        ),
        backgroundColor: Theme.of(context).colorScheme.background,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Enter your email to reset your password".tr,
              style: TextStyle(
                fontSize: 18,
                color: Theme.of(context).colorScheme.onBackground,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 20),
            TextField(
              controller: controller.emailController,
              style: TextStyle(
                color: Theme.of(context).colorScheme.background,
              ),
              decoration: InputDecoration(
                hintText: "Enter your email".tr,
                hintStyle: TextStyle(
                  color: Theme.of(context).colorScheme.background.withOpacity(0.6),
                ),
                filled: true,
                fillColor: Theme.of(context).colorScheme.onBackground,
                border: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: Theme.of(context).colorScheme.onBackground,
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: Theme.of(context).colorScheme.onBackground,
                    width: 2.0,
                  ),
                ),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: controller.sendResetLink,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.onBackground,
              ),
              child: Text(
                "send_reset_link".tr,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.background,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
