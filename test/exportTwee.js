'use strict';

const test = require('ava');
const {exportTwee,} = require('../src/exportTwee');

/** @type IStory */
const storyFixture = {
    title: 'My sad story',
    format: 'SugarCube',
    formatVer: '2.28.2',
    ifid: 'some_unique_uuid',
    tagColors: {
        bookmark: 'green',
    },
    styleSheet: 'a { color: red; }',
    script: 'alert(123);',
    passages: [
        {
            title: 'Intro',
            text: `My story begins when I was but a kid.
It is a very long story, so bear with me.

Actually, forget that. I'm tired.`,
            tags: ['tag', 'another-tag',],
            position: {x: 100, y: 200,},
            starting: true,
        },
    ],
};

test('exportTwee', async (t) => {
    const twee = exportTwee(storyFixture);

    t.truthy(twee);
    t.true(twee.includes('::Stylesheet [stylesheet]\na { color: red; }'));
    t.true(twee.includes('::Script [script]\nalert(123);'));
    t.true(twee.includes('::Start [tag another-tag] <100,200>'));
    t.true(
        twee.includes('::StoryTitle\nMy sad story')
    );
    t.true(
        twee.includes('::StorySettings\nifid:some_unique_uuid')
    );
});