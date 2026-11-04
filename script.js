const games = {
  obby:{title:"Mega Obby",icon:"🏁",description:"Проверь ловкость в полосе препятствий. Прыгай по платформам и доберись до финиша.",action:"Начать испытание"},
  clicker:{title:"Космический кликер",icon:"⚡",description:"Нажимай на звезду, собирай энергию и улучшай свой космический рекорд.",action:"Собрать энергию"},
  island:{title:"Остров выживания",icon:"🏝️",description:"Исследуй остров, собирай ресурсы и построй своё первое убежище.",action:"Исследовать остров"},
  racing:{title:"Block Racing",icon:"🏎️",description:"Выбирай скорость и соревнуйся с таймером на блочной трассе.",action:"Старт гонки"},
  pets:{title:"Мир питомцев",icon:"🐾",description:"Открывай милых питомцев и собирай собственную коллекцию.",action:"Получить питомца"},
  city:{title:"Мой город",icon:"🏙️",description:"Построй маленький город: размещай дома, парки и украшения.",action:"Построить дом"},
  style:{title:"Студия стиля",icon:"👕",description:"Собери образ своего персонажа и выбери любимые цвета.",action:"Сменить стиль"}
};
let coins = Number(localStorage.getItem("bw-coins")) || 250;
let activeGame = null;
let score = 0;
const $ = id => document.getElementById(id);
const grid = $("gameGrid");
function updateCoins(){ $("coins").textContent=coins; localStorage.setItem("bw-coins",String(coins)); }
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2200);}
function openGame(key){
  const game=games[key];if(!game)return;activeGame=key;score=0;
  $("modalIcon").textContent=game.icon;$("modalTitle").textContent=game.title;$("modalDescription").textContent=game.description;
  $("gameArea").innerHTML='<div class="game-score">Твой результат: <b id="scoreValue">0</b></div><p id="gameHint">Нажми кнопку ниже, чтобы начать!</p>';
  $("startGame").textContent=game.action+" →";$("modalBackdrop").classList.remove("hidden");
}
function closeGame(){$("modalBackdrop").classList.add("hidden");activeGame=null;}
grid.addEventListener("click",e=>{const card=e.target.closest("[data-game]");if(card)openGame(card.dataset.game);});
$("closeModal").addEventListener("click",closeGame);
$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeGame();});
$("startGame").addEventListener("click",()=>{
  if(!activeGame)return;score++;$("scoreValue").textContent=score;
  const hints={
    obby:["Отличный прыжок! Продолжай!","Платформа пройдена!","Ты всё ближе к финишу!"],
    clicker:["+1 энергия!","Звезда заряжена!","Космос ждёт!"],
    island:["Ты нашёл полезный ресурс!","На острове безопасно.","Пора строить убежище!"],
    racing:["Хороший разгон!","Ты ускоряешься!","Новый круг!"],
    pets:["Питомец рад знакомству!","Коллекция растёт!","Какой милый!"],
    city:["Дом добавлен в город!","Город становится больше!","Отличная постройка!"],
    style:["Новый образ сохранён!","Стиль на высоте!","Попробуй другой цвет!"]
  };
  $("gameHint").textContent=hints[activeGame][(score-1)%3];
  if(score%5===0){coins+=10;updateCoins();toast("+10 ◆ за 5 действий!");}
});
$("search").addEventListener("input",e=>{
  const q=e.target.value.trim().toLocaleLowerCase("ru");let shown=0;
  grid.querySelectorAll(".game-card").forEach(card=>{const match=card.innerText.toLocaleLowerCase("ru").includes(q);card.hidden=!match;if(match)shown++;});
  $("gameCount").textContent=shown+" игр";
  $("sectionTitle").textContent=q?"Результаты поиска":"Популярные игры";
});
$("randomBtn").addEventListener("click",()=>{const keys=Object.keys(games);openGame(keys[Math.floor(Math.random()*keys.length)]);});
document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.remove("active"));btn.classList.add("active");
  const page=btn.dataset.page;
  if(page==="home"||page==="discover"){toast(page==="home"?"Главная страница":"Все доступные игры");return;}
  if(page==="shop"){coins+=0;toast("Магазин скоро откроется!");return;}
  const messages={avatar:"Настройка аватара скоро появится!",friends:"Это одиночная версия — друзья пока недоступны.",inventory:"Твой инвентарь пока пуст.",settings:"Настройки скоро появятся!"};
  toast(messages[page]||"Раздел скоро появится.");
}));
$("profileBtn").addEventListener("click",()=>toast("Привет! Добро пожаловать в BlockWorld."));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeGame();});
updateCoins();