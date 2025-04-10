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
let imageScale = 1;
let cropSide = 0;

// Configurações fixas do canvas
const canvasSize = 1080;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Eventos de arraste
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

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

// Para mobile
canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDragging = true;
    startX = touch.clientX - rect.left - offsetX;
    startY = touch.clientY - rect.top - offsetY;
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches.length === 1) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    offsetX = touch.clientX - rect.left - startX;
    offsetY = touch.clientY - rect.top - startY;
    drawCanvas();
  }
});

canvas.addEventListener('touchend', () => {
  isDragging = false;
});

// Quando o usuário envia a imagem
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      userImage = img;
      cropSide = Math.min(img.width, img.height);
      offsetX = 0;
      offsetY = 0;
      drawCanvas();
      canvas.style.display = 'block';
      downloadBtn.disabled = false;
      downloadBtn.style.display = 'inline-block';
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Redesenha o canvas com a imagem posicionada + moldura
function drawCanvas() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  if (userImage) {
    // Desenha a imagem do usuário com corte central e posição customizada
    ctx.drawImage(
      userImage,
      (userImage.width - cropSide) / 2,
      (userImage.height - cropSide) / 2,
      cropSide,
      cropSide,
      offsetX,
      offsetY,
      canvasSize,
      canvasSize
    );
  }

  // Desenha a moldura por cima
  if (moldura.complete) {
    ctx.drawImage(moldura, 0, 0, canvasSize, canvasSize);
  } else {
    moldura.onload = () => {
      ctx.drawImage(moldura, 0, 0, canvasSize, canvasSize);
    };
  }
}

// Baixar imagem final
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'foto_campanha.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
