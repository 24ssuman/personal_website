# Assets Directory

This directory holds the static and dynamic media assets used across Suman Saha's professional personal website.

## Directory Structure

- `publications/`: Houses visual abstract/TOC graphics for peer-reviewed papers and preprints listed on the Publications page.
- `research-background.png`: Premium high-resolution graphic inspired by water cluster energy pathways and porous structures, preloaded in the hero sections.
- `research_hydration.svg`, `research_confinement.svg`, `research_mof_ions.svg`, `research_enzyme.svg`: current vector illustrations for the four research cards (ion hydration; nanoconfined water; ion uptake and Li⁺ transport in MOFs; serine β-lactamase acyl–enzyme with a methyl group blocking the hydrolytic water), using the site palette.
- `research_uptake.svg`: earlier MOF-808-only illustration, superseded by `research_mof_ions.svg` and no longer referenced.
- `research_hydration.png`, `research_transport.png`, `research_confinement.png`, `research_uptake.png`: earlier raster research images, kept for reference but no longer referenced by the pages.
- `md_tutorial_preview.png`: Premium 3D side preview image for the Molecular Dynamics Tutorial for Beginners, showing a cluster of interacting water molecules and a Velocity Verlet code overlay.
- `animation.js`: High-performance client-side script that drives:
  - An interactive HTML5 Canvas displaying slow-moving floating molecular lattices that respond to touch and cursor moves.
  - A scroll-reveal observer to introduce cards and academic milestones with smooth transition eases.
  - Accessible "Abstract" toggles on publication cards (abstracts remain visible when JavaScript is off).
  - Active-section highlighting in the homepage navigation, including keeping the active link visible in the scrollable mobile nav.
