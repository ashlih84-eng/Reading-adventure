import type{PlacementSkill}from'../types';
export interface PlacementStep{id:string;difficulty:number;skill:PlacementSkill;mission:string;prompt:string;options:string[];answer:number;supported?:boolean}
export const PLACEMENT_STEPS:PlacementStep[]=[
 {id:'sounds-1',difficulty:1,skill:'letter-sound',mission:'Repair the first recipe page',prompt:'Which word begins with the /m/ sound?',options:['map','sun','leaf'],answer:0},
 {id:'words-1',difficulty:1,skill:'word-recognition',mission:'Find the familiar word',prompt:'Which word says “the”?',options:['then','the','they'],answer:1},
 {id:'decode-2',difficulty:2,skill:'decoding',mission:'Open the meadow gate',prompt:'Blend the sounds /s/ /t/ /e/ /p/. Which word do they make?',options:['stop','step','stamp'],answer:1},
 {id:'vocab-2',difficulty:2,skill:'vocabulary',mission:'Choose the right recipe note',prompt:'If a path is narrow, what is it like?',options:['Not very wide','Very noisy','Made of metal'],answer:0},
 {id:'oral-2',difficulty:2,skill:'oral-reading',mission:'Read the messenger’s clue',prompt:'Read: “The lantern glowed beside the quiet path.”',options:['I read it independently','I used listen-then-read','Use the no-microphone fallback'],answer:0,supported:true},
 {id:'comp-3',difficulty:3,skill:'comprehension',mission:'Solve the garden clue',prompt:'Kai covered the seedlings before the storm. Why?',options:['To protect them','To hide from a friend','To make them taller'],answer:0},
 {id:'vocab-4',difficulty:4,skill:'vocabulary',mission:'Decode the royal note',prompt:'A cautious explorer is someone who…',options:['acts with care','never asks questions','moves very loudly'],answer:0},
 {id:'comp-4',difficulty:4,skill:'comprehension',mission:'Connect two clues',prompt:'The bridge boards were slick, so Mina slowed down. What caused Mina to slow?',options:['The slick boards','The distant bell','The sunny weather'],answer:0},
 {id:'stamina-5',difficulty:5,skill:'stamina',mission:'Finish the final recipe page',prompt:'Read the short paragraph at a steady pace, then choose when you are ready.',options:['Ready without support','Ready after a short break','Use supported reading'],answer:0,supported:true},
];
