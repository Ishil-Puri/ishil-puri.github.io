import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('./photo-loading.js', import.meta.url), 'utf8');

for (const outcome of ['cached', 'load', 'error']) {
  const classes = new Set();
  const listeners = {};
  const image = {
    complete: outcome === 'cached',
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
    addEventListener: (name, callback) => { listeners[name] = callback; },
  };
  runInNewContext(source, { document: { querySelectorAll: () => [image] } });
  if (outcome === 'cached') {
    assert.equal(Object.keys(listeners).length, 0);
  } else {
    assert(classes.has('is-loading'));
    listeners[outcome]();
  }
  assert(!classes.has('is-loading'), `${outcome} leaves the image hidden`);
}

console.log('Checked cached images, loaded images, and failed downloads.');
