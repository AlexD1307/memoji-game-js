let cards = [{id: 1, image: '🐻'}, {id: 2, image: '🐼'}, {id: 3, image: '🐨'}, {id: 4, image: '🐯'}, {id: 5, image: '🦁',}, {id: 6, image: '🐮'}]
const memoryGame = document.getElementById('memory-game')
const timerBlock = document.getElementById('timer')
const modalBlock = document.getElementById('modal')
let cardsMatch, openCardPairs, hasFlipped, clickedCards, timeInterval

(function initApp() {
  cards = [...cards, ...cards]
  startGame()
})()

function startGame() {
  initData()
  cards = shuffle(cards)
  timerTemplate(1)
  memoryGame.innerHTML = cards.map(cardTemplate).join('')
}

memoryGame.addEventListener('click', (event) => {
  if (event.target.classList.contains('card-back')) {
    const card = event.target.closest('.card-field')
    flipCard(card)
  }
})

modalBlock.addEventListener('click', (event) => {
  if (event.target.dataset.btn) {
    modalBlock.style.display = 'none'
    startGame()
  }
})

function cardTemplate(card) {
  return `
    <div class="card-field" data-card="${card.id}">
      <div class="card card-back"></div>
      <div class="card card-front">${card.image}</div>
    </div>
  `
}

function timerTemplate(minutes = 1, seconds= 0) {
  timerBlock.innerHTML = `
    <span class="timer">
      ${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}
    </span>  
  `
}

function initData() {
  clickedCards = []
  openCardPairs = 0
  cardsMatch = false
  hasFlipped = false
}

function flipCard(card) {
  card.classList.add('flipped')
  !clickedCards.length && startTimer()

  if (!hasFlipped) {
    shouldUnflip = !!clickedCards.length && !cardsMatch
    shouldUnflip && unflipCards(clickedCards)

    clickedCards[0] = card
    hasFlipped = true
  } else {
    clickedCards[1] = card
    hasFlipped = false
    checkForMatch()
  }
}

function checkForMatch() {
  const matchBackgroundCards = setCardsBackground(clickedCards)
  cardsMatch = clickedCards[0].dataset.card === clickedCards[1].dataset.card

  if (cardsMatch) {
    matchBackgroundCards('#5AD66F')
    openCardPairs += 1
  } else {
    matchBackgroundCards('#F44336')
  }
  victory = openCardPairs === cards.length / 2
  victory && gameVictory()
}

function unflipCards(cards) {
  const restoreBackgroundCards = setCardsBackground(cards)
  restoreBackgroundCards('#fff')
  cards.forEach(card => card.classList.remove('flipped'))
}

function startTimer() {
  const deadline = new Date(Date.parse(new Date()) + 59 * 1000)

  function updateClock() {
    const time = getTimeRemaining(deadline)
    if (time.total <= 0) {
      openModal('Lose')
      clearInterval(timeInterval)
    }

    timerTemplate(time.minutes, time.seconds)
  }

  updateClock()
  timeInterval = setInterval(updateClock, 1000)
}

function getTimeRemaining(endTime) {
  const total = Date.parse(endTime) - Date.parse(new Date())
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const seconds = Math.floor((total / 1000) % 60)
  return {total, minutes, seconds}
}

function openModal(text) {
  modalBlock.style.display = 'flex'
  modalBlock.innerHTML = `
    <div class="modal-content">
      <h2 class="modal-title">${text}</h2>
      <button class="btn-restart" data-btn="restart">Play again</button>
    </div>
  `
}

function setCardsBackground(cards) {
  return (color) => {
    cards.forEach(card => {
      const cardFront = card.querySelector('.card-front')
      cardFront.style.backgroundColor = cardFront.style.borderColor = color
    })
  }
}

function gameVictory() {
  clearInterval(timeInterval)
  openModal('Win')
}

function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return cards
}
