const game = document.getElementById('jogo');

const GameWidth = 4;
const GameHeight = 5;

let last = {
  result: null,
  div: null
};

let delay = false;

const colors = [
  "#00b8a9",
  "#f8f3d4",
  "#f6416c",
  "#ffde7d",
]

const cards = [
  { result: 9, texts: ['6 + 3', '3²', '3 * 3', '3²'] },
  { result: 5, texts: ['√25', '2 + 3'] },
  { result: 14, texts: ['7 * 2', '9 + 5'] },
  { result: 25, texts: ['5 * 5', '30 - 5'] },
  { result: 11, texts: ['44 - 33', '5 + 6'] },
  { result: 4, texts: ['8 ÷ 2', '2 * 2'] },
  { result: 1, texts: ['√1', '1 x 1'] },
  { result: 16, texts: ['4²', '8 + 8'] },
  { result: 30, texts: ['5 * 6', '15 + 15'] },
]

game.style.gridTemplateColumns = new Array(GameWidth).fill('1fr').join(' ');
// POR FAVOR ANÔNIMO, NÃO QUEBRE O CÓDIGO
// Ass: Moises
const errorCounterDiv = document.getElementById('error');
const winnerDiv = document.querySelector('.winner');
const errosTotalDiv = document.getElementById('errorsTotal');

function init() {
  for (const card of cards) {
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
              winnerDiv.classList.add('show');
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

function desviraVirados() {
  let virados = document.querySelectorAll('.rotate')
  virados.forEach(e => {
    if (e.classList.contains('correct')) return;

    e.classList.remove('rotate');
  })
}

init();

function ResetGame() {
  game.innerHTML = "";
  last = { div: null, result: null };
  errorCounterDiv.innerText = "0";
  init();
}

document.getElementById('reset').addEventListener('click', () => ResetGame())

document.getElementById('playagin').addEventListener('click', () => {
  winnerDiv.classList.remove('show');
  ResetGame();
});
