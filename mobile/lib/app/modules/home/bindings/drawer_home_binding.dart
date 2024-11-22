import 'package:get/get.dart';
import '../controllers/drawer_controller.dart';

class DrawerHomeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MyDrawerController>(() => MyDrawerController());
  }
}
