/**
 * @param {IStory} story
 * @return {number}
 */
function getStartingPid(story) {
    const startingPassage = story.passages.find(({starting,}) => starting);
    if (startingPassage) {
        return startingPassage.pid;
    } else {
        return 1;
    }
}
/**
 * @param {IStory} story
 * @return {string|null}
 */
function getStartingName(story) {
    const startingPassage = story.passages.find(({starting,}) => starting);
    if (startingPassage) {
        return startingPassage.title;
    } else {
        return null;
    }
}

module.exports = {
    getStartingPid,
    getStartingName,
}