interface IStoryMeta {
    ifid: string,
    format: string,
    formatVer: string;
    tagColors: object;
}

interface IStory extends IStoryMeta {
    title: string,
    passages: IPassage[],
    styleSheet: string,
    script: string,
    lastEdit: Date | number,
}

interface IPassagePosition {
    x: number;
    y: number;
}

type PassagePid = number;

interface IPassage {
    title: string,
    text: string,
    pid: PassagePid,
    tags: string[],
    starting: boolean,
    selected: boolean;
    position: IPassagePosition;
}

interface ITwineStory {
    startPassagePid: PassagePid,
    name: string,
    ifid: string,
    lastUpdate: Date,
    script: string,
    stylesheet: string,
    zoom: number,
    passages: ITwinePassage[],
    format: string,
}

interface ITwinePassage {
    pid: string,
    left: number,
    top: number,
    width: number,
    height: number,
    tags: string[],
    name: string,
    text: string,
}