#!/usr/bin/env python3
"""
Deep Asset Fetcher for Pixel-Perfect Cloning
Discovers and downloads all responsive picture variants (.avif, .webp, -m),
custom fonts (.woff2), media assets, and scripts.
"""

import sys
import os
import re
import urllib.request
import urllib.parse

def fetch_asset(url, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
        return True
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            }
        )
        with urllib.request.urlopen(req, timeout=10) as response, open(output_path, "wb") as out:
            out.write(response.read())
        print(f"Downloaded: {output_path} ({os.path.getsize(output_path)} bytes)")
        return True
    except Exception as e:
        print(f"Failed to fetch {url}: {e}", file=sys.stderr)
        return False

def scan_and_download(html_file, origin_url, output_dir):
    with open(html_file, "r", encoding="utf-8") as f:
        html = f.read()

    patterns = [
        r'srcset=["\']([^"\']+)["\']',
        r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp|avif|svg|woff2|woff|ttf|mp3|mp4))["\']',
        r'href=["\']([^"\']+\.(?:png|jpg|jpeg|webp|avif|svg|woff2|woff|ttf|css))["\']',
    ]

    found_urls = set()
    for p in patterns:
        for match in re.finditer(p, html):
            val = match.group(1)
            # Handle srcset with multiple entries like "/img.avif 1x, /img-2x.avif 2x"
            parts = [x.strip().split(" ")[0] for x in val.split(",")]
            for part in parts:
                if part and not part.startswith("data:"):
                    found_urls.add(part)

    print(f"Found {len(found_urls)} unique asset paths in {html_file}")

    for asset_path in sorted(found_urls):
        clean_path = asset_path.split("?")[0].lstrip("/")
        full_url = urllib.parse.urljoin(origin_url, asset_path)
        dest_path = os.path.join(output_dir, clean_path)
        fetch_asset(full_url, dest_path)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: deep-asset-fetcher.py <path_to_html> <origin_url> <output_dir>")
        sys.exit(1)
    scan_and_download(sys.argv[1], sys.argv[2], sys.argv[3])
