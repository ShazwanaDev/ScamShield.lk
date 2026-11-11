import '../models/classification_result.dart';

/// Offline fallback classifier using the bundled TFLite model
/// (assets/models/scamshield_offline.tflite).
///
/// This is a stub. `tflite_flutter` was removed from pubspec.yaml — v0.10.4's
/// Android build pins a JVM-incompatible AGP 7.3.0 classpath that broke
/// Android builds outright and it wasn't imported anywhere. Re-add a current
/// version (0.12.1+) here once the quantized model has been exported by
/// `ml/src/tfidf_baseline.py` and converted. The conversion step (TF-IDF
/// vocabulary + weights -> a small dense TFLite model) needs its own export
/// script, which hasn't been written yet.
class OfflineModelService {
  static bool _warmedUp = false;

  // Pressure, reward and credential words common in Sri Lankan scam SMS.
  static const _keywords = [
    'otp', 'pin', 'click', 'won', 'winner', 'prize', 'urgent', 'immediately', 'suspend', 'blocked',
    'verify', 'kyc', 'reload', 'fee', 'claim', 'link', 'fine', 'arrest', 'customs', 'lottery',
  ];

  /// Called once from the splash screen so there's a real (if currently
  /// trivial) async step to show a "loading offline model" status against.
  /// Once tflite_flutter is wired up, load and cache the Interpreter here.
  static Future<void> warmUp() async {
    if (_warmedUp) return;
    await Future.delayed(const Duration(milliseconds: 400));
    _warmedUp = true;
  }

  static Future<ClassificationResult> classify(String message) async {
    // TODO: replace with real tflite_flutter Interpreter.run() call.
    // Placeholder keeps the app usable offline during development.
    final lower = message.toLowerCase();
    final hits = [
      for (final k in _keywords)
        if (lower.contains(k)) k,
    ];
    final looksScam = hits.isNotEmpty;

    return ClassificationResult(
      label: looksScam ? 'scam' : 'legitimate',
      confidence: looksScam ? (0.62 + hits.length * 0.06).clamp(0.62, 0.9).toDouble() : 0.6,
      triggerWords: [
        for (final k in hits.take(5)) {'word': k, 'weight': 0.3},
      ],
      isOffline: true,
    );
  }
}
