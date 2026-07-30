
const app = document.getElementById("app");
const sparkles = document.getElementById("sparkles");

const LESSON = {
  title:"The Royal Recipe",
  words:["mysterious","ingredient","disguised","prevent"],
  story:`Cookie Kingdom was preparing for the Royal Friendship Feast when a mysterious baker arrived at the castle. She called herself Lady Licorice and carried a silver recipe book. She promised the king that one bite of her enchanted cookies would make the whole kingdom adore her.

Two young siblings, Mira and Milo, noticed something strange. The baker never tasted her own cookies. They followed her into the pantry and discovered a bottle labeled “Admiration Potion.” Mira and Milo knew they had to prevent Lady Licorice from taking over the kingdom. They hurried to find Chef Cinnamon before the feast began.`,
  questions:[
    {q:"Why were Mira and Milo suspicious of Lady Licorice?",a:["She never tasted her own cookies","She wore a silver crown","She arrived before lunch"],c:0,ingredient:"🥚"},
    {q:"What did the siblings discover in the pantry?",a:["A bottle of Admiration Potion","A sleeping dragon","A hidden treasure map"],c:0,ingredient:"🧈"},
    {q:"What does prevent mean in the story?",a:["Stop something from happening","Celebrate something loudly","Forget what happened"],c:0,ingredient:"🍯"},
    {q:"Why did they hurry to find Chef Cinnamon?",a:["They wanted help before the feast","They needed a new oven","They wanted to leave the kingdom"],c:0,ingredient:"🍫"}
  ]
};

const SHOP = [
  {id:"pony",name:"Pony Friend",emoji:"🐴",cost:150},
  {id:"fox",name:"Forest Fox",emoji:"🦊",cost:125},
  {id:"owl",name:"Snowy Owl",emoji:"🦉",cost:175},
  {id:"dragon",name:"Baby Dragon",emoji:"🐉",cost:500},
  {id:"crown",name:"Golden Crown",emoji:"👑",cost:1000},
  {id:"treehouse",name:"Cookie Treehouse",emoji:"🏡",cost:750}
];

let state = JSON.parse(localStorage.getItem("bra-v02") || "null") || {
  stars:150,
  completed:0,
  streak:1,
  sound:true,
  owned:[],
  lessonScore:0
};

function save(){ localStorage.setItem("bra-v02",JSON.stringify(state)); }

function tone(type="tap"){
  if(!state.sound) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if(!AudioCtx) return;
  const ctx = new AudioCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  const map={tap:[440,.08],correct:[740,.16],wrong:[190,.18],reward:[880,.28],buy:[620,.22],magic:[520,.4]};
  const [f,d]=map[type]||map.tap;
  o.frequency.setValueAtTime(f,ctx.currentTime);
  if(type==="correct") o.frequency.exponentialRampToValueAtTime(1100,ctx.currentTime+d);
  if(type==="reward") o.frequency.exponentialRampToValueAtTime(1320,ctx.currentTime+d);
  g.gain.setValueAtTime(.13,ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d);
  o.start(); o.stop(ctx.currentTime+d);
}

function burst(x=innerWidth/2,y=innerHeight/2,count=18){
  const icons=["⭐","✨","🍪"];
  for(let i=0;i<count;i++){
    const s=document.createElement("div");
    s.className="spark";
    s.textContent=icons[i%icons.length];
    s.style.left=x+"px";
    s.style.top=y+"px";
    s.style.setProperty("--x",(Math.random()*260-130)+"px");
    s.style.setProperty("--y",(Math.random()*-230+40)+"px");
    sparkles.appendChild(s);
    setTimeout(()=>s.remove(),1200);
  }
}

function shell(content,active="home"){
  app.innerHTML=`<div class="app">
    <div class="topbar">
      <div class="brand">📚 Brynlei's Reading Adventure</div>
      <div class="top-actions">
        <button class="icon-btn" id="soundBtn">${state.sound?"🔊":"🔇"}</button>
        <div class="pill">⭐ ${state.stars}</div>
      </div>
    </div>
    ${content}
    <nav class="nav">
      <button data-go="home" class="${active==="home"?"active":""}">🏠<br>Home</button>
      <button data-go="kingdom" class="${active==="kingdom"?"active":""}">🍪<br>Kingdom</button>
      <button data-go="shop" class="${active==="shop"?"active":""}">🛍️<br>Shop</button>
      <button data-go="collection" class="${active==="collection"?"active":""}">🎒<br>Pets</button>
    </nav>
  </div>`;
  document.querySelectorAll("[data-go]").forEach(b=>{
    b.onclick=()=>{tone("tap");route(b.dataset.go);};
  });
  document.getElementById("soundBtn").onclick=()=>{
    state.sound=!state.sound;
    save();
    route(active);
  };
}

function home(){
  shell(`<section class="card hero">
    <p class="muted">Welcome back, Brynlei!</p>
    <h1>Cookie Kingdom needs you.</h1>
    <p>Lady Licorice has hidden a potion inside her enchanted cookies. Read the clues, collect ingredients, and help save the Royal Friendship Feast.</p>
    <button class="primary" id="enter">Enter Cookie Kingdom</button>
  </section>
  <section class="stats">
    <div class="stat"><strong>${state.stars}</strong>stars</div>
    <div class="stat"><strong>${state.completed}</strong>quests</div>
    <div class="stat"><strong>${state.owned.length}</strong>pets & prizes</div>
  </section>
  <section class="card">
    <h2>Your Cookie Kingdom progress</h2>
    <div class="progress"><div style="width:${Math.min(100,state.completed*25)}%"></div></div>
    <p class="muted small">${state.completed?"The Royal Bakery is getting safer!":"Your first mission is ready."}</p>
  </section>`);
  document.getElementById("enter").onclick=()=>{tone("magic");kingdom();};
}

function kingdom(){
  shell(`<section class="cookie-world">
    <div class="world-title">🍪 Cookie Kingdom</div>
    <div class="cloud c1">☁️</div>
    <div class="cloud c2">☁️</div>
    <div class="cookie-bird">🕊️</div>
    <div class="tree t1">🍭</div>
    <div class="tree t2">🍬</div>
    <div class="castle">🏰</div>
    <div class="guide">👩‍🍳</div>
    <div class="river"></div>
    <div class="speech">Chef Cinnamon: “Brynlei! Lady Licorice is headed toward the feast. We need your reading powers!”</div>
  </section>
  <section class="card">
    <h2>The Royal Recipe</h2>
    <p>Complete the story quest to earn ingredients, bake the Truth Cookies, and open a treasure chest.</p>
    <button class="primary" id="quest">Start the quest</button>
  </section>`,"kingdom");
  document.getElementById("quest").onclick=()=>{tone("tap");introScene();};
}

function introScene(){
  shell(`<section class="card character-scene">
    <div class="character villain">🧙‍♀️</div>
    <h2>Lady Licorice appears!</h2>
    <p>“One bite of my special cookies, and everyone in the kingdom will adore me!”</p>
    <div class="smoke">💨</div>
    <button class="primary" id="continue">Follow the clues</button>
  </section>`,"kingdom");
  tone("magic");
  document.getElementById("continue").onclick=vocab;
}

function vocab(){
  shell(`<section class="card">
    <h1>Magic word warm-up</h1>
    <p>Tap each word to hear it. Then say it aloud.</p>
    <div>${LESSON.words.map(w=>`<button class="word" data-word="${w}">${w}</button>`).join("")}</div>
    <button class="primary" id="read">Read the story</button>
  </section>`,"kingdom");
  document.querySelectorAll("[data-word]").forEach(b=>{
    b.onclick=()=>{
      tone("tap");
      if("speechSynthesis" in window){
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(b.dataset.word));
      }
    };
  });
  document.getElementById("read").onclick=story;
}

function story(){
  shell(`<section class="card">
    <h1>${LESSON.title}</h1>
    <article class="card story">${LESSON.story}</article>
    <div class="row">
      <button class="secondary" id="listen">🔊 Listen</button>
      <button class="primary" id="questions">Find ingredients</button>
    </div>
  </section>`,"kingdom");
  document.getElementById("listen").onclick=()=>{
    tone("tap");
    if("speechSynthesis" in window){
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(LESSON.story));
    }
  };
  document.getElementById("questions").onclick=()=>question(0,0,[]);
}

function ingredientsMarkup(earned=[]){
  return LESSON.questions.map(q=>`<div class="ingredient ${earned.includes(q.ingredient)?"earned":""}">${q.ingredient}</div>`).join("");
}

function question(i,score,earned){
  const q=LESSON.questions[i];
  shell(`<section class="card">
    <p class="muted">Ingredient clue ${i+1} of ${LESSON.questions.length}</p>
    <div class="ingredient-board">${ingredientsMarkup(earned)}</div>
    <h1>${q.q}</h1>
    ${q.a.map((a,j)=>`<button class="answer" data-choice="${j}">${a}</button>`).join("")}
    <p id="feedback" class="muted"></p>
  </section>`,"kingdom");
  document.querySelectorAll("[data-choice]").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("[data-choice]").forEach(x=>x.disabled=true);
      const ok=Number(b.dataset.choice)===q.c;
      if(ok){
        b.classList.add("correct");
        tone("correct");
        burst(innerWidth/2,220,10);
        earned=[...earned,q.ingredient];
        score++;
        document.getElementById("feedback").textContent=`You found ${q.ingredient}!`;
      }else{
        b.classList.add("wrong");
        tone("wrong");
        document.querySelector(`[data-choice="${q.c}"]`).classList.add("correct");
        document.getElementById("feedback").textContent="Good try. The correct clue is highlighted.";
      }
      setTimeout(()=>i+1<LESSON.questions.length?question(i+1,score,earned):mixing(score,earned),1000);
    };
  });
}

function mixing(score,earned){
  shell(`<section class="card">
    <h1>Mix the Truth Cookies!</h1>
    <div class="ingredient-board">${ingredientsMarkup(earned)}</div>
    <div class="bowl-stage" id="stage">
      <div class="spoon" id="spoon">🥄</div>
      <div class="bowl">🥣</div>
    </div>
    <button class="primary" id="mix">Add ingredients and mix</button>
  </section>`,"kingdom");
  document.getElementById("mix").onclick=()=>{
    tone("magic");
    const stage=document.getElementById("stage");
    earned.forEach((e,n)=>setTimeout(()=>{
      const d=document.createElement("div");
      d.className="falling";
      d.textContent=e;
      d.style.left=(30+n*14)+"%";
      stage.appendChild(d);
    },n*260));
    setTimeout(()=>document.getElementById("spoon").classList.add("mix"),earned.length*260+300);
    setTimeout(()=>bake(score),earned.length*260+3900);
  };
}

function bake(score){
  shell(`<section class="card">
    <h1>The cookies are baking...</h1>
    <div class="oven">🔥🧱🔥</div>
    <p style="text-align:center;font-weight:900">The Truth Cookies are rising!</p>
  </section>`,"kingdom");
  tone("magic");
  setTimeout(()=>finish(score),2200);
}

function finish(score){
  const reward=50+score*25;
  state.stars+=reward;
  state.completed++;
  state.lessonScore=score;
  save();
  shell(`<section class="card">
    <h1>The kingdom is saved! 🎉</h1>
    <div class="tray">🍪🍪🍪</div>
    <p>Mira and Milo served the Truth Cookies. The king discovered Lady Licorice’s plan, and Chef Cinnamon locked the potion safely away.</p>
    <p><strong>You earned ${reward} stars!</strong></p>
    <div class="chest" id="chest">🎁</div>
    <p style="text-align:center" class="muted">Tap the treasure chest.</p>
  </section>`,"kingdom");
  burst(innerWidth/2,240,24);
  tone("reward");
  document.getElementById("chest").onclick=e=>{
    e.currentTarget.classList.add("open");
    tone("reward");
    burst(innerWidth/2,380,30);
    setTimeout(()=>treasure(reward),650);
  };
}

function treasure(reward){
  shell(`<section class="card reward-burst">
    <h1>Treasure unlocked!</h1>
    <div style="font-size:110px">🧁</div>
    <p><strong>Royal Baker Cupcake</strong></p>
    <p>You also earned ${reward} stars. Spend them in the Star Shop or save for a Baby Dragon.</p>
    <button class="shop-btn" id="goShop">Visit the Star Shop</button>
  </section>`,"kingdom");
  document.getElementById("goShop").onclick=shop;
}

function shop(){
  shell(`<section class="card">
    <h1>Star Shop</h1>
    <p>You have <strong>${state.stars} stars</strong>. Buy a friend or save for something bigger.</p>
  </section>
  <section class="shop-grid">
    ${SHOP.map(item=>{
      const owned=state.owned.includes(item.id);
      return `<div class="shop-item ${owned?"owned":""}">
        <div class="emoji">${item.emoji}</div>
        <strong>${item.name}</strong>
        <p>${owned?"Owned":item.cost+" ⭐"}</p>
        <button data-buy="${item.id}" ${owned?"disabled":""}>${owned?"In collection":"Buy"}</button>
      </div>`;
    }).join("")}
  </section>`,"shop");

  document.querySelectorAll("[data-buy]").forEach(b=>{
    b.onclick=()=>{
      const item=SHOP.find(x=>x.id===b.dataset.buy);
      if(state.stars<item.cost){
        tone("wrong");
        alert(`You need ${item.cost-state.stars} more stars.`);
        return;
      }
      state.stars-=item.cost;
      state.owned.push(item.id);
      save();
      tone("buy");
      burst(innerWidth/2,300,24);
      setTimeout(shop,500);
    };
  });
}

function collection(){
  const pets=SHOP.filter(x=>state.owned.includes(x.id));
  shell(`<section class="card">
    <h1>My Collection</h1>
    <p class="muted">Everything Brynlei buys appears here.</p>
    <div class="collection">
      ${pets.length
        ? pets.map(p=>`<div class="pet-card"><div class="emoji">${p.emoji}</div><strong>${p.name}</strong></div>`).join("")
        : "<p>No rewards yet. Visit the Star Shop!</p>"}
    </div>
  </section>`,"collection");
}

function route(name){
  const routes={home,kingdom,shop,collection};
  (routes[name]||home)();
}

window.addEventListener("load",()=>{
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").catch(()=>{});
  }
  home();
});
