import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'color_schemes.g.dart';

abstract class AppTheme {
  static get light => ThemeData(
        useMaterial3: true,
        colorScheme: lightColorScheme,
        scaffoldBackgroundColor: lightColorScheme.background,
        appBarTheme: _appBarTheme(),
        listTileTheme: _listTileThemeData(),
        iconButtonTheme: _iconButtonThemeData(),
        progressIndicatorTheme: _lightProgressIndicatorThemeData(),
        textButtonTheme: _textButtonThemeData(),
      );

  static get dark => ThemeData(
        useMaterial3: true,
        colorScheme: darkColorScheme,
        scaffoldBackgroundColor: darkColorScheme.background,
        appBarTheme: _appBarTheme(),
        listTileTheme: _listTileThemeData(),
        iconButtonTheme: _iconButtonThemeData(),
        progressIndicatorTheme: _darkProgressIndicatorThemeData(),
        textButtonTheme: _textButtonThemeData(),
      );

  static TextButtonThemeData _textButtonThemeData() {
    return TextButtonThemeData(
      style: ButtonStyle(
        overlayColor: MaterialStateProperty.all(Colors.transparent),
      ),
    );
  }

  //! Theme .........
  static ProgressIndicatorThemeData _lightProgressIndicatorThemeData() {
    return ProgressIndicatorThemeData(
      refreshBackgroundColor: lightColorScheme.onPrimary,
      circularTrackColor: lightColorScheme.onPrimary,
      color: lightColorScheme.primary,
    );
  }

  static ProgressIndicatorThemeData _darkProgressIndicatorThemeData() {
    return ProgressIndicatorThemeData(
      refreshBackgroundColor: darkColorScheme.onPrimary,
      circularTrackColor: darkColorScheme.onPrimary,
      color: darkColorScheme.primary,
    );
  }

  static ListTileThemeData _listTileThemeData() {
    return ListTileThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
    );
  }

  static AppBarTheme _appBarTheme() {
    return const AppBarTheme(
      // backgroundColor: AppColors.background,
      elevation: 0,
      systemOverlayStyle: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
      ),
    );
  }

  static IconButtonThemeData _iconButtonThemeData() {
    return IconButtonThemeData(
      style: ButtonStyle(
        shape: MaterialStateProperty.all(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }
}
