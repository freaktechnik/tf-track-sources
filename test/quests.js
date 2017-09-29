import test from 'ava';
import Ajv from 'ajv';
import schema from '../schemas/quests.json';
import tracks from '../data/tracks.json';
import quests from '../data/quests.json';

const getQuest = (name) => quests.find((q) => q.name === name),
    requiredQuests = (quest) => quest.requirements.filter((r) => r.type === "quest").map((r) => r.name),
    requiresName = (reqQuests, name) => reqQuests.some((q) => q === name),
    checkQuest = (questName, name) => {
        const reqQuests = requiredQuests(getQuest(questName));
        return !requiresName(reqQuests, name) && reqQuests.every((q) => checkQuest(q, name));
    };

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

test('No circular quests', (t) => {
    for(const quest of quests) {
        t.true(checkQuest(quest.name, quest.name));
    }
});

test('Tracks rewarded after first use', (t) => {
    //TODO don't make this test depend on the order of quests in the array. i.e. build the quest tree.
    const awardedTracks = new Set();
    for(const quest of quests) {
        const requiredTracks = quest.requirements.filter((r) => r.type === "track");
        for(const track of requiredTracks) {
            if(!awardedTracks.has(track.name)) {
                t.true(quest.rewards.some((r) => r.type === track.type && r.name == track.name && r.amount >= 1));
                awardedTracks.add(track.name);
            }
        }
    }
});
