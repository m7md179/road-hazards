import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:maps/app/const/size.dart';
import 'package:maps/app/global/custom_button.dart';
import 'package:maps/app/global/custome_text.dart';
import 'package:maps/app/global/text_button.dart';
import 'package:maps/app/global/text_feild.dart';
import 'package:maps/app/global/theme_switcher.dart';
import 'package:maps/app/modules/auth/controllers/signup_controller.dart';

class SignUpView extends StatelessWidget {
  final SignUpController controller = Get.put(SignUpController());
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController(text: "+962");
  final passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.background,
        actions: [
          ThemeSwitcher(),
        ],
        iconTheme: IconThemeData(
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
              text: "signup".tr,
              fontSize: 40,
              color: Theme.of(context).colorScheme.onBackground,
            ),
            SizedBox(height: getHeight(context, 0.05)),

            // Name Field
            Obx(() => CustomTextField(
                  controller: nameController,
                  hintText: "name".tr,
                  backgroundColor: Theme.of(context).colorScheme.onBackground,
                  hintStyle: TextStyle(
                    color: Theme.of(context)
                        .colorScheme
                        .background
                        .withOpacity(0.6),
                  ),
                  textColor: Theme.of(context).colorScheme.background,
                  borderColor: Theme.of(context).colorScheme.background,
                  focusedBorderColor:
                      Theme.of(context).colorScheme.onBackground,
                  prefixIcon: Icon(
                    Icons.person,
                    color: Theme.of(context).colorScheme.background,
                  ),
                  errorText: controller.nameError.value.isNotEmpty
                      ? controller.nameError.value
                      : null,
                  onChanged: (value) => controller.validateName(value),
                )),

            SizedBox(height: getHeight(context, 0.02)),

            // Email Field
            Obx(() => CustomTextField(
                  controller: emailController,
                  hintText: "email".tr,
                  backgroundColor: Theme.of(context).colorScheme.onBackground,
                  hintStyle: TextStyle(
                    color: Theme.of(context)
                        .colorScheme
                        .background
                        .withOpacity(0.6),
                  ),
                  textColor: Theme.of(context).colorScheme.background,
                  borderColor: Theme.of(context).colorScheme.background,
                  focusedBorderColor:
                      Theme.of(context).colorScheme.onBackground,
                  prefixIcon: Icon(
                    Icons.email,
                    color: Theme.of(context).colorScheme.background,
                  ),
                  errorText: controller.emailError.value.isNotEmpty
                      ? controller.emailError.value
                      : null,
                  onChanged: (value) => controller.validateEmail(value),
                )),

            SizedBox(height: getHeight(context, 0.02)),

            // Phone Field
            Obx(
              () => CustomTextField(
                controller: phoneController,
                hintText: "name".tr, // إزالة hintText واعتماد labelText
                backgroundColor: Theme.of(context).colorScheme.onBackground,
                hintStyle: TextStyle(
                  color:
                      Theme.of(context).colorScheme.background.withOpacity(0.6),
                ),
                textColor: Theme.of(context).colorScheme.background,
                borderColor: Theme.of(context).colorScheme.background,
                focusedBorderColor: Theme.of(context).colorScheme.onBackground,
                prefixIcon: Icon(
                  Icons.phone,
                  color: Theme.of(context).colorScheme.background,
                ),
                textDirection: TextDirection.ltr, // لضمان اتجاه النص
                errorText: controller.phoneError.value.isNotEmpty
                    ? controller.phoneError.value
                    : null,
                keyboardType: TextInputType.phone,
                onChanged: (value) {
                  // ضمان أن النص يبدأ بـ +962
                  if (!value.startsWith("+962")) {
                    final cursorPosition = phoneController.selection.baseOffset;
                    phoneController.text = "+962";
                    phoneController.selection = TextSelection.fromPosition(
                      TextPosition(
                          offset: cursorPosition > 4 ? cursorPosition : 4),
                    );
                  } else if (value.length > 13) {
                    // منع إدخال أكثر من 9 أرقام بعد +962
                    phoneController.text = value.substring(0, 13);
                    phoneController.selection = TextSelection.fromPosition(
                      TextPosition(offset: phoneController.text.length),
                    );
                  }
                  controller.validatePhone(phoneController.text);
                },
              ),
            ),

            SizedBox(height: getHeight(context, 0.02)),

            // Password Field
            Obx(() => CustomTextField(
                  controller: passwordController,
                  hintText: "password".tr,
                  backgroundColor: Theme.of(context).colorScheme.onBackground,
                  hintStyle: TextStyle(
                    color: Theme.of(context)
                        .colorScheme
                        .background
                        .withOpacity(0.6),
                  ),
                  textColor: Theme.of(context).colorScheme.background,
                  borderColor: Theme.of(context).colorScheme.background,
                  focusedBorderColor:
                      Theme.of(context).colorScheme.onBackground,
                  obscureText: !controller.isPasswordVisible.value,
                  prefixIcon: Icon(
                    Icons.lock,
                    color: Theme.of(context).colorScheme.background,
                  ),
                  suffixIcon: Icon(
                    controller.isPasswordVisible.value
                        ? Icons.visibility
                        : Icons.visibility_off,
                    color: Theme.of(context).colorScheme.background,
                  ),
                  onTapSuffixIcon: controller.togglePasswordVisibility,
                  errorText: controller.passwordError.value.isNotEmpty
                      ? controller.passwordError.value
                      : null,
                  onChanged: (value) => controller.validatePassword(value),
                )),

            SizedBox(height: getHeight(context, 0.03)),

            // Sign Up Button
            Obx(() => controller.isLoading.value
                ? CircularProgressIndicator()
                : CustomButton(
                    text: "signup".tr,
                    onPressed: () {
                      if (controller.validateForm(
                        nameController.text,
                        emailController.text,
                        phoneController.text,
                        passwordController.text,
                      )) {
                        controller.signUp(
                          nameController.text,
                          emailController.text,
                          phoneController.text,
                          passwordController.text,
                        );
                      } else {
                        Get.snackbar(
                          "Error".tr,
                          "Please correct the errors before proceeding.".tr,
                          snackPosition: SnackPosition.BOTTOM,
                        );
                      }
                    },
                    color: Theme.of(context).colorScheme.onBackground,
                    textColor: Theme.of(context).colorScheme.background,
                    width: getWidth(context, 0.9),
                  )),

            SizedBox(height: getHeight(context, 0.02)),

            // Navigate to Login
            CustomTextButton(
              text: 'Already have an account? Login'.tr,
              onPressed: () => Get.offAllNamed('/login'),
              backgroundColor: Theme.of(context).colorScheme.background,
              textColor: Theme.of(context).colorScheme.onBackground,
            ),
          ],
        ),
      ),
    );
  }
}
