import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ1ODU0NDA3LCJzdWIiOiJkZWQ4NjMzMy04NTI3LTQwMWUtOTIyYi05MGM5NmMyOWU0OTF-U1RBR0lOR34wZWUzZmU3YS05NDE5LTRjOGItODhkZS0zNjMzYzdhZWQ0MGQifQ.wOlS9MrQnJRBO9vgmNK0kV09xG4cvMFspdjhErjqkmg', // 👈 poné tu token real
  });

  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  // liveRenderTarget.style.transform = 'scaleX(-1)';
  const captureButton = document.getElementById('captureBtn')!;
  //  const retryBtn = document.getElementById('shareBtn')!;
  const introScreen = document.getElementById('intro-screen')!;
const startButton = document.getElementById('startBtn')!;
captureButton.style.display = 'none';

startButton.addEventListener('click', () => {
  introScreen.style.display = 'none';
  captureButton.style.display = 'block';
});
  const resultSection = document.getElementById('result-section')!;
  const canvasWrapper = document.getElementById('canvas-wrapper')!;

 function resizeCanvas() {
  // const wrapperWidth = canvasWrapper.clientWidth;
  // const aspectRatio = 9 / 16;

  // const calculatedHeight = wrapperWidth / aspectRatio;

  // liveRenderTarget.style.width = wrapperWidth + 'px';
  // liveRenderTarget.style.height = calculatedHeight + 'px';

  // liveRenderTarget.width = 1080;   // Resolución interna
  // liveRenderTarget.height = 1920;
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

  captureButton.addEventListener('click', async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const imageData = liveRenderTarget.toDataURL('image/png');

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 1080;
    finalCanvas.height = 1920;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

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

    // ✂️ Ajuste estilo "cover"
    const aspectCanvas = finalCanvas.width / finalCanvas.height;
    const aspectPhoto = photo.width / photo.height;

    let sx = 0, sy = 0, sw = photo.width, sh = photo.height;

    if (aspectPhoto > aspectCanvas) {
      sw = photo.height * aspectCanvas;
      sx = (photo.width - sw) / 2;
    } else {
      sh = photo.width / aspectCanvas;
      sy = (photo.height - sh) / 2;
    }

    ctx.fillStyle = "#000"; // 👈 evita bordes blancos
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(photo, sx, sy, sw, sh, 0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(frame, 0, 0, finalCanvas.width, finalCanvas.height);

    const finalImageDataUrl = finalCanvas.toDataURL('image/png');

    // ✅ Mostrar resultado (más chico, pero sin modificar el canvas real)
    canvasWrapper.style.display = 'none';
    resultSection.innerHTML = `
      <div style="background-color:#2b2b2b; color:white; width:100%; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1rem; box-sizing:border-box;">

        <!-- Texto superior -->
        <div style="text-align:center; margin-bottom:1rem;">
          <div style="font-weight:bold; font-size:1rem;">LOGO OR BRANDS</div>
          <div style="font-size:0.9rem;">LOREM IPSUM<br/>LOREM LOREEM</div>
        </div>

        <!-- Contenedor imagen final reducida -->
        <div style="position:relative; width:100%; max-width:340px;">
          <img src="${finalImageDataUrl}" style="width:100%; display:block;" />

          <!-- Botones al pie (sobre imagen) -->
          <div style="position:absolute; bottom:16px; left:0; right:0; display:flex; justify-content:space-around; padding:0 1rem; z-index:10;">
            <button id="finalShareBtn" style="padding:0.5rem 1rem; font-size:14px; border:none; border-radius:20px; background:#fff; color:#222;">SHARE</button>
            <button id="retryBtn" style="padding:0.5rem 1rem; font-size:14px; border:none; border-radius:20px; background:#fff; color:#222;">TRY AGAIN</button>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const finalShareBtn = document.getElementById('finalShareBtn');
    finalShareBtn?.addEventListener('click', async () => {
      try {
        const response = await fetch(finalImageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'foto.png', {
          type: 'image/png',
          lastModified: Date.now(),
        });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: 'Mi Foto',
            text: '¡Mirá mi foto!',
            files: [file],
          });
        } else {
          alert('Tu navegador no permite compartir archivos.');
        }
      } catch (err) {
        console.error('Error al compartir:', err);
        alert('Ocurrió un error al compartir la foto.');
      }
    });

    const retryBtn = document.getElementById('retryBtn');
    retryBtn?.addEventListener('click', () => {
      resultSection.style.display = 'none';
      canvasWrapper.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });
})();