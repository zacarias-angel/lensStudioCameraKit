import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ1ODU0NDA3LCJzdWIiOiJkZWQ4NjMzMy04NTI3LTQwMWUtOTIyYi05MGM5NmMyOWU0OTF-U1RBR0lOR34wZWUzZmU3YS05NDE5LTRjOGItODhkZS0zNjMzYzdhZWQ0MGQifQ.wOlS9MrQnJRBO9vgmNK0kV09xG4cvMFspdjhErjqkmg', // 👈 poné tu token real
  });

  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  const captureButton = document.getElementById('captureBtn')!;
  const shareButton = document.getElementById('shareBtn')!;
  // const retryButton = document.getElementById('retryBtn')!;
  const resultSection = document.getElementById('result-section')!;
  const canvasWrapper = document.getElementById('canvas-wrapper')!;
  // const capturedImage = document.getElementById('captured-image') as HTMLImageElement
  // Resize canvas dinámico
  function resizeCanvas() {
    const width = liveRenderTarget.clientWidth;
    const height = (width / 9) * 16; // Mantener 9:16
    liveRenderTarget.width = width;
    liveRenderTarget.height = height;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const session = await cameraKit.createSession({ liveRenderTarget });
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  await session.setSource(mediaStream);
  await session.play();

  const lens = await cameraKit.lensRepository.loadLens(
    'f0c4c183-eabc-4ddd-bbeb-10cae4734b52',
    'c2e781a8-be7f-48b9-b7e1-bf02923ab16d'
  );
  await session.applyLens(lens);

  // Botón Compartir
  shareButton.textContent = '📤 Compartir Foto';
  shareButton.className = 'share-button';





  captureButton.addEventListener('click', async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const imageData = liveRenderTarget.toDataURL('image/png');

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = 1080;
  finalCanvas.height = 1920;
  const ctx = finalCanvas.getContext('2d');
if (!ctx) {
  console.error('No se pudo obtener el contexto del canvas.');
  return;
}

  const photo = new Image();
  const frame = new Image();

  const loadImage = (img: HTMLImageElement, src: string) => new Promise<void>(resolve => {
    img.onload = () => resolve();
    img.src = src;
  });

  await Promise.all([
    loadImage(photo, imageData),
    loadImage(frame, '/frames/marco.webp')
  ]);

  // 👉 Recortar la foto como "cover" (centrada y ajustada)
  const aspectRatioCanvas = finalCanvas.width / finalCanvas.height;
  const aspectRatioPhoto = photo.width / photo.height;
  let sx = 0, sy = 0, sw = photo.width, sh = photo.height;

  if (aspectRatioPhoto > aspectRatioCanvas) {
    sw = photo.height * aspectRatioCanvas;
    sx = (photo.width - sw) / 2;
  } else {
    sh = photo.width / aspectRatioCanvas;
    sy = (photo.height - sh) / 2;
  }

 const marcoX = 0;
const marcoY = 0;
const marcoAncho = finalCanvas.width;
const marcoAlto = finalCanvas.height;

// 👉 Ahora dibujar la foto **dentro** del marco
const marcoRatio = marcoAncho / marcoAlto;
const photoRatio = sw / sh;
let drawSX = sx, drawSY = sy, drawSW = sw, drawSH = sh;

if (photoRatio > marcoRatio) {
  drawSW = sh * marcoRatio;
  drawSX = sx + (sw - drawSW) / 2;
} else {
  drawSH = sw / marcoRatio;
  drawSY = sy + (sh - drawSH) / 2;
}

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

ctx.drawImage(photo, drawSX, drawSY, drawSW, drawSH, marcoX, marcoY, marcoAncho, marcoAlto);
ctx.drawImage(frame, marcoX, marcoY, marcoAncho, marcoAlto);

  const finalImageDataUrl = finalCanvas.toDataURL('image/png');

  // 👉 Mostrar resultado
  canvasWrapper.style.display = 'none';
resultSection.innerHTML = `
  <div style="background-color:#2b2b2b; color:white; width:100%; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1rem; box-sizing:border-box;">
    
    <!-- Texto superior -->
    <div style="text-align:center; margin-bottom:1rem;">
      <div style="font-weight:bold; font-size:1rem;">LOGO OR BRANDS</div>
      <div style="font-size:0.9rem;">LOREM IPSUM<br/>LOREM LOREEM</div>
    </div>

    <!-- Contenedor de imagen con botones -->
    <div id="result-container" style="position:relative; width:100%; max-width:360px;">
      <img src="${finalImageDataUrl}" style="width:100%; display:block;" />
      
      <!-- Botones sobre la imagen -->
      <div style="position:absolute; top:12px; left:0; right:0; display:flex; justify-content:space-around; padding:0 1rem; z-index:10;">
        <button id="finalShareBtn" style="padding:0.5rem 1rem; font-size:14px; border:none; border-radius:20px; background:#fff; color:#222;">SHARE</button>
        <button id="retryBtn" style="padding:0.5rem 1rem; font-size:14px; border:none; border-radius:20px; background:#fff; color:#222;">TRY AGAIN</button>
      </div>
    </div>
  </div>
`;
resultSection.style.display = 'flex';
document.body.style.overflow = 'hidden';

const finalShareBtn = document.getElementById('finalShareBtn');
if (finalShareBtn) {
  finalShareBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(finalImageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'foto.png', {
        type: 'image/png',
        lastModified: Date.now()
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Mi Foto',
          text: '¡Mirá mi foto!',
          files: [file]
        });
      } else {
        alert('Tu navegador no permite compartir archivos.');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
      alert('Ocurrió un error al compartir la foto.');
    }
  });
}

const retryBtn = document.getElementById('retryBtn');
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    resultSection.style.display = 'none';
    canvasWrapper.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
}
 
});


})();
