import test from 'ava';
import Ajv from 'ajv';
import schema from '../schemas/tracks.json';
import sources from '../data/sources.json';
import tracks from '../data/tracks.json';

test('Tracks comply to the schema', (t) => {
    const ajv = new Ajv();

    const valid = ajv.validate(schema, tracks);
    if(!valid) {
        t.fail(ajv.errorsText());
    }
    else {
        t.true(valid);
    }
});

test('Track sources exist', (t) => {
    const sourceNames = Object.values(sources).map((source) => source.name);
    for(const track of tracks) {
        for(const s of track.sources) {
            t.true(sourceNames.includes(s.source));
        }
    }
});
