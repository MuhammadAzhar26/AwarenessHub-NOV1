# Building IEEE Paper

## Requirements
Install a LaTeX distribution (e.g., TeX Live or MiKTeX) with `pdflatex`, `bibtex`, and PGF/TikZ packages.

## Compile Steps (PowerShell)
```powershell
pdflatex ieee-paper.tex
bibtex ieee-paper
pdflatex ieee-paper.tex
pdflatex ieee-paper.tex
```
The sequence ensures proper citation and reference resolution.

## Adding Figures
Vector diagrams are embedded using TikZ (no external images required). If you prefer external images, place PDF/PNG files alongside the `.tex` or in a `figures/` subdirectory and update `\includegraphics` paths accordingly.

## Common Adjustments
- Ensure no orphaned references: every `\cite{}` key must exist in `references.bib`.
- Run `pdflatex` twice after modifying citations.
- Use vector formats (PDF/SVG converted to PDF) for diagrams where possible.

## IEEE Compliance Notes
- Abstract unnumbered, Index Terms provided.
- Avoid footnotes where possible; keep tables and figures within column width.
- Ensure figures have legible font size (~8–10pt when scaled).

## Next Steps
Insert empirical results (tables, charts) once data is collected. Replace placeholder DOIs with actual ones.
