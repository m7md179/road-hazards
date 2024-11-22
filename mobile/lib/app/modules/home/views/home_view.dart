import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:maps/app/const/size.dart';
import 'package:maps/app/modules/home/controllers/google_map_controller.dart';
import 'package:maps/app/modules/home/views/google_map.dart';
import 'package:maps/app/modules/home/views/home_drawer.dart';
import '../controllers/home_controller.dart';

class HomeView extends StatelessWidget {
  final HomeController controller = Get.find();
  final MapController controlle = Get.put(MapController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(
          color: Theme.of(context).colorScheme.onBackground, // لون الأيقونة
        ),
        title: Text(
          "home".tr,
          style: TextStyle(color: Theme.of(context).colorScheme.onBackground),
        ),
        backgroundColor: Theme.of(context).colorScheme.background,
      ),
      drawer: MyDrawer(),
      body: Stack(
        children: [
          GoogleMapView(),
          Positioned(
            bottom: getHeight(context, 0.15), // المسافة من أسفل الشاشة
            right: 16, // المسافة من يمين الشاشة
            child: FloatingActionButton(
              onPressed: () {
                // تنفيذ إجراء التبليغ هنا
                Get.snackbar(
                  "Report",
                  "صبركم لسا ما فعلناها",
                  snackPosition: SnackPosition.BOTTOM,
                );
              },
              backgroundColor: Theme.of(context).colorScheme.background,
              child: Icon(Icons.report,
                  color: Theme.of(context).colorScheme.onBackground, ),
            ),
          ),
        ],
      ),
    );
  }
}
