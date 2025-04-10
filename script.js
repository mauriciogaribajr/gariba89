const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');

// Carrega a moldura
const moldura = new Image();
moldura.src = 'moldura.png';

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Define o tamanho do canvas baseado na imagem
      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Desenha a imagem do usuário
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Desenha a moldura por cima
      moldura.onload = () => {
        ctx.drawImage(moldura, 0, 0, width, height);
        canvas.style.display = 'block';
        downloadBtn.disabled = false;
      };

      // Se a moldura já estiver carregada, desenha imediatamente
      if (moldura.complete) {
        ctx.drawImage(moldura, 0, 0, width, height);
        canvas.style.display = 'block';
        downloadBtn.disabled = false;
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
