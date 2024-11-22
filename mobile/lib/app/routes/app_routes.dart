part of 'app_pages.dart';

abstract class Routes {
  Routes._();
  static const LOGIN = '/login';
  static const SIGNUP = '/signup';
  static const OTP_PHONE = '/otp-phone';
  static const HOME = '/home';
  static const PROFILE = '/profile';
  static const REST_PASS1 = '/rest-pass1';
  static const ARCHIVE = '/archive';
  static const SETTINGS = '/settings';
  static const OTP_EMAIL = '/otp-email';
  static const MY_DRAWER = '/my-drawer'; // تم تصحيح التسمية لتتبع التنسيق
}
