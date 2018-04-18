//фронт

let grid = []; // судоку на экране массив 9Х9 из Cell
let cellw = 0; // размер ячейки
let currentCell; // текущая выбранная ячейка == Cell
let startButton; // кнопка сброса
let lessCells = 0; //количество оставшихся заполнить ячеек/сложность

//бэк

let full = []; //
let done = []; //

const DIFFICULTY = 50; //сложность судоку - чем больше число, тем сложнее
/*
Учитывая что в судоку всего 81 ячейка, то принято, что необходимо минимум:
21 заполненная ячейка => 80 - максимальное, реальное для решения число.
Самым сложным считается:
|---+---+---|---+---+---|---+---+---|
| 8         |           |           |
|         3 | 6         |           |
|     7     |     9     | 2         |
|---+---+---|---+---+---|---+---+---|
|     5     |         7 |           |
|           |     4   5 | 7         |
|           | 1         |     3     |
|---+---+---|---+---+---|---+---+---|
|         1 |           |     6   8 |
|         8 | 5         |     1     |
|     9     |           | 4         |
|---+---+---|---+---+---|---+---+---|
*/

function setup() {
  cellw = floor((((windowWidth < windowHeight) ? windowWidth : windowHeight) - 20) / 12); //определяем размер ячейки
  lessCells = DIFFICULTY; //задаем сложность
  createCanvas(9 * cellw + 1, 9 * cellw + 1).
            parent('canv'); //выделяем поле под судоку
  textAlign(CENTER); //цифра будет по центру
  textSize(cellw / 2); //цифра бужет в половину высоты и это все для красоты
  for(let i = 0; i < 9; i++) {
    grid[i] = [] // задаём строчку для ячеек
    for(let j = 0; j < 9; j++) {
      grid[i][j] = new Cell(i, j); //заполняем её ячейками
      grid[i][j].getRect();
    }
  }

  startButton = createButton("Сгенерировать новый"). // объект кнопка
                  mousePressed(startSolving).
                  style('font-family', 'Arial').
                  style('border-radius', '8px').
                  style('font-size', '16px').
                  style('margin-right', '16px').
                  style('height', '70px').
                  parent('stbutton'); // id в html файле

  createElement('a', //объект текстовое поле
                  '<span style="color: blue">• Press a cell and click a number.</span><br>' +
                  '<span style="color: red">• Do not put same numbers in the same cell/row/column.</span><br>' +
                  '<span style="color: grey">• Grey cells are the BLOCK numbers.</span><br>' +
                  '<span style="color: green">• Green cells are the SECURE numbers.</span>').
                  style('font-size', '12px').
                  parent('txt'); // id в html файле
}

function draw() {
  background(255);
  strokeWeight(1);

  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      grid[i][j].show();
    }
  }
  drawLines();
}

function startSolving() {

  firstSudocu();

  a();

  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      grid[i][j].value = full[i][j];
    }
  }
}

function keyTyped() {
  if (key >= 0 && key <= 9) {
    typeNumber(key);
  }
}

function typeNumber(v) {
  if(!currentCell) return;
  let i = currentCell.i;
  let j = currentCell.j;

  if(isNaN(v))
    v = 0;

  if((checkRows(i, j, v) && checkCols(i, j, v) && checkRect(i, j, v)) || v == 0) {
    currentCell.value = v;
    currentCell.error = false;

    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        grid[i][j].checkSecure();
      }
    }
  } else {
    alert('Do not put same numbers in the same cell/row/column.');
  }


}

function checkCell() {
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if(grid[i][j].value != 0) continue;
      grid[i][j].checkSecure();

      if(grid[i][j].secure.length == 1) {
        grid[i][j].value = grid[i][j].secure[0];
        grid[i][j].sec = true;
        checkCell();
        return;
      }
    }
  }

  let count = 0, pi, pj;
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      let ni = grid[i][j].rectx;
      let nj = grid[i][j].recty;

      for(let n = 1; n <= 9; n++) {
        count = 0;
        pi = -1;
        pj = -1;

        for(let nis = ni; nis < (ni + 3); nis++) {
          for(let njs = nj; njs < (nj + 3); njs++) {
            if(grid[nis][njs].value > 0) continue;
            grid[nis][njs].checkSecure();

            //if(grid[nis][njs].secure.length < 2) continue;
            if(!grid[nis][njs].secure.includes(n)) continue;
            pi = nis;
            pj = njs;
            count++;
          }
        }

        if(count == 1) {
          grid[pi][pj].value = n;
          grid[pi][pj].sec = true;
          checkCell();
          return;
        }
      }
    }
  }

  return;
}

function checkRect(i, j, n) {
  let ni = grid[i][j].rectx;
  let nj = grid[i][j].recty;
  for(let nis = ni; nis < (ni + 3); nis++) {
    for(let njs = nj; njs < (nj + 3); njs++) {
      if(i == nis && j == njs) continue;

      if(grid[nis][njs].value == n)
        return false;
    }
  }
  return true;
}

function checkCols(i, j, n) {
  for(let nj = 0; nj < 9; nj++) {
    if(nj == j) continue;

    if(grid[i][nj].value == n)
      return false;
  }
  return true;
}

function checkRows(i, j, n) {
  for(let ni = 0; ni < 9; ni++) {
    if(ni == i) continue;

    if(grid[ni][j].value == n)
      return false;
  }
  return true;
}

function mousePressed() {
  if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return; //Вернуться, если промазал

  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      let x = grid[i][j].x;
      let y = grid[i][j].y;

      if(grid[i][j].error)
        grid[i][j].error = false;

      if(mouseX >= x && mouseX < x + cellw && mouseY >= y && mouseY < y + cellw) {
        currentCell = grid[i][j];
        currentCell.chosen = true;
      } else
        grid[i][j].chosen = false;
    }
  }
}

function drawLines() {
  strokeWeight(3);

  for(let l = 0; l <= 3; l++) {
    line(0, cellw * (l * 3), width, cellw * (l * 3));
    line(cellw * (l * 3), 0, cellw * (l * 3), height);
  }
}

function Cell(i, j) {
  this.i = i;
  this.j = j;

  this.x = j * cellw;
  this.y = i * cellw;

  this.rectx = 0;
  this.recty = 0;

  this.value = 0;
  this.chosen = false;
  this.block = false;
  this.sec = false;
  this.error = false;

  this.secure = [];

  this.getRect = function() {
    for(let ni = 0; ni < 9; ni += 3) {
      for(let nj = 0; nj < 9; nj += 3) {
        if(this.i >= ni && this.i < ni + 3 && this.j >= nj && this.j < nj + 3) {
          this.rectx = ni;
          this.recty = nj;
          return;
        }
      }
    }
  }

  this.checkSecure = function() {
    this.secure.splice(0, this.secure.length);
    if(this.value != 0) return;

    for(let n = 1; n <= 9; n++) {
      if(!(checkRows(this.i, this.j, n) && checkCols(this.i, this.j, n) && checkRect(this.i, this.j, n))) continue;
      this.secure.push(n);
    }
  }

  this.show = function() {
    noFill();

    if(this.chosen)
      fill(0, 180, 255);

    if(this.block)
      fill(150);

    if(this.sec)
      fill(0, 255, 80);

    if(this.error)
      fill(255, 0, 0);

    rect(this.x, this.y, cellw, cellw);

    if(this.value > 0) {
      fill(0);
      text(this.value, this.x + cellw / 2, this.y + cellw / 1.5);
    }
  }
}

//-----------Да наступит---------
//-------------Великая-----------
//------------Генерация----------

function firstSudocu(){
  for(let i = 0; i < 9; i++) {
    full[i] = [];
    for(let j = 0; j < 9; j++) {
      full[i][j] = (((i*3 + j) + Math.floor(i / 3))  % 9 ) +1;
    }
  }
}

function exchanger(){

}

function a(){ // транспонирование
  let buf = []
  for(let i = 0; i < 9; i++) {
    buf[i] = [];
    for(let j = 0; j < 9; j++) {
      buf [i][j] = full[i][j];
    }
  }
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      full[i][j] = buf [j][i];
    }
  }
}
