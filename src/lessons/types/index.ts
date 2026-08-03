export type ActivityType='read-aloud'|'word-recognition'|'sequencing'|'main-idea'|'retelling'|'vocabulary'|'sentence-building'|'story-evidence'|'short-response'|'drag-order'|'matching'|'syllable-breakdown'|'morphology'|'listen-then-read';
export interface VocabularyCard{word:string;pronunciation:string;syllables:string[];definition:string;example:string;visualCue?:string}
export interface LessonActivity{id:string;type:ActivityType;prompt:string;options?:string[];answer?:number;acceptedText?:string[];correctOrder?:string[];pairs?:Array<[string,string]>;vocabulary?:VocabularyCard}
export interface ActivityScore{activityId:string;score:number;correct:boolean;response:unknown;skillEvidence:string[]}
export type MissionKind='lesson'|'review'|'villain'|'checkpoint';
export interface Lesson{id:string;regionId:number;kind:MissionKind;title:string;mission:string;passage:string;activities:LessonActivity[];rewardStars:number;skills:string[]}
export interface LessonAttempt{lessonId:string;score:number;passed:boolean;completedAt:string;skills:string[]}
export interface MasteryRecord{attempts:LessonAttempt[];rewardedLessonIds:string[];masteredSkills:string[];checkpointPassed:boolean;villainDefeated:boolean}
