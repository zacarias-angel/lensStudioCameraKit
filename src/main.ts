import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ1ODU0NDA3LCJzdWIiOiJkZWQ4NjMzMy04NTI3LTQwMWUtOTIyYi05MGM5NmMyOWU0OTF-U1RBR0lOR34wZWUzZmU3YS05NDE5LTRjOGItODhkZS0zNjMzYzdhZWQ0MGQifQ.wOlS9MrQnJRBO9vgmNK0kV09xG4cvMFspdjhErjqkmg', // 👈 poné tu token real
  });

  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  const captureButton = document.getElementById('captureBtn')!;
const shareButton = document.getElementById('shareBtn')!;
const retryButton = document.getElementById('retryBtn')!;
const resultSection = document.getElementById('result-section')!;
const canvasWrapper = document.getElementById('canvas-wrapper')!;
const capturedImage = document.getElementById('captured-image') as HTMLImageElement
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
 
  

  let finalImageDataUrl = '';


  captureButton.addEventListener('click', async () => {
  // ⏱️ Esperar un poco (por si el Lens necesita actualizar)
  await new Promise(resolve => setTimeout(resolve, 300));

  // 📸 Capturar imagen desde el canvas de preview
  const imageData = liveRenderTarget.toDataURL('image/png');

  // Crear canvas con dimensiones dinámicas
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = liveRenderTarget.width;
  finalCanvas.height = liveRenderTarget.height;
  const ctx = finalCanvas.getContext('2d')!;

  // Cargar imagen capturada y marco
  const photo = new Image();
  const frame = new Image();

  const loadImage = (img: HTMLImageElement, src: string) => {
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = src;
    });
  };

  await Promise.all([
    loadImage(photo, imageData),
    loadImage(frame, '/frames/marco.webp')
  ]);

  // Dibujar la imagen de fondo
  ctx.drawImage(photo, 0, 0, finalCanvas.width, finalCanvas.height);

  // 🔲 Dibujar el marco centrado (por ejemplo, que ocupe 80% del ancho)
  const marcoAncho = finalCanvas.width * 0.8;
  const marcoAlto = marcoAncho * (frame.height / frame.width); // mantener proporción
  const marcoX = (finalCanvas.width - marcoAncho) / 2;
  const marcoY = (finalCanvas.height - marcoAlto) / 2;
  ctx.drawImage(frame, marcoX, marcoY, marcoAncho, marcoAlto);

  // Guardar imagen final
  finalImageDataUrl = finalCanvas.toDataURL('image/png');
  capturedImage.src = finalImageDataUrl;

  // Mostrar resultado y ocultar cámara
  canvasWrapper.style.display = 'none';
  resultSection.innerHTML = `
    <div style="text-align:center; padding: 1rem;">
      <p style="margin: 0 0 1rem 0; font-size: 18px;">📄 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <img id="captured-image" src="${finalImageDataUrl}" style="max-width: 100%; border-radius: 8px;" />
      <div style="margin-top: 1rem; display: flex; justify-content: center; gap: 1rem;">
  <button id="retryBtn" style="padding: 0.5rem 1rem; font-size: 16px;">🔁 Volver a Tomar</button>
  <button id="shareBtn" style="padding: 0.5rem 1rem; font-size: 16px;">📤 Compartir Foto</button>
</div>
    </div>
  `;
  resultSection.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Reasignar botones porque los reemplazamos con innerHTML
  document.getElementById('retryBtn')!.addEventListener('click', () => {
    resultSection.style.display = 'none';
    canvasWrapper.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  document.getElementById('shareBtn')!.addEventListener('click', async () => {
    if (!finalImageDataUrl) return;
    try {
      const res = await fetch(finalImageDataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'foto-con-marco.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mi foto con marco',
          text: '¡Mirá esta foto!',
        });
      } else {
        alert('Compartir no es soportado.');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  });
});

  retryButton.addEventListener('click', () => {
    resultSection.style.display = 'none';
    canvasWrapper.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
})();
