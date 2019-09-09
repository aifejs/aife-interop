'use strict';

const MODE_TITLE = 'MODE_TITLE';
const MODE_TAGS = 'MODE_TAGS';
const MODE_META = 'MODE_META';
const MODE_LEGACY_META = 'MODE_LEGACY_META';

const mustEscape = '[]{}\\'.split('');
const escapeStart = '\\';
const isLegacyCoord = '1234567890.,-'.split('');

function isEscaped(char) {
    return mustEscape.includes(char);
}

function titleParser(stream) {
    let mode = MODE_TITLE;
    let pos = 0;

    let title = '';
    let tags = '';
    let meta = '';

    while (pos < stream.length) {
        const char = stream[pos];

        if (mode === MODE_TITLE) {
            if (char === escapeStart) {
                if (isEscaped(stream[pos + 1])) {
                    title += stream[pos + 1];

                    pos++;
                } else {
                    title += char;
                }
                pos++;
            } else if (char === '[') {
                mode = MODE_TAGS;
            } else if (char === '{') {
                mode = MODE_META;
            } else if (char === '<') {
                mode = MODE_LEGACY_META;
            } else {
                title += char;
                pos++;
            }
        } else if (mode === MODE_TAGS) {
            if (char === escapeStart) {
                if (isEscaped(stream[pos + 1])) {
                    tags += stream[pos + 1];
                    pos++;
                } else {
                    tags += char;
                }
                pos++;
            } else if (char === '{') {
                mode = MODE_META;
            } else if (char === '<') {
                mode = MODE_LEGACY_META;
            } else {
                tags += char;
                pos++;
            }
        } else if (mode === MODE_META) {
            meta += char;
            pos++;
        } else if (mode === MODE_LEGACY_META) {
            if (isLegacyCoord.includes(char)) {
                meta += char;
            }
            pos++;
        }
    }

    const parsedTitle = {
        title: title.replace(/^::\s*/, '').trim(),
        tags: tags.length ? tags.replace(/^\s*\[|]\s*$/mg, '').split(/\s+/g) : [],
    };

    if (mode === MODE_LEGACY_META) {
        const [x, y,] = meta.split(',').map(parseFloat);
        parsedTitle.meta = {
            x,
            y,
        };
    } else if (mode === MODE_META) {
        try {
            parsedTitle.meta = JSON.parse(meta);
        } catch (e) {
            console.warn(`Malformed meta at passage "${stream}"`); // eslint-disable-line no-console
            parsedTitle.meta = {};
        }
    } else {
        parsedTitle.meta = {};
    }

    return parsedTitle;
}

module.exports = {
    titleParser,
};