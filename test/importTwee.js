'use strict';

const test = require('ava');
const fs = require('fs');
const {importTwee,} = require('../src/importTwee');

test('importTwee', async (t) => {
    const storyFixture = fs.readFileSync('test/fixtures/importTwee.lf.twee');
    const story = importTwee(storyFixture.toString());

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

test('importTwee/supports CRLF', async (t) => {
    const crlf = fs.readFileSync('test/fixtures/importTwee.crlf.twee');
    const lf = fs.readFileSync('test/fixtures/importTwee.lf.twee');
    const crlfStory = importTwee(crlf.toString());
    const lfStory = importTwee(lf.toString());

    t.is(crlfStory.title, lfStory.title);
    t.is(crlfStory.passages.length, lfStory.passages.length);
    t.is(crlfStory.ifid, lfStory.ifid);
    t.is(crlfStory.format, lfStory.format);
    t.is(crlfStory.formatVer, lfStory.formatVer);
    t.is(crlfStory.zoom, lfStory.zoom);
});