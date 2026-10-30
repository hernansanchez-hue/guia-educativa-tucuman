import assert from 'node:assert/strict';
import test from 'node:test';
import {canOptimizePublicImage} from '../lib/public-image.mjs';

test('only known public raster providers use the image optimizer', () => {
  assert.equal(canOptimizePublicImage('/assets/get-city-footer-logo.png'), true);
  assert.equal(canOptimizePublicImage('/assets/catalog/law.webp'), true);
  assert.equal(canOptimizePublicImage('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80'), true);
  assert.equal(canOptimizePublicImage('https://res.cloudinary.com/disj9fs8m/image/upload/example.png'), true);
});

test('editorial providers, authenticated paths, SVG and unsupported URLs retain their source', () => {
  for (const src of [undefined, '', '/admin/media/private.png', '/media/cms/editorial.png', '/assets/icon.svg', 'https://other.example/image.jpg', 'http://images.unsplash.com/photo-123', 'https://images.unsplash.com:8443/photo-123', 'https://images.unsplash.com/not-a-photo', 'https://res.cloudinary.com/another-account/image/upload/test.jpg', 'data:image/png;base64,abc']) {
    assert.equal(canOptimizePublicImage(src), false, String(src));
  }
});
