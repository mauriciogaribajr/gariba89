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

canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

// Zoom com scroll (mouse)
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY < 0 ? 0.05 : -0.05;
  scale = Math.min(Math.max(0.1, scale + delta), 4);
  drawCanvas();
});

// Toque (drag e pinch zoom no mobile)
let lastTouchDistance = null;

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDragging = true;
    startX = touch.clientX - rect.left - offsetX;
    startY = touch.clientY - rect.top - offsetY;
  } else if (e.touches.length === 2) {
    lastTouchDistance = getTouchDistance(e.touches);
    lastScale = scale;
  }
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    offsetX = touch.clientX - rect.left - startX;
    offsetY = touch.clientY - rect.top - startY;
    drawCanvas();
  } else if (e.touches.length === 2) {
    const newDistance = getTouchDistance(e.touches);
    const scaleChange = newDistance / lastTouchDistance;
    scale = Math.min(Math.max(0.1, lastScale * scaleChange), 4);
    drawCanvas();
  }
});

canvas.addEventListener('touchend', () => {
  isDragging = false;
  lastTouchDistance = null;
});

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Carrega a imagem do usuário
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      userImage = img;
      imgWidth = img.width;
      imgHeight = img.height;
      scale = 1;
      offsetX = (canvasSize - imgWidth * scale) / 2;
      offsetY = (canvasSize - imgHeight * scale) / 2;
      drawCanvas();
      canvas.style.display = 'block';
      downloadBtn.disabled = false;
      downloadBtn.style.display = 'inline-block';
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Desenha tudo no canvas
function drawCanvas() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  if (userImage) {
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    ctx.drawImage(userImage, offsetX, offsetY, drawWidth, drawHeight);
  }

  if (moldura.complete) {
    ctx.drawImage(moldura, 0, 0, canvasSize, canvasSize);
  } else {
    moldura.onload = () => {
      ctx.drawImage(moldura, 0, 0, canvasSize, canvasSize);
    };
  }
}

// Baixa imagem final
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'foto_campanha.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
