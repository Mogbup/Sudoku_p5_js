//--------------------------Задание переменных----------------------------------

//---------------------------------Фронт----------------------------------------

let grid = []; // судоку на экране массив 9Х9 из Cell
let cellw = 0; // размер ячейки
let currentCell; // текущая выбранная ячейка == Cell
let startButton; // кнопка сброса
let lessCells = 0; //количество оставшихся заполнить ячеек/сложность
let errors = 0; //количество ошибок

//----------------------------------Бэк-----------------------------------------

let full = []; //
let done = []; //

const DIFFICULTY = 55; //сложность судоку - чем больше число, тем сложнее
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

//--------------------------------Реализация------------------------------------

//---------------------------------Фронт----------------------------------------


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
                  '<span style="color: blue">• Выберите пустую ячейку.</span><br>' +
                  '<span style="color: grey">• Серые клетки не трогай - они тебе даны изначально.</span><br>' +
                  '<span style="color: black">• Удаление на 0.</span><br>' +
                  '<span style="color: red">• Красные клетки - то что ты не хочешь увидеть - это ошибки.</span>').
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
  errors = 0;
  firstSudocu();
  let num = Math.floor(Math.random()* DIFFICULTY + DIFFICULTY);
  for(let i = 0; i < num; i++){
    let func_num = Math.floor(Math.random()*5);
    switch (func_num){
      case 0 :
        change_a();
        break;
      case 1 :
        change_b();
        break;
      case 2 :
        change_c();
        break;
      case 3 :
        change_d();
        break;
      case 4 :
        change_e();
        break;
      default : break;
    }
  }
  deleter(lessCells);
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      grid[i][j].clear();
      grid[i][j].value = done[i][j];
      if(grid[i][j].value != 0){
        grid[i][j].block = true;
      }
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

  if((checkRows(i, j, v) && checkCols(i, j, v) && checkRect(i, j, v)) || v == 0){
    if (currentCell.value == 0){
      lessCells --;
    }
    currentCell.value = v;
    currentCell.sec = false;
    if (errors == 0 && lessCells == 0){
      for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
          grid[i][j].block = true;
        }
      }
      alert("Вы всё-таки смогли это решить!");
    }
  } else {
    currentCell.value = v;
    currentCell.sec = true;
  }
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

function Cell(i, j) { // объект ячейка
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

  this.backgroundColor = 255;

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

  this.clear = function(){
    noFill();
    this.value = 0;
    this.chosen = false;
    this.block = false;
    this.sec = false;
  }

  this.show = function() {
    noFill();

    if(this.chosen)
      fill(0, 180, 255); //голубой блок, выбранный изначально

    if(this.block)
      fill(225); // серый блок, заполненный изначально

    if(this.sec)
      fill(255, 155, 155); //красненький, неправильный блок

    rect(this.x, this.y, cellw, cellw);

    if(this.value > 0) {
      fill(0);
      text(this.value, this.x + cellw / 2, this.y + cellw / 1.5);
    }
  }
}

//----------------------------------Бэк-----------------------------------------

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

function deleter(a){ //удаление эл-тов судоку
  a = 0;
  for(let i = 0; i < 9; i++) {
    done[i] = [];
    for(let j = 0; j < 9; j++) {
      done[i][j] = full[i][j];
    }
  }
  for(let i = 0; i < 81; i++){
    if( Math.floor(Math.random() * 81) < DIFFICULTY){
      done[Math.floor(i / 9)][i % 9] = 0;
      a++;
    }
  }
  return a ;
}

function change_a(){ // транспонирование
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
  return;
}

function change_b(){ //смена двух строк
  let buf = [];
  for(let i = 0; i < 9; i++) {
    buf[i] = [];
    for(let j = 0; j < 9; j++) {
      buf [i][j] = full[i][j];
    }
  }
  let one = Math.floor(Math.random()*3);
  let two = Math.floor(Math.random()*3);
  if (one == 0){
    for(let j = 0; j < 9; j++) {
      full[two*3][j] = buf [two*3 + 1][j];
      full[two*3 + 1][j] = buf [two*3][j];
    }
  }
  if (one == 1){
    for(let j = 0; j < 9; j++) {
      full[two*3 + 1][j] = buf [two*3 + 2][j];
      full[two*3 + 2][j] = buf [two*3 + 1][j];
    }
  }
  if (one == 2){
    for(let j = 0; j < 9; j++) {
      full[two*3][j] = buf [two*3 + 2][j];
      full[two*3 + 2][j] = buf [two*3][j];
    }
  }
  return;
}

function change_c(){ //смена двух столбцов
  let buf = [];
  for(let i = 0; i < 9; i++) {
    buf[i] = [];
    for(let j = 0; j < 9; j++) {
      buf [i][j] = full[i][j];
    }
  }
  let one = Math.floor(Math.random()*3);
  let two = Math.floor(Math.random()*3);
  if (one == 0){
    for(let i = 0; i < 9; i++) {
      full[i][two*3] = buf [i][two*3 + 1];
      full[i][two*3 + 1] = buf [i][two*3];
    }
  }
  if (one == 1){
    for(let i = 0; i < 9; i++) {
      full[i][two*3 + 1] = buf [i][two*3 + 2];
      full[i][two*3 + 2] = buf [i][two*3 + 1];
    }
  }
  if (one == 2){
    for(let i = 0; i < 9; i++) {
      full[i][two*3] = buf [i][two*3 + 2];
      full[i][two*3 + 2] = buf [i][two*3];
    }
  }
  return;
}

function change_d(){ // смена строк по три
  let buf = [];
  for(let i = 0; i < 9; i++) {
    buf[i] = [];
    for(let j = 0; j < 9; j++) {
      buf [i][j] = full[i][j];
    }
  }
  let one = Math.floor(Math.random()*3);
  if (one == 0){
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 9; j++){
        full[i][j] = buf [i + 3][j];
        full[i + 3][j] = buf [i][j];
      }
    }
  }
  if (one == 1){
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 9; j++){
        full[i][j] = buf [i + 6][j];
        full[i + 6][j] = buf [i][j];
      }
    }
  }
  if (one == 2){
    for(let i = 3; i < 6; i++) {
      for(let j = 0; j < 9; j++){
        full[i][j] = buf [i + 3][j];
        full[i + 3][j] = buf [i][j];
      }
    }
  }
  return;
}

function change_e(){ // смена столбцов по три
  let buf = [];
  for(let i = 0; i < 9; i++) {
    buf[i] = [];
    for(let j = 0; j < 9; j++) {
      buf [i][j] = full[i][j];
    }
  }
  let one = Math.floor(Math.random()*3);
  if (one == 0){
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j<3; j++){
        full[i][j] = buf [i][j+3];
        full[i][j+3] = buf [i][j];
      }
    }
  }
  if (one == 1){
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j<3; j++){
        full[i][j] = buf [i][j+6];
        full[i][j+6] = buf [i][j];
      }
    }
  }
  if (one == 2){
    for(let i = 0; i < 9; i++) {
      for(let j = 3; j < 6; j++){
        full[i][j] = buf [i][j+3];
        full[i][j+3] = buf [i][j];
      }
    }
  }
  return;
}
