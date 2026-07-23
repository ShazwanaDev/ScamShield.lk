/// A community scam report submitted while offline, queued locally until
/// connectivity returns (see services/report_queue_service.dart).
class PendingReport {
  final String id;
  final String message;
  final String? category;
  final DateTime queuedAt;

  PendingReport({
    required this.id,
    required this.message,
    required this.category,
    required this.queuedAt,
  });

  factory PendingReport.create(String message, String? category) => PendingReport(
        id: '${DateTime.now().microsecondsSinceEpoch}',
        message: message,
        category: category,
        queuedAt: DateTime.now(),
      );

  factory PendingReport.fromJson(Map<String, dynamic> json) => PendingReport(
        id: json['id'] as String,
        message: json['message'] as String,
        category: json['category'] as String?,
        queuedAt: DateTime.parse(json['queued_at'] as String),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'message': message,
        'category': category,
        'queued_at': queuedAt.toIso8601String(),
      };
}
