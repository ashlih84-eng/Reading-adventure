import type{DialogueSituation,NpcDialogue}from'../types';
const lines:Record<DialogueSituation,string>={
 'first-meeting':'Hello, {{firstName}}! I’m glad we get to read together.',
 'returning-player':'Welcome back, {{firstName}}. I remember the clue you worked on with me.',
 'mission-introduction':'A story problem needs our help. I’ll stay nearby while you read.',
 'asks-for-help':'Good idea asking for help. We can look for one useful clue together.',
 'correct-action':'You used the words to change the world. I noticed how carefully you looked.',
 'gentle-retry':'Let’s slow down and look at the clue again. Nothing is lost.',
 'skill-improvement':'That skill is getting steadier. You used less help this time.',
 'region-restoration':'Look at the meadow, {{firstName}}. Your reading brought it back.',
 'friendship-increase':'We know each other better now. I saved a new story for us.',
 'gift-unlocked':'I made a small friendship gift for your adventure pouch.',
 'returning-after-days':'It is good to see you whenever you are ready. Our story can continue.',
 'selected-companion':'Your companion looks ready to help us search for clues.',
 'difficult-word':'I remember that tricky word. Let’s try its sounds one part at a time.'
};
export const DIALOGUE:NpcDialogue[]=Object.entries(lines).flatMap(([situation,text])=>['chef-cinnamon','hazel','poppy','finn','grandma-buttercup','baker-ben','mayor-maple'].map(npcId=>({id:`${npcId}-${situation}`,npcId,situation:situation as DialogueSituation,text})));
export function dialogueFor(npcId:string,situation:DialogueSituation,firstName:string){const line=DIALOGUE.find(x=>x.npcId===npcId&&x.situation===situation)??DIALOGUE.find(x=>x.npcId==='chef-cinnamon'&&x.situation===situation)!;return line.text.replaceAll('{{firstName}}',firstName)}
