const game = document.getElementById('jogo');

const GameWidth = 4;
const GameHeight = 5;

let last = {
  result: null,
  div: null
};

let delay = false;
let difficulty = 1; //0 = easy 1 = normal 2 = hard
let difficultyHasChange = false;
let offset = 0;

const colors = [
  "#00b8a9",
  "#f8f3d4",
  "#f6416c",
  "#ffde7d",
]
const list = document.getElementById("players-list");
const cards = [
  {
    difficulty: 0,
    cards: [
      { result: 2, texts: ['1 + 1', '4 / 2'] },
      { result: 6, texts: ['3 + 3', '4 + 2'] },
      { result: 5, texts: ['10 / 2', '2 + 3'] },
      { result: 8, texts: ['6 + 2', '11 - 3'] },
      { result: 10, texts: ['5 + 5', '5 * 2'] },
      { result: 10, texts: ['20 - 10', '30 - 20'] },
      { result: 11, texts: ['5 + 6', '22 - 11'] },
      { result: 1, texts: ['2 - 1', '1 * 1'] },
      { result: 20, texts: ['10 * 2', '10 + 10'] },
      { result: 30, texts: ['50 - 20', '20 + 10'] },
    ]
  },
  {
    difficulty: 1,
    cards: [
      { result: 9, texts: ['6 + 3', '3²', '3 * 3', '3²'] },
      { result: 5, texts: ['√25', '2 + 3'] },
      { result: 14, texts: ['7 * 2', '9 + 5'] },
      { result: 25, texts: ['5 * 5', '30 - 5'] },
      { result: 11, texts: ['44 - 33', '5 + 6'] },
      { result: 4, texts: ['8 ÷ 2', '2 * 2'] },
      { result: 1, texts: ['√1', '1 * 1'] },
      { result: 16, texts: ['4²', '8 + 8'] },
      { result: 30, texts: ['5 * 6', '15 + 15'] },
    ]
  },
  {
    difficulty: 2,
    cards: [
      { result: 5, texts: ['x2 = 10', '√25'] },
      { result: 64, texts: ['8²', 'x4² = 4'] },
      { result: 100, texts: ['10²', '√10000'] },
      { result: 14, texts: ['7 * 2', '9 + 5'] },
      { result: 25, texts: ['5 * 5', '30 - 5'] },
      { result: 11, texts: ['44 - 33', '5 + 6'] },
      { result: 4, texts: ['8 ÷ 2', '2 * 2'] },
      { result: 1, texts: ['√1', '1 x 1'] },
      { result: 16, texts: ['4²', '8 + 8'] },
      { result: 30, texts: ['5 * 6', '15 + 15'] },
    ]
  }
]
const APIUrl = "https://jogo-da-memoria-api.herokuapp.com/api";

game.style.gridTemplateColumns = new Array(GameWidth).fill('1fr').join(' ');
// POR FAVOR ANÔNIMO, NÃO QUEBRE O CÓDIGO
// Ass: Moises
const errorCounterDiv = document.getElementById('error');
const alertsDiv = document.querySelector('.alerts');
const errosTotalDiv = document.getElementById('errorsTotal');
const difficultyRange = document.getElementById('difficulty-range');
const difficultyLabel = document.getElementById('difficulty');

function init() {
  for (const card of cards.find(e => e.difficulty == difficulty).cards) {
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (const text of card.texts) {
      let flipCard = document.createElement('div');
      let flipCardFront = document.createElement('div');
      let flipCardBack = document.createElement('div');

      flipCard.className = "card"
      flipCard.addEventListener("click", () => {
        if (delay) return;
        if (flipCard.classList.contains("rotate") || flipCard.classList.contains("correct")) return;

        flipCard.classList.toggle("rotate")

        if (last.result === null) {
          last.result = card.result;
          last.div = flipCard;
          return;
        } else if (last.result === card.result) {
          flipCard.classList.add('correct');
          last.div.classList.add('correct');

          const allCardsLength = document.querySelectorAll('.card').length;
          if (document.querySelectorAll('.correct').length === allCardsLength) {
            setTimeout(() => {
              errosTotalDiv.innerText = errorCounterDiv.innerText
              alertsDiv.classList.add('show', 'winner');
            }, 1000);
            return;
          }
        } else {
          let errorCounter = Number.parseInt(errorCounterDiv.innerText);
          errorCounterDiv.innerText = errorCounter + 1;
          delay = true;
          setTimeout(() => {
            delay = false;
            desviraVirados();
          }, 1000);
        }
        last = { div: null, result: null };
      })

      flipCardBack.innerText = "?";

      flipCardFront.className = "flip-card flip-card-front"
      flipCardBack.className = "flip-card flip-card-back"

      flipCardFront.style.backgroundColor = color;

      flipCardFront.innerText = text;
      flipCard.style.order = Math.floor(Math.random() * (GameWidth * GameHeight));

      flipCard.appendChild(flipCardFront);
      flipCard.appendChild(flipCardBack);
      game.appendChild(flipCard)
    }
  }
}

addPlayersList();

async function reloadPlayerList() {
  const itens = await fetch(`${APIUrl}/get?offset=${0}&size=${offset * 4}`).then(e => e.json());

  document.getElementById("players-list").innerHTML = `<button id="load-more">Load More</button>`;
  for (const item of itens) {
    addBlockList(item.name, item.erros, item.dificulty);
  }
}

async function addPlayersList() {
  const itens = await fetch(`${APIUrl}/get?offset=${offset}&size=4`).then(e => e.json());
  for (const item of itens) {
    addBlockList(item.name, item.erros, item.dificulty);
    offset += 1;
  }
}

function desviraVirados() {
  let virados = document.querySelectorAll('.rotate')
  virados.forEach(e => {
    if (e.classList.contains('correct')) return;

    e.classList.remove('rotate');
  })
}

init();

function showDifficult() {
  const labels = [
    'Fácil',
    'Normal',
    'Difícil',
  ];

  difficulty = difficultyRange.value;
  difficultyLabel.innerText = labels[difficulty];
}

difficultyRange.value = difficulty;
showDifficult();

difficultyRange.addEventListener('input', () => {
  difficultyHasChange = true;
  showDifficult()
});

function ResetGame() {
  game.innerHTML = "";
  last = { div: null, result: null };
  errorCounterDiv.innerText = "0";
  init();
}

document.getElementById('load-more').addEventListener('click', () => {
  addPlayersList();
});

document.getElementById('menu-button').addEventListener('click', () => {
  alertsDiv.classList.add('show', 'menu');
});

document.getElementById('restart-winner').addEventListener('click', () => {
  alertsDiv.classList.remove('show', 'winner');
  ResetGame();
});

document.getElementById('restart-menu').addEventListener('click', () => {
  alertsDiv.classList.remove('show', 'menu');
  ResetGame();
});

document.getElementById('list-button').addEventListener('click', () => {
  alertsDiv.classList.add('show', 'list');
});

document.getElementById('back-list').addEventListener('click', () => {
  alertsDiv.classList.remove('show', 'list');
});

function getCookies() {
  return document.cookie.split(';').map(e => {
    const values = e.split('=');
    return { name: values[0], value: values[1] };
  });
}

/**@param {{name: string, value: string}} cookie */
function addCookie(cookie) {
  document.cookie = [cookie.name, cookie.value].join('=');
}

function findCookie(name) {
  for (const value of getCookies()) {
    if (value.name.trim() == name) return value;
  }

  return undefined;
}

document.getElementById('add-rank').addEventListener('click', async () => {
  const cookie = findCookie('jdm-name');
  
  let value = cookie?.value;
  
  if (!value) value = prompt("Digite seu nome");

  if (!cookie) {
    addCookie({ name: "jdm-name", value });
  }

  const data = {
    name: value,
    erros: errorCounterDiv.innerText,
    dificulty: Number(difficulty) + 1
  };
  
  const PostJsonRequestOptions = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: "POST",
  }
  
  await fetch(`${APIUrl}/add`, {
    ...PostJsonRequestOptions,
    body: JSON.stringify(data),
  }).then(async e => {
    if (e.status !== 200) {
      const text = await e.text()
      if (text === "User Allayers exist!") {
        await fetch(`${APIUrl}/modify:${value}`, {
          ...PostJsonRequestOptions,
          body: JSON.stringify(data)
        });
        
        alertsDiv.classList.remove('show', 'winner');
        ResetGame();
        return;
      }
      
      document.getElementById("winner-error-message").innerText = text;
    } else {
      alertsDiv.classList.remove('show', 'winner');
      ResetGame();
    }
  });

  await reloadPlayerList();
});

document.getElementById('playagin-menu').addEventListener('click', () => {
  if (difficultyHasChange) {
    ResetGame();
  }

  difficultyHasChange = false;
  alertsDiv.classList.remove('show', 'menu');
});

function addBlockList(name, erros, difficultyLvl) {
  const div = document.createElement('div');
  div.className = "block";

  let difficultyName = "Fácil";
  let difficultyClass = "easy";

  switch (difficultyLvl) {
    case 2:
      difficultyName = "Médio";
      difficultyClass = "medium";
      break;

    case 3:
      difficultyName = "Difícil";
      difficultyClass = "hard";
      break;
  }

  div.innerHTML = `<div class="left">
    <h1>${name}</h1>
    <p>${erros} passos</p>
  </div>
  <div class="right ${difficultyClass}">
    <i class="fa-solid fa-trophy"></i>
    <p>${difficultyName}</p>
  </div>`
  document.getElementById("load-more").before(div);
}