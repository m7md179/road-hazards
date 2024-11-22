import 'package:flutter/material.dart';

class CustomTextButton extends StatelessWidget {
  final String text; // النص الذي يظهر داخل الزر
  final Color textColor; // لون النص داخل الزر
  final double fontSize; // حجم النص داخل الزر
  final FontWeight fontWeight; // سمك النص داخل الزر
  final VoidCallback onPressed; // الدالة التي يتم استدعاؤها عند الضغط على الزر
  final Color backgroundColor; // لون خلفية الزر

  const CustomTextButton({
    Key? key,
    required this.text,
    required this.onPressed,
    this.textColor = Colors.white,
    this.fontSize = 16.0,
    this.fontWeight = FontWeight.normal,
    this.backgroundColor = Colors.blue,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed, 
      style: TextButton.styleFrom(
        foregroundColor: textColor, backgroundColor: backgroundColor, 
        textStyle: TextStyle(
          fontSize: fontSize, 
          fontWeight: fontWeight,
        ),
        padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0), 
      ),
      child: Text(text),
    );
  }
}
