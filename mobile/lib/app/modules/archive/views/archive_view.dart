import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/archive_controller.dart';

class ArchiveView extends GetView<ArchiveController> {
  const ArchiveView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Archive'),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          'This feature will coming soon',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
