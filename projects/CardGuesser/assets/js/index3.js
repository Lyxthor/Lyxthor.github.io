// ALGORITHMS
class ProgramAlgorithms  {
    constructor() {
        this.cards = [];
        this.decks = decks;
        this.randedCards = [];
        this.randedDecks = [];
        this.randCardLength = 0;

        this.cards.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21])
        this.decks.push([])
        this.decks.push([])
        this.decks.push([])
        this.decks[0] = [
            this.cards[0], 
            this.cards[1], 
            this.cards[2], 
            this.cards[3], 
            this.cards[4], 
            this.cards[5], 
            this.cards[6], 
        ]
        this.decks[1] = [
            this.cards[7], 
            this.cards[8], 
            this.cards[9], 
            this.cards[10], 
            this.cards[11], 
            this.cards[12], 
            this.cards[13], 
        ]
        this.decks[2] = [
            this.cards[14], 
            this.cards[15], 
            this.cards[16], 
            this.cards[17], 
            this.cards[18], 
            this.cards[19], 
            this.cards[20], 
        ]
        this.randedDecks.push([])
        this.randedDecks.push([])
        this.randedDecks.push([])
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
            console.log(index)
            if(index !== middleIndex) {
                this.setEdgeCards(index)
            }
        }
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
    resetRandVariables() {
        this.randedCards = [];
        this.randedDecks = [[], [], []];
    }
}

// INTERFACE
/* animations functions */
class ProgramAnimations {
    constructor(confirmBtnsContainer, decksContainer, decks) {
        this.confirmBtnsContainer = confirmBtnsContainer
        this.decksContainer = decksContainer
        this.decks = decks
    }
    collapse() {
        this.decksContainer.setAttribute('class', 'collapseAble')
        this.decks.forEach(deck=>{
            deck.classList.toggle('collapse')
        })
    }
    down() {
        this.decksContainer.setAttribute('class', 'collapseAble downAble')
        this.decks.forEach(deck=>{
            deck.classList.toggle('down')
        })
    }
    switchShuffle() {
        this.decksContainer.setAttribute('class', 'collapseAble downAble shuffleAble')
    }
    shuffle(index) {
        const deck = this.decks[index]
        deck.classList.add('shuffle')
    }
    spread() {
        this.decksContainer.setAttribute('class', 'collapseAble spreadAble')
        this.decks.forEach(deck => {
            deck.classList.toggle('spread')
        })
    }
    toggleForwardBackward(index) {
        const deck = this.decks[index]
        deck.classList.toggle('forward')
    }
    toggleOpenClose(index) {
        const deck = this.decks[index]
        deck.classList.toggle('collapse')
    }
}
/* elements */
const startBtn = document.getElementById('startBtn')
const confirmBtnsContainer = document.getElementById('confirmBtnsContainer')
const yesBtn = document.getElementById('yesBtn')
const noBtn = document.getElementById('noBtn')
const decksContainer = document.getElementById('decksContainer')
const decks = document.getElementsByClassName('deck')
// ALGORITHMS & INTERFACE CONNECTION
let cardArr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21
]
let cardDecks = []
cardDecks[0] = [
    cardArr[0], 
    cardArr[1], 
    cardArr[2], 
    cardArr[3], 
    cardArr[4], 
    cardArr[5], 
    cardArr[6], 
]
cardDecks[1] = [
    cardArr[7], 
    cardArr[8], 
    cardArr[9], 
    cardArr[10], 
    cardArr[11], 
    cardArr[12], 
    cardArr[13], 
]
cardDecks[2] = [
    cardArr[14], 
    cardArr[15], 
    cardArr[16], 
    cardArr[17], 
    cardArr[18], 
    cardArr[19], 
    cardArr[20], 
]
const algorithms = new ProgramAlgorithms(cardArr, cardDecks);
// const animations = new ProgramAnimations()
let sessionEnd = false;
let programEnd = false;
let sessionIndex = 1;
let noAnswer = 0;
let yesAnswer = 0;


