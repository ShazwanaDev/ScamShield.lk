import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/classification_provider.dart';

class HistoryEntry {
  final String message;
  final String label;
  final double confidence;
  final List<Map<String, dynamic>> triggerWords;
  final bool isOffline;
  final DateTime timestamp;

  HistoryEntry({
    required this.message,
    required this.label,
    required this.confidence,
    required this.triggerWords,
    required this.isOffline,
    required this.timestamp,
  });

  factory HistoryEntry.fromJson(Map<String, dynamic> json) {
    return HistoryEntry(
      message: json['message'] as String,
      label: json['label'] as String,
      confidence: (json['confidence'] as num).toDouble(),
      triggerWords: json['trigger_words'] != null
          ? List<Map<String, dynamic>>.from(json['trigger_words'])
          : const [],
      isOffline: json['is_offline'] as bool? ?? false,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
        'message': message,
        'label': label,
        'confidence': confidence,
        'trigger_words': triggerWords,
        'is_offline': isOffline,
        'timestamp': timestamp.toIso8601String(),
      };
}

class HistoryService {
  static const _key = 'scamshield_history';

  static Future<void> save(String message, ClassificationResult result) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];

    final entry = HistoryEntry(
      message: message,
      label: result.label,
      confidence: result.confidence,
      triggerWords: result.triggerWords,
      isOffline: result.isOffline,
      timestamp: DateTime.now(),
    );

    existing.insert(0, jsonEncode(entry.toJson()));
    await prefs.setStringList(_key, existing);
  }

  static Future<List<HistoryEntry>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];
    return existing
        .map((e) => HistoryEntry.fromJson(jsonDecode(e) as Map<String, dynamic>))
        .toList();
  }

  static Future<void> deleteAt(int index) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];
    if (index < 0 || index >= existing.length) return;
    existing.removeAt(index);
    await prefs.setStringList(_key, existing);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
