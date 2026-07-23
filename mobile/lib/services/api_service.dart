import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/classification_result.dart';
import 'offline_model_service.dart';

class ApiService {
  // Point this at your Railway deployment once live; localhost for dev/emulator.
  static const String baseUrl = String.fromEnvironment(
    'SCAMSHIELD_API_URL',
    defaultValue: 'http://10.0.2.2:5000/api',
  );

  static Future<ClassificationResult> classify(String message) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/predict'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'message': message}),
          )
          .timeout(const Duration(seconds: 3));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return ClassificationResult(
          label: data['label'],
          confidence: (data['confidence'] as num).toDouble(),
          triggerWords: List<Map<String, dynamic>>.from(data['trigger_words']),
          classificationId: data['classification_id'] as int?,
        );
      }
      throw Exception('API returned ${response.statusCode}');
    } on TimeoutException {
      return OfflineModelService.classify(message);
    } on SocketException {
      return OfflineModelService.classify(message);
    } on http.ClientException {
      return OfflineModelService.classify(message);
    }
    // Anything else (malformed JSON, unexpected response shape, etc.) is a real bug —
    // let it surface instead of silently masking it behind the offline fallback.
  }

  static Future<void> sendFeedback(int classificationId, bool correct) async {
    final response = await http
        .post(
          Uri.parse('$baseUrl/feedback/$classificationId'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'correct': correct}),
        )
        .timeout(const Duration(seconds: 5));

    if (response.statusCode != 200) {
      throw Exception('API returned ${response.statusCode}');
    }
  }

  static Future<void> submitReport(String message, String? category) async {
    final response = await http
        .post(
          Uri.parse('$baseUrl/submit-sms'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'message': message, if (category != null) 'category': category}),
        )
        .timeout(const Duration(seconds: 5));

    if (response.statusCode != 201) {
      throw Exception('API returned ${response.statusCode}');
    }
  }

  static Future<Map<String, dynamic>> fetchStats() async {
    final response = await http.get(Uri.parse('$baseUrl/stats')).timeout(const Duration(seconds: 5));
    if (response.statusCode != 200) {
      throw Exception('API returned ${response.statusCode}');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}
