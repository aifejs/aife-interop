'use strict';

const {getStartingName,} = require('./utils.js');

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
    let title = `::${passage.title}`;
    if (passage.tags && passage.tags.length) {
        title += ` [${passage.tags.join(' ')}]`;
    }

    if (passage.position && Object.keys(passage.position).length > 0) {
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
    const settings = {};

    if (story.ifid) {
        settings.ifid = story.ifid;
    }
    if (story.format) {
        settings.format = story.format;
    }
    if (story.formatVer) {
        settings['format-version'] = story.formatVer;
    }
    if (story.tagColors && Object.keys(story.tagColors).length > 0) {
        settings['tag-colors'] = story.tagColors;
    }
    if (story.zoom) {
        settings.zoom = story.zoom;
    }
    settings.start = getStartingName(story);

    return exportTweePassage({
        title: 'StoryData',
        text: JSON.stringify(settings, null, '    '),
    });
}

module.exports = {
    exportTwee,
};