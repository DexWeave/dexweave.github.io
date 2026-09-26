"""Package gallery MP4s for playback on the anonymous review host."""
import base64
import hashlib
import pathlib
import re

root = pathlib.Path(__file__).resolve().parents[1]
index = root / 'index.html'
html = index.read_text()
paths = dict.fromkeys(url.split('?')[0] for url in re.findall(r'data-video="([^"]+)"', html))
for relative in paths:
    video = root / relative
    data = video.read_bytes()
    encoded = base64.b64encode(data).decode('ascii')
    video.with_suffix('.mp4.js').write_text('document.currentScript.dispatchEvent(new CustomEvent("video-data",{detail:new Blob([Uint8Array.from(atob("' + encoded + '"),c=>c.charCodeAt(0))],{type:"video/mp4"})}));\n')
    html = re.sub(r'data-video="' + re.escape(relative) + r'(?:\?[^"]*)?"', 'data-video="' + relative + '?v=' + hashlib.sha256(data).hexdigest()[:12] + '"', html)
index.write_text(html)
print(f'Packaged {len(paths)} videos.')
