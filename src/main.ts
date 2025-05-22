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

  const marcoAncho = finalCanvas.width * 0.8;
const marcoAlto = marcoAncho * (frame.height / frame.width);
const marcoX = (finalCanvas.width - marcoAncho) / 2;
const marcoY = (finalCanvas.height - marcoAlto) / 2;

// 👉 Ahora dibujar la foto **dentro** del marco
ctx.drawImage(photo, sx, sy, sw, sh, marcoX, marcoY, marcoAncho, marcoAlto);

// 👉 Luego el marco encima
ctx.drawImage(frame, marcoX, marcoY, marcoAncho, marcoAlto);

  const finalImageDataUrl = finalCanvas.toDataURL('image/png');

  // 👉 Mostrar resultado
  canvasWrapper.style.display = 'none';
  resultSection.innerHTML = `
    <div style="background-color:#222; color:white; width:100%; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem 1rem; box-sizing:border-box;">

      <h2 style="margin:0; font-weight:bold; font-size:18px;">LOGO OR BRANDS</h2>
      <p style="margin:0.5rem 0 1rem 0; text-align:center; font-size:1.1rem;">
        LOREM IPSUM<br/>LOREM LOREEM
      </p>
      <div style="background-color:#eee; padding:1rem; border-radius:8px;">
        <img src="${finalImageDataUrl}" style="width:300px; max-width:100%; border-radius:6px;" />
      </div>
      <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1.5rem; width:100%; max-width:300px;">
        <button id="shareBtn" style="padding:0.75rem; font-size:16px; border:none; border-radius:20px; background-color:white; color:#222;">SHARE</button>
        <button id="retryBtn" style="padding:0.75rem; font-size:16px; border:none; border-radius:20px; background-color:white; color:#222;">TRY AGAIN</button>
      </div>
      
    </div>
  `;
  resultSection.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Reasignar eventos a botones
  const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    // tu lógica de compartir
  });
}

const retryBtn = document.getElementById('retryBtn');
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    resultSection.style.display = 'none';
    canvasWrapper.style.display = 'block';
   document.body.style.overflow = 'auto';
  });
}

 
});


})();
