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
      const outputSize = 1080;
      canvas.width = outputSize;
      canvas.height = outputSize;

      const { width, height } = img;
      const side = Math.min(width, height);
      const startX = (width - side) / 2;
      const startY = (height - side) / 2;

      // Desenha imagem recortada
      ctx.clearRect(0, 0, outputSize, outputSize);
      ctx.drawImage(img, startX, startY, side, side, 0, 0, outputSize, outputSize);

      // Quando a moldura estiver pronta, desenha por cima e mostra preview
      const drawFinalImage = () => {
        ctx.drawImage(moldura, 0, 0, outputSize, outputSize);
        canvas.style.display = 'block';
        downloadBtn.disabled = false;
        downloadBtn.style.display = 'inline-block';
      };

      if (moldura.complete) {
        drawFinalImage();
      } else {
        moldura.onload = drawFinalImage;
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'foto_campanha.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
