import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/tab_provider.dart';
import 'classify_screen.dart';
import 'report_screen.dart';
import 'history_screen.dart';
import 'stats_screen.dart';

class HomeShell extends ConsumerWidget {
  const HomeShell({super.key});

  static const _screens = [
    ClassifyScreen(),
    ReportScreen(),
    HistoryScreen(),
    StatsScreen(),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final index = ref.watch(selectedTabProvider);

    return Scaffold(
      body: IndexedStack(index: index, children: _screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: index,
        onTap: (i) => ref.read(selectedTabProvider.notifier).state = i,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.search_rounded), label: 'Check'),
          BottomNavigationBarItem(icon: Icon(Icons.flag_outlined), label: 'Report'),
          BottomNavigationBarItem(icon: Icon(Icons.history_rounded), label: 'History'),
          BottomNavigationBarItem(icon: Icon(Icons.insights_outlined), label: 'Stats'),
        ],
      ),
    );
  }
}
