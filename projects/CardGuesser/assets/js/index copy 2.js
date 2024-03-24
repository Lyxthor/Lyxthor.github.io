let cards = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21
]
let cardDecks = []
cardDecks[0] = [
    cards[0], 
    cards[1], 
    cards[2], 
    cards[3], 
    cards[4], 
    cards[5], 
    cards[6], 
]
cardDecks[1] = [
    cards[7], 
    cards[8], 
    cards[9], 
    cards[10], 
    cards[11], 
    cards[12], 
    cards[13], 
]
cardDecks[2] = [
    cards[14], 
    cards[15], 
    cards[16], 
    cards[17], 
    cards[18], 
    cards[19], 
    cards[20], 
]
let randCardDecks = [[],[],[]];
let randCards = []
let session = 1;
let sessionEnd = false;
let noAnswer = 0;
let yesAnswer = 0;

function greeting() {
    alert("this is card guesser program. i will guess what card that you thought in less than 4 questions")
}
// function showCardChoices(session, deck, queue) {
//     let choicesText = ''
//     deck.forEach(card => {
//         choicesText += card+', '
//     });
//     let answer = confirm(`session - ${session} \ndeck - ${queue+1} \n ${choicesText} \nis the card that you tought exists in those choices`)
//     answerHandler(answer, queue)
// }
function answerHandler(answer, index) {
    if(!answer && noAnswer === 3) restartSession()
    else {
        if(answer) setMiddleDeck(index)  
        else setEdgeDeck(index)
    }
}
function setMiddleDeck(index) {
    for(let i = 7;i < 14;i++) { randCards[i] = cardDecks[index][i-7] };
    for(let i = 0;i < cardDecks.length;i++) { if(i !== index) setEdgeDeck(i) }
    sessionEnd = true
}
function setEdgeDeck(index) {
    if(randCards[0] === undefined) {
        for(let i = 0;i < 7;i++) { randCards[i] = cardDecks[index][i] }
    } else {
        for(let i = 14;i < 21;i++) { randCards[i] = cardDecks[index][i-14] }
    }
}
function randomizeCardDecks() {
    let h = 0;
    for(let i = 0;i < cardDecks[0].length;i++) {
        for(let j = 0;j < cardDecks.length;j++) {
            randCardDecks[j][i] = randCards[h]
            h++
        }
    }
    cardDecks = randCardDecks
    resetRandVariables()
}
// let tryArray = []
// async function getRandIndex() {
//     if(currentRandIndex < 21) {
//         let randIndex = Math.floor(Math.random() * 21);
        
//         if(tryArray.includes(cards[randIndex]) == false) {
//             tryArray.push(cards[randIndex])
//             currentRandIndex++
//         } else {
//             getRandIndex()
//         }
//         if(tryArray.length < 21 || currentRandIndex < 21) {
//             getRandIndex()
//         }
//     } 
//     console.log(tryArray)
// }
// getRandIndex()
let currentRandIndex = 0;
async function randomizeCards() {
    if(currentRandIndex < 21) {
        let randIndex = Math.floor(Math.random() * 21);
        
        if(randCards.includes(cards[randIndex]) == false) {
            randCards.push(cards[randIndex])
            currentRandIndex++
        } else {
            randomizeCards()
        }
        if(randCards.length < 21 || currentRandIndex < 21) {
            randomizeCards()
        } 
    } 

}
function resetRandVariables() {
    randCardDecks = [[],[],[]]
    randCards = []
}
// function startSession() {
//     let queue = 0;
//     while(!sessionEnd) {
//         showCardChoices(session, cardDecks[queue], queue)
//         queue++
//     }
//     continueOrRand()
// }
function restartSession() {
    let confirmation = confirm('hmmm... this cant be possible maybe you should pay more attention on the choices. Restart session....')
    if(confirmation) startSession()
}
function continueOrRand() {
    session++
    randomizeCardDecks()
    if(session === 4) getResult()
    else {
        sessionEnd = false
    }
}
function getResult() {
    sessionEnd = true
    alert(`the card in your mind is.....${cardDecks[1][3]}`)
}
// function start() {
//     greeting()
//     startSession()
// }
// start()


let i = 2;
const decks = document.getElementsByClassName('deck');
const backwardTimeout = 1600;
const forwardTimeout = 1600;
const shuffleTimeout = 3600;
const spreadTimeout = 800;
const showOnTimeout = forwardTimeout+400;
const questionOnTimeout = 800;
const showOffTimeout = 1000;
const questionOffTimeout = 1000;
let isOpenedDeckExists = false;
let openedDeckIndex = null;
let shuffleState = false;
let moveState = true;
randomizeCards()
async function startMove() {
    console.log(cardDecks);
    randomizeCardDecks()
    collapse()
    await sleep(shuffleTimeout).then(() => {
        shuffle
    })
    return sleep(spreadTimeout).then(() => {
        spread
    })
}
function openDeck(e, index) {
    if(!isOpenedDeckExists) {
        disableButton(e.target);
        moveDeck(index);
    }
}
function enableButton(button) {
    button.textContent = "Open";
    button.disabled = false;
}
function disableButton(button) {
    button.textContent = "Opened"
    button.disabled = true;
}
function collapse() {
    const decksContainer = document.querySelector('#decks');
    decksContainer.classList.toggle('collapse')
    setTimeout(()=>{
        shuffle()
    }, shuffleTimeout)
}
const sleep = ms =>{
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
const removeShuffle = (deck) =>{
    return sleep(900).then(()=>{
            deck.classList.remove('shuffle')
    })
}
const shuffle = async _ => {
    for(let j = 0;j < 3;j++) {
        for(let i = 2;i > 0;i--) {
            let deck = decks[i]
            deck.classList.add('shuffle')
            await removeShuffle(deck)
        }
    }
    noAnswer = 0;
    loadCardEls()
    setTimeout(spread, spreadTimeout)
}
function spread() {
    document.getElementById('decks').classList.toggle('spread');
    setTimeout(toggleShowChooseButtons, spreadTimeout+200);
}

async function moveDeck(index) {
    if(!isOpenedDeckExists) {
        if(moveState) {
            await moveForward(index)
        } else {
            await moveBackward(index);
        }
    }
}
async function moveForward(index) {
    openedDeckIndex = index;
    decks[index].classList.add('forward')
    decks[index].classList.remove('backward')
    await sleep(showOnTimeout).then(()=>{
        show()
    })
    return sleep(questionOnTimeout).then(()=>{
        switchQuestion()
        isOpenedDeckExists = true;
        moveState = false;
    })
}
async function moveBackward(index) {
    show()
    switchQuestion()
    await sleep(showOffTimeout).then(()=>{
        const button = document.querySelector(`.chooseButton-${index+1}`);
        enableButton(button);
        decks[index].classList.add('backward')
        decks[index].classList.remove('forward')
    })
    return sleep(backwardTimeout).then(()=>{
        decks[index].classList.remove('backward')
        decks[index].classList.remove('flipable')
        isOpenedDeckExists = false;
        moveState = true
    })
}
function show() {
    const mainDeck = document.querySelector('.deck.forward')
    if(mainDeck != null) {
        mainDeck.classList.toggle('flipable');
        const mainCards = mainDeck.querySelectorAll('.card')
        mainCards.forEach(card => {
            card.classList.toggle('show')
        })
    }
}
async function yes() {
    yesAnswer++
    answerHandler(true, openedDeckIndex)
    await moveBackward(openedDeckIndex)
    if(yesAnswer === 3) {
        spread()
        await sleep(spreadTimeout).then(()=>{
            shuffle()
            return sleep(5600).then(()=>{
                continueOrRand()
            })
        })
    }
    else {
        continueOrRand()
        spread()
        await setTimeout(shuffle, spreadTimeout)
    }
}
async function no() {
    noAnswer++
    answerHandler(false, openedDeckIndex)
    await moveBackward(openedDeckIndex)
}
function toggleShowChooseButtons() {
    const chooseButtons = document.getElementById("chooseButtonsContainer");
    chooseButtons.classList.toggle('visible');
}
function switchQuestion() {
    const question = document.getElementById("question")
    question.classList.toggle('visible');
}

// COMBINE DISPLAY AND ALGORITHMS
const pivotCards = [];
const cardEls = document.getElementsByClassName("back-face")
function loadPivotCards() {
    for(let i = 0;i < cardDecks.length;i++) {
        // for(let j = 0;j < cardDecks[i].length;j++) {
        //     pivotCards[j] = cardDecks[i][j]
        // }
        if(i === 2) {
            for(let j = 0;j < cardDecks[2].length;j++) {
                pivotCards[j+14] = cardDecks[2][j]
            }
        } else if(i === 1) {
            for(let j = 0;j < cardDecks[1].length;j++) {
                pivotCards[j+7] = cardDecks[1][j]
            }
        } else {
            for(let j = 0;j < cardDecks[i].length;j++) {
                pivotCards[j] = cardDecks[i][j]
            }
        }
    }
}
function loadCardEls() {
    // let i = 0;
    // cardEls.forEach((cardEl, index)=>{
    //     cardEl.innerHTML = `<h2>${pivotCards[index]}</h2>`
    // })

    for(let i = 0;i < cardDecks.length;i++) {
        // for(let j = 0;j < cardDecks[i].length;j++) {
        //     pivotCards[j] = cardDecks[i][j]
        // }
        if(i === 2) {
            for(let j = 0;j < cardDecks[2].length;j++) {
                cardEls[j+14].textContent = cardDecks[2][j]
            }
        } else if(i === 1) {
            for(let j = 0;j < cardDecks[1].length;j++) {
                cardEls[j+7].textContent = cardDecks[1][j]
            }
        } else {
            for(let j = 0;j < cardDecks[i].length;j++) {
                cardEls[j].textContent = cardDecks[i][j]
            }
        }
    }
}
loadPivotCards()
loadCardEls()