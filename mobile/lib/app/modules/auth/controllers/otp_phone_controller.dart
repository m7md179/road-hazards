import 'package:get/get.dart';

class OtpController extends GetxController {
  //TODO: Implement OtpController

  late RxBool is_email;
  final count = 0.obs;
  @override
  void onInit() {
    is_email = (Get.arguments?['type'] == 'email').obs;
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }

  void increment() => count.value++;
}
