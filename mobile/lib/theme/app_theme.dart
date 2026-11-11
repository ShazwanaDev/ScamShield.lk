import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Brand tokens: the "signal" dark theme shared with the web app
/// (web/tailwind.config.js). Off-black neutrals with one accent, signal red.
/// Token names are unchanged from the old light theme so every screen
/// re-themes without per-screen edits.
///
/// Contrast (WCAG AA): [brand], [danger] and the other verdict colours are for
/// text and icons on dark surfaces. Filled red controls use [brandFill] so
/// white labels keep at least 4.5:1.
class AppColors {
  // Surfaces & text
  static const background = Color(0xFF0B0B0C);
  static const surface = Color(0xFF16161A);
  static const surfaceRaised = Color(0xFF1C1C21);
  static const surfaceMuted = Color(0xFF1F1F24);
  static const outline = Color(0xFF2A2A2F);
  static const onSurface = Color(0xFFE6E6E8);
  static const onSurfaceMuted = Color(0xFF8C8C95);

  // Brand
  static const brand = Color(0xFFFF3B30); // signal red: text, icons, strokes
  static const brandFill = Color(0xFFD42C24); // filled buttons with white text
  static const brandDeep =
      Color(0xFF7A0E13); // deep red: gradients, earlier-period cells
  static const brand2 = brandDeep;
  static const brandAccent = Color(0xFFFF6A60);
  static const brandSoft = Color(0xFFFF9C94);
  static const onBrand = Color(0xFFFFFFFF);
  static const brandBg = Color(0xFF2A1314);

  // Legacy slots folded into the dark/red system
  static const navy = Color(0xFF111114);
  static const navyDeep = Color(0xFF0B0B0C);
  static const teal = Color(0xFFFF5A4F);
  static const tealLight = Color(0xFFFF9C94);
  static const info = Color(0xFFAEB6C4);
  static const infoBg = Color(0xFF1C1E23);

  // Semantic verdicts / states (danger=scam, warning=spam, success=legit)
  static const danger = Color(0xFFFF4F45);
  static const dangerBg = Color(0xFF2A1314);
  static const warning = Color(0xFFF5A524);
  static const warningBg = Color(0xFF272012);
  static const success = Color(0xFF3DD68C);
  static const successBg = Color(0xFF10231A);

  // Pixel-cell charts
  static const cell = Color(0xFF1E1E23);
  static const cellDeep = Color(0xFF8E1A17);

  // Aliases so verdict widgets can read semantically
  static const scam = danger;
  static const scamBg = dangerBg;
  static const spam = warning;
  static const spamBg = warningBg;
  static const legit = success;
  static const legitBg = successBg;

  /// The red-to-black wash used by hero cards (as in the mobile references).
  static const heroGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF5A0B10), Color(0xFF2A0A0C), Color(0xFF16161A)],
    stops: [0, 0.45, 1],
  );

  /// Glossy fill for primary pill buttons.
  static const ctaGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFEC3A31), Color(0xFFBB1F18)],
  );
}

/// Multilingual text styles. Sinhala/Tamil script needs an explicit
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

  /// Big figures and headings: Manrope with tight tracking.
  static TextStyle display(
      {double fontSize = 32,
      FontWeight fontWeight = FontWeight.w700,
      Color? color}) {
    return GoogleFonts.manrope(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color ?? AppColors.onSurface,
      letterSpacing: -fontSize * 0.03,
      height: 1.05,
      fontFeatures: const [FontFeature.tabularFigures()],
    );
  }

  /// Mono labels such as "[ THE CHALLENGE ]" eyebrows and axis ticks.
  static TextStyle mono(
      {double fontSize = 11,
      Color? color,
      FontWeight fontWeight = FontWeight.w500}) {
    return GoogleFonts.jetBrainsMono(
        fontSize: fontSize,
        color: color ?? AppColors.onSurfaceMuted,
        fontWeight: fontWeight);
  }
}

class AppTheme {
  /// Kept so older call sites keep compiling; the app has one (dark) theme.
  static ThemeData get light => dark;

  static ThemeData get dark {
    final inter = GoogleFonts.interTextTheme(ThemeData.dark().textTheme);
    TextStyle? heading(TextStyle? s) => s == null
        ? null
        : GoogleFonts.manrope(
            textStyle: s, letterSpacing: -0.4, fontWeight: FontWeight.w700);
    final textTheme = inter.copyWith(
      displayLarge: heading(inter.displayLarge),
      displayMedium: heading(inter.displayMedium),
      displaySmall: heading(inter.displaySmall),
      headlineLarge: heading(inter.headlineLarge),
      headlineMedium: heading(inter.headlineMedium),
      headlineSmall: heading(inter.headlineSmall),
      titleLarge: heading(inter.titleLarge),
    );

    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.brand,
      brightness: Brightness.dark,
      primary: AppColors.brand,
      onPrimary: AppColors.onBrand,
      secondary: AppColors.brandSoft,
      tertiary: AppColors.brandDeep,
      error: AppColors.danger,
      surface: AppColors.surface,
      onSurface: AppColors.onSurface,
      surfaceContainerHighest: AppColors.surfaceRaised,
      outline: AppColors.outline,
    );

    final pill = WidgetStateProperty.all<OutlinedBorder>(const StadiumBorder());

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColors.background,
      canvasColor: AppColors.background,
      textTheme: textTheme.apply(
          bodyColor: AppColors.onSurface, displayColor: AppColors.onSurface),
      splashFactory: InkRipple.splashFactory,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.onSurface,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        centerTitle: false,
        titleTextStyle: GoogleFonts.manrope(
          color: AppColors.onSurface,
          fontWeight: FontWeight.w700,
          fontSize: 20,
          letterSpacing: -0.4,
        ),
        iconTheme: const IconThemeData(color: AppColors.onSurface),
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: BorderSide(color: Colors.white.withValues(alpha: 0.06)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF111114),
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
          borderSide: BorderSide(
              color: AppColors.brand.withValues(alpha: 0.8), width: 1.4),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.danger),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.brandFill,
          foregroundColor: AppColors.onBrand,
          disabledBackgroundColor: AppColors.brandFill.withValues(alpha: 0.35),
          disabledForegroundColor: Colors.white.withValues(alpha: 0.7),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 15),
          shape: const StadiumBorder(),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
        ).copyWith(
            shadowColor:
                WidgetStateProperty.all(AppColors.brand.withValues(alpha: 0.5)),
            elevation: WidgetStateProperty.all(6)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.brandFill,
          foregroundColor: AppColors.onBrand,
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 15),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
        ).copyWith(shape: pill),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.onSurface,
          backgroundColor: Colors.white.withValues(alpha: 0.03),
          side: BorderSide(color: Colors.white.withValues(alpha: 0.16)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 13),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ).copyWith(shape: pill),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: AppColors.brandSoft),
      ),
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(foregroundColor: AppColors.onSurface),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.surfaceMuted,
        selectedColor: AppColors.brandFill,
        labelStyle: const TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w600,
            color: AppColors.onSurface),
        side: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
        shape: const StadiumBorder(),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.brand,
        unselectedItemColor: AppColors.onSurfaceMuted,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: const Color(0xFF141417),
        indicatorColor: Colors.white.withValues(alpha: 0.08),
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w600,
            color: states.contains(WidgetState.selected)
                ? AppColors.onSurface
                : AppColors.onSurfaceMuted,
          ),
        ),
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected)
                ? AppColors.brand
                : AppColors.onSurfaceMuted,
          ),
        ),
      ),
      dividerTheme: DividerThemeData(
          color: Colors.white.withValues(alpha: 0.06), space: 1),
      listTileTheme: const ListTileThemeData(
          iconColor: AppColors.onSurfaceMuted, textColor: AppColors.onSurface),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? Colors.white
              : AppColors.onSurfaceMuted,
        ),
        trackColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? AppColors.brandFill
              : AppColors.surfaceMuted,
        ),
        trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? AppColors.brandFill
              : Colors.transparent,
        ),
        side: const BorderSide(color: AppColors.onSurfaceMuted),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.surfaceRaised,
        contentTextStyle: const TextStyle(color: AppColors.onSurface),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.surfaceRaised,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.surfaceRaised,
        surfaceTintColor: Colors.transparent,
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.brand,
        linearTrackColor: AppColors.cell,
        circularTrackColor: AppColors.cell,
      ),
    );
  }
}
