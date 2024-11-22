import 'package:get/get.dart';
import '../controllers/rest_pass1_controller.dart';

class RestPass1Binding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<RestPass1Controller>(() => RestPass1Controller());
  }
}
