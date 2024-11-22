import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:maps/app/const/size.dart';

class LanguageSelector extends StatelessWidget {
  final double height;

  // يمكنك تعيين قيمة افتراضية للارتفاع هنا، مثلاً 50.0
  LanguageSelector({this.height = 50.0});

  @override
  Widget build(BuildContext context) {
    return Container(
      height:  getHeight(context, 0.05), // التحكم في الارتفاع
      padding: EdgeInsets.symmetric(horizontal: 15.0, vertical: 8.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.onBackground, // لون خلفية لطيف
        borderRadius: BorderRadius.circular(10.0), // زوايا مستديرة
        border: Border.all(color: Theme.of(context).colorScheme.onBackground, width: 1.5), // حدود خارجية
      ),
      child: DropdownButton<String>(
        value: Get.locale?.languageCode,
        dropdownColor: Theme.of(context).colorScheme.onBackground, // خلفية العناصر عند فتح القائمة
        underline: SizedBox(), // إزالة الخط السفلي الافتراضي
        icon: Icon(Icons.language, color: Theme.of(context).colorScheme.background), // أيقونة للقائمة
        style: TextStyle(color: Theme.of(context).colorScheme.background, fontSize: 16.0), // تنسيق النص
        items: [
          DropdownMenuItem(
            value: 'en',
            child: Text(
              'English',
              style: TextStyle(color:Theme.of(context).colorScheme.background), // لون نص العنصر
            ),
          ),
          DropdownMenuItem(
            value: 'ar',
            child: Text(
              'العربية',
              style: TextStyle(color:Theme.of(context).colorScheme.background),
            ),
          ),
        ],
        onChanged: (value) {
          if (value != null) {
            Get.updateLocale(Locale(value));
            GetStorage().write('lang', value);
          }
        },
      ),
    );
  }
}
