import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_user.dart';
import '../services/auth_service.dart';

enum AuthStatus { unknown, unauthenticated, authenticated }

class AuthState {
  final AuthStatus status;
  final AppUser? user;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.status = AuthStatus.unknown,
    this.user,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    AuthStatus? status,
    AppUser? user,
    bool? isLoading,
    String? error,
  }) =>
      AuthState(
        status: status ?? this.status,
        user: user ?? this.user,
        isLoading: isLoading ?? this.isLoading,
        error: error,
      );
}

class AuthNotifier extends StateNotifier<AuthState> {
  /// Resolves once the persisted session has been loaded (or found absent).
  /// Awaited by the splash screen before deciding where to route.
  late final Future<void> ready;

  AuthNotifier() : super(const AuthState()) {
    ready = _restore();
  }

  Future<void> _restore() async {
    final user = await AuthService.restoreSession();
    state = state.copyWith(
      status: user == null ? AuthStatus.unauthenticated : AuthStatus.authenticated,
      user: user,
    );
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final user = await AuthService.login(email, password);
      state = state.copyWith(status: AuthStatus.authenticated, user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> register(String email, String password, {String? displayName}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final user = await AuthService.register(email, password, displayName: displayName);
      state = state.copyWith(status: AuthStatus.authenticated, user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> continueAsGuest() async {
    final user = await AuthService.continueAsGuest();
    state = state.copyWith(status: AuthStatus.authenticated, user: user);
  }

  Future<void> updateDisplayName(String name) async {
    final current = state.user;
    if (current == null) return;
    final updated = current.copyWith(displayName: name);
    await AuthService.updateProfile(updated);
    state = state.copyWith(user: updated);
  }

  Future<void> logout() async {
    await AuthService.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  void clearError() => state = state.copyWith(error: null);
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) => AuthNotifier());
