import test from 'ava';
import Ajv from 'ajv';
import schema from '../schemas/quests.json';
import tracks from '../data/tracks.json';
import quests from '../data/quests.json';

test('Quests comply to the schema', (t) => {
    const ajv = new Ajv();

    const valid = ajv.validate(schema, quests);
    if(!valid) {
        t.fail(ajv.errorsText());
    }
    else {
        t.true(valid);
    }
});

test('Tracks exist', (t) => {
    const trackNames = Object.values(tracks).map((track) => track.name);
    for(const quest of quests) {
        for(const req of quest.requirements) {
            if(req.type == "track") {
                t.true(trackNames.includes(req.name));
            }
        }
        for(const rew of quest.rewards) {
            if(rew.type == "track") {
                t.true(trackNames.includes(rew.name));
            }
        }
    }
});

test.todo('No circular quests');
test.todo('Tracks rewarded after first use');
