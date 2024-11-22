import 'package:flutter/material.dart';
import 'package:maps/app/const/size.dart';

Widget buildOtpBox(
  BuildContext context,
  TextEditingController controller, {
  Color hintColor = Colors.grey, // لون النص التلميحي
}) {
  return Container(
    width: getWidth(context, 0.12),
    height: getWidth(context, 0.12),
    alignment: Alignment.center,
    decoration: BoxDecoration(
      color:  Theme.of(context).colorScheme.onBackground, // لون الخلفية
      borderRadius: BorderRadius.circular(8),
    ),
    child: TextField(
      controller: controller,
      maxLength: 1,
      textAlign: TextAlign.center,
      keyboardType: TextInputType.number,
      style: TextStyle(color:  Theme.of(context).colorScheme.background, fontSize: 18), // لون النص وحجمه
      decoration: InputDecoration(
        filled: true,
        fillColor: Theme.of(context).colorScheme.onBackground, // لون الخلفية
        counterText: "", // لإخفاء العداد
        hintText: "*", // رمز تلميحي
        hintStyle: TextStyle(color:  Theme.of(context).colorScheme.secondary), // لون النص التلميحي
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Theme.of(context).colorScheme.onBackground, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Theme.of(context).colorScheme.secondary, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color:  Theme.of(context).colorScheme.onBackground, width: 1.5),
        ),
      ),
      onChanged: (value) {
        if (value.isNotEmpty) {
          FocusScope.of(context).nextFocus(); // الانتقال إلى الحقل التالي تلقائيًا
        }
      },
    ),
  );
}
