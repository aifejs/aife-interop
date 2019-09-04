'use strict';

const {titleParser,} = require('./titleParser.js');

/**
 * @deprecated
 * @param {IPassage} passage
 * @return {IStoryMeta}
 */
function extractMetaFromStoryTitle(passage) {
    const meta = passage.tags.reduce((/** IStoryMeta */acc, tag) => {
        if (tag.startsWith('ifid-')) {
            acc.ifid = tag.replace('ifid-', '');
        }

        if (tag.startsWith('story-format-')) {
            acc.format = tag.replace('story-format-', '');
        }

        if (tag.startsWith('format-version-')) {
            acc.formatVer = tag.replace('format-version-', '');
        }

        return acc;
    }, {
        title: passage.text, // sic!
    });

    if (Object.keys(meta).length > 1) {
        console.warn('Using StoryTitle tags to pass metadata is deprecated, use StorySettings');
    }

    return meta;
}

/**
 * @deprecated
 * @param {IPassage} passage
 * @return {IStoryMeta}
 */
function extractMetaFromStorySettings(passage) {
    const meta = passage.text.split(/\s*\n\s*/).reduce((/** IStoryMeta */acc, line) => {
        if (line !== '') {
            if (line.startsWith('ifid:')) {
                acc.ifid = line.replace('ifid:', '');
            }

            if (line.startsWith('story-format:')) {
                acc.format = line.replace('story-format:', '');
            }

            if (line.startsWith('format-version:')) {
                acc.formatVer = line.replace('format-version:', '');
            }

            if (line.startsWith('tag-colors:')) {
                let tagColors;
                try {
                    tagColors = JSON.parse(line.replace('tag-colors:', ''));
                } catch (e) {
                    console.warn('Failed to parse tag colors:', e.message);
                    tagColors = {};
                }

                acc.tagColors = tagColors;
            }
        }

        return acc;
    }, {});

    return meta;
}

function extractMetaFromStoryData(passage) {
    try {
        const meta = JSON.parse(passage.text);
        return {
            ifid: meta.ifid,
            format: meta.format,
            formatVer: meta['format-version'],
            tagColors: meta['tag-colors'] || {},
            zoom: meta.zoom || 1,
            starting: meta.start,
        };
    } catch (e) {
        return {};
    }
}

/**
 * @param {string} storyString
 * @return {Partial<IStory>}
 */
function importTwee(storyString) {
    const passages = storyString.trim().split(/\n\n::/mg);

    const story = passages.reduce(
        (/** {Partial<IStory>} */storyProgress, passageString, index) => {
            const passage = parsePassageString(passageString.trim());

            if (passage.title === 'StoryTitle') {
                Object.assign(storyProgress, extractMetaFromStoryTitle(passage));
            } else if (passage.title === 'StorySettings') {
                Object.assign(storyProgress, extractMetaFromStorySettings(passage));
            } else if (passage.title === 'StoryDate') {
                Object.assign(storyProgress, extractMetaFromStoryData(passage));
            } else if (passage.tags.includes('stylesheet')) {
                storyProgress.styleSheet += passage.text + '\n'; // eslint-disable-line prefer-template
            } else if (passage.tags.includes('script')) {
                storyProgress.script += passage.text + '\n'; // eslint-disable-line prefer-template
            } else {
                storyProgress.passages.push(
                    Object.assign(
                        {pid: index + 1,},
                        passage
                    )
                );
            }

            return storyProgress;
        },
        {
            styleSheet: '',
            script: '',
            passages: [],
        }
    );

    story.styleSheet = story.styleSheet.trim();
    story.script = story.script.trim();

    if (story.starting) {
        story.passages.forEach((passage) => {
            if (passage.title === story.starting) {
                passage.starting = true;
            }
        });
    } else {
        story.passages.forEach((passage) => {
            if (passage.title === 'Start') {
                passage.starting = true;
            }
        });
    }

    return story;
}

/**
 * @param {string} passageString
 * @return Partial<IPassage>
 */
function parsePassageString(passageString) {
    const passage = {};
    const [titleLine, ...text] = passageString.split('\n');

    const {title, tags, meta,} = titleParser(titleLine);
    passage.text = text.join('\n').trim();

    let passageMeta = {};
    try {
        if (meta !== '') {
            passageMeta = JSON.parse(meta);
        }
    } catch (e) {
        console.error(`Malformed meta: "${titleLine}"`);
    }

    const {x, y, width, height, ...rest} = passageMeta;
    const position = {
        x,
        y,
    };

    if (width !== undefined) {
        position.width = width;
    }
    if (height !== undefined) {
        position.height = height;
    }

    return {
        title,
        tags: tags.split(' '),
        starting: title === 'Start',
        position,
        ...rest,
        text: text.join('\n').trim(),
    };
}

module.exports = {
    importTwee,
};