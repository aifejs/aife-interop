'use strict';

/**
 * @param {string} storyString
 * @return {Partial<IStory>}
 */
function importTwee(storyString) {
    const passages = storyString.trim().split(/\n\n::/mg);

    const story = passages.reduce(
        (storyProgress, passageString, index) => {
            const passage = parsePassageString(passageString.trim());

            if (passage.title === 'StoryTitle') {
                storyProgress.title = passage.text;
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

    return story;
}

/**
 * @param {string} passageString
 * @return Partial<IPassage>
 */
function parsePassageString(passageString) {
    const passage = {
        tags: [],
    };
    let [titleLine, ...text] = passageString.split('\n');

    // since JS doesn't have character classes, it's hard to write regexp that covers
    // unicode passage name and unicode tags, so we use replace with side-effects,
    // gradually removing pieces until only title remains

    titleLine = titleLine
        .replace(/( <\d+,\d+>)/, (match) => {
            const [x, y,] = match.replace(/(<|>)/, '').split(',').map(parseFloat);
            passage.position = {
                x,
                y,
            };

            return '';
        })
        .trim();

    titleLine = titleLine
        .replace(/\[.*\]/, (match) => {
            const tags = match.replace(/(\[|\])/g, '').split(/\s+/);
            passage.tags.push(...tags);

            return '';
        })
        .trim();

    titleLine = titleLine
        .replace(/^::/, '')
        .trim();

    passage.title = titleLine;
    passage.text = text.join('\n').trim();

    if (passage.title === 'Start') {
        passage.starting = true;
    }

    return passage;
}

module.exports = {
    importTwee,
};