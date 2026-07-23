import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/classification_result.dart';
import '../models/history_entry.dart';

class HistoryService {
  static const _key = 'scamshield_history';

  static Future<void> save(String message, ClassificationResult result) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];

    final entry = HistoryEntry.fromResult(message, result);
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

  static Future<void> setFeedback(String id, String feedback) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];
    final updated = existing.map((raw) {
      final json = jsonDecode(raw) as Map<String, dynamic>;
      if (json['id'] == id) {
        json['user_feedback'] = feedback;
      }
      return jsonEncode(json);
    }).toList();
    await prefs.setStringList(_key, updated);
  }

  static Future<void> deleteById(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];
    existing.removeWhere((raw) => (jsonDecode(raw) as Map<String, dynamic>)['id'] == id);
    await prefs.setStringList(_key, existing);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
