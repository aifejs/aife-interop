'use strict';

const test = require('ava');
const {importTwee,} = require('../src/importTwee');

const storyFixture = `
::StoryTitle [ifid-some_unique_uuid story-format-SugarCube format-version-2.28.2]
My sad story

::Start [start another-tag] <100,200>

My story begins when I was but a kid.
It is a very long story, so bear with me.

Actually, forget that. I'm tired.

::Second passage <100.25,-100.55>
Mock passage

::Stylesheet [stylesheet]

a { color: red; }

::Script [script]

alert(123);
`;

test('importTwee', async (t) => {
    const story = importTwee(storyFixture);

    t.is(story.passages.length, 2);
    t.is(story.title, 'My sad story');
    t.is(story.styleSheet, 'a { color: red; }');
    t.is(story.script, 'alert(123);');
    t.is(story.format, 'SugarCube');
    t.is(story.formatVer, '2.28.2');
    t.is(story.ifid, 'some_unique_uuid');

    const passage1 = story.passages[0];
    t.pass(passage1.starting);
    t.pass(passage1.text.startsWith('My story'));
    t.pass(passage1.text.endsWith('tired.'));
    t.deepEqual(passage1.position, {x: 100, y: 200,});

    const passage2 = story.passages[1];
    t.pass(!passage2.starting);
    t.is(passage2.text, 'Mock passage');
    t.deepEqual(passage2.position, {x: 100.25, y: -100.55,});

});
