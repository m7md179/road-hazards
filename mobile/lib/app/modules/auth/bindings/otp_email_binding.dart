import 'package:get/get.dart';
import '../controllers/otp_email_controller.dart';

class OtpEmailBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<OtpEmailController>(
      () => OtpEmailController(),
    );
  }
}
