# The Shape of Inquiry — Technical Cinematic Short v2

This is a 3-minute vertical Remotion short built to feel like a dense technical research film, not a product ad.

## Install

```bash
npm install
```

## Preview

```bash
npm run dev
```

## Render vertical short

```bash
npm run render
```

Output:

```text
out/the-shape-of-inquiry-vertical.mp4
```

## Render wide screening version

```bash
npm run render:horizontal
```

## Notes

No generated audio is included. Use `docs/audio-direction.md` for narration, music, and SFX prompts/search terms.

The project uses only reproducible procedural graphics plus the included real/generated lab asset. More captured or generated assets can be dropped into `public/images` and wired into scene components.
