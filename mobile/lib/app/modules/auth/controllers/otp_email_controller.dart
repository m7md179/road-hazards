import 'package:get/get.dart';

class OtpEmailController extends GetxController {
  RxList<String> otpCode = List<String>.filled(6, "").obs;
  RxBool isResending = false.obs;
  RxBool isSubmitting = false.obs;

  // تحديث قيمة OTP لكل مربع
  void updateOtpCode(int index, String value) {
    otpCode[index] = value;
  }

  // التحقق من صحة OTP
  Future<void> verifyOtp() async {
    try {
      isSubmitting.value = true;

      final otp = otpCode.join();
      if (otp.length < 6) {
        Get.snackbar("Error", "Please enter a valid 6-digit OTP.");
        return;
      }

      // محاكاة تحقق من OTP (يمكن استبداله باستدعاء API)
      await Future.delayed(Duration(seconds: 2));
      Get.snackbar("Success", "OTP Verified Successfully.");
      Get.offAllNamed('/home');
    } catch (e) {
      Get.snackbar("Error", "Failed to verify OTP. Please try again.");
    } finally {
      isSubmitting.value = false;
    }
  }

  // إعادة إرسال OTP
  Future<void> resendOtp() async {
    try {
      isResending.value = true;

      // محاكاة طلب إعادة إرسال OTP (يمكن استبداله باستدعاء API)
      await Future.delayed(Duration(seconds: 2));
      Get.snackbar("Success", "OTP has been resent successfully.");
    } catch (e) {
      Get.snackbar("Error", "Failed to resend OTP. Please try again.");
    } finally {
      isResending.value = false;
    }
  }
}
