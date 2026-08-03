export type ReadingBand='foundations'|'early-reader'|'developing-reader'|'fluent-reader';
export type PlacementSkill='letter-sound'|'word-recognition'|'decoding'|'vocabulary'|'oral-reading'|'comprehension'|'stamina';
export interface PlacementResponse{stepId:string;skill:PlacementSkill;difficulty:number;correct:boolean;supported:boolean}
export interface PlacementResult{completedAt:string;gradeHint:string;startingDifficulty:number;endingDifficulty:number;instructionalBand:ReadingBand;recommendedRegion:number;responses:PlacementResponse[];skillEstimates:Partial<Record<PlacementSkill,number>>;usedSpeechFallback:boolean;stoppedForFrustration:boolean;disclaimer:string}
export interface PlacementState{gradeHint:string;difficulty:number;responses:PlacementResponse[];lowStreak:number;done:boolean;stoppedForFrustration:boolean}
