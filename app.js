
const $ = (s) => document.querySelector(s);
const app = document.getElementById('app');
const lessons = [
  {
    level: 3,
    title: "The Lantern in the Garden",
    world: "Whispering Woods",
    emoji: "🌳",
    words: ["flickered","narrow","noticed","curious"],
    story: `Brynlei noticed a tiny light flickering near the garden fence. She followed the narrow path and found an old lantern beneath a rosebush. The lantern was dusty, but it still glowed. Curious, she lifted it carefully. A soft voice whispered, “Thank you for finding me.”`,
    questions: [
      {q:"Where did Brynlei find the lantern?", a:["Under a rosebush","Inside the house","Beside a river"], c:0},
      {q:"What does curious mean in this story?", a:["Wanting to know more","Feeling sleepy","Being angry"], c:0},
      {q:"Why did she lift the lantern carefully?", a:["It might be old or fragile","It was very loud","She wanted to throw it"], c:0}
    ]
  },
  {
    level: 3,
    title: "The Missing Recipe",
    world: "Cookie Kingdom",
    emoji: "🧁",
    words: ["recipe","searched","ingredient","relieved"],
    story: `The royal baker could not find the recipe for the queen’s favorite honey cookies. Everyone searched the kitchen. Brynlei looked beneath the flour bin and spotted a folded card. The missing ingredient was cinnamon. The baker felt relieved and began mixing the dough.`,
    questions: [
      {q:"What was missing?", a:["A recipe","A spoon","A crown"], c:0},
      {q:"Where was the card?", a:["Beneath the flour bin","In the oven","Outside the castle"], c:0},
      {q:"What does relieved mean?", a:["No longer worried","Very confused","Ready to sleep"], c:0}
    ]
  },
  {
    level: 4,
    title: "Message from Mars",
    world: "Space Station",
    emoji: "🚀",
    words: ["signal","translated","distant","discovery"],
    story: `A strange signal reached the space station just before midnight. The crew translated the repeating pattern and discovered it was a map. It pointed toward a distant valley on Mars. The discovery could change everything scientists understood about the planet.`,
    questions: [
      {q:"What did the signal contain?", a:["A map","A song","A weather report"], c:0},
      {q:"What can you infer about the crew?", a:["They were excited by the discovery","They ignored the signal","They were baking"], c:0},
      {q:"What does distant mean?", a:["Far away","Very noisy","Easy to reach"], c:0}
    ]
  }
];

let state = JSON.parse(localStorage.getItem("bra-state") || "null") || {
  name:"Brynlei", xp:0, streak:1, level:3, completed:0, placementDone:false,
  scores:[], weakWords:[], parentPin:"2468", lastDate:null
};
function save(){ localStorage.setItem("bra-state", JSON.stringify(state)); }
function shell(content, active="home"){
  app.innerHTML = `<div class="app">
    <div class="topbar"><div class="brand">📚 Brynlei's Reading Adventure</div><div class="pill">⭐ ${state.xp} XP</div></div>
    ${content}
    <div class="nav">
      <button data-go="home" class="${active==="home"?"active":""}">🏠<br>Home</button>
      <button data-go="map" class="${active==="map"?"active":""}">🗺️<br>Map</button>
      <button data-go="parent" class="${active==="parent"?"active":""}">🔒<br>Parent</button>
    </div>
  </div>`;
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>route(b.dataset.go));
}
function home(){
  const pct = Math.min(100, state.completed/8*100);
  shell(`<section class="card hero">
    <p class="muted">Good morning, ${state.name}!</p>
    <h1>Ready for today’s reading adventure?</h1>
    <p>Read, think, and collect stars. Mistakes help your brain grow.</p>
    <button class="primary" id="start">${state.placementDone ? "Continue Today’s Adventure" : "Start My Reading Check"}</button>
  </section>
  <section class="stats">
    <div class="stat"><strong>${state.streak}</strong>day streak</div>
    <div class="stat"><strong>Level ${state.level}</strong>reader path</div>
    <div class="stat"><strong>${state.completed}</strong>lessons done</div>
  </section>
  <section class="card"><h2>Your next goal</h2><div class="progress"><div style="width:${pct}%"></div></div>
  <p class="muted small">${Math.max(0,8-state.completed)} lessons until your next adventure badge.</p></section>`);
  $("#start").onclick = ()=> state.placementDone ? startLesson() : placement();
}
function placement(){
  shell(`<section class="card"><h1>Quick reading check</h1>
  <p>This is not a test. It helps the app choose stories that feel challenging—but not frustrating.</p>
  <div class="notice">Read this sentence aloud, then choose the best meaning.</div>
  <section class="card story">The puppy hesitated at the edge of the puddle before carefully stepping around it.</section>
  <h2>What does <em>hesitated</em> mean?</h2>
  <button class="answer" data-a="0">Paused because it was unsure</button>
  <button class="answer" data-a="1">Ran as fast as possible</button>
  <button class="answer" data-a="2">Barked at the puddle</button></section>`);
  document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{
    const correct = b.dataset.a==="0";
    state.level = correct ? 3 : 2;
    state.placementDone = true;
    state.xp += correct ? 20 : 10;
    save();
    b.classList.add(correct?"correct":"wrong");
    setTimeout(home,700);
  });
}
function startLesson(){
  const lesson = lessons[Math.min(state.completed, lessons.length-1)];
  vocabulary(lesson);
}
function vocabulary(lesson){
  shell(`<section class="card"><p class="muted">${lesson.emoji} ${lesson.world}</p><h1>${lesson.title}</h1>
  <h2>Word warm-up</h2><p>Tap each word and say it aloud.</p>
  <div>${lesson.words.map(w=>`<button class="word" data-word="${w}">${w}</button>`).join("")}</div>
  <p class="muted small">Try using one word in your own sentence.</p>
  <button class="primary" id="read">Read the story</button></section>`);
  document.querySelectorAll("[data-word]").forEach(b=>b.onclick=()=>{
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(b.dataset.word));
  });
  $("#read").onclick=()=>story(lesson);
}
function story(lesson){
  shell(`<section class="card"><p class="muted">${lesson.emoji} ${lesson.world}</p><h1>${lesson.title}</h1>
  <article class="card story">${lesson.story}</article>
  <div class="row"><button class="secondary" id="listen">🔊 Listen</button><button class="primary" id="questions">Answer questions</button></div></section>`);
  $("#listen").onclick=()=>{speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(lesson.story));};
  $("#questions").onclick=()=>question(lesson,0,0);
}
function question(lesson, index, score){
  const item=lesson.questions[index];
  shell(`<section class="card"><p class="muted">Question ${index+1} of ${lesson.questions.length}</p>
  <h1>${item.q}</h1>
  ${item.a.map((a,i)=>`<button class="answer" data-choice="${i}">${a}</button>`).join("")}
  <p id="feedback" class="muted"></p></section>`);
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{
    document.querySelectorAll("[data-choice]").forEach(x=>x.disabled=true);
    const ok=Number(b.dataset.choice)===item.c;
    b.classList.add(ok?"correct":"wrong");
    $("#feedback").textContent=ok ? "Yes! You used the story clues." : "Not quite. Look back at the sentence and try to find the clue.";
    if(!ok) document.querySelector(`[data-choice="${item.c}"]`).classList.add("correct");
    setTimeout(()=> index+1<lesson.questions.length ? question(lesson,index+1,score+(ok?1:0)) : finish(lesson,score+(ok?1:0)),1100);
  });
}
function finish(lesson, score){
  const pct=Math.round(score/lesson.questions.length*100);
  state.completed++;
  state.xp += score*25 + 25;
  state.scores.push({date:new Date().toISOString(), title:lesson.title, score:pct});
  if(pct>=80 && state.completed%2===0) state.level=Math.min(6,state.level+1);
  save();
  shell(`<section class="card hero"><h1>Adventure complete! 🎉</h1>
  <p>You scored <strong>${pct}%</strong> and earned <strong>${score*25+25} XP</strong>.</p>
  <p>${pct>=80?"Strong reading! The next story may be a little more challenging.":"Good work. We’ll practice these skills again so they become easier."}</p>
  <button class="primary" id="done">Back home</button></section>`);
  $("#done").onclick=home;
}
function map(){
  shell(`<section class="card"><h1>Adventure Map</h1><p class="muted">New worlds unlock as Brynlei completes lessons.</p></section>
  <div class="map">
  ${lessons.map((l,i)=>`<div class="world"><div class="emoji">${l.emoji}</div><div><strong>${l.world}</strong><br><span class="muted">${i<state.completed?"Completed":i===state.completed?"Next adventure":"Locked"}</span></div></div>`).join("")}
  </div>`, "map");
}
function parent(){
  shell(`<section class="card"><h1>Parent dashboard</h1><p>Enter the four-digit parent PIN.</p>
  <div class="pin"><input id="pin" inputmode="numeric" maxlength="4" type="password"></div>
  <button class="primary" id="unlock">Unlock</button>
  <p class="muted small">Starter PIN: 2468</p></section>`,"parent");
  $("#unlock").onclick=()=> $("#pin").value===state.parentPin ? dashboard() : alert("That PIN did not match.");
}
function dashboard(){
  const avg=state.scores.length?Math.round(state.scores.reduce((a,b)=>a+b.score,0)/state.scores.length):0;
  shell(`<section class="card"><h1>Parent dashboard</h1>
  <div class="stats"><div class="stat"><strong>${state.level}</strong>current path</div><div class="stat"><strong>${avg}%</strong>comprehension</div><div class="stat"><strong>${state.xp}</strong>total XP</div></div></section>
  <section class="card"><h2>Recent lessons</h2>${state.scores.length?state.scores.slice(-5).reverse().map(s=>`<p><strong>${s.title}</strong><br><span class="muted">${s.score}% comprehension</span></p>`).join(""):"<p class='muted'>No completed lessons yet.</p>"}</section>
  <section class="card"><h2>Controls</h2><button class="ghost" id="reset">Reset progress</button></section>`,"parent");
  $("#reset").onclick=()=>{if(confirm("Reset all reading progress?")){localStorage.removeItem("bra-state");location.reload();}};
}
function route(r){({home,map,parent}[r]||home)();}
window.addEventListener("load",()=>{
  if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
  home();
});
