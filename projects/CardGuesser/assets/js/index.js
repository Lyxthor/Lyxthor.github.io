// ALGORITHMS
class ProgramAlgorithms  {
    constructor() {
        this.initAlgorithmsVariable()
    }
    setCards(randedCards) {
        this.cards = randedCards
    }
    setMiddleCards(middleIndex) {
        const deck = this.decks[middleIndex]
        deck.forEach((card, index)=> {
            let i = index+7
            this.randedCards[i] = card
        })
        for(let index = 0;index < this.decks.length;index++) {
            if(index !== middleIndex) {
                this.setEdgeCards(index)
            }
        }
        this.answerDecks.push(deck)
    }
    setEdgeCards(edgeIndex) {
        const deck = this.decks[edgeIndex]
        const firstLeftEdgeCard = this.randedCards[0]

        if(firstLeftEdgeCard === undefined) {
            deck.forEach((card, index)=> {
                let i = index
                this.randedCards[i] = card
            })
        } else {
            deck.forEach((card, index)=> {
                let i = index+14
                this.randedCards[i] = card
            })
        }
    }
    randDecks() {
        let cardIndex = 0;
        for(let deckCardIndex = 0;deckCardIndex < this.decks[0].length;deckCardIndex++) {
            for(let deckIndex = 0;deckIndex < this.decks.length;deckIndex++) {
                this.randedDecks[deckIndex][deckCardIndex] = this.randedCards[cardIndex]
                cardIndex++
            }
        }
        this.decks = this.randedDecks
        this.resetRandVariables()
    }
    randCards() {
        while(this.randCardLength < 21) {
            let randedIndex = Math.floor(Math.random() * 21);
            if(this.randedCards.includes(this.cards[randedIndex]) === false) {
                this.randedCards.push(this.cards[randedIndex])
                this.randCardLength++
            }
        }
        this.setCards(this.randedCards)
        this.randDecks()
    }
    trackAnswerCardDeckPosition() {
        const answerCard = this.decks[1][3];
        let validDeckNumber = 0;
        this.answerDecks.forEach((deck)=>{
            if(deck.includes(answerCard)) {
                validDeckNumber++
            }
        })
        if(validDeckNumber === 3) return {isAnswerValid: true};
        else return {isAnswerValid: false};
    }
    resetRandVariables() {
        this.randedCards = [];
        this.randedDecks = [[], [], []];
    }
    initAlgorithmsVariable() {
        this.cards = [
            "card_clubs_J", "card_clubs_Q", "card_clubs_K", "card_clubs_A", "card_clubs_02", "card_clubs_03",
            "card_hearts_J", "card_hearts_Q", "card_hearts_K", "card_hearts_A", "card_hearts_02",
            "card_spades_J", "card_spades_Q", "card_spades_K", "card_spades_A", "card_spades_02",
            "card_diamonds_J", "card_diamonds_Q", "card_diamonds_K", "card_diamonds_A", "card_diamonds_02"
        ]
        this.decks = 
        [
            [
                this.cards[0], 
                this.cards[1], 
                this.cards[2], 
                this.cards[3], 
                this.cards[4], 
                this.cards[5], 
                this.cards[6], 
            ],
            [
                this.cards[7], 
                this.cards[8], 
                this.cards[9], 
                this.cards[10], 
                this.cards[11], 
                this.cards[12], 
                this.cards[13], 
            ],
            [
                this.cards[14], 
                this.cards[15], 
                this.cards[16], 
                this.cards[17], 
                this.cards[18], 
                this.cards[19], 
                this.cards[20], 
            ]
        ];
        this.answerDecks = []
        this.randedCards = [];
        this.randedDecks = [];
        this.randCardLength = 0;

        this.randedDecks.push([])
        this.randedDecks.push([])
        this.randedDecks.push([])
    }
}

// INTERFACE
/* animations functions */
class ProgramAnimations {
    constructor(message, confirmation, decksContainer, decks) {
        this.message = message
        this.confirmation = confirmation
        this.decksContainer = decksContainer
        this.decks = decks

        this.collapseTimeout = this.downTimeout = this.spreadTimeout = this.flipTimeout = 800
        this.shuffleTimout = 1000
        this.forwardTimeout = this.backwardTimeout = 800
        this.openTimeout = this.closeTimeout = 800
    }
    triggerAnimations(trigererClasses) {
        this.decksContainer.setAttribute('class', trigererClasses)
    }
    setDecksAnimation(animationClass) {
        for(let deck of this.decks) { deck.classList.toggle(animationClass) }
    }
    setDeckAnimation(index, animationClass) {
        const deck = this.decks[index]
        deck.classList.toggle(animationClass)
    }
    collapse() {
        this.triggerAnimations('collapseAble')
        this.setDecksAnimation('collapse')
    }
    down() {
        this.triggerAnimations('collapseAble downAble')
        this.setDecksAnimation('down')
    }
    switchShuffle() {
        this.triggerAnimations('collapseAble downAble shuffleAble')
    }
    setShuffle(index) {
        this.setDeckAnimation(index, 'shuffle')
    }
    spread() {
        this.triggerAnimations('collapseAble downAble spreadAble')
        this.setDecksAnimation('spread')
    }
    switchOpen() {
        this.triggerAnimations('collapseAble spreadAble openAble')
    }
    toggleForwardBackward(index) {
        this.setDeckAnimation(index, 'forward')
    }
    toggleOpenClose(index) {
        this.setDeckAnimation(index, 'collapse')
    }
    toggleFlip(index) {
        const deck = this.decks[index]
        const cards = deck.getElementsByClassName('card')
        deck.classList.toggle('flipable')
        for(let card of cards) { card.classList.toggle('flip') }
    }
    toggleShowConfirmation() {
        if(this.confirmation.classList.contains('visible')) {
            noBtn.setAttribute('disabled', true);
            yesBtn.setAttribute('disabled', true);
            this.confirmation.classList.toggle('visible')
        } else {
            noBtn.removeAttribute('disabled');
            yesBtn.removeAttribute('disabled');
            this.confirmation.classList.toggle('visible')
        }
    }
    toggleShowMessage() {
        this.message.classList.toggle('visible')
    }
    showOrHide(el, visibilityClass) {
        if(visibilityClass === 'hidden') {
            el.classList.remove('visible')
            el.classList.add(visibilityClass)
            setTimeout(()=>{el.setAttribute('class', 'vanish')}, 600)
        } else {
            el.classList.remove('vanish')
            el.classList.remove('hidden')
            el.classList.add(visibilityClass)
        }
    }
    showAnswerCard() {
        const answerDeck = decks[1]
        const answerCard = answerDeck.getElementsByClassName('card')[3]
        
        answerDeck.classList.toggle('answer-deck')
        answerCard.classList.toggle('answer-card')
        setTimeout(function() { answerCard.classList.toggle('flip') }, this.forwardTimeout);
    }
    alertElementsLayoutAndContent(alertElement, elementText, layoutClass) {
        alertElement.getElementsByClassName('text')[0].textContent = elementText;
        alertElement.setAttribute("class", layoutClass)
    }
}
/* elements */
const startBtn = document.getElementById('startBtn')
const message = document.getElementById('message')
const confirmation = document.getElementById('confirmation')
const yesBtn = document.getElementById('yesBtn')
const noBtn = document.getElementById('noBtn')
const gotItBtn = document.getElementById('gotItBtn')
const decksContainer = document.getElementById('decksContainer')
const decks = document.getElementsByClassName('deck')
const cards = document.getElementsByClassName('card')
const cardBacks = document.getElementsByClassName('back-face')

// ALGORITHMS & INTERFACE CONNECTION
/* class & variables */
const algorithms = new ProgramAlgorithms();
const animations = new ProgramAnimations(message, confirmation, decksContainer, decks)
const cardsImgBaseUrl = "./assets/images/cards"
let sessionEnd = false;
let programEnd = false;
let sessionIndex = 1;
let deckIndex = 0;
let noAnswer = 0;
let yesAnswer = 0;
/* helper functions */
function sleep(ms) {
    return new Promise(resolve => { setTimeout(resolve, ms) })
}
function resetPerSessionVariables() {
    deckIndex = 0;
    noAnswer = 0;
}
function resetAllVariables() {
    algorithms.initAlgorithmsVariable()
    sessionEnd = false;
    programEnd = false;
    sessionIndex = 1;
    deckIndex = 0;
    noAnswer = 0;
    yesAnswer = 0;
}
function randAndLoadCard() {
    return new Promise(resolve=>{
        loadCardContent()
        resolve()
    })
}
function loadCardContent() {
    let cardIndex = 0;
    for(let deckIndex = 0;deckIndex < algorithms.decks.length;deckIndex++) {
        for(let deckCardIndex = 0;deckCardIndex < algorithms.decks[deckIndex].length;deckCardIndex++) {
            cardBacks[cardIndex].innerHTML = `<img src="${cardsImgBaseUrl}/${algorithms.decks[deckIndex][deckCardIndex]}.png" alt="${algorithms.decks[deckIndex][deckCardIndex]}" />`
            cardIndex++
        }
    }
}
/* animation utilizes functions */
async function shuffleCards() {
    animations.switchShuffle()
    return new Promise(async (resolve) => {
        for(let sessionIteration = 0;sessionIteration < 2;sessionIteration++) {
            for(let shuffleIteration = 2;shuffleIteration > 0;shuffleIteration--) {
                let deck = decks[shuffleIteration]
                deck.classList.add('shuffle')
                await sleep(animations.shuffleTimout).then(()=>{
                    deck.classList.remove('shuffle')
                })
            }
        }
        resolve()
    })
}
async function collapseDown() {
    animations.collapse()
    await sleep(animations.collapseTimeout).then(()=>{ animations.down() })
    await (async () => { algorithms.randCards() })()
    await sleep(animations.downTimeout).then(async ()=>{ await shuffleCards() })
    await sleep(animations.shuffleTimout)
}
async function collapseUp() {
    animations.down()
    await sleep(animations.downTimeout).then(()=>{ animations.collapse() })
    await sleep(animations.collapseTimeout).then(()=>{ flipAll() })
    await sleep(animations.flipTimeout).then(()=>{ animations.showOrHide(startBtn, 'visible') })
    animations.alertElementsLayoutAndContent(confirmation, "Hi, i'm default confirmation text", "box-lg")
    animations.alertElementsLayoutAndContent(message, "howdy, i'm default message text", "box-lg")
    await sleep(animations.flipTimeout)
    resetAllVariables()
}
async function flipAll() {
    for(let index = 0;index < decks.length;index++) { animations.toggleFlip(index) }
    await sleep(animations.flipTimeout)
}
async function spreadAndLoad() {
    animations.spread()
    randAndLoadCard()
    await sleep(animations.spreadTimeout)
}
async function gatherAndShuffle() {
    animations.spread()
    await sleep(animations.spreadTimeout).then(async ()=>{ await shuffleCards() })
    await sleep(animations.shuffleTimeout)
}
async function moveForward() {
    animations.switchOpen()
    animations.toggleForwardBackward(deckIndex)
    await sleep(animations.forwardTimeout).then(()=>{ animations.toggleOpenClose(deckIndex) })
    await sleep(animations.openTimeout).then(()=>{ animations.toggleFlip(deckIndex) })
    animations.alertElementsLayoutAndContent(confirmation, "Do your card exists among these cards?", "box-lg")
    animations.showOrHide(confirmation, 'visible')
    await sleep(animations.flipTimeout)
}
async function moveBackward() {
    animations.toggleFlip(deckIndex)
    animations.showOrHide(confirmation, 'hidden')
    await sleep(animations.flipTimeout).then(()=>{ animations.toggleOpenClose(deckIndex) })
    await sleep(animations.closeTimeout).then(()=>{
        animations.switchOpen()
        animations.toggleForwardBackward(deckIndex)
    })
    await sleep(animations.forwardTimeout)
}
async function showMessage(messageText, layoutClass) {
    animations.alertElementsLayoutAndContent(message, messageText, layoutClass)
    animations.showOrHide(message, 'visible')
    await sleep(3000).then(()=>{ animations.showOrHide(message, 'hidden') })
}
// on click functions
async function yes() {
    if(!programEnd) {
        yesAnswer++
        algorithms.setMiddleCards(deckIndex)
        algorithms.randDecks()
        await moveBackward()
        resetPerSessionVariables()
        await gatherAndShuffle()
        if(yesAnswer === 3) {
            programEnd = true;
            const {isAnswerValid} = algorithms.trackAnswerCardDeckPosition()
            console.log(isAnswerValid)
            if(isAnswerValid) {
                randAndLoadCard()
                animations.showAnswerCard()
                await sleep(animations.flipTimeout).then(()=>{
                    animations.alertElementsLayoutAndContent(confirmation, "Is it your card", "box-sm")
                })
                animations.alertElementsLayoutAndContent(message, "hi, i'm default", 'box-sm')
                await sleep(800).then(()=>{
                    animations.showOrHide(confirmation, 'visible')
                })
            } else {
                await showMessage("hoho.. not so fast buddy, you can't just click yes without pick a card first. it's not a type of those game", 'box-lg')
                await sleep(800).then(()=>{ collapseUp() })
            }
        } else {
            await spreadAndLoad()
            await moveForward()
        }
    } else {
        animations.showOrHide(confirmation, 'hidden')
        await showMessage("gotcha!", 'box-sm')
        restart()
    }
}
async function no() {
    if(!programEnd) {
        noAnswer++
        algorithms.setEdgeCards(deckIndex)
        await moveBackward()
        if(noAnswer === 3) {
            await showMessage("haha.. caught ya lost focus. I ain't so careless bud, there's no way your card just got lost in my watch. Try again", 'box-lg')
            resetPerSessionVariables()
            moveForward()
        } else {
            deckIndex++
            await moveForward()
        }
    } else {
        animations.showOrHide(confirmation, 'hidden')
        await showMessage("awwwhh:(", 'box-sm')
        restart()
    }
}

async function restart() {
    if(programEnd) {
        const card = cards[10]
        await sleep(800).then(()=>{card.classList.remove('flip')})
        await sleep(animations.flipTimeout).then(() => {
            card.parentElement.classList.remove('answer-deck')
            card.classList.remove('answer-card')
        })
        await sleep(animations.backwardTimeout).then(async () => { await collapseUp() })
        resetAllVariables()
    }
}
/* elements' event listeners */
startBtn.addEventListener('click', async (e)=>{
    animations.showOrHide(e.target, 'hidden')
    await flipAll()
    await collapseDown()
    await spreadAndLoad()
    await moveForward()
})
yesBtn.addEventListener('click', yes)
noBtn.addEventListener('click', no)
loadCardContent()


