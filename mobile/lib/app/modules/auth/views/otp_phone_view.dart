import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:maps/app/const/size.dart';
import 'package:maps/app/global/custom_button.dart';
import 'package:maps/app/global/custome_text.dart';
import 'package:maps/app/global/text_button.dart';

import '../../../global/otp_box.dart';
import '../controllers/otp_phone_controller.dart';

class OtpPhoneView extends GetWidget<OtpController> {
  final List<TextEditingController> otpControllers =
      List.generate(6, (_) => TextEditingController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        iconTheme: IconThemeData(
          color: Theme.of(context).colorScheme.onBackground, // لون الأيقونة
        ),
        backgroundColor: Theme.of(context).colorScheme.background,
        title: CustomText(
          text: "otp_verification".tr,
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Theme.of(context).colorScheme.onBackground,
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: getHeight(context, 0.1)),

            CustomText(
              text: controller.is_email.value
                  ? "Please enter the 6-digit code sent to your email".tr
                  : "Please enter the 6-digit code sent to your phone".tr,
              fontSize: 16,
              color: Theme.of(context).colorScheme.onBackground,
            ),

            SizedBox(height: getHeight(context, 0.05)),

            // OTP Input
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                6,
                (index) => buildOtpBox(context, otpControllers[index]),
              ),
            ),

            SizedBox(height: getHeight(context, 0.05)),

            CustomButton(
              text: "submit".tr,
              onPressed: () {
                final otpCode =
                    otpControllers.map((controller) => controller.text).join();
                if (otpCode.length == 6) {
                  Get.snackbar("Success", "OTP Verified Successfully.");
                  Get.offAllNamed('/otp-email');
                } else {
                  Get.snackbar("Error", "Please enter a valid 6-digit OTP.");
                }
              },
              color: Theme.of(context).colorScheme.onBackground,
              textColor: Theme.of(context).colorScheme.background,
              width: getWidth(context, 0.9),
            ),

            SizedBox(height: getHeight(context, 0.02)),

            CustomTextButton(
              text: "resend_otp".tr,
              onPressed: () {
                // يمكن إضافة منطق لإعادة إرسال الرمز
                Get.snackbar("Info", "OTP Resent.");
              },
              backgroundColor: Theme.of(context).colorScheme.background,
              textColor: Theme.of(context).colorScheme.onBackground,
            ),
          ],
        ),
      ),
    );
  }
}
