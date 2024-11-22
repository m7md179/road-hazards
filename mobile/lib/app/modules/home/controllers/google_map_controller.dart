import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart'; // مكتبة الموقع

class MapController extends GetxController {
  GoogleMapController? mapController; // للتحكم بالخريطة
  final RxSet<Marker> markers = <Marker>{}.obs; // مجموعة العلامات على الخريطة
  final Rx<CameraPosition> currentPosition = CameraPosition(
    target: LatLng(31.963158, 35.930359), // الموقع الافتراضي
    zoom: 15,
  ).obs;

  final RxBool isLoading = false.obs; // مؤشر حالة تحميل العلامات أو البيانات
  final RxString errorMessage = ''.obs; // رسالة الخطأ في حالة حدوث خطأ

  // تحميل العلامات من مصدر خارجي (محاكاة)
  Future<void> loadMarkers() async {
    try {
      isLoading.value = true;
      await Future.delayed(Duration(seconds: 2)); // محاكاة تحميل البيانات
      markers.addAll([
        Marker(
          markerId: MarkerId("1"),
          position: LatLng(31.963158, 35.930359),
          infoWindow: InfoWindow(title: "Marker 1"),
        ),
        Marker(
          markerId: MarkerId("2"),
          position: LatLng(31.968158, 35.930359),
          infoWindow: InfoWindow(title: "Marker 2"),
        ),
      ]);
    } catch (e) {
      errorMessage.value = "Failed to load markers: $e";
    } finally {
      isLoading.value = false;
    }
  }

  // لتحديث موضع الكاميرا
  void moveCamera(LatLng target) {
    if (mapController != null) {
      mapController!.animateCamera(
        CameraUpdate.newLatLng(target),
      );
      currentPosition.value = CameraPosition(target: target, zoom: 15);
    } else {
      errorMessage.value = "MapController is not initialized.";
    }
  }

  // لإضافة علامة جديدة
  void addMarker(LatLng position, String markerId) {
    final Marker marker = Marker(
      markerId: MarkerId(markerId),
      position: position,
      infoWindow: InfoWindow(title: "New Marker $markerId"),
    );
    markers.add(marker);
  }

  // لإضافة علامة في الموقع الحالي
  Future<void> addMarkerAtCurrentLocation() async {
    try {
      Position currentPosition = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      final LatLng currentLatLng =
          LatLng(currentPosition.latitude, currentPosition.longitude);
      final String markerId = 'marker_${markers.length + 1}';

      addMarker(currentLatLng, markerId);
      moveCamera(currentLatLng); // تحريك الكاميرا إلى الموقع الحالي
    } catch (e) {
      errorMessage.value = "Failed to get current location: $e";
    }
  }

  // لإزالة علامة محددة
  void removeMarker(String markerId) {
    markers.removeWhere((marker) => marker.markerId.value == markerId);
  }

  // لإزالة جميع العلامات
  void clearMarkers() {
    markers.clear();
  }

  // إعداد `GoogleMapController` عند إنشاء الخريطة
  void onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  @override
  void onClose() {
    mapController?.dispose(); // تنظيف موارد التحكم بالخريطة
    super.onClose();
  }
}
