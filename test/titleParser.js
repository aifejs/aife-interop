'use strict';

const test = require('ava');
const {titleParser,} = require('../src/titleParser.js');

const simpleFixture = ':: An overgrown path';
const tagsFixture = ':: An overgrown path [forest spooky]';
const metaFixture = ':: An overgrown path {"position":"600,400","size":"100,200"}';
const fullFixture = ':: An overgrown path [forest spooky] {"position":"600,400","size":"100,200"}';
const escapedFixture = ':: A\\n \\[over\\{grown\\} path\\] [fo\\re[st\\] s\\{pook\\}y] {"position":"600,400","size":"100,200"}'; // eslint-disable-line max-len

test('titleParser: simple', (t) => {
    const simpleTitle = titleParser(simpleFixture);
    t.is(simpleTitle.meta, '');
    t.deepEqual(simpleTitle.tags, '');
    t.is(simpleTitle.title, 'An overgrown path');
});

test('titleParser: with tags', (t) => {
    const taggedTitle = titleParser(tagsFixture);
    t.is(taggedTitle.meta, '');
    t.deepEqual(taggedTitle.tags, 'forest spooky');
    t.is(taggedTitle.title, 'An overgrown path');
});

test('titleParser: with meta', (t) => {
    const metaTitle = titleParser(metaFixture);
    t.is(metaTitle.meta, '{"position":"600,400","size":"100,200"}');
    t.deepEqual(metaTitle.tags, '');
    t.is(metaTitle.title, 'An overgrown path');
});

test('titleParser: with meta and tags', (t) => {
    const fullTitle = titleParser(fullFixture);
    t.is(fullTitle.meta, '{"position":"600,400","size":"100,200"}');
    t.deepEqual(fullTitle.tags, 'forest spooky');
    t.is(fullTitle.title, 'An overgrown path');
});

test('titleParser: with escape sequences', (t) => {
    const fullTitle = titleParser(escapedFixture);
    t.is(fullTitle.meta, '{"position":"600,400","size":"100,200"}');
    t.deepEqual(fullTitle.tags, 'fo\\re[st] s{pook}y');
    t.is(fullTitle.title, 'A\\n [over{grown} path]');
});