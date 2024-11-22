import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:maps/app/const/size.dart';
import 'package:maps/app/global/custom_button.dart';
import 'package:maps/app/global/custome_text.dart';
import 'package:maps/app/global/language_selector.dart';
import 'package:maps/app/global/text_button.dart';
import 'package:maps/app/global/text_feild.dart';
import 'package:maps/app/global/theme_switcher.dart';
import '../../../routes/app_pages.dart';
import '../controllers/login_controller.dart';

class LoginView extends StatelessWidget {
  final LoginController controller = Get.put(LoginController());
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Get.theme.colorScheme.background,
      appBar: AppBar(
        iconTheme: IconThemeData(
          color: Theme.of(context).colorScheme.onBackground,
        ),
        backgroundColor: Get.theme.colorScheme.background,
        actions: [
          ThemeSwitcher(),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: getHeight(context, 0.098)),
            CustomText(text: "login".tr, fontSize: 40),
            SizedBox(height: getHeight(context, 0.098)),
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
            SizedBox(height: getHeight(context, 0.03)),
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
            Obx(
              () => controller.isLoading.value
                  ? CircularProgressIndicator()
                  : CustomButton(
                      text: "login".tr,
                      onPressed: () {
                        final isEmailValid =
                            controller.validateEmail(emailController.text);
                        final isPasswordValid = controller
                            .validatePassword(passwordController.text);

                        if (isEmailValid && isPasswordValid) {
                          controller.login(
                            emailController.text,
                            passwordController.text,
                          );
                        } else {
                          Get.snackbar(
                            "Error".tr,
                            "Please correct the errors before proceeding.".tr,
                            snackPosition: SnackPosition.TOP,
                          );
                        }
                      },
                      color: Theme.of(context).colorScheme.onBackground,
                      textColor: Theme.of(context).colorScheme.background,
                    ),
            ),
            SizedBox(height: getHeight(context, 0.04)),
            CustomTextButton(
              text: 'forgot_password'.tr,
              onPressed: () => Get.toNamed(Routes.REST_PASS1),
              backgroundColor: Theme.of(context).colorScheme.background,
              textColor: Theme.of(context).colorScheme.onBackground,
            ),
            SizedBox(height: getHeight(context, 0.02)),
            CustomTextButton(
              text: 'Dont have an account ? Sign Up '.tr,
              onPressed: () => Get.toNamed(Routes.SIGNUP),
              backgroundColor: Theme.of(context).colorScheme.background,
              textColor: Theme.of(context).colorScheme.onBackground,
            ),
            SizedBox(height: getHeight(context, 0.04)),
            LanguageSelector(),
          ],
        ),
      ),
    );
  }
}
