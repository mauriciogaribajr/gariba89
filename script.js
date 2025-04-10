const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');

const moldura = new Image();
moldura.src = 'moldura.png';

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Tamanho final desejado
      const outputSize = 1080;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Dimensões da imagem original
      const { width, height } = img;

      // Cálculo para cortar a imagem ao centro e manter aspecto
      const side = Math.min(width, height); // pega o menor lado
      const startX = (width - side) / 2;
      const startY = (height - side) / 2;

      // Limpa o canvas
      ctx.clearRect(0, 0, outputSize, outputSize);

      // Desenha a imagem recortada, redimensionada para 1080x1080
      ctx.drawImage(img, startX, startY, side, side, 0, 0
