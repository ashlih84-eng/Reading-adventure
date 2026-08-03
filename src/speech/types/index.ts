export type WordStatus='match'|'omission'|'substitution'|'insertion'|'repetition';
export interface ComparedWord{expected?:string;heard?:string;status:WordStatus;confidence:number}
export interface ReadingComparison{words:ComparedWord[];matchedPercentage:number;possiblyUnclearWords:string[];omissions:number;substitutions:number;insertions:number;repetitions:number;durationSeconds:number;wordsPerMinute:number;confidence:number}
export interface SpeechSessionResult{transcript:string;durationSeconds:number;longPauses:number;supportedFallback:boolean}
export interface SpeechRecognitionService{readonly kind:'web-speech'|'fallback'|'remote';isAvailable():boolean;start():Promise<void>;stop():Promise<SpeechSessionResult>;cancel():void}
