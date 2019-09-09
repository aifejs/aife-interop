'use strict';

const test = require('ava');
const {titleParser,} = require('../src/titleParser.js');

const simpleFixture = ':: An overgrown path';
const tagsFixture = ':: An overgrown path [forest spooky]';
const metaFixture = ':: An overgrown path {"position":"600,400","size":"100,200"}';
const fullFixture = ':: An overgrown path [forest spooky] {"position":"600,400","size":"100,200"}';
const escapedFixture = ':: A\\n \\[over\\{grown\\} path\\] [fo\\re[st\\] s\\{pook\\}y] {"position":"600,400","size":"100,200"}'; // eslint-disable-line max-len
const legacyFixture = '::Empty house <100,200>';

test('titleParser: simple', (t) => {
    const simpleTitle = titleParser(simpleFixture);
    t.deepEqual(simpleTitle.meta, {});
    t.deepEqual(simpleTitle.tags, []);
    t.is(simpleTitle.title, 'An overgrown path');
});

test('titleParser: with tags', (t) => {
    const taggedTitle = titleParser(tagsFixture);
    t.deepEqual(taggedTitle.meta, {});
    t.deepEqual(taggedTitle.tags, ['forest', 'spooky',]);
    t.is(taggedTitle.title, 'An overgrown path');
});

test('titleParser: with meta', (t) => {
    const metaTitle = titleParser(metaFixture);
    t.deepEqual(metaTitle.meta, {position: '600,400', size: '100,200',});
    t.deepEqual(metaTitle.tags, []);
    t.is(metaTitle.title, 'An overgrown path');
});

test('titleParser: with meta and tags', (t) => {
    const fullTitle = titleParser(fullFixture);
    t.deepEqual(fullTitle.meta, {'position': '600,400','size': '100,200',});
    t.deepEqual(fullTitle.tags, ['forest', 'spooky',]);
    t.is(fullTitle.title, 'An overgrown path');
});

test('titleParser: with escape sequences', (t) => {
    const fullTitle = titleParser(escapedFixture);
    t.deepEqual(fullTitle.meta, {'position': '600,400','size': '100,200',});
    t.deepEqual(fullTitle.tags, ['fo\\re[st]', 's{pook}y',]);
    t.is(fullTitle.title, 'A\\n [over{grown} path]');
});

test('titleParser: legacy mode', (t) => {
    const legacyTitle = titleParser(legacyFixture);

    // t.deepEqual doesn't work here for some reason, saying "object are equal, but not the same"
    t.is(legacyTitle.meta.x, 100);
    t.is(legacyTitle.meta.y, 200);
    t.is(Object.keys(legacyTitle.meta).length, 2);

    t.is(legacyTitle.tags.length, 0);
    t.is(legacyTitle.title, 'Empty house');
});