import 'package:get/get.dart';
import 'package:maps/app/modules/auth/controllers/signup_controller.dart';

class SignupBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<SignUpController>(
      () => SignUpController(), // استخدام اسم الكلاس الصحيح
    );
  }
}
