'use strict';

/**
 * @param {IStory} story
 * @return {string}
 */
function exportTwee(story) {
    return [
        exportTitle(story),
        exportStorySettings(story),
        ...story.passages.map(exportTweePassage),
        exportStyle(story),
        exportScript(story),
    ].join('\n\n');
}

/**
 * @param {IPassage} passage
 * @return {string}
 */
function exportTweePassage(passage) {
    let title = `::${passage.starting ? 'Start' : passage.title}`;
    if (passage.tags && passage.tags.length) {
        title += ` [${passage.tags.join(' ')}]`;
    }

    if (passage.position) {
        title += ` ${JSON.stringify(passage.position)}`;
    }

    return title + '\n' + passage.text; // eslint-disable-line prefer-template
}

/**
 * @param {IStory} story
 * @return {string}
 */
function exportStyle(story) {
    return exportTweePassage({
        title: 'Stylesheet',
        tags: ['stylesheet',],
        text: story.styleSheet,
    });
}

/**
 * @param {IStory} story
 * @return {string}
 */
function exportScript(story) {
    return exportTweePassage({
        title: 'Script',
        tags: ['script',],
        text: story.script,
    });
}

/**
 * @param {IStory} story
 * @return {string}
 */
function exportTitle(story) {
    return exportTweePassage({
        title: 'StoryTitle',
        text: story.title,
    });
}

/**
 * @param {IStory} story
 * @return {string}
 */
function exportStorySettings(story) {
    const textCollector = [];
    if (story.ifid) {
        textCollector.push(`ifid:${story.ifid}`);
    }
    if (story.format) {
        textCollector.push(`story-format:${story.format}`);
    }
    if (story.formatVer) {
        textCollector.push(`format-version:${story.formatVer}`);
    }
    if (story.tagColors && Object.keys(story.tagColors).length > 0) {
        textCollector.push(`tag-colors:${JSON.stringify(story.tagColors)}`);
    }

    return exportTweePassage({
        title: 'StorySettings',
        text: textCollector.join('\n'),
    });
}

module.exports = {
    exportTwee,
};