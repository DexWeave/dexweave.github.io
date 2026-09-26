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
    parts = ['<svg xmlns="http://www.w3.org/2000/svg"><script><![CDATA[const chunks=[];]]></script>']
    for start in range(0, len(data), 384 * 1024):
        encoded = base64.b64encode(data[start:start + 384 * 1024]).decode('ascii')
        parts.append('<script><![CDATA[chunks.push(Uint8Array.from(atob("' + encoded + '"),c=>c.charCodeAt(0)));]]></script>')
    parts.append('<script><![CDATA[parent.postMessage({type:"video-data",blob:new Blob(chunks,{type:"video/mp4"})},"*");]]></script></svg>')
    video.with_suffix('.mp4.svg').write_text('\n'.join(parts) + '\n')
    html = re.sub(r'data-video="' + re.escape(relative) + r'(?:\?[^"]*)?"', 'data-video="' + relative + '?v=' + hashlib.sha256(data).hexdigest()[:12] + '"', html)
index.write_text(html)
print(f'Packaged {len(paths)} videos.')
