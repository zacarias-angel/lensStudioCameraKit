import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ1ODU0NDA3LCJzdWIiOiJkZWQ4NjMzMy04NTI3LTQwMWUtOTIyYi05MGM5NmMyOWU0OTF-U1RBR0lOR34wZWUzZmU3YS05NDE5LTRjOGItODhkZS0zNjMzYzdhZWQ0MGQifQ.wOlS9MrQnJRBO9vgmNK0kV09xG4cvMFspdjhErjqkmg', // 👈 poné tu token real
  });

  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  const captureButton = document.getElementById('captureBtn')!;
  const resultSection = document.getElementById('result-section')!;
  const capturedImage = document.getElementById('captured-image') as HTMLImageElement;
  const canvasWrapper = document.getElementById('canvas-wrapper')!;
  const shareButton = document.createElement('button');

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
  shareButton.style.display = 'none'; // oculto al principio
  resultSection.appendChild(shareButton);

  let finalImageDataUrl = '';

  // Capturar foto
  captureButton.addEventListener('click', async () => {
    const imageData = liveRenderTarget.toDataURL('image/png');

    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d')!;
    finalCanvas.width = 1080;
    finalCanvas.height = 1920;

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
      loadImage(frame, '/frames/marco.webp') // Tu marco debe estar en /public/frames/marco.webp
    ]);

    ctx.drawImage(photo, 0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(frame, 0, 0, finalCanvas.width, finalCanvas.height);

    finalImageDataUrl = finalCanvas.toDataURL('image/png');
    capturedImage.src = finalImageDataUrl;

    canvasWrapper.style.display = 'none';
    resultSection.style.display = 'flex';
    shareButton.style.display = 'block';
  });

  // Compartir imagen
  shareButton.addEventListener('click', async () => {
    if (!finalImageDataUrl) return;

    if (navigator.canShare && navigator.canShare({ files: [] })) {
      try {
        const res = await fetch(finalImageDataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'foto-con-marco.png', { type: 'image/png' });

        await navigator.share({
          files: [file],
          title: 'Mi foto con marco',
          text: '¡Mirá esta foto!',
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      console.log('Compartir no soportado en este navegador.');
    }
  });
})();
