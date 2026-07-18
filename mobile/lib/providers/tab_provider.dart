import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Index into HomeShell's bottom tabs: 0 Check, 1 Report, 2 History, 3 Stats.
final selectedTabProvider = StateProvider<int>((ref) => 0);
