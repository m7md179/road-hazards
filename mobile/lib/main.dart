import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:maps/app/AppTranslations/translations.dart';
import 'package:maps/app/theme/app_theme.dart';
import 'app/routes/app_pages.dart';
import 'app/supabase_config.dart';

void main() async {
  await GetStorage.init();
  WidgetsFlutterBinding.ensureInitialized();
  await initSupabase(); // تهيئة التخزين المحلي
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final GetStorage storage = GetStorage();

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'My App',
      theme: AppTheme.light.copyWith(
        textSelectionTheme: TextSelectionThemeData(
          cursorColor: Colors.white, // لون المؤشر للوضع النهاري
          selectionColor: Colors.white.withOpacity(0.3), // لون النص المحدد
          selectionHandleColor: Colors.white, // لون المقبض
        ),
      ),
      darkTheme: AppTheme.dark.copyWith(
        textSelectionTheme: TextSelectionThemeData(
          cursorColor: Colors.black, // لون المؤشر للوضع الليلي
          selectionColor: Colors.black.withOpacity(0.3), // لون النص المحدد
          selectionHandleColor: Colors.black, // لون المقبض
        ),
      ),
      themeMode: _getThemeMode(), // تحديد الثيم بناءً على التخزين
      initialRoute: _getInitialRoute(), // تحديد الصفحة الأولية
      getPages: AppPages.routes,
      translations: AppTranslations(),
      locale: Locale(storage.read('lang') ?? 'en'), // اللغة الافتراضية
    );
  }

  ThemeMode _getThemeMode() {
    final bool isDarkMode = GetStorage().read('isDarkMode') ?? false;
    return isDarkMode ? ThemeMode.dark : ThemeMode.light;
  }

  String _getInitialRoute() {
    final bool isLoggedIn = GetStorage().read('isLoggedIn') ?? false;
    return isLoggedIn ? '/home' : AppPages.INITIAL;
  }
}
