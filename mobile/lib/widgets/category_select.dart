import 'package:flutter/material.dart';
import '../constants/report_categories.dart';

class CategorySelect extends StatelessWidget {
  final String? value;
  final ValueChanged<String?> onChanged;

  const CategorySelect({super.key, required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      initialValue: value,
      decoration: const InputDecoration(labelText: 'Category (optional)'),
      isExpanded: true,
      items: [
        const DropdownMenuItem(value: null, child: Text('Not sure / prefer not to say')),
        ...kReportCategories.map(
          (c) => DropdownMenuItem(value: c.value, child: Text(c.label, overflow: TextOverflow.ellipsis)),
        ),
      ],
      onChanged: onChanged,
    );
  }
}
