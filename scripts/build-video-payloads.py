"""Package gallery MP4s for playback on the anonymous review host."""
import base64
import hashlib
import pathlib
import re
import subprocess
import tempfile

root = pathlib.Path(__file__).resolve().parents[1]
index = root / 'index.html'
html = index.read_text()
paths = dict.fromkeys(url.split('?')[0] for url in re.findall(r'data-video="([^"]+)"', html))
for relative in paths:
    video = root / relative
    data = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(video), '-map', '0:v:0', '-c', 'copy', '-an', '-map_metadata', '-1', '-movflags', 'frag_keyframe+empty_moov+default_base_moof', '-f', 'mp4', 'pipe:1'], check=True, stdout=subprocess.PIPE).stdout
    avcc = data.index(b'avcC')
    codec = 'avc1.' + data[avcc + 5:avcc + 8].hex()
    # A seekable file reports the full duration instead of just the first fragment.
    with tempfile.NamedTemporaryFile(suffix='.mp4') as stream:
        stream.write(data)
        stream.flush()
        duration = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(stream.name)], check=True, stdout=subprocess.PIPE).stdout.decode().strip()
    part_size = 1024 * 1024 - 1
    parts = [data[start:start + part_size] for start in range(0, len(data), part_size)]
    for old_part in video.parent.glob(video.name + '.part*.js'):
        old_part.unlink()
    for number, part in enumerate(parts, 1):
        encoded = base64.b64encode(part).decode('ascii')
        video.with_suffix(f'.mp4.part{number:02d}.js').write_text('document.currentScript.dispatchEvent(new CustomEvent("video-data",{detail:Uint8Array.from(atob("' + encoded + '"),c=>c.charCodeAt(0))}));\n')
    html = re.sub(r'data-video="' + re.escape(relative) + r'(?:\?[^"]*)?"(?: data-parts="\d+")?(?: data-codec="[^"]+")?(?: data-duration="[^"]+")?', 'data-video="' + relative + '?v=' + hashlib.sha256(data).hexdigest()[:12] + '" data-parts="' + str(len(parts)) + '" data-codec="' + codec + '" data-duration="' + duration + '"', html)

def inline_cover(match):
    tag = match[0]
    path = re.search(r'data-poster="([^"]+)"', tag) or re.search(r'src="([^"]+)"', tag)
    data = base64.b64encode((root / path[1]).read_bytes()).decode('ascii')
    tag = re.sub(r'src="[^"]*"', 'src="data:image/jpeg;base64,' + data + '"', tag)
    return tag if 'data-poster=' in tag else tag.replace('<img ', '<img data-poster="' + path[1] + '" ', 1)

html = re.sub(r'<img\b(?=[^>]*class="video-poster")[^>]*>', inline_cover, html)
index.write_text(html)
print(f'Packaged {len(paths)} videos.')
