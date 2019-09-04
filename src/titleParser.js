'use strict';

const MODE_TITLE = 'MODE_TITLE';
const MODE_TAGS = 'MODE_TAGS';
const MODE_META = 'MODE_META';

const mustEscape = '[]{}\\'.split('');
const escapeStart = '\\';

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
            } else {
                tags += char;
                pos++;
            }
        } else if (mode === MODE_META) {
            meta += char;
            pos++;
        }
    }

    return {
        title: title.replace(/^::\s*/, '').trim(),
        tags: tags.replace(/^\s*\[|]\s*$/mg, '').trim(),
        meta: meta.trim(),
    };
}

module.exports = {
    titleParser,
};