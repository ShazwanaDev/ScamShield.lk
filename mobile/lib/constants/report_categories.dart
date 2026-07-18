/// Mirrors web/src/lib/api.js REPORT_CATEGORIES — kept in sync manually until a
/// GET /api/categories endpoint exists (see docs/wireframe_brief.md §10).
class ReportCategory {
  final String value;
  final String label;
  const ReportCategory(this.value, this.label);
}

const List<ReportCategory> kReportCategories = [
  ReportCategory('lottery_scam', 'Lottery / prize'),
  ReportCategory('bank_transfer_scam', 'Banking / bank transfer'),
  ReportCategory('otp_fraud', 'OTP fraud'),
  ReportCategory('loan_scam', 'Loan scam'),
  ReportCategory('delivery_scam', 'Delivery / courier scam'),
  ReportCategory('police_impersonation', 'Police impersonation'),
  ReportCategory('subscription_scam', 'Subscription scam'),
  ReportCategory('other', 'Other'),
];
