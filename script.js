const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');

const moldura = new Image();
moldura.src = 'moldura.png';

let userImage = null;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let startX, startY;
let scale = 1;
let lastScale = 1;
let imgWidth, imgHeight;

// Configurações do canvas
const canvasSize = 1080;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Drag com mouse
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.offsetX - offsetX;
  startY = e.offsetY - offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    offsetX = e.offsetX - startX;
    offsetY = e.offsetY - startY;
    drawCanvas();
  }
});

canvas.addEventListener('mouseup', () => isDragging = false
