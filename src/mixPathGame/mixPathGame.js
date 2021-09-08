import { COLORS, rgbCMYK, cmykRGB, cmykMax, setFirstColor, addColor, C, M, Y, K } from '../main/color'
import { randomNum, posObject, colorArr, sameArray, styleFinish, optionStyle, clearStyle } from '../main/helper'

// BOARD
let tileGrid;
let body;
export let allTiles = {};
let checkColor = true;

// GAMEPLAY

let selectedTiles = [];
let path;
let startTile;
let finishTile;
let targetColor;
let level = 3;
let lives = 3;

export const OPTIONS = [
  { dir: [-1, 0], name: 'up' },
  { dir: [1, 0], name: 'down' },
  { dir: [0, -1], name: 'left' },
  { dir: [0, 1], name: 'right' }
];

// CURRENT MOVE
let currentTile;
let currentColor;
let count = 1;
let optionTiles = [];
// let direction;



// let mixedTiles = [];


// DOM LOADED START
export function startGame() {

  // CREATE GRID
  setNewGrid();

  // ADD RESET... for now
  const reset = document.querySelector('.reset');
  reset.addEventListener('click', resetGrid);


}

function setNewGrid() {
  createMixGrid();
  setPath();
  resetVariables();
  optionTiles = markOptions();
};


function createMixGrid() {
  body = document.querySelector('body');
  // tileGrid = document.querySelector('.tile-grid');

  let cont = document.createElement('div')
  body.appendChild(cont)
  // tileGrid.appendChild(cont)
  cont.setAttribute('class', 'tile-grid');
  cont.setAttribute('id', `group-${level}`);
  let colorCount = 0;

  for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      let colorId = COLORS[colorCount];
      let coor = `${x}-${y}`;
      const tile = document.createElement('div');
      tile.setAttribute('id', colorCount)
      tile.setAttribute('colorId', colorId)
      tile.setAttribute('coor', coor)
      tile.setAttribute('class', 'mix-tile')
      tile.style['background-color'] = colorId;
      tile.style.border = '1px solid black';
      tile.style['aspect-ratio'] = 1;
      tile.addEventListener('click', mixTile)
      let info = {
        ele: tile,
        coor: coor,
        x,
        y
      }
      allTiles[coor] = info;
      cont.appendChild(tile)
      colorCount++
    }
  };
  cont.style.display = 'tile-grid';
  cont.style['grid-gap'] = '4px';
  cont.style['grid-template-columns'] = '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr';
  // SET START TILE 
  // setPath();
  // markOptions();
}



function findPath() {
  let mixedColor;
  currentColor = setFirstColor(currentColor);
  while ((count) <= level) {
    optionTiles = nextMoveOptions(false);
    let next = optionTiles[randomNum(optionTiles.length)];
    // return next = `${newX}-${newY}`
    selectedTiles.push(next);
    
    let nextColor = allTiles[next].ele.getAttribute('colorId');
    mixedColor = addColor(nextColor, count);
    currentTile = posObject(next);
    count = count + 1
    // count + 1;
  }
  

  targetColor = `rgb(${parseInt(mixedColor[0])}, ${parseInt(mixedColor[1])}, ${parseInt(mixedColor[2])})`;
  finishTile = currentTile.coor;
  // let finishEle = allTiles[finishTile].ele;
  // finishEle.style['border-radius'] = '100%';
  // finishEle.style.border = 'none'
  let body = document.querySelector('body');
  body.style['background-color'] = targetColor;

  // RESET VARIABLES FOR GAMEPLAY
  // currentTile = startTile;
  // count = 1
  // optionTiles = [startTile];
  path = selectedTiles;
  // selectedTiles = [currentTile.coor];
  // C = 0;
  // M = 0;
  // Y = 0;
  resetVariables();
}



function setPath() {
  // FIRST POSITION
  let x = randomNum(10) + 1;
  let y = randomNum(10) + 1;
  let coor = `${x}-${y}`;
  let coorObj = {
      coor,
      x,
      y
    };
  currentTile = coorObj;
  startTile = coorObj;
  selectedTiles.push(coor);
  currentColor = allTiles[coor].ele.getAttribute('colorId');

  // FIND PATH
    findPath();


  // RETURN START TILE
  // return coorObj;
}



function checkWinLose(color) {
  if ( targetColor === color && count - 1 === level ) {
    Object.values(allTiles).forEach(tile => {
      let { coor, ele } = tile;
      if (!selectedTiles.includes(coor)) {
        ele.style.border = 'none';
        ele.style['background-color'] = color;
      }
    })
    level = level + 1;
    lives = lives + 1;
    let finalEle = allTiles[finishTile].ele;
    finalEle.classList.remove('blink');
    finalEle.border = 'none'
    // selectedTiles = [];
    count = 1;
    setNewGrid();
    document.querySelector(`#group-${level}`).scrollIntoView({
      behavior: 'smooth'
    });

    return true;
  }
  return false;
}


function mixTile() {
  let clickedCoor = this.getAttribute('coor');
  let check = optionTiles.some(coor => coor === clickedCoor)
  if (check) {
    clearStyle(optionTiles, currentTile, true);
    selectedTiles.push(clickedCoor);
    let colorOne = allTiles[currentTile.coor].ele.getAttribute('colorId')
    if (checkColor) {
      currentColor = setFirstColor(colorOne);
      checkColor = false;
    }
    let colorTwo = this.getAttribute('colorId')

    // ADD COLOR RETURN MIXED RGB
    let rgb = addColor(colorTwo, count);
    let rgbStr = `rgb(${parseInt(rgb[0])}, ${parseInt(rgb[1])}, ${parseInt(rgb[2])})`
    count = count + 1
  

    // SET NEW COLOR & MARK NEXT OPTIONS
    this.style['background-color'] = rgbStr;

    // CHECK WIN or LOSE
    optionTiles.forEach(coor => {
      let oldOption = allTiles[coor].ele;
      if (coor !== currentTile) {
        oldOption.style.border = '1px solid black'
      } else {
        oldOption.style.border = 'none'
      }
    })
    if ( !checkWinLose(rgbStr) ) {
      currentTile = posObject(this.getAttribute('coor'));
      optionTiles = markOptions();

    }

  }
}





export function resetGrid() {
  let prev = document.querySelector(`#group-${level}`);
  prev.remove();
  createMixGrid();
  resetVariables();
  optionTiles = markOptions();
  // console.log('clicked')
  
}

function resetVariables() {
  currentTile = startTile;
  count = 1
  // path = selectedTiles;
  // selectedTiles = [startTile];
  selectedTiles = [currentTile.coor];
  let color = allTiles[currentTile.coor].ele.getAttribute('colorId');
  currentColor = setFirstColor(color);
  styleFinish(finishTile);
}


function markOptions() {
  let tile = allTiles[currentTile.coor];
  tile.ele.style['border-radius'] = '100%'
  return nextMoveOptions(true)
}

function nextMoveOptions(styleCheck) {
  let newOptionTiles = [];
  let tile = allTiles[currentTile.coor];

  Object.values(OPTIONS).forEach(pos => {
    let newX = pos.dir[0] + tile.x;
    let newY = pos.dir[1] + tile.y;
    let newCoor = `${newX}-${newY}`

    // SHOULD CREATE ARROW INSTEAD
    // let arrow = document.querySelector(`#${pos.name}`);
    let arrow = document.createElement('DIV');
    arrow.setAttribute('id', `${pos.name}`);
    arrow.setAttribute('class', 'arrow-icons')
    
    debugger
    if (newX <= 10 &&
      newX > 0 &&
      newY <= 10 &&
      newY > 0 &&
      !selectedTiles.includes(newCoor)) {
      if (!styleCheck) {
        newOptionTiles.push(newCoor);
      } else if (newCoor !== finishTile) {
        newOptionTiles.push(newCoor);
        let optionTile = allTiles[newCoor].ele;
        // [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let radiusStr = optionStyle(pos.dir);
        // let arrow = <i class="fas fa-caret-up"></i>
        optionTile.appendChild(arrow);
        arrow.style.display = 'flex'
        // arrow.style['color'] = targetColor;
        optionTile.style['border-radius'] = radiusStr;
        optionTile.style.border = 'none';
        // optionTile.style.border = '1px solid white'
      } else if (count === level && newCoor === finishTile) {
        clearStyle(newOptionTiles, currentTile);
        newOptionTiles = [newCoor];
        let optionTile = allTiles[newCoor].ele;
        optionTile.style.border = '2px solid black';

      }

    }
  });
  return newOptionTiles
}




