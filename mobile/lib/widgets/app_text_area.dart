import 'package:flutter/material.dart';

class AppTextArea extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final int maxLength;
  final int minLines;

  const AppTextArea({
    super.key,
    required this.controller,
    required this.label,
    required this.hint,
    this.maxLength = 1000,
    this.minLines = 4,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      minLines: minLines,
      maxLines: minLines + 4,
      maxLength: maxLength,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        alignLabelWithHint: true,
      ),
    );
  }
}
