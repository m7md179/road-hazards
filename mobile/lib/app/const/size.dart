import 'package:flutter/material.dart';

double getWidth(BuildContext context, double percentage) {
  return MediaQuery.of(context).size.width * percentage;
}

double getHeight(BuildContext context, double percentage) {
  return MediaQuery.of(context).size.height * percentage;
}
