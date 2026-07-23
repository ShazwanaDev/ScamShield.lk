import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/settings_service.dart';

class SettingsState {
  final bool preferOffline;
  final AppLanguage language;
  final bool loaded;

  const SettingsState({this.preferOffline = false, this.language = AppLanguage.english, this.loaded = false});

  SettingsState copyWith({bool? preferOffline, AppLanguage? language, bool? loaded}) => SettingsState(
        preferOffline: preferOffline ?? this.preferOffline,
        language: language ?? this.language,
        loaded: loaded ?? this.loaded,
      );
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier() : super(const SettingsState()) {
    _load();
  }

  Future<void> _load() async {
    final preferOffline = await SettingsService.getPreferOffline();
    final language = await SettingsService.getLanguage();
    state = state.copyWith(preferOffline: preferOffline, language: language, loaded: true);
  }

  Future<void> setPreferOffline(bool value) async {
    state = state.copyWith(preferOffline: value);
    await SettingsService.setPreferOffline(value);
  }

  Future<void> setLanguage(AppLanguage language) async {
    state = state.copyWith(language: language);
    await SettingsService.setLanguage(language);
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, SettingsState>(
  (ref) => SettingsNotifier(),
);

/// Resolved once at splash time to decide the initial route; re-read via
/// [markOnboardingSeen] rather than watched reactively elsewhere.
final onboardingSeenProvider = FutureProvider<bool>((ref) => SettingsService.hasSeenOnboarding());
