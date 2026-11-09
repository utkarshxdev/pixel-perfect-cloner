# 3D Canvas Hit-Testing & Case Study Modals

## Converting Non-Interactive WebGL into Interactive Portfolios

On luxury marketing websites, 3D card reels frequently have `pointer-events: none` on both the canvas and the parent section to avoid conflicting with page-level scrollytelling. This creates a frustrating "dead element" experience for visitors who want to click project cards.

### 1. The Perspective Projection Formula
To calculate where a 3D card sits on the 2D screen:

```javascript
function projectCardToScreen(card, camera, canvasRect) {
  // 1. Distance along camera viewing axis
  const camZ = camera.z - card.z;
  if (camZ <= 0.1 || card.opacity < 0.1) return null;

  // 2. Frustum half-extents at current depth
  const fovRad = (camera.fov * Math.PI) / 180;
  const aspect = canvasRect.width / Math.max(1, canvasRect.height);
  const halfHeight = Math.tan(fovRad / 2) * camZ;
  const halfWidth = halfHeight * aspect;

  // 3. Normalized Device Coordinates (NDC: -1 to +1)
  const ndcX = card.x / halfWidth;
  const ndcY = card.y / halfHeight;

  // 4. Viewport Screen Coordinates (Pixels)
  const screenX = (ndcX * 0.5 + 0.5) * canvasRect.width + canvasRect.left;
  const screenY = (-ndcY * 0.5 + 0.5) * canvasRect.height + canvasRect.top;

  // 5. Projected Width & Height
  const baseSize = 3.4; // Base model scale
  const cardWidth = ((card.scale * baseSize) / halfWidth) * 0.5 * canvasRect.width;
  const cardHeight = cardWidth * 0.66; // 16:10 or 3:2 aspect ratio

  return {
    index: card.index,
    camZ,
    screenX,
    screenY,
    cardWidth,
    cardHeight,
    bounds: {
      left: screenX - cardWidth / 2,
      right: screenX + cardWidth / 2,
      top: screenY - cardHeight / 2,
      bottom: screenY + cardHeight / 2
    }
  };
}
```

### 2. Hit-Testing on Mousemove & Click
```javascript
function findCardAt(clientX, clientY, projectedCards) {
  const hits = projectedCards.filter(p =>
    clientX >= p.bounds.left && clientX <= p.bounds.right &&
    clientY >= p.bounds.top && clientY <= p.bounds.bottom
  );
  if (!hits.length) return null;
  // Return the closest card to camera (smallest camZ)
  hits.sort((a, b) => a.camZ - b.camZ);
  return hits[0];
}
```

### 3. Glassmorphic Modal Specifications
When a card is clicked, display a modal containing:
- **Browser Mockup**: Top bar with macOS controls (red, yellow, green) and real project URL.
- **Project Metadata**: Client name, category badge, 10-day turnaround, tech stack.
- **High-Converting CTA**: "Start a project like this" button that smoothly scrolls to `#pricing`.
- **Keyboard Navigation**: `Escape` to close, `ArrowLeft` / `ArrowRight` to cycle through projects.
