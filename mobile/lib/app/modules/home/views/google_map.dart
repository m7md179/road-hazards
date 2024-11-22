import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import '../controllers/google_map_controller.dart';

class GoogleMapView extends StatelessWidget {
  final MapController controller = Get.find();

  final CameraPosition _initialPosition = CameraPosition(
    target: LatLng(31.963158, 35.930359), // الموقع الافتراضي (عمان)
    zoom: 15,
  );

  Future<void> _addMarkerToCurrentLocation(BuildContext context) async {
    try {
      // التحقق من الأذونات
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception("Location permissions are denied");
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception(
            "Location permissions are permanently denied. Enable permissions in app settings.");
      }

      // الحصول على الموقع الحالي
      Position currentPosition = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);

      // إضافة العلامة إلى الموقع الحالي
      controller.addMarker(
        LatLng(currentPosition.latitude, currentPosition.longitude),
        'marker_${controller.markers.length + 1}',
      );

      // تحريك الكاميرا إلى الموقع الحالي
      controller.moveCamera(
        LatLng(currentPosition.latitude, currentPosition.longitude),
      );
    } catch (e) {
      Get.snackbar(
        "Error",
        e.toString(),
        backgroundColor: Colors.red,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Obx(
            () => GoogleMap(
              initialCameraPosition: _initialPosition,
              mapType: MapType.normal,
              onMapCreated: controller.onMapCreated, // إعداد الخريطة عند إنشائها
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
              markers: controller.markers.toSet(),
              onCameraMove: (position) {
                controller.currentPosition.value = position;
              },
              onCameraIdle: () {
                print(
                    "Camera idle at: ${controller.currentPosition.value.target}");
              },
            ), 
          ),
          Positioned(
            bottom: 200,
            right: 16,
            child: FloatingActionButton(
              onPressed: () => _addMarkerToCurrentLocation(context),
              backgroundColor: Theme.of(context).colorScheme.background,
              child: Icon(Icons.add , color: Theme.of(context).colorScheme.onBackground,),
            ),
          ),
          Obx(() {
            if (controller.isLoading.value) {
              return Positioned(
                top: 20,
                right: 20,
                child: CircularProgressIndicator(),
              );
            } else if (controller.errorMessage.isNotEmpty) {
              return Positioned(
                top: 20,
                right: 20,
                child: Text(
                  controller.errorMessage.value,
                  style: TextStyle(color: Colors.red),
                ),
              );
            }
            return SizedBox.shrink();
          }),
        ],
      ),
    );
  }
}
