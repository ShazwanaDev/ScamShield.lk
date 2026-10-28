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

  List<String> get triggerWordStrings =>
      triggerWords.map((w) => w['word'].toString()).toList();
}
