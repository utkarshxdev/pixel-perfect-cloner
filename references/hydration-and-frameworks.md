# Framework Hydration Synchronization (SvelteKit, Next.js, React)

## The Hydration Problem
When cloning a pre-rendered website, the server delivers static HTML (`site.html`). However, once the client-side JavaScript bundle runs:
- SvelteKit (`kit.start`)
- Next.js (`ReactDOM.hydrateRoot`)
- Nuxt (`createApp().mount()`)

The framework's virtual DOM reconciliation mounts and **replaces** DOM nodes with the strings bundled at compile time.

## System to Locate & Replace Strings in Bundles

### Step 1: Identify Key String Tokens
Find the original brand name, slogan, or pricing figure across `public/_app/immutable/` or `_next/static/`:
```bash
python3 -c "
import glob
for f in glob.glob('public/_app/immutable/**/*.js', recursive=True):
    with open(f) as fp:
        c = fp.read()
        if 'ORIGINAL_BRAND' in c:
            print(f, c.count('ORIGINAL_BRAND'))
"
```

### Step 2: The Core Brand Dictionary Chunk
Modern compiled bundles isolate configuration into a single chunk. Look for objects like:
```javascript
const t = {
  name: "ORIGINAL_BRAND",
  wordmark: "ORIGINAL_BRAND",
  tagline: { lead: "...", trail: "..." },
  url: "https://original.com"
};
```
Edit this file first. Changing `name` and `wordmark` here updates 80% of downstream components automatically.

### Step 3: Translation Bundles (i18n)
In multilingual apps, UI text is pulled from translation dictionaries.
Locate chunks with dictionaries like:
```javascript
{"What is BRAND?": "What is BRAND?", "BRAND team": "BRAND team"}
```
Update all occurrences of the brand string in both English and French/secondary language chunks.

### Step 4: Font Measurement Functions
Check if components measure font widths dynamically before rendering (e.g. `document.fonts.load('... "Overused Grotesk"', "BRAND")`). Ensure the test string matches the new wordmark so letter metrics calculate accurately.
