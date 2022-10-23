
class Cell{
  constructor(value){
    this.value = value;
  }

  getCell(index){
    const cell = document.createElement('div');
    cell.classList.add('cell', 'cell-activ');
    cell.dataset.index = `${index}`;
    // cell.draggable = true;
    cell.innerHTML = `
        <div class="text-container">
            <h2 class="text">${this.value}</h2>
        </div>`;


    // cell.addEventListener('pointerdown', (e)=>{

    //   e.preventDefault()
    
    //   cell.setPointerCapture(e.pointerId);
    //   let isEmptyElement = true;
    
    //   if (e.target.closest('.cell-activ')){
    //     // const targetCell = e.target.closest('.cell-activ')
    
    //     const cellTime = cell.cloneNode(true);
    
    //     cellTime.style.transition = 'none';
    //     cellTime.style.opacity = '0.8'
    
    //     const left = cell.offsetLeft;
    //     const top = cell.offsetTop;
    //     const cellWidth = cell.offsetWidth; 

    //     console.log(left, top)
    //     console.log(emptyCell.offsetLeft, emptyCell.offsetTop)
        
    //     const windowX = cell.getBoundingClientRect().left;
    //     const windowY = cell.getBoundingClientRect().top;
    
    //     const shiftX = e.clientX - windowX;
    //     const shiftY = e.clientY - windowY;  
    
    //     cellTime.style.zIndex = 1000;
    //     body.append(cellTime);
    
    //     moveAt(e.pageX, e.pageY);
    
    //     function moveAt(pageX, pageY) {
    //       cellTime.style.left = pageX - shiftX + 'px';
    //       cellTime.style.top = pageY - shiftY + 'px';
    //     }
    
    //     function onMouseMove(e, ) {
    //       if(Math.abs(windowX - cellTime.offsetLeft) > 10 || Math.abs(windowY -cellTime.offsetTop) > 10){
    
    //         cellTime.style.display = 'none';
    
    //         isEmptyElement = document.elementFromPoint(e.clientX, e.clientY).closest('.cell-empty') === emptyCell;
    
    //         cellTime.style.display = '';

    //       }
    //       moveAt(e.pageX, e.pageY);
    //     }
    
    //     function removeEvents(e){
    //       document.removeEventListener('pointermove', onMouseMove);
    //       cell.removeEventListener('pointerup', removeEvents);
    //       // console.log(left, top)
    //         if((Math.abs(left - emptyCell.offsetLeft) + Math.abs(top - emptyCell.offsetTop) === cellWidth) && isEmptyElement){
        
    //           cellTime.remove();
    //           if(+soundEffect.dataset.sound){
    //             audio.play();
    //           }
          
    //           cell.style.left = `${emptyCell.offsetLeft}px`;
    //           cell.style.top = `${emptyCell.offsetTop}px`;
              
             
    //           emptyCell.style.left = `${left}px`;
    //           emptyCell.style.top = `${top}px`;
          
    //           [cell.dataset.index, emptyCell.dataset.index] = [emptyCell.dataset.index, cell.dataset.index]
    //           updateMoves();
          
    //           localStorage.setItem('controls', controls.innerHTML);
    //           localStorage.setItem('wraper', wraper.innerHTML);
          
    //           showWinsMessage(activCells);
    //         } else{
    //           cellTime.remove();
    //         }
    //     }
    
    //     document.addEventListener('pointermove', onMouseMove);
    //     cell.addEventListener('pointerup', removeEvents);
    //   }
    // })
    return cell;
  }
};

class EmptyCell{
  getCell(index){
    const cell = document.createElement('div');
    cell.classList.add('cell', 'cell-empty');
    cell.id = 'cell-empty';
    cell.dataset.index = `${index}`;
    return cell;
  }
};

// Functions ----------------------------------------------------------

function shuffle(arr){
  let parity = 1;

  while (parity !== 0) {
    let j, temp;
    for(let i = arr.length - 1; i > 0; i--){
        j = Math.floor(Math.random()*(i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }

    let summ = 0;

    for (let first = 0; first < arr.length - 1; first++){
      for (let sec = first; sec < arr.length; sec++){
        if(arr[first] > arr[sec]){
          summ++;
        }
      }
    }
    parity = summ % 2;
  }
  arr.push(0);
  return arr
}

function shuffleCells(){
  wraper.innerHTML = ``;

  createAndResizePuzzle(getPuzzleSize(sectionSize), createCells, sectionSize);
  
  emptyCell = document.getElementById('cell-empty');

  updateMoves(true)

  clearInterval(startTimer);
  timer.querySelector('span').textContent = '00:00:00'
  timer.dataset.time = `0`;
  startTimer = setInterval(updateTimer, 1000);
}

function setSizeOfCell(cell, size, left, top){
    cell.style.left = `${left * size}px`;
    cell.style.top = `${top * size}px`;
    
    cell.style.width = `${size}px`;
    cell.style.height = `${size}px`;
}

function createCells(size, number) {

  let arr = [];

  for (let i = start; i < start + number - 1; i++){
      arr.push(i);
  }

  shuffle(arr);

  for (let i = 0; i < arr.length; i++){

      const left = i % Math.sqrt(number);
      const top = (i - left) / Math.sqrt(number);

      let sizeOfCell = size / Math.sqrt(number);
      let cell;

      if(!arr[i]){
        cell = new EmptyCell().getCell(i);
      } else {
        cell = new Cell(arr[i]).getCell(i);
      }
      
      setSizeOfCell(cell, sizeOfCell, left, top)

      wraper.append(cell)
  }

  arr = [];
}

function createAndResizePuzzle (size, callback, numberOfCells, ...[cells]){
    wraper.style.width = size + 'px';
    wraper.style.height = size + 'px';

    callback(size, numberOfCells, cells);
    
}

function resizeCell(size, number, cells){
    let sizeOfCell = size / Math.sqrt(number);

    let arrayOfCells = Array.from(cells);
    
    arrayOfCells.forEach(cell => {

        let leftCoefficient = Math.round(cell.offsetLeft / cell.offsetWidth);
        let topCoefficient = Math.round(cell.offsetTop / cell.offsetWidth);

        setSizeOfCell(cell, sizeOfCell, leftCoefficient, topCoefficient)
    })
}

function getPuzzleSize(sectionSize){
    let puzzleSize = Math.floor((body.offsetHeight - body.offsetWidth > 0? body.offsetWidth : body.offsetHeight)*0.8);
    return puzzleSize -= puzzleSize % Math.sqrt(sectionSize);
}

function updateMoves(reset = false){

  const moves = document.querySelector('.moves');

  if(reset){
    moves.dataset.moves = '0'
    moves.querySelector('span').textContent = '0'
  } else{
    let counter = +moves.dataset.moves + 1
    moves.dataset.moves = `${counter}`
    moves.querySelector('span').textContent = `${counter}`

    localStorage.setItem('controls', controls.innerHTML);
    localStorage.setItem('wraper', wraper.innerHTML);
  }

  
}

function updateTimer(){
  let time = +timer.dataset.time + 1;

  let hour = Math.floor(time / 60 / 60);
  let mins = Math.floor(time / 60 );
  let sec = time % 60;

  let resultTime = `${(hour > 9? hour : '0' + hour)}:${(mins > 9? mins : '0' + mins)}:${(sec > 9? sec : '0' + sec)}`;

  timer.querySelector('span').textContent = resultTime;
  
  timer.dataset.time = `${time}`;

  localStorage.setItem('controls', controls.innerHTML);
  localStorage.setItem('wraper', wraper.innerHTML);
}

function showWinsMessage(cells){
  let winsArray = Array.from(cells);

  const isWin = winsArray.map(item => +item.dataset.index + 1 === +item.querySelector('.text').textContent).indexOf(false);

  if(isWin < 0){
    
    bestResults.push({
      time: +timer.dataset.time,
      timer: timer.querySelector('span').textContent,
      moves: document.querySelector('.moves').dataset.moves,
      select: select.value
    })

    if(bestResults.length <= 10){
      bestResults.sort((first, second) => first.time - second.time)
    } else{
      bestResults.sort((first, second) => first.time - second.time)
      bestResults.pop();
    }
    
    localStorage.setItem('bestResults', JSON.stringify(bestResults))

    clearInterval(startTimer);

    const winsMessage = document.createElement('div');
    winsMessage.classList.add('message');
    winsMessage.innerHTML = `<div class="message__inner">
                                <div class="message__text">
                                    Ура! Вы решили головоломку за <span id="winsTime">${timer.querySelector('span').textContent}</span> и <span id="winsMoves">${document.querySelector('.moves').dataset.moves}</span> ходов!
                                </div>
                                <div class="btn new-game">New Game!</div>
                            </div>`;
    body.append(winsMessage);

    localStorage.removeItem('wraper')
    localStorage.removeItem('controls')
  }
}

// Code---------------------------------------------------------------------
const body = document.querySelector('body');

let select, sectionSize, bestResults = [];

if(localStorage.bestResults){
 bestResults = JSON.parse(localStorage.bestResults)
}

const wraper = document.createElement('div');
wraper.classList.add('wraper')

const controls = document.createElement('div');
controls.classList.add('controls');
controls.innerHTML = `<div class="menu">
                        <div class="btn" id="shuffle">shuffle</div>
                        <div class="btn" id="results">results</div>
                        <div class="btn" data-sound='1' id="sound">sound</div>
                        <select class="btn" id="select">
                          <option value="9">3x3</option>
                          <option value="16" selected>4x4</option>
                          <option value="25">5x5</option>
                          <option value="36">6x6</option>
                          <option value="49">7x7</option>
                          <option value="64">8x8</option>
                        </select>
                      </div>

                      <div class="info">
                        <p class="moves" data-moves="0">Moves: <span>0</span></p>
                        <p class="time" data-time="0">Time: <span>00:00:00</span></p>
                      </div>`;

let start = Math.floor(Math.random() + 1);

const audio = new Audio('src/audio.mp3');

if(!localStorage.wraper){
  body.append(controls);
  body.append(wraper);

  select = document.getElementById('select');

  sectionSize = +select.value;

  createAndResizePuzzle(getPuzzleSize(sectionSize), createCells, sectionSize);

  localStorage.setItem('controls', controls.innerHTML);
  localStorage.setItem('wraper', wraper.innerHTML);
  localStorage.setItem("sectionSize", sectionSize)

} else{
  wraper.innerHTML = localStorage.wraper
  controls.innerHTML = localStorage.controls

  body.prepend(wraper) 
  body.prepend(controls) 

  select = document.getElementById('select');
  select.value = localStorage.sectionSize;
  sectionSize = +localStorage.sectionSize;

}

let startTimer = setInterval(updateTimer, 1000);

const cells = document.getElementsByClassName('cell');
let emptyCell = document.getElementById('cell-empty');
const activCells = document.getElementsByClassName('cell-activ');
const timer = document.querySelector('.time');
const results = document.getElementById('results');
const soundEffect = document.getElementById('sound');

createAndResizePuzzle(getPuzzleSize(sectionSize), resizeCell, sectionSize, cells);

// Events-----------------------------------------------------

window.addEventListener('resize', () => {    
  createAndResizePuzzle(getPuzzleSize(sectionSize), resizeCell, sectionSize, cells);

  localStorage.setItem('controls', controls.innerHTML);
  localStorage.setItem('wraper', wraper.innerHTML);
})

wraper.addEventListener('pointerdown', (e)=>{

  e.preventDefault()

  wraper.setPointerCapture(e.pointerId)
  let isEmptyElement = true;

  if (e.target.closest('.cell-activ')){
    const targetCell = e.target.closest('.cell-activ')

    const cell = targetCell.cloneNode(true);

    cell.style.transition = 'none';
    cell.style.opacity = '0.8'

    const left = targetCell.offsetLeft;
    const top = targetCell.offsetTop;
    const cellWidth = targetCell.offsetWidth; 
    
    const windowX = targetCell.getBoundingClientRect().left;
    const windowY = targetCell.getBoundingClientRect().top;

    const shiftX = e.clientX - windowX;
    const shiftY = e.clientY - windowY;  

    cell.style.zIndex = 1000;
    body.append(cell);

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
      cell.style.left = pageX - shiftX + 'px';
      cell.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(e, ) {
      if(Math.abs(windowX - cell.offsetLeft) > 10 || Math.abs(windowY -cell.offsetTop) > 10){

        cell.style.display = 'none';

        isEmptyElement = document.elementFromPoint(e.clientX, e.clientY).closest('.cell-empty') === emptyCell;

        cell.style.display = '';
      }
      moveAt(e.pageX, e.pageY);
    }

    function removeEvents(e){
      document.removeEventListener('pointermove', onMouseMove);
      wraper.removeEventListener('pointerup', removeEvents);

        if(Math.abs(left - emptyCell.offsetLeft) + Math.abs(top - emptyCell.offsetTop) === cellWidth && isEmptyElement){
    
          cell.remove();
          if(+soundEffect.dataset.sound){
            audio.play();
          }
      
          targetCell.style.left = `${emptyCell.offsetLeft}px`;
          targetCell.style.top = `${emptyCell.offsetTop}px`;
          
          emptyCell.style.left = `${left}px`;
          emptyCell.style.top = `${top}px`;
      
          [targetCell.dataset.index, emptyCell.dataset.index] = [emptyCell.dataset.index, targetCell.dataset.index]
          updateMoves();
      
          localStorage.setItem('controls', controls.innerHTML);
          localStorage.setItem('wraper', wraper.innerHTML);
      
          showWinsMessage(activCells);
        } else{
          cell.remove();
        }
    }

    document.addEventListener('pointermove', onMouseMove);
    wraper.addEventListener('pointerup', removeEvents);
  }
})

select.addEventListener('change', ()=>{
  sectionSize = +select.value;
  shuffleCells();

  localStorage.setItem('controls', controls.innerHTML);
  localStorage.setItem('wraper', wraper.innerHTML);
  localStorage.setItem("sectionSize", sectionSize)
})

controls.addEventListener('click', (e)=> {
  e.preventDefault();
  if(e.target.closest('#shuffle')){
    shuffleCells();

    localStorage.setItem('controls', controls.innerHTML);
    localStorage.setItem('wraper', wraper.innerHTML);
  }

  if(e.target.closest('#results') === results){
    clearInterval(startTimer);
    const resultList = document.createElement('div');
    resultList.classList.add('results__mask');
    resultList.innerHTML = `<div class="results__inner">
                              <div class="btn results__close">close</div>
                              <div class="results__item">
                                <span class="results__item-place results__item--elem">№</span>
                                <span class="results__item-moves results__item--elem">Moves</span>
                                <span class="results__item-time results__item--elem">Time</span>
                                <span class="results__item-size results__item--elem">Size</span>
                              </div>
                              <ul class="results__list">
                              </ul>
                            </div>`;

    bestResults.forEach((item, key) => {
      let listItem = document.createElement('li');
      listItem.classList.add('results__item');
      if(key % 2 === 0){
        listItem.classList.add('_blue')
      }
      listItem.innerHTML = `<span class="results__item-place results__item--elem">${key+1}</span>
                            <span class="results__item-moves results__item--elem">${item.moves}</span>
                            <span class="results__item-time results__item--elem">${item.timer}</span>
                            <span class="results__item-size results__item--elem">${Math.sqrt(item.select)}x${Math.sqrt(item.select)}</span>`;

      resultList.querySelector('ul').append(listItem);
    })

    body.append(resultList);

    function closeResultList(e){
      e.preventDefault();

      resultList.removeEventListener('click', closeResultList);
      resultList.remove();
      startTimer = setInterval(updateTimer, 1000);
    }

    resultList.addEventListener('click', closeResultList)
  }

  if(e.target.closest('#sound') === soundEffect){
    soundEffect.classList.toggle('_red');
    soundEffect.dataset.sound = soundEffect.classList.contains('_red')? 0 : 1;
  }
})

body.addEventListener('click', (e)=>{
  e.preventDefault();

  if(e.target.classList.contains('new-game')){
    
    e.target.closest('.message').remove();
    shuffleCells();

    localStorage.setItem('controls', controls.innerHTML);
    localStorage.setItem('wraper', wraper.innerHTML);
  }
})