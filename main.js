const canvas = document.querySelector("#draw");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', (e) => {
  let data = ctx.getImageData(0,0,canvas.width,canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.putImageData(data,0,0);

  // fixes bug where line join changes after resize
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
});

ctx.strokeStyle = '#000000';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 10;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
  if(!isDrawing) return;

  // draw line from last position to new position
  ctx.beginPath()

  ctx.moveTo(lastX, lastY);

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', (e) => {
  isDrawing=true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => {isDrawing=false});
canvas.addEventListener('mouseout', () => {isDrawing=false});

const menu = document.querySelector("#menu");
const options = document.querySelectorAll("[data-key]");
const optionsArr = Array.prototype.slice.call(options);
menu.addEventListener('click', () => {
  optionsArr.map(option => option.classList.toggle("open"));
});

// save drawing to local fs 
const camera = document.querySelector("[data-key='3']");
camera.addEventListener('click', () => {
  var link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL()
  link.click();
});

// change colour between list of set colours 
const colour = document.querySelector("[data-key='2']");
colours = ['#000000', '#FF0000', '#00FF00', '#0000FF'];
let currentColour = 0;
colour.addEventListener('click', () => {
  currentColour++;
  if (currentColour >= colours.length) {
    currentColour = 0;
  }
  ctx.strokeStyle = colours[currentColour];

  // adds 40% transparency to current colour 
  colour.style.setProperty(`--currentColour`, colours[currentColour]+'66');
  colour.classList.add('pulse');
  setTimeout(() => { colour.classList.remove('pulse'); }, 1000) 
});

// change size between some set sizes 10-100
const size = document.querySelector("[data-key='1']");
const maxSize = 100;
let currentSize = 0;
size.addEventListener('click', () => {
  currentSize += 10;
  if (currentSize > maxSize) {
    currentSize = 0;
  }
  ctx.lineWidth = currentSize; 
});