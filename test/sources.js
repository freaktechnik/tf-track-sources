import test from 'ava';
import Ajv from 'ajv';
import schema from '../schemas/sources.json';
import sources from '../data/sources.json';
import tracks from '../data/tracks.json';

test('Sources comply to the schema', (t) => {
    const ajv = new Ajv();

    const valid = ajv.validate(schema, sources);
    if(!valid) {
        t.fail(ajv.errorsText());
    }
    else {
        t.true(valid);
    }
});

test('All sources are used in tracks', (t) => {
    const usedSources = new Set();
    for(const track of tracks) {
        for(const { source } of track.sources) {
            usedSources.add(source);
        }
    }

    for(const source of sources) {
        if("source" in source) {
            usedSources.add(source.source);
        }
    }

    for(const source of sources) {
        t.true(usedSources.has(source.name));
    }
});
