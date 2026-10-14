"""Generate the site's favicon, touch icons and share image from the Build 365 mark.

The geometry and colours mirror src/components/OrbMark.tsx (the voice-orb ring). If you change the mark there, change the
constants here and run:  python3 site/scripts/make-icons.py      (needs Pillow)

Writes: the site favicon, touch icons and share image (site/public), the app favicon (public/) and the Chrome clipper
extension icons (extension/icons).
"""
import math
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'site' / 'public'
TILES, TURN, RADIUS, TW, TH, GROW = 24, 0.06, 32.5, 5.9, 13.4, 1.32
GRAD = ((241, 255, 0), (145, 153, 0))  # #F1FF00 -> #919900, top left to bottom right
PLATE = (13, 13, 10)

frac = lambda x: x - math.floor(x)
envelope = lambda u: math.sin(math.pi * frac(u) ** 0.75) ** 1.3

def tiles():
    out = []
    for i in range(TILES):
        u = frac(i / TILES + TURN); a = u * math.pi * 2; s = envelope(u) * GROW
        if s <= 0.14: continue
        out.append(dict(i=i, x=50 - math.sin(a) * RADIUS, y=50 + math.cos(a) * RADIUS, rot=(a - 0.35) * 180 / math.pi, s=s))
    return out

def svg(plate=True):
    hx = lambda c: '#%02X%02X%02X' % c
    body = ''.join(f'<rect x="{-TW/2}" y="{-TH/2}" width="{TW}" height="{TH}" rx="2.2" fill="#fff" opacity="{min(1, t["s"]*1.6):.2f}" transform="translate({t["x"]:.2f} {t["y"]:.2f}) rotate({t["rot"]:.1f}) scale({t["s"]:.3f})"/>' for t in tiles())
    bg = f'<rect width="100" height="100" rx="22" fill="{"#%02x%02x%02x" % PLATE}"/>' if plate else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>'
            f'<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100"><stop offset="0" stop-color="{hx(GRAD[0])}"/><stop offset="1" stop-color="{hx(GRAD[1])}"/></linearGradient>'
            f'<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">{body}</mask></defs>{bg}'
            f'<rect width="100" height="100" fill="url(#g)" mask="url(#m)"/></svg>\n')

def draw(size, plate=True, radius_ratio=0.22):
    """Render the mark at `size` px (supersampled 4x): tiles as a mask, coloured by one diagonal gradient."""
    S = size * 4; k = S / 100
    mask = Image.new('L', (S, S), 0)
    for t in tiles():
        w, h = max(2, round(TW * t['s'] * k)), max(2, round(TH * t['s'] * k))
        m = Image.new('L', (w, h), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), radius=int(2.2 * t['s'] * k), fill=int(255 * min(1, t['s'] * 1.6)))
        m = m.rotate(-t['rot'], expand=True, resample=Image.BICUBIC)
        layer = Image.new('L', (S, S), 0); layer.paste(m, (round(t['x'] * k - m.width / 2), round(t['y'] * k - m.height / 2)))
        mask = ImageChops.lighter(mask, layer)
    # Diagonal gradient: t = (x + y) / 2 across the canvas.
    grad = Image.new('RGB', (S, S)); gp = grad.load()
    for y in range(S):
        for x in range(S):
            f = (x + y) / (2 * (S - 1))
            gp[x, y] = tuple(round(GRAD[0][c] + (GRAD[1][c] - GRAD[0][c]) * f) for c in range(3))
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    if plate:
        pm = Image.new('L', (S, S), 0); ImageDraw.Draw(pm).rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * radius_ratio), fill=255)
        img.paste(Image.new('RGBA', (S, S), PLATE + (255,)), (0, 0), pm)
    img.paste(grad, (0, 0), mask)
    return img.resize((size, size), Image.LANCZOS)

def font(size, bold=False):
    f = ImageFont.truetype('/System/Library/Fonts/SFNS.ttf', size)
    try: f.set_variation_by_name('Bold' if bold else 'Regular')
    except Exception: pass
    return f

def wordmark(size, text='Build 365', track=-0.055, from_col=(255, 255, 255), to_col=(139, 144, 154)):
    """The wordmark as an RGBA image: bold, tightly tracked, fading from white to grey left to right."""
    f = font(size, True)
    step = track * size
    widths = [f.getlength(ch) for ch in text]
    total = sum(widths) + step * (len(text) - 1)
    W, H = int(total) + 8, int(size * 1.35)
    mask = Image.new('L', (W, H), 0); md = ImageDraw.Draw(mask)
    x = 4.0
    for ch, w in zip(text, widths):
        md.text((x, 0), ch, font=f, fill=255); x += w + step
    grad = Image.new('RGB', (W, H)); gp = grad.load()
    for xx in range(W):
        t = max(0.0, min(1.0, (xx / W - 0.32) / 0.68))
        col = tuple(round(from_col[c] + (to_col[c] - from_col[c]) * t) for c in range(3))
        for yy in range(H): gp[xx, yy] = col
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); out.paste(grad, (0, 0), mask)
    return out


if __name__ == '__main__':
    (OUT / 'favicon.svg').write_text(svg(True))
    (ROOT / 'public' / 'favicon.svg').write_text(svg(True))
    for px in (16, 32, 48, 128):
        draw(px).save(ROOT / 'extension' / 'icons' / f'{px}.png', optimize=True)
    for name, px in [('apple-touch-icon.png', 180), ('icon-192.png', 192), ('icon-512.png', 512)]:
        draw(px).convert('RGBA').save(OUT / name, optimize=True)
    # Share image: the mark beside the headline, on the site's dark canvas.
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), (10, 10, 8)); d = ImageDraw.Draw(im, 'RGBA')
    for r in range(520, 0, -6):
        d.ellipse((930 - r, 330 - r, 930 + r, 330 + r), fill=(245, 213, 71, int(8 * (1 - r / 520) ** 2)))
    big = draw(430, plate=False)
    im.paste(big, (715, 115), big)
    mk = draw(56, plate=False); im.paste(mk, (70, 68), mk)
    wm = wordmark(40); im.paste(wm, (140, 66), wm)
    d.text((72, 250), 'Dev tools for', font=font(84, True), fill=(242, 243, 245)); d.text((72, 342), 'lean teams.', font=font(84, True), fill=(242, 243, 245))
    d.text((72, 462), 'Shipping around the clock.', font=font(40), fill=(233, 242, 63))
    d.text((72, 552), 'One local-first workspace for tasks, roadmap, docs, GitHub, Figma and AI.', font=font(22), fill=(163, 168, 177))
    im.save(OUT / 'og-image.png', optimize=True)
    print('wrote site icons, share image, app favicon and extension icons')
