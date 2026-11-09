# WebGL, Canvas & Shader Troubleshooting in Cloned Sites

## Common WebGL Issues & Solutions

### 1. Canvas Remains at `opacity: 0` (Black/Transparent Gallery)
- **Symptom**: The 3D card carousel or halftone effect does not render; `[data-gallery-canvas]` has inline style `opacity: 0` or CSS rule hiding it.
- **Root Cause**: The engine's image loading promise chain rejected or never resolved because one of the `<picture>` asset formats (usually `.avif` or mobile `-m.webp`) failed with HTTP 404.
- **Diagnostic**:
  ```javascript
  // In Chrome console / CDP:
  document.querySelectorAll('img[data-gallery-print]').forEach(img => {
    console.log(img.src, 'complete:', img.complete, 'naturalWidth:', img.naturalWidth);
  });
  ```
- **Fix**:
  1. Inspect network 404s for image files.
  2. Download every responsive format (`1.avif`, `1-m.avif`, `1.webp`, `1-m.webp`).
  3. Change `loading="lazy"` to `loading="eager"` on textures needed by WebGL.

### 2. WebGL Context Loss (`webglcontextlost`)
- **Symptom**: On tab change, resize, or device wake, the canvas goes blank and does not recover.
- **Fix**: Ensure the restoration listener properly triggers scene re-compilation:
  ```javascript
  canvas.addEventListener("webglcontextrestored", () => {
    renderer?.rebuild();
    requestAnimationFrame(renderLoop);
  });
  ```

### 3. Exposing Engine Instance for Custom Interaction
Always locate the constructor of the scene controller (e.g., `class Vi` or `function createScene`) in the minified vendor chunk and attach it to `window`:
```javascript
// Inside chunk before returning:
window.__sybiosGallery = ee;
window.__sybiosGalleryCanvas = K;
```
This gives your custom scripts access to camera coordinates, card positions, and progress variables.
