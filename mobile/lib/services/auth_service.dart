import 'dart:convert';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/app_user.dart';
import 'demo_data.dart';

/// Mock auth — the backend has no /api/login or /api/register yet (see
/// backend/routes/), so this simulates a JWT-style session entirely on
/// device: a fake network delay, a locally-generated opaque token, and a
/// persisted session so the user stays logged in across app restarts.
/// Swap the body of [login]/[register] for real HTTP calls once the backend
/// ships auth endpoints — the public API (AppUser in, AppUser out) shouldn't
/// need to change.
class AuthService {
  static const _sessionKey = 'scamshield_session';
  static final _random = Random.secure();

  static Future<AppUser> login(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 700));
    if (!_isValidEmail(email)) {
      throw AuthException('Enter a valid email address.');
    }
    if (password.length < 6) {
      throw AuthException('Incorrect email or password.');
    }
    final user = AppUser(email: email, token: _generateToken(), displayName: DemoData.displayNameFor(email));
    await DemoData.seedIfNeeded(email);
    await _persist(user);
    return user;
  }

  static Future<AppUser> register(String email, String password, {String? displayName}) async {
    await Future.delayed(const Duration(milliseconds: 800));
    if (!_isValidEmail(email)) {
      throw AuthException('Enter a valid email address.');
    }
    if (password.length < 6) {
      throw AuthException('Password must be at least 6 characters.');
    }
    final user = AppUser(email: email, token: _generateToken(), displayName: DemoData.displayNameFor(email) ?? displayName);
    await DemoData.seedIfNeeded(email);
    await _persist(user);
    return user;
  }

  static Future<AppUser> continueAsGuest() async {
    final user = AppUser.guest();
    await _persist(user);
    return user;
  }

  static Future<void> updateProfile(AppUser user) => _persist(user);

  static Future<AppUser?> restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_sessionKey);
    if (raw == null) return null;
    final user = AppUser.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    // A returning demo account picks up any demo data added since it last signed in.
    await DemoData.seedIfNeeded(user.email);
    return user;
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_sessionKey);
  }

  static Future<void> _persist(AppUser user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_sessionKey, jsonEncode(user.toJson()));
  }

  static bool _isValidEmail(String email) => RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(email);

  static String _generateToken() {
    final bytes = List<int>.generate(24, (_) => _random.nextInt(256));
    return base64UrlEncode(bytes);
  }
}

class AuthException implements Exception {
  final String message;
  AuthException(this.message);
  @override
  String toString() => message;
}
