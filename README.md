# SAADI paper website

A static, responsive paper website. Open `index.html` directly in a browser, or serve this directory with any static HTTP server. No build or package installation is required.

To preview it locally at http://localhost:8787:

```bash
python3 -m http.server 8787 --directory .
```

## Template

The layout and visual style follow the LiGHT lab project-page template, as used for CLIMB (climb.light-laboratory.org):

- Warm paper background, navy ink and a royal-blue accent, set as CSS variables at the top of `style.css`.
- Manrope for text and the acronym title; Ivy Presto Headline for headings, the subtitle and italic variables.
- A sticky translucent navigation bar with section links and an active-section underline.
- A centred hero: the acronym, the expanded title, authors with affiliations, lab logos and Paper, Code and BibTeX buttons.
- An animated overview panorama with a "Watch overview" button that swaps in the video.
- A TL;DR row of three key numbers and an expandable abstract.
- Sections with large serif headings: a scroll-driven story, method cards, results written as question-and-answer blocks, cost cards, BibTeX and a light-blue footer.

## Files

- `index.html`: page content, scientific details, results and citation.
- `style.css`: template tokens, responsive layout, typography and animation styling.
- `hero.js`: the animated overview in the hero, its pause control and the swap to the video.
- `story.js`: story steps and scenes, SVG history tree, ranking movement, navigation highlighting, chart reveal, KaTeX and BibTeX copy.
- `assets/saadi-demo.mp4`: the video supplied on 24 October 2026, copied without re-encoding.
- `assets/demo-poster.jpg`: a frame from that video.
- `assets/`: the existing paper figures and SAADI logo, plus supplied LiGHT, EPFL and HSLU logos.
- `paper/SAADI_ICLR.pdf`: the existing paper, unchanged.

## Experience

The hero overview loops through one indexing pass over 25 chunks, then three questions answered from the same index. It pauses when scrolled out of view, has a pause button, and shows its finished state to reduced-motion users. "Watch overview" replaces it with the full video, which has native controls and does not autoplay; "Back to animation" returns.

Desktop viewports wider than 900 px and at least 700 px tall pin each story scene beside its steps: the step crossing the middle of the window sets the scene. Phones, short windows and reduced-motion preferences show the scene with numbered step buttons instead. The method details, plotted chart values and abstract are expandable.

No animation library is required. Google Fonts and KaTeX are the only external presentation dependencies; font fallbacks and the main content still work without them. Without JavaScript, the overview shows its finished state with the video below it, and every story step is listed as text.

## Content provenance

The indexing excerpts, entity aliases and illustrative query come from the approved SAADI animation source. The displayed sequence combines selected source passages. The hero overview is an illustration: its three questions are answered by passages shown in the story, and chunk positions are schematic. Ranking movement is illustrative and carries no numerical rank claim. The query-time summary is illustrative for this recomposed sequence; it is not presented as a cached summary from the original sequence.

Agent comparison means reuse the approved results slides. Each SAADI/agent pair uses its own matched evidence depth. The means are not a single fixed-k comparison. The 16/20 statement refers to dataset-and-agent pairs. Call counts exclude final answer generation. Detailed figures and results remain available in the original paper sections.

## Updating the video

Replace `assets/saadi-demo.mp4` and refresh its poster if needed. The scroll scenes are native web graphics, so they do not depend on the playback timing of this file.

## Publishing

Upload this folder's `index.html`, `style.css`, `hero.js`, `story.js`, `chart-data.js`, `charts.js`, `assets/` and `paper/` to your static host (including GitHub Pages). No hosting or publication was performed during this update.

## Animated research figures (24 October update)

The original exposure and difficulty PNGs have been replaced in the page by a native SVG results explorer with three views: evidence exposure, context expansion and hop count. Dataset controls, per-method visibility toggles, pointer/touch/keyboard tooltips, replay, downloadable JSON and HTML data tables are available. Curves reveal when the chart enters view or the selection changes; reduced-motion users get the completed chart immediately.

- `charts.js`: chart rendering and interactions.
- `chart-data.js`: browser-local dataset (works when opening the HTML directly).
- `assets/chart-data.json`: the same data for download, with per-series source information.
- Exposure: SAADI from Table 23, agents/HippoRAG from Table 22, Vanilla from Table 1. The shown x ranges match Figure 2 (15 chunks on LooGLE/NovelHopQA and 20 on the other datasets).
- Context expansion: Table 26, retaining the methods plotted in Figure 3(a).
- Hops: Table 21 for BM25 and agents; BGE-M3 recovered from the PDF's vector paths and axis coordinates and rounded to one decimal. The triangle-marked dense curves in Figure 3(b) are BGE-M3; the square-marked curves in Figure 3(a) are Contriever.
- Agent trajectories are explicitly distinguished from the fixed top-10 setting in the context/hop views. Y axes begin at zero.
- `assets/light.svg` is the current LiGHT logo (stacked, blue), copied unchanged from `Logo Stacked Blue.svg`. Institutional order remains LiGHT, EPFL, HSLU.
- Headings use Ivy Presto Headline, self-hosted from `fonts/`; body text stays Manrope.
