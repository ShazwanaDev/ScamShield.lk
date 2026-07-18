import '../providers/classification_provider.dart';

/// Offline fallback classifier using the bundled TFLite model
/// (assets/models/scamshield_offline.tflite).
///
/// This is a stub — wire up `tflite_flutter` here once the quantized
/// model has been exported by `ml/src/tfidf_baseline.py` and converted.
/// The conversion step (TF-IDF vocabulary + weights -> a small dense
/// TFLite model) needs its own export script; see docs/tflite_export_notes.md.
class OfflineModelService {
  static Future<ClassificationResult> classify(String message) async {
    // TODO: replace with real tflite_flutter Interpreter.run() call.
    // Placeholder keeps the app usable offline during development.
    final lower = message.toLowerCase();
    final looksScam = lower.contains('otp') ||
        lower.contains('click') ||
        lower.contains('won') ||
        lower.contains('urgent');

    return ClassificationResult(
      label: looksScam ? 'scam' : 'legitimate',
      confidence: looksScam ? 0.7 : 0.6,
      triggerWords: const [],
      isOffline: true,
    );
  }
}
