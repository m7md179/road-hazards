import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final TextEditingController? controller; // التحكم بالنص
  final String? hintText; // النص التلميحي
  final String? errorText; // نص الخطأ
  final Color textColor; // لون النص داخل الحقل
  final Color backgroundColor; // لون الخلفية
  final Color borderColor; // لون الحدود
  final Color focusedBorderColor; // لون الحدود عند التركيز
  final Color labelColor; // لون النص التوضيحي
  final double borderRadius; // نصف قطر الحدود
  final double fontSize; // حجم النص داخل الحقل
  final FontWeight fontWeight; // سمك النص داخل الحقل
  final TextInputType keyboardType; // نوع لوحة المفاتيح
  final bool obscureText; // لجعل النص مخفي
  final int? maxLength; // الحد الأقصى للأحرف
  final TextAlign textAlign; // محاذاة النص
  final Icon? prefixIcon; // أيقونة على اليسار
  final Icon? suffixIcon; // أيقونة على اليمين
  final VoidCallback? onTapSuffixIcon; // دالة تستدعي عند الضغط على الأيقونة اليمنى
  final Function(String)? onChanged; // دالة تستدعي عند تغيير النص
  final TextStyle? hintStyle; // تنسيق النص التلميحي
  final TextStyle? errorStyle; // تنسيق نص الخطأ
  final TextStyle? labelStyle; // تنسيق النص التوضيحي
  final int? maxLines; // عدد الأسطر للنص
  final bool readOnly; // لجعل الحقل للقراءة فقط
  final VoidCallback? onTap; // استدعاء عند الضغط على الحقل
  final TextDirection? textDirection; // إضافة خاصية تحديد اتجاه النص

  const CustomTextField({
    Key? key,
    this.controller,
    this.hintText,
    this.errorText,
    this.textColor = Colors.black,
    this.backgroundColor = Colors.white,
    this.borderColor = Colors.grey,
    this.focusedBorderColor = Colors.blue,
    this.labelColor = Colors.grey,
    this.borderRadius = 8.0,
    this.fontSize = 16.0,
    this.fontWeight = FontWeight.normal,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.maxLength,
    this.textAlign = TextAlign.start,
    this.prefixIcon,
    this.suffixIcon,
    this.onTapSuffixIcon,
    this.onChanged,
    this.hintStyle,
    this.errorStyle,
    this.labelStyle,
    this.maxLines = 1,
    this.readOnly = false,
    this.onTap,
    this.textDirection, // خاصية جديدة
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller, // ربط الـ controller بالحقل
      onChanged: onChanged,
      keyboardType: keyboardType,
      obscureText: obscureText,
      maxLength: maxLength,
      textAlign: textAlign,
      textDirection: textDirection, // تحديد اتجاه النص
      maxLines: maxLines,
      readOnly: readOnly,
      onTap: onTap,
      style: TextStyle(
        color: textColor,
        fontSize: fontSize,
        fontWeight: fontWeight,
      ),
      decoration: InputDecoration(
        hintText: hintText,
        errorText: errorText,
        hintStyle: hintStyle ??
            TextStyle(
              color: textColor.withOpacity(0.6),
              fontSize: fontSize,
            ),
        errorStyle: errorStyle ??
            TextStyle(
              color: Colors.red,
              fontSize: fontSize - 2,
            ),
        labelStyle: labelStyle ??
            TextStyle(
              color: labelColor,
              fontSize: fontSize,
              fontWeight: fontWeight,
            ),
        filled: true,
        fillColor: backgroundColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: BorderSide(color: focusedBorderColor, width: 2.0),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: BorderSide(color: Colors.red),
        ),
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon != null
            ? GestureDetector(
                onTap: onTapSuffixIcon,
                child: suffixIcon,
              )
            : null,
        counterText: "", // لإخفاء العداد الافتراضي للأحرف
      ),
    );
  }
}
