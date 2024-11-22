import 'package:get/get.dart';
import '../controllers/google_map_controller.dart';

class GoogleMapBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MapController>(() => MapController());
  }
}
