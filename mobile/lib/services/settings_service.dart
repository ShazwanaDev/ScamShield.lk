import 'package:shared_preferences/shared_preferences.dart';

enum AppLanguage { english, sinhala, tamil }

extension AppLanguageLabel on AppLanguage {
  String get label => switch (this) {
        AppLanguage.english => 'English',
        AppLanguage.sinhala => 'සිංහල',
        AppLanguage.tamil => 'தமிழ்',
      };

  String get code => switch (this) {
        AppLanguage.english => 'en',
        AppLanguage.sinhala => 'si',
        AppLanguage.tamil => 'ta',
      };
}

/// Local device preferences — none of this syncs to the backend (there's no
/// user-settings endpoint), it's purely on-device UX state.
class SettingsService {
  static const _onboardingSeenKey = 'scamshield_onboarding_seen';
  static const _preferOfflineKey = 'scamshield_prefer_offline';
  static const _languageKey = 'scamshield_language';

  static Future<bool> hasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_onboardingSeenKey) ?? false;
  }

  static Future<void> setOnboardingSeen() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardingSeenKey, true);
  }

  static Future<bool> getPreferOffline() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_preferOfflineKey) ?? false;
  }

  static Future<void> setPreferOffline(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_preferOfflineKey, value);
  }

  static Future<AppLanguage> getLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final code = prefs.getString(_languageKey);
    return AppLanguage.values.firstWhere(
      (l) => l.code == code,
      orElse: () => AppLanguage.english,
    );
  }

  static Future<void> setLanguage(AppLanguage language) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_languageKey, language.code);
  }
}
