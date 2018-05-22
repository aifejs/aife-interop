'use strict';

function exportTwee(story) {
    return [
        exportTitle(story),
        ...story.passages.map(exportTweePassage),
        exportStyle(story),
        exportScript(story),
    ].join('\n\n');
}

function exportTweePassage(passage) {
    let title = `::${passage.starting ? 'Start' : passage.title}`;
    if (passage.tags && passage.tags.length) {
        title += ` [${passage.tags.join()}]`;
    }

    if (passage.position) {
        title += ` <${passage.position.x},${passage.position.y}>`;
    }

    return title + '\n' + passage.text; // eslint-disable-line prefer-template
}

function exportStyle(story) {
    return exportTweePassage({
        title: 'Stylesheet',
        tags: ['stylesheet',],
        text: story.styleSheet,
    });
}

function exportScript(story) {
    return exportTweePassage({
        title: 'Script',
        tags: ['script',],
        text: story.script,
    });
}

function exportTitle(story) {
    return exportTweePassage({
        title: 'StoryTitle',
        text: story.title,
    });
}

module.exports = {
    exportTwee,
};