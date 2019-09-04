'use strict';

const test = require('ava');
const {importTwee,} = require('../src/importTwee');

const storyFixture = `
::StoryTitle
My sad story

::StorySettings
ifid:some_unique_uuid
story-format:SugarCube
format-version:2.28.2
tag-colors:{"bookmark":"green"}

::Start [start another-tag] {"x":100,"y":200,"width":100,"height":100}

My story begins when I was but a kid.
It is a very long story, so bear with me.

Actually, forget that. I'm tired.

::Second passage {"x":100.25,"y":-100.55}
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
    t.deepEqual(story.tagColors, {bookmark: 'green',});

    const passage1 = story.passages[0];
    t.true(passage1.starting);
    t.true(passage1.text.startsWith('My story'));
    t.true(passage1.text.endsWith('tired.'));
    t.deepEqual(passage1.position, {x: 100, y: 200, width: 100, height: 100,});

    const passage2 = story.passages[1];
    t.false(passage2.starting);
    t.is(passage2.text, 'Mock passage');
    t.deepEqual(passage2.position, {x: 100.25, y: -100.55,});

});
