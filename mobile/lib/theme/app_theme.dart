import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Brand tokens — converted 1:1 from web/src/index.css's :root HSL custom
/// properties so both clients read as one visual system (dark navy/charcoal,
/// gold/amber accent). Keep these in sync if the web palette changes.
class AppColors {
  static const background = Color(0xFF080C16);
  static const surface = Color(0xFF0E1320);
  static const surfaceMuted = Color(0xFF191F2A);
  static const outline = Color(0xFF222B3A);
  static const onSurfaceMuted = Color(0xFF95A1B2);
  static const onSurface = Color(0xFFF1F5F8);

  static const brand = Color(0xFFF4B925); // gold
  static const brand2 = Color(0xFFE18D0E); // amber
  static const brandAccent = Color(0xFFFCCE45); // bright gold
  static const onBrand = Color(0xFF0B111E);

  static const success = Color(0xFF34B262);
  static const onSuccess = Color(0xFF0B111E);
  static const warning = Color(0xFFF69323);
  static const onWarning = Color(0xFF0B111E);
  static const danger = Color(0xFFE74B4B);
  static const onDanger = Color(0xFFFFFFFF);

  static Color successBg = success.withValues(alpha: 0.14);
  static Color warningBg = warning.withValues(alpha: 0.14);
  static Color dangerBg = danger.withValues(alpha: 0.14);
  static Color brandBg = brand.withValues(alpha: 0.14);
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
  static ThemeData get dark {
    final baseTextTheme = GoogleFonts.interTextTheme(ThemeData.dark().textTheme);

    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.brand,
      brightness: Brightness.dark,
      primary: AppColors.brand,
      onPrimary: AppColors.onBrand,
      secondary: AppColors.brand2,
      tertiary: AppColors.brandAccent,
      error: AppColors.danger,
      surface: AppColors.surface,
      onSurface: AppColors.onSurface,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
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
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: AppColors.outline),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceMuted,
        contentPadding: const EdgeInsets.all(14),
        hintStyle: const TextStyle(color: AppColors.onSurfaceMuted),
        labelStyle: const TextStyle(color: AppColors.onSurfaceMuted),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.outline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.brand, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.danger),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.brand,
          foregroundColor: AppColors.onBrand,
          disabledBackgroundColor: AppColors.brand.withValues(alpha: 0.35),
          disabledForegroundColor: AppColors.onBrand.withValues(alpha: 0.6),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.onSurface,
          side: const BorderSide(color: AppColors.outline),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
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
        indicatorColor: AppColors.brand.withValues(alpha: 0.16),
        surfaceTintColor: Colors.transparent,
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
          (states) => states.contains(WidgetState.selected) ? AppColors.brand : AppColors.onSurfaceMuted,
        ),
        trackColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? AppColors.brand.withValues(alpha: 0.4)
              : AppColors.surfaceMuted,
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.surfaceMuted,
        contentTextStyle: const TextStyle(color: AppColors.onSurface),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(color: AppColors.brand),
    );
  }
}
