/// The backend (see backend/routes/*) has no auth endpoints yet — this is a
/// client-side-only mock so the login/register/guest UX can be built and
/// demoed ahead of real server auth. `token` is a locally-generated opaque
/// string, not a verifiable JWT; nothing server-side trusts it.
class AppUser {
  final String email;
  final String? displayName;
  final String token;
  final bool isGuest;

  const AppUser({
    required this.email,
    required this.token,
    this.displayName,
    this.isGuest = false,
  });

  factory AppUser.guest() => const AppUser(email: 'guest@local', token: '', isGuest: true);

  factory AppUser.fromJson(Map<String, dynamic> json) => AppUser(
        email: json['email'] as String,
        displayName: json['display_name'] as String?,
        token: json['token'] as String,
        isGuest: json['is_guest'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {
        'email': email,
        'display_name': displayName,
        'token': token,
        'is_guest': isGuest,
      };

  AppUser copyWith({String? displayName}) => AppUser(
        email: email,
        token: token,
        isGuest: isGuest,
        displayName: displayName ?? this.displayName,
      );
}
