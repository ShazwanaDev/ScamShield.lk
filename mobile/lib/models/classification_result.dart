class ClassificationResult {
  final String label; // 'scam' | 'spam' | 'legitimate'
  final double confidence;
  final List<Map<String, dynamic>> triggerWords;
  final bool isOffline;
  final int? classificationId;

  ClassificationResult({
    required this.label,
    required this.confidence,
    required this.triggerWords,
    this.isOffline = false,
    this.classificationId,
  });

  bool get isScam => label == 'scam';

  /// Words that pushed the result toward scam. The API also returns words
  /// with a negative weight (pointing toward legitimate); those aren't risky.
  List<String> get triggerWordStrings => [
        for (final w in triggerWords)
          if (((w['weight'] as num?) ?? 1) > 0) w['word'].toString(),
      ];
}
