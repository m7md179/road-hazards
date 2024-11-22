import 'package:get/get.dart';

import '../modules/archive/bindings/archive_binding.dart';
import '../modules/archive/views/archive_view.dart';
import '../modules/auth/bindings/auth_binding.dart';
import '../modules/auth/bindings/otp_email_binding.dart';
import '../modules/auth/bindings/otp_phone_binding.dart';
import '../modules/auth/bindings/rest_pass1_binding.dart';
import '../modules/auth/views/login_view.dart';
import '../modules/auth/views/otp_email_view.dart';
import '../modules/auth/views/otp_phone_view.dart';
import '../modules/auth/views/rest_pass1_view.dart';
import '../modules/auth/views/signup_view.dart';
import '../modules/home/bindings/drawer_home_binding.dart';
import '../modules/home/bindings/home_binding.dart';
import '../modules/home/views/home_drawer.dart';
import '../modules/home/views/home_view.dart';
import '../modules/profile/bindings/profile_binding.dart';
import '../modules/profile/views/profile_view.dart';
import '../modules/settings/bindings/settings_binding.dart';
import '../modules/settings/views/settings_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  // المسار الابتدائي للتطبيق
  static const INITIAL = Routes.LOGIN;

  // تعريف جميع الصفحات مع الربط بين المسارات والـ Binding
  static final routes = [
    // صفحة تسجيل الدخول
    GetPage(
      name: Routes.LOGIN,
      page: () => LoginView(),
      binding: AuthBinding(),
    ),

    // صفحة إنشاء الحساب
    GetPage(
      name: Routes.SIGNUP,
      page: () => SignUpView(),
      binding: AuthBinding(),
    ),

    // صفحة OTP الهاتف
    GetPage(
      name: Routes.OTP_PHONE,
      page: () => OtpPhoneView(),
      binding: OtpBinding(),
    ),

    // الصفحة الرئيسية
    GetPage(
      name: Routes.HOME,
      page: () => HomeView(),
      binding: HomeBinding(),
    ),

    // صفحة الملف الشخصي
    GetPage(
      name: Routes.PROFILE,
      page: () => ProfileView(),
      binding: ProfileBinding(),
    ),

    // صفحة إعادة تعيين كلمة المرور
    GetPage(
      name: Routes.REST_PASS1,
      page: () => RestPass1View(),
      binding: RestPass1Binding(),
    ),

    // صفحة الأرشيف
    GetPage(
      name: Routes.ARCHIVE,
      page: () => const ArchiveView(),
      binding: ArchiveBinding(),
    ),

    // صفحة الإعدادات
    GetPage(
      name: Routes.SETTINGS,
      page: () => const SettingsView(),
      binding: SettingsBinding(),
    ),

    // صفحة OTP البريد الإلكتروني
    GetPage(
      name: Routes.OTP_EMAIL,
      page: () => OtpEmailView(),
      binding: OtpEmailBinding(),
    ),

    // صفحة القائمة الجانبية
    GetPage(
      name: Routes.MY_DRAWER, // تم تصحيح التسمية
      page: () => MyDrawer(),
      binding: DrawerHomeBinding(),
    ),
  ];
}
