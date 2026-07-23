import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Brand tokens — the refined Sri Lankan cybersecurity palette, shared 1:1 with
/// the web app (web/tailwind.config.js) so both clients read as one product:
/// a light navy/charcoal + blue/teal system with semantic scam/spam/legit
/// colours. Existing token names are kept and remapped to light values, so the
/// whole UI re-themes without per-screen changes.
class AppColors {
  // Surfaces & text
  static const background = Color(0xFFF6F8FB);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceMuted = Color(0xFFEEF2F6);
  static const outline = Color(0xFFD0D5DD);
  static const onSurface = Color(0xFF101828);
  static const onSurfaceMuted = Color(0xFF667085);

  // Brand (primary = blue for CTAs, navy for dark accents, teal secondary)
  static const brand = Color(0xFF175CD3); // primary blue — CTAs
  static const brand2 = Color(0xFF0B1F33); // deep navy — dark sections/headers
  static const brandAccent = Color(0xFF2E90FA); // electric blue
  static const onBrand = Color(0xFFFFFFFF);
  static const brandBg = Color(0xFFEFF6FF);

  static const navy = Color(0xFF0B1F33);
  static const navyDeep = Color(0xFF071524);
  static const teal = Color(0xFF0E9384);
  static const tealLight = Color(0xFF5FE9D0);
  static const info = Color(0xFF6941C6);

  // Semantic verdicts / states (danger=scam, warning=spam, success=legit)
  static const danger = Color(0xFFD92D20);
  static const dangerBg = Color(0xFFFEE4E2);
  static const warning = Color(0xFFDC6803);
  static const warningBg = Color(0xFFFEF0C7);
  static const success = Color(0xFF079455);
  static const successBg = Color(0xFFD1FADF);

  // Aliases so verdict widgets can read semantically
  static const scam = danger;
  static const scamBg = dangerBg;
  static const spam = warning;
  static const spamBg = warningBg;
  static const legit = success;
  static const legitBg = successBg;
}

/// Multilingual text styles — Sinhala/Tamil script needs an explicit
/// fontFamilyFallback chain since Inter has no glyphs for either script.
/// Used anywhere raw SMS content is rendered: input fields, result cards,
/// history rows/detail.
class AppFonts {
  static TextStyle message({
    double fontSize = 14.5,
    FontWeight fontWeight = FontWeight.w500,
    Color? color,
    double? height,
  }) {
    return GoogleFonts.notoSansSinhala(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color ?? AppColors.onSurface,
      height: height,
    ).copyWith(
      fontFamilyFallback: [
        GoogleFonts.notoSansTamil().fontFamily!,
        GoogleFonts.inter().fontFamily!,
      ],
    );
  }
}

class AppTheme {
  static ThemeData get light {
    final baseTextTheme = GoogleFonts.interTextTheme(ThemeData.light().textTheme);

    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.brand,
      brightness: Brightness.light,
      primary: AppColors.brand,
      onPrimary: AppColors.onBrand,
      secondary: AppColors.navy,
      tertiary: AppColors.teal,
      error: AppColors.danger,
      surface: AppColors.surface,
      onSurface: AppColors.onSurface,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColors.background,
      textTheme: baseTextTheme.apply(
        bodyColor: AppColors.onSurface,
        displayColor: AppColors.onSurface,
      ),
      splashFactory: InkRipple.splashFactory,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.onSurface,
        elevation: 0,
        scrolledUnderElevation: 1,
        surfaceTintColor: Colors.transparent,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          color: AppColors.onSurface,
          fontWeight: FontWeight.w800,
          fontSize: 20,
        ),
        iconTheme: const IconThemeData(color: AppColors.onSurface),
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.outline),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.all(14),
        hintStyle: const TextStyle(color: AppColors.onSurfaceMuted),
        labelStyle: const TextStyle(color: AppColors.onSurfaceMuted),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.outline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.brand, width: 1.6),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.danger),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.brand,
          foregroundColor: AppColors.onBrand,
          disabledBackgroundColor: AppColors.brand.withValues(alpha: 0.35),
          disabledForegroundColor: Colors.white.withValues(alpha: 0.8),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.onSurface,
          side: const BorderSide(color: AppColors.outline),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: AppColors.brand),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.surfaceMuted,
        labelStyle: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.onSurface),
        side: const BorderSide(color: AppColors.outline),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.brand,
        unselectedItemColor: AppColors.onSurfaceMuted,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: AppColors.surface,
        indicatorColor: AppColors.brandBg,
        surfaceTintColor: Colors.transparent,
        elevation: 3,
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w700,
            color: states.contains(WidgetState.selected) ? AppColors.brand : AppColors.onSurfaceMuted,
          ),
        ),
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected) ? AppColors.brand : AppColors.onSurfaceMuted,
          ),
        ),
      ),
      dividerTheme: const DividerThemeData(color: AppColors.outline, space: 1),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected) ? AppColors.brand : Colors.white,
        ),
        trackColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected) ? AppColors.brand.withValues(alpha: 0.9) : AppColors.outline,
        ),
        trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.navy,
        contentTextStyle: const TextStyle(color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.surface,
        surfaceTintColor: Colors.transparent,
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(color: AppColors.brand),
    );
  }
}
