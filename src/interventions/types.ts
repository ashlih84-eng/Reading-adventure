export type InterventionReason='vowel-patterns'|'blends-digraphs'|'context-clues'|'sequencing'|'main-idea'|'unclear-words'|'decoding-vs-comprehension'|'comprehension-vs-fluency';
export type InterventionSupport='shorter-passage'|'listen-then-read'|'vocabulary-preview'|'word-pattern-mini-lesson'|'parallel-passage'|'retelling'|'parent-review'|'reassessment';
export interface SkillEvidence{skill:string;score:number;occurredAt:string;sourceId:string}
export interface InterventionRecord{id:string;reason:InterventionReason;support:InterventionSupport;createdAt:string;evidenceCount:number;completedAt?:string}
export interface InterventionTemplate{id:string;title:string;reason:InterventionReason;support:InterventionSupport;childMessage:string;passage:string}
