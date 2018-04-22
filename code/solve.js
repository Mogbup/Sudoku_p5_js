//Прикладная Теория Цифровых автоматов
//Начало разработки - 17.04.2018
//
//Мотичев Михаил ИУ6-42
//Вариант 18
//Задача: Судоку
//
//==========================Задание переменных==================================

//-------------------------------Интерфейс--------------------------------------

let grid = []; // судоку на экране массив 9Х9 из Cell
let cellw = 0; // размер ячейки
let genButton; // кнопка сброса
let texting;

//---------------------Решение судоку пользователем-----------------------------

let currentCell; // текущая выбранная ячейка == Cell
let lessCells = 0; //количество оставшихся заполнить ячеек/сложность
let errors = 0; //количество ошибок

//---------------------------Генерация судоку-----------------------------------

let full = []; //
let done = []; //

const DIFFICULTY = 45; //сложность судоку - чем больше число, тем сложнее
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

//================================Реализация====================================

//-------------------------------Интерфейс--------------------------------------

function setup() {
  cellw = floor((((windowWidth < windowHeight) ? windowWidth : windowHeight) - 20) / 12); //определяем размер ячейки
  createCanvas(9 * cellw + 1, 9 * cellw + 1).
            parent('canv'); //выделяем поле под судоку
  textAlign(CENTER); //цифра будет по центру
  textSize(cellw / 2); //цифра бужет в половину высоты и это все для красоты
  for(let i = 0; i < 9; i++) {
    grid[i] = [] // задаём строчку для ячеек
    for(let j = 0; j < 9; j++) {
      grid[i][j] = new Cell(i, j); //заполняем её ячейками
      grid[i][j].getRect(); // присваиваем ячейкам их координаты квадратов 3х3
    }
  }

  genButton = createButton("Сгенерировать новый"). // объект кнопка
    mousePressed(Generate).
    style('height', '70px'). // повыше
    style('border-radius', '4px'). // закруглим
    style('font-family', 'Helvetica').
    style('font-size', '16px').
    parent('genbut'); // id в html файле

  texting = createElement('pravila', //объект текстовое поле
    '<span style="color: blue">• Выберите пустую ячейку.</span><br>' +
    '<span style="color: grey">• Серые клетки не трогай - они тебе даны изначально.</span><br>' +
    '<span style="color: black">• Удаление на 0.</span><br>' +
    '<span style="color: red">• Красные клетки - то что ты не хочешь увидеть - это ошибки.</span>').
    style('font-size', '14px').
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
  drawLines(); // нарисуем линии потолще для квадратов 3х3
}

function Generate() {
  errors = 0;
  firstSudocu();
  myShuffle();
  deleter();
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      grid[i][j].clear();
      grid[i][j].value = done[i][j];
      if(grid[i][j].value != 0){
        grid[i][j].block = true;
      }
    }
  }
  console.log("les - " + lessCells);
  console.log('er - ' + errors);
}

//---------------------Решение судоку пользователем-----------------------------

function keyTyped() { // отработка нажатия цифры 0 ... 9
  if ((key >= 0 && key <= 9) ) {
    typeNumber(key); // набрать число
  }
  console.log("les - " + lessCells);
  console.log('er - ' + errors);
}

function typeNumber(v) {
  if(!currentCell || currentCell.block == true) return; // если ячейка задана изначально - выходим
  let i = currentCell.i; // берём номер строки ячейки
  let j = currentCell.j; // берём номер столбца ячейки

  if(((checkRows(i, j, v) && checkCols(i, j, v) && checkRect(i, j, v)) || v == 0)  ){
    if (currentCell.value == 0 && v != 0){
      lessCells = lessCells - 1;
    }
    if (currentCell.value != 0 && v == 0){
      lessCells ++;
    }
    if (currentCell.error == true){
      errors = errors - 1;
    }
    currentCell.value = v;
    currentCell.error = false;
    if (errors == 0 && lessCells == 0){
      for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
          grid[i][j].block = true;
        }
      }
      alert("Вы всё-таки смогли это решить!");
    }
  } else {
    if (currentCell.error == false){
      errors ++;
      if (currentCell.value == 0){
        lessCells = lessCells -1;
      }
    }
    currentCell.value = v;
    currentCell.error = true;
  }
}

function checkRect(i, j, n) { // проверяем в квадрате 3х3
  let ni = grid[i][j].rectx;
  let nj = grid[i][j].recty;
  for(let nis = ni; nis < (ni + 3); nis++) {
    for(let njs = nj; njs < (nj + 3); njs++) {
      if(i == nis && j == njs) continue; // обходим нашу ячейку

      if(grid[nis][njs].value == n) // если есть совпадение, то
        return false; // выходим с ошибкой
    }
  }
  return true;
}

function checkCols(i, j, n) { // проверка по столбцу
  for(let nj = 0; nj < 9; nj++) {
    if(nj == j) continue; // обходим нашу ячейку

    if(grid[i][nj].value == n) // если есть совпадение, то
      return false; // выходим с ошибкой
  }
  return true; // раз дошли - то все верно
}

function checkRows(i, j, n) { // проверка по строке
  for(let ni = 0; ni < 9; ni++) {
    if(ni == i) continue; // обходим нашу ячейку

    if(grid[ni][j].value == n) // если есть совпадение, то
      return false; // выходим с ошибкой
  }
  return true; // раз дошли - то все верно
}

function mousePressed() { // нажатие мышкой
  if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return; //Вернуться, если промазал по всему

  for(let i = 0; i < 9; i++) { // в цикле перебираем
    for(let j = 0; j < 9; j++) { // куда мы попали
      let x = grid[i][j].x; // начало каждой ячейки по х
      let y = grid[i][j].y; // и по у

      if(mouseX >= x && mouseX < x + cellw && mouseY >= y && mouseY < y + cellw) { // если попали в проверяемую ячейку
        currentCell = grid[i][j]; // задаем  выбранную ячейку текущей
        currentCell.chosen = true; // текущая ячека выбрана (изменён цвет)
      } else
        grid[i][j].chosen = false; // если промазали, то оставляем цвет белым (заодно очищается на белый цвет предыдщая ячейка)
    }
  }
}

function drawLines() { // рисуем сетку 3х3 более толстыми линиями
  strokeWeight(3); //толщина 3

  for(let l = 0; l <= 3; l++) {
    line(0, cellw * (l * 3), width, cellw * (l * 3));
    line(cellw * (l * 3), 0, cellw * (l * 3), height);
  }
}

function Cell(i, j) { // объект ячейка
  this.i = i; // номер строки
  this.j = j; // номер столбца

  this.x = j * cellw; // координата начала ячейки по х
  this.y = i * cellw; // координата ячейки по у

  this.rectx = 0; // координата х квадрата ячейки
  this.recty = 0; // координата у квадрата ячейки

  this.value = 0; // число  в ячейке
  this.chosen = false; // выбрана ли ячейка
  this.block = false; // была ли ячейка заранее задана
  this.error = false; // поставлена ли ошибка

  this.backgroundColor = 255; // цвет экрана

  this.getRect = function() { // задание координат квадрата каждой ячейки
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

  this.clear = function(){ // очищение от выбранной + ошибочной + заранее заданной (вызывается при генерации нового)
    noFill();
    this.value = 0;
    this.chosen = false;
    this.block = false;
    this.error = false;
  }

  this.show = function() { // показ ячейки (её цвет, )
    noFill();

    if(this.block)
      fill(225); // серый блок, заполненный изначально

    if(this.error)
      fill(255, 155, 155); // красненький, неправильный блок

    if(this.chosen)
      fill(0, 180, 255); // голубой блок, выбранный изначально

    if(this.block && this.chosen) // тёмно серый, выбран заполненный изначально
      fill(175);

    if(this.chosen && this.error) // тёмно красненький, выбран неправильный блок
      fill(255, 125, 125);

    rect(this.x, this.y, cellw, cellw); // рисуем границы ячейки !

    if(this.value > 0) { // пишем в неё поставленное число
      fill(0);
      text(this.value, this.x + cellw / 2, this.y + cellw / 1.5);
    }
  }
}

//----------------------------------Бэк-----------------------------------------

//-----------Да наступит---------
//-------------Великая-----------
//------------Генерация----------

/*
Разобьём всё на пункты - как будет задаваться судоку:
1)  Зададим простейший судоку
    Выглядит он вот так:
      |---+---+---|---+---+---|---+---+---|
      | 1   2   3 | 4   5   6 | 7   8   9 |
      | 4   5   6 | 7   8   9 | 1   2   3 |
      | 7   8   9 | 1   2   3 | 4   5   6 |
      |---+---+---|---+---+---|---+---+---|
      | 2   3   4 | 5   6   7 | 8   9   1 |
      | 5   6   7 | 8   9   1 | 2   3   4 |
      | 8   9   1 | 2   3   4 | 5   6   7 |
      |---+---+---|---+---+---|---+---+---|
      | 3   4   5 | 6   7   8 | 9   1   2 |
      | 6   7   8 | 9   1   2 | 3   4   5 |
      | 9   1   2 | 2   4   5 | 6   7   8 |
      |---+---+---|---+---+---|---+---+---|
    Его плюс в том, что его можно задать в одну строчку
    -!- смотри функцию: function firstSudocu(); -!-

2)  Перемешаем его используя логические понятия линейной алгебры о матрицах:
    Судоку останется правильным при следующих перестановках:
      1. Транспонировании -!- function a(); -!-
*/

function firstSudocu(){ // задаём простейший судоку
  for(let i = 0; i < 9; i++) {
    full[i] = [];
    for(let j = 0; j < 9; j++) {
      full[i][j] = (((i*3 + j) + Math.floor(i / 3))  % 9 ) +1; // вот и формула
    }
  }
}

function myShuffle(){
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

function deleter(){ //удаление эл-тов судоку
  lessCells = 0;
  for(let i = 0; i < 9; i++) {
    done[i] = [];
    for(let j = 0; j < 9; j++) {
      done[i][j] = full[i][j];
    }
  }
  for(let i = 0; i < 81; i++){
    if( Math.floor(Math.random() * 81) < DIFFICULTY){
      done[Math.floor(i / 9)][i % 9] = 0;
      lessCells++;
    }
  }
  return;
}
