import{describe,expect,it}from'vitest';import{SPRINKLE_MISSIONS}from'./sprinkleMeadows';
const manipulation=new Set(['drag-order','sequencing','sentence-building','matching','scene-hotspots','recipe-drop','stirring','story-card-retell','sound-sort','map-repair','color-restoration','treasure-reward']);
const comprehension=new Set(['story-evidence','main-idea','path-choice','scene-hotspots','story-card-retell','sentence-building','matching','sound-sort']);
describe('Sprinkle Meadows interaction variety',()=>{
 it('gives every lesson reading, manipulation, comprehension, and visible change',()=>{for(const lesson of SPRINKLE_MISSIONS){expect(lesson.passage.length).toBeGreaterThan(40);expect(lesson.activities.some(a=>manipulation.has(a.type))).toBe(true);expect(lesson.activities.some(a=>comprehension.has(a.type))).toBe(true);expect(lesson.activities.every(a=>Boolean(a.worldChange)||a.type==='vocabulary')).toBe(true)}});
 it('keeps static multiple-choice below 25 percent',()=>{const all=SPRINKLE_MISSIONS.flatMap(x=>x.activities);const staticChoices=all.filter(x=>x.type==='main-idea'||x.type==='word-recognition');expect(staticChoices.length/all.length).toBeLessThanOrEqual(.25)});
 it('never repeats the same interaction sequence in consecutive lessons',()=>{const sequences=SPRINKLE_MISSIONS.map(x=>x.activities.map(a=>a.type).join('|'));for(let i=1;i<sequences.length;i++)expect(sequences[i]).not.toBe(sequences[i-1])});
 it('uses at least four interaction types in the villain and checkpoint',()=>{for(const id of['sprinkle-snatcher','meadow-checkpoint'])expect(new Set(SPRINKLE_MISSIONS.find(x=>x.id===id)!.activities.map(a=>a.type)).size).toBeGreaterThanOrEqual(4)});
});
