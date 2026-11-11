import 'classification_result.dart';

class HistoryEntry {
  final String id;
  final String message;
  final String label;
  final double confidence;
  final List<Map<String, dynamic>> triggerWords;
  final bool isOffline;
  final DateTime timestamp;
  final String? userFeedback; // 'correct' | 'incorrect' | null

  HistoryEntry({
    required this.id,
    required this.message,
    required this.label,
    required this.confidence,
    required this.triggerWords,
    required this.isOffline,
    required this.timestamp,
    this.userFeedback,
  });

  bool get isScam => label == 'scam';

  /// Words that pushed the result toward scam (negative weights point toward legitimate).
  List<String> get triggerWordStrings => [
        for (final w in triggerWords)
          if (((w['weight'] as num?) ?? 1) > 0) w['word'].toString(),
      ];

  factory HistoryEntry.fromResult(String message, ClassificationResult result) {
    return HistoryEntry(
      id: '${DateTime.now().microsecondsSinceEpoch}',
      message: message,
      label: result.label,
      confidence: result.confidence,
      triggerWords: result.triggerWords,
      isOffline: result.isOffline,
      timestamp: DateTime.now(),
    );
  }

  factory HistoryEntry.fromJson(Map<String, dynamic> json) {
    return HistoryEntry(
      id: json['id'] as String? ?? '${(json['timestamp'] as String).hashCode}',
      message: json['message'] as String,
      label: json['label'] as String,
      confidence: (json['confidence'] as num).toDouble(),
      triggerWords: json['trigger_words'] != null
          ? List<Map<String, dynamic>>.from(json['trigger_words'])
          : const [],
      isOffline: json['is_offline'] as bool? ?? false,
      timestamp: DateTime.parse(json['timestamp'] as String),
      userFeedback: json['user_feedback'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'message': message,
        'label': label,
        'confidence': confidence,
        'trigger_words': triggerWords,
        'is_offline': isOffline,
        'timestamp': timestamp.toIso8601String(),
        'user_feedback': userFeedback,
      };

  HistoryEntry copyWith({String? userFeedback}) => HistoryEntry(
        id: id,
        message: message,
        label: label,
        confidence: confidence,
        triggerWords: triggerWords,
        isOffline: isOffline,
        timestamp: timestamp,
        userFeedback: userFeedback ?? this.userFeedback,
      );
}
