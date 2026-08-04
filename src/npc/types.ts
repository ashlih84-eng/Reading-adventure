import type{ReadingSkill}from'../curriculum/types';
export type NpcRole='mentor'|'comprehension-helper'|'vocabulary-helper'|'sequencing-helper'|'fluency-helper'|'phonics-helper'|'evidence-helper'|'story-guide'|'shopkeeper'|'villager';
export type NpcAnimationState='idle'|'blink'|'talk'|'walk'|'wave'|'point'|'think'|'encourage'|'celebrate'|'work'|'sit'|'react';
export type DialogueSituation='first-meeting'|'returning-player'|'mission-introduction'|'asks-for-help'|'correct-action'|'gentle-retry'|'skill-improvement'|'region-restoration'|'friendship-increase'|'gift-unlocked'|'returning-after-days'|'selected-companion'|'difficult-word';
export interface NpcRoutineEntry{period:'morning'|'midday'|'afternoon'|'evening';startHour:number;endHour:number;location:string;activity:string;animation:NpcAnimationState}
export interface NpcHelpRule{skills:string[];hints:[string,string,string,string]}
export interface FriendshipReward{level:1|2|3|4|5;dialogueId?:string;giftId?:string;helperBonus?:string}
export interface NpcRelationship{npcId:string;playerId:string;friendshipLevel:number;friendshipPoints:number;missionsCompletedTogether:number;lastInteractionAt?:string;unlockedDialogueIds:string[];unlockedGiftIds:string[];recentSkill?:string;recentAccomplishment?:string;sideQuestsCompleted:string[]}
export interface NpcDefinition{id:string;firstName:string;displayName:string;role:NpcRole;regionId:number;personality:string[];skillSpecialties:Array<ReadingSkill|string>;dialogueSetIds:string[];animationStates:NpcAnimationState[];dailyRoutine:NpcRoutineEntry[];helpRules:NpcHelpRule[];friendshipRewards:FriendshipReward[];voice:{rate:number;pitch:number;cadence:'calm'|'bright'|'playful'|'gentle'|'steady'};colors:{skin:string;hair:string;outfit:string;accent:string}}
export interface NpcDialogue{id:string;npcId:string;situation:DialogueSituation;text:string}
export interface NpcHelpEvent{id:string;npcId:string;playerId:string;activityId:string;skill:string;hintLevel:number;requestedAt:string;succeededAfterward?:boolean;guided:boolean}
export interface NpcRoutineState{npcId:string;period:NpcRoutineEntry['period'];location:string;activity:string;animation:NpcAnimationState;offlineSafe:true}
