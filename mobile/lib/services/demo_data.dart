import 'package:shared_preferences/shared_preferences.dart';

import '../models/history_entry.dart';
import 'history_service.dart';
import 'my_reports_service.dart';

/// Demo data for one presentation account, matching the web app's demo.
///
/// The demo account comes from build defines, so no personal details live in
/// the repository:
///   flutter run --dart-define-from-file=dart_defines.local.json
/// with DEMO_EMAIL and DEMO_NAME in that (gitignored) file. When that email
/// signs in, the device history is filled once with sample checks.
/// Auth is still a mock (see AuthService): no password is stored or checked.
/// Phone numbers and links are safe placeholders.
class DemoData {
  static const email = String.fromEnvironment('DEMO_EMAIL');
  static const name = String.fromEnvironment('DEMO_NAME');
  static const _seededKey = 'scamshield_demo_seeded_v1';
  static const _reportsSeededKey = 'scamshield_demo_reports_seeded_v1';

  static bool isDemo(String candidate) =>
      email.isNotEmpty && candidate.trim().toLowerCase() == email.trim().toLowerCase();

  /// Display name for the demo account, or null for everyone else.
  static String? displayNameFor(String candidate) => isDemo(candidate) && name.isNotEmpty ? name : null;

  /// Fill the history once for the demo account. Existing checks are kept.
  static Future<void> seedIfNeeded(String candidate) async {
    if (!isDemo(candidate)) return;
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getString(_seededKey) == null) {
      await HistoryService.importEntries(_buildHistory(DateTime.now()));
      await prefs.setString(_seededKey, DateTime.now().toIso8601String());
    }
    if (prefs.getString(_reportsSeededKey) == null) {
      await MyReportsService.importAll(_buildReports(DateTime.now()));
      await prefs.setString(_reportsSeededKey, DateTime.now().toIso8601String());
    }
  }

  /// Same six reports as the web demo: approved, pending and rejected.
  static List<MyReport> _buildReports(DateTime now) {
    DateTime ago(int days, int hours) => now.subtract(Duration(days: days, hours: hours));
    const approvedNote = 'Added to community stats. Thank you for reporting.';
    return [
      MyReport(id: 'SR-6101', message: _messages[0].$3, category: 'otp_fraud', status: 'approved', submittedAt: ago(26, 3), note: approvedNote),
      MyReport(id: 'SR-6118', message: _messages[1].$3, category: 'lottery_scam', status: 'approved', submittedAt: ago(19, 5), note: approvedNote),
      MyReport(
        id: 'SR-6134',
        message: _messages[5].$3,
        category: 'delivery_scam',
        status: 'approved',
        submittedAt: ago(12, 2),
        note: 'Added to community stats and linked to a community alert.',
      ),
      MyReport(
        id: 'SR-6142',
        message: _messages[4].$3,
        category: 'subscription_scam',
        status: 'rejected',
        submittedAt: ago(9, 6),
        note: 'Not added. The moderator judged this as promotional spam rather than a scam.',
      ),
      MyReport(id: 'SR-6157', message: _messages[9].$3, category: 'police_impersonation', status: 'pending', submittedAt: ago(2, 4), note: MyReportsService.pendingNote),
      MyReport(id: 'SR-6160', message: _messages[3].$3, category: 'bank_transfer_scam', status: 'pending', submittedAt: ago(0, 5), note: MyReportsService.pendingNote),
    ];
  }

  static const _messages = <(String label, double confidence, String message)>[
    ('scam', 0.94, 'Your account will be suspended within 2 hours. Verify now by sharing the 6-digit OTP sent to your phone.'),
    ('scam', 0.91, 'සුභ පැතුම්! ඔබගේ අංකයට රු. 2,000,000ක ත්‍යාගයක් දිනා ඇත. ලබා ගැනීමට රු. 5,000ක reload එකක් [PHONE REDACTED] වෙත එවන්න.'),
    ('legitimate', 0.91, 'Your a/c XXXX1234 is debited Rs. 4,500.00 on 07/11 at SUPERMARKET. Avl Bal Rs. 32,105.20. Not you? Call the number on your card.'),
    ('scam', 0.88, 'உங்கள் வங்கி கணக்கு இன்று முடக்கப்படும். KYC புதுப்பிக்க இந்த இணைப்பை கிளிக் செய்யவும்: hxxps://kyc-update.example'),
    ('spam', 0.82, 'MEGA SALE! 50% off all data packs this weekend only. Dial #123# to activate.'),
    ('scam', 0.89, 'Your parcel is held at customs. Pay Rs. 250 clearance fee within 24 hours to avoid return: hxxps://parcel-release.example'),
    ('legitimate', 0.88, '123456 is your verification code. For your security, do not share this code with anyone, including bank staff.'),
    ('scam', 0.86, 'Machan, oyage SIM eka ada block wenawa. OTP eka mata ewanna, mama fix karala dennam.'),
    ('scam', 0.57, "Hi, this is Nimal from the office. Can you send me the code you just received? It's urgent."),
    ('scam', 0.92, 'This is the Police Cyber Unit. A case has been filed against your NIC. Pay the fine today to avoid arrest. Call [PHONE REDACTED].'),
    ('spam', 0.78, 'Aluth offer eka! Rs. 99 ta unlimited YouTube data. Dan ma activate karanna.'),
    ('legitimate', 0.86, 'ඔබගේ වෛද්‍ය හමුව සඳුදා පෙ.ව. 10.30ට තහවුරු කර ඇත. ස්තූතියි.'),
    ('scam', 0.84, 'Overseas job offer in Dubai, salary Rs. 450,000 a month. Pay Rs. 15,000 registration fee today to confirm your visa slot.'),
    ('scam', 0.87, 'Instant loan approved! Rs. 300,000 with no documents. Pay Rs. 3,500 processing fee to release the funds.'),
    ('legitimate', 0.84, 'Reminder: the parent teacher meeting is on Friday at 2pm in the main hall. Thank you.'),
    ('spam', 0.75, 'Get 20% off at City Fashion this Avurudu season. Reply STOP to opt out.'),
    ('scam', 0.90, 'ඔබගේ ගිණුම තහවුරු කිරීමට ලැබුණු OTP අංකය අපට එවන්න. නැතිනම් ගිණුම අද අවහිර වේ.'),
    ('legitimate', 0.55, 'Your electricity bill is overdue. Please pay online to avoid disconnection.'),
    ('scam', 0.93, 'Congratulations! You won an iPhone 15 in our anniversary draw. Claim within 1 hour: hxxps://claim-prize.example'),
    ('legitimate', 0.83, 'உங்கள் ஆர்டர் இன்று டெலிவரி செய்யப்படும். நன்றி.'),
    ('scam', 0.81, 'Unga bank account la problem iruku. Udane intha link la login pannunga: hxxps://secure-login.example'),
    ('spam', 0.73, 'විශේෂ දීමනාව! සියලු ඇඳුම් සඳහා 30% වට්ටමක්. අදම පැමිණෙන්න.'),
    ('legitimate', 0.80, 'Your data balance is 2.1GB, valid until 15/11. Thank you for staying with us.'),
  ];

  // Words highlighted in the history detail when they appear in a scam or spam message.
  static const _triggers = [
    'OTP', 'suspended', 'Verify now', 'reload', 'KYC', 'clearance fee', 'block', 'code', 'fine', 'arrest',
    'registration fee', 'processing fee', 'won', 'Claim', 'login', 'link', 'MEGA SALE', 'offer', 'Dial',
  ];

  static const _daysAgo = [
    0, 0, 1, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15, 16,
    16, 17, 18, 19, 20, 20, 21, 22, 23, 24, 24, 25, 26, 27, 27, 28, 29, 29, 29, 29, 29,
  ];

  static List<HistoryEntry> _buildHistory(DateTime now) {
    return [
      for (var i = 0; i < _daysAgo.length; i++) _entry(i, now),
    ];
  }

  static HistoryEntry _entry(int i, DateTime now) {
    final (label, confidence, message) = _messages[i % _messages.length];
    final day = now.subtract(Duration(days: _daysAgo[i]));
    var at = DateTime(day.year, day.month, day.day, 8 + (i * 5) % 13, (i * 17) % 60);
    if (at.isAfter(now)) at = now.subtract(Duration(minutes: (i + 1) * 9));
    final lower = message.toLowerCase();
    final words = label == 'legitimate'
        ? const <Map<String, dynamic>>[]
        : [
            for (final w in _triggers)
              if (lower.contains(w.toLowerCase())) {'word': w, 'weight': 0.4},
          ].take(4).toList();
    return HistoryEntry(
      id: 'demo-${(i + 1).toString().padLeft(3, '0')}',
      message: message,
      label: label,
      confidence: confidence,
      triggerWords: words,
      isOffline: false,
      timestamp: at,
      userFeedback: i % 7 == 0 ? 'correct' : null,
    );
  }
}
