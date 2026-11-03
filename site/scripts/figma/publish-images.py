#!/usr/bin/env python3
"""Publish reviewed derivative recipes while keeping native originals private.

Purpose: Make the 2026-11-03 additional curation reproducible from known PNGs.
Responsibilities: Verify source hashes, apply disclosed crops/redactions, emit bounded WebP variants.
Execution context: Maintainer Python CLI with Pillow; generated assets are committed for Node builds.
Connected files: portfolio-evidence-images.json and public-image-recipes.json.
Maintenance: New recipes require visual/privacy review; an accessible source is not blanket publication permission.
"""
import hashlib
import io
import json
import pathlib
from PIL import Image, ImageDraw


def digest(data):
    """Return a stable content identity for original or derived bytes."""
    return hashlib.sha256(data).hexdigest()


def publish(root, recipe):
    """Generate one disclosed public derivative from a reviewed source recipe."""
    source = root.parent / recipe['source']
    original = source.read_bytes()
    if digest(original) != recipe['source_sha256']:
        raise ValueError('Source changed; review required: ' + recipe['id'])
    image = Image.open(io.BytesIO(original)).convert('RGB')
    if recipe.get('crop'):
        image = image.crop(tuple(recipe['crop']))
    drawing = ImageDraw.Draw(image)
    for box in recipe.get('redactions', []):
        drawing.rectangle(tuple(box), fill='#edf0f5')
        drawing.text((box[0] + 5, box[1] + 8), 'REDACTED', fill='#4d5563')
    directory = root / 'assets/images/evidence'
    directory.mkdir(parents=True, exist_ok=True)
    variants = []
    for width in sorted(set(min(image.width, w) for w in (480, 800, 1240))):
        height = round(image.height * width / image.width)
        scaled = image.resize((width, height), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        scaled.save(output, 'WEBP', quality=90, method=6)
        data = output.getvalue()
        filename = f"{recipe['id']}-{width}-{digest(data)[:12]}.webp"
        (directory / filename).write_bytes(data)
        variants.append(dict(src='/assets/images/evidence/' + filename, width=width, height=height, bytes=len(data), sha256=digest(data)))
    social = Image.new('RGB', (1200, 630), '#0b1020')
    presentation = image.copy()
    presentation.thumbnail((1120, 550), Image.Resampling.LANCZOS)
    social.paste(presentation, ((1200-presentation.width)//2, (630-presentation.height)//2))
    output = io.BytesIO()
    social.save(output, 'PNG', optimize=True)
    data = output.getvalue()
    filename = f"{recipe['id']}-social-{digest(data)[:12]}.png"
    (directory / filename).write_bytes(data)
    return {key: recipe[key] for key in ('id','project','fileKey','nodeId','source','source_sha256','alt','caption','permission','privacy_review','presentation')} | dict(variants=variants, socialSrc='/assets/images/evidence/' + filename)


def main():
    """Update only recipe-owned entries without changing earlier reviewed assets."""
    root = pathlib.Path(__file__).resolve().parents[2]
    path = root / 'src/content/portfolio-evidence-images.json'
    images = json.loads(path.read_text())
    recipes = json.loads((root / 'src/content/public-image-recipes.json').read_text())
    for recipe in recipes:
        result = publish(root, recipe)
        images = [image for image in images if image['id'] != result['id']]
        images.append(result)
    path.write_text(json.dumps(images, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(curated_images=len(images), new_recipes=len(recipes))))


if __name__ == '__main__':
    main()
