import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class HomeController extends GetxController {
  final GetStorage storage = GetStorage();
  GoogleMapController? googleMapController;
  final RxSet<Marker> markers = <Marker>{}.obs;

  // وظيفة تسجيل الخروج مع نافذة تأكيد
  void confirmLogout() {
    Get.defaultDialog(
      title: "Confirm Logout",
      middleText: "Are you sure you want to log out?",
      textConfirm: "Yes",
      textCancel: "No",
      onConfirm: () {
        logout(); // استدعاء وظيفة تسجيل الخروج
        Get.back(); // إغلاق نافذة التأكيد
      },
      onCancel: () => Get.back(), // إغلاق النافذة إذا تم اختيار "No"
    );
  }

  // وظيفة تسجيل الخروج الأساسية
  void logout() async {
    try {
      if (storage.hasData('isLoggedIn')) {
        // محاولة إزالة البيانات من التخزين
        await storage.remove('isLoggedIn');

        // التحقق إذا تم إزالة البيانات بنجاح
        if (!storage.hasData('isLoggedIn')) {
          print("User logged out successfully.");

          // التنقل إلى صفحة تسجيل الدخول
          Get.offAllNamed('/login');
        } else {
          print("Failed to log out. Data still exists.");
        }
      } else {
        print("User is already logged out.");
      }
    } catch (e) {
      // التعامل مع الأخطاء أثناء العملية
      print("An error occurred during logout: $e");
    }
  }

  // إضافة Marker إلى الخريطة
  void addMarker(LatLng position, String id) {
    final marker = Marker(
      markerId: MarkerId(id),
      position: position,
    );
    markers.add(marker);
  }

  // تحريك الكاميرا إلى موقع معين
  void moveCamera(LatLng target) {
    if (googleMapController != null) {
      googleMapController!.animateCamera(CameraUpdate.newLatLng(target));
    } else {
      print("GoogleMapController is not initialized yet.");
    }
  }

  @override
  void onClose() {
    googleMapController?.dispose(); // التخلص من GoogleMapController بأمان
    super.onClose();
  }
}
