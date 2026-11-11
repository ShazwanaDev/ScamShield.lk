import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// One column in a [CellBarChart].
class CellBar {
  final String label;
  final int value;

  const CellBar({required this.label, required this.value});
}

/// Pixel-cell bar chart, shared look with the web dashboards: each column is a
/// stack of square cells, empty cells drawn behind the filled ones. The
/// selected column is bright red with a dashed outline and a value callout;
/// the others are deep red. Tap a column to select it. Each column is exposed
/// to screen readers as a button with its label and value.
class CellBarChart extends StatefulWidget {
  final List<CellBar> bars;
  final int rows;
  final String unit;
  final int? initialSelected;

  const CellBarChart(
      {super.key,
      required this.bars,
      this.rows = 10,
      this.unit = '',
      this.initialSelected});

  @override
  State<CellBarChart> createState() => _CellBarChartState();
}

class _CellBarChartState extends State<CellBarChart> {
  late int _selected;

  int get _peakIndex {
    var best = 0;
    for (var i = 1; i < widget.bars.length; i++) {
      if (widget.bars[i].value > widget.bars[best].value) best = i;
    }
    return best;
  }

  @override
  void initState() {
    super.initState();
    _selected = widget.initialSelected ?? _peakIndex;
  }

  @override
  Widget build(BuildContext context) {
    final bars = widget.bars;
    if (bars.isEmpty) return const SizedBox.shrink();
    final maxValue = bars.fold<int>(1, (m, b) => b.value > m ? b.value : m);
    final selected = bars[_selected.clamp(0, bars.length - 1)];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Callout for the selected column
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text('${selected.value}',
                style: AppFonts.display(
                    fontSize: 26, fontWeight: FontWeight.w600)),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                '${widget.unit.isEmpty ? '' : '${widget.unit} · '}${selected.label}',
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                    fontSize: 12.5, color: AppColors.onSurfaceMuted),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        LayoutBuilder(
          builder: (context, constraints) {
            const gap = 6.0;
            final colWidth =
                ((constraints.maxWidth - gap * (bars.length - 1)) / bars.length)
                    .clamp(8.0, 30.0);
            final cell = colWidth;
            final cellHeight = cell * 0.8;
            return Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                for (var i = 0; i < bars.length; i++)
                  _Column(
                    width: colWidth,
                    cellHeight: cellHeight,
                    rows: widget.rows,
                    filled: bars[i].value <= 0
                        ? 0
                        : ((bars[i].value / maxValue) * widget.rows)
                            .round()
                            .clamp(1, widget.rows),
                    selected: i == _selected,
                    semanticsLabel:
                        '${bars[i].label}: ${bars[i].value} ${widget.unit}',
                    onTap: () => setState(() => _selected = i),
                  ),
              ],
            );
          },
        ),
        const SizedBox(height: 8),
        // Labels under the columns
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            for (final b in bars)
              Expanded(
                child: Text(
                  b.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: AppFonts.mono(fontSize: 9.5),
                ),
              ),
          ],
        ),
      ],
    );
  }
}

class _Column extends StatelessWidget {
  final double width;
  final double cellHeight;
  final int rows;
  final int filled;
  final bool selected;
  final String semanticsLabel;
  final VoidCallback onTap;

  const _Column({
    required this.width,
    required this.cellHeight,
    required this.rows,
    required this.filled,
    required this.selected,
    required this.semanticsLabel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final fill = selected ? AppColors.brandAccent : AppColors.cellDeep;
    return Semantics(
      button: true,
      selected: selected,
      label: semanticsLabel,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: CustomPaint(
          foregroundPainter: selected ? _DashedOutline() : null,
          child: Padding(
            padding: const EdgeInsets.all(2),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (var r = rows - 1; r >= 0; r--)
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 220),
                      width: width - 4,
                      height: cellHeight,
                      decoration: BoxDecoration(
                        color: r < filled ? fill : AppColors.cell,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DashedOutline extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    const dash = 3.0;
    const space = 3.0;
    void line(Offset a, Offset b) {
      final total = (b - a).distance;
      final dir = (b - a) / total;
      var d = 0.0;
      while (d < total) {
        final end = (d + dash).clamp(0, total).toDouble();
        canvas.drawLine(a + dir * d, a + dir * end, paint);
        d += dash + space;
      }
    }

    final r = Offset.zero & size;
    line(r.topLeft, r.topRight);
    line(r.topRight, r.bottomRight);
    line(r.bottomRight, r.bottomLeft);
    line(r.bottomLeft, r.topLeft);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// A row of small segments, as in "341 of 10,000 this month".
class CellMeter extends StatelessWidget {
  final double value;
  final double max;
  final int cells;
  final Color color;
  final String? semanticsLabel;

  const CellMeter(
      {super.key,
      required this.value,
      required this.max,
      this.cells = 20,
      this.color = AppColors.brand,
      this.semanticsLabel});

  @override
  Widget build(BuildContext context) {
    final ratio = max <= 0 ? 0.0 : (value / max).clamp(0.0, 1.0);
    final on = value > 0 ? (ratio * cells).round().clamp(1, cells) : 0;
    return Semantics(
      label: semanticsLabel,
      value: '${value.round()} of ${max.round()}',
      child: Row(
        children: [
          for (var i = 0; i < cells; i++)
            Expanded(
              child: Container(
                height: 6,
                margin: EdgeInsets.only(right: i == cells - 1 ? 0 : 3),
                decoration: BoxDecoration(
                  color: i < on ? color : AppColors.cell,
                  borderRadius: BorderRadius.circular(1.5),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
