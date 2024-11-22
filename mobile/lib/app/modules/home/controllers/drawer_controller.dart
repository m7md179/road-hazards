import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class MyDrawerController extends GetxController { // تغيير الاسم هنا
  final GetStorage storage = GetStorage();

  void logout() async {
    try {
      if (storage.hasData('isLoggedIn')) {
        // إزالة بيانات تسجيل الدخول
        await storage.remove('isLoggedIn');
        
        // التحقق من الحذف
        if (!storage.hasData('isLoggedIn')) {
          print("User logged out successfully.");
          Get.offAllNamed('/login'); // التنقل إلى صفحة تسجيل الدخول
        } else {
          print("Failed to log out. Data still exists.");
        }
      } else {
        print("User is already logged out.");
      }
    } catch (e) {
      // التعامل مع الأخطاء
      print("An error occurred during logout: $e");
    }
  }
}
