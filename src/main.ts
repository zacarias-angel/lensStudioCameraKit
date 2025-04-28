
import { bootstrapCameraKit } from '@snap/camera-kit';
// import { createMediaStreamSource, Transform2D } from '@snap/camera-kit';
// (async function main() {
//   const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzM2MzkwMzc1LCJzdWIiOiI4MzU2YjM5Ni1mMTMyLTQ2MjItOTQwZi0zNWQ4ZTRlY2RiYmN-U1RBR0lOR35hZDg0OGMyNS0wNjQ2LTRmYTYtODQ4Yy04NWI5MGUyNzdhNzYifQ.ePlhaPrPCB18nWvg5MDkGJv4aj6yuJUzMMibI17xk5Q';
//   const cameraKit = await bootstrapCameraKit({ apiToken });
//   const canvas = document.getElementById('canvas') as HTMLCanvasElement;
//   const session = await cameraKit.createSession({ liveRenderTarget: canvas }) ;
//   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//   const source = createMediaStreamSource(stream, {
//   transform: Transform2D.MirrorX,
//   cameraType: 'user',
// });
// await session.setSource(source);
// const lens = await cameraKit.lensRepository.loadLens(
//   '107e6c4f-b2f6-4795-9060-3d5f8e9171ac',
//  'd4983d40-24a3-4a75-9928-4a207e79a27c'
// )
// await session.applyLens(lens);

// })();


// Using an existing canvas








// // Let Camera Kit create a new canvas, then append it to the DOM
// const canvasContainer = document.getElementById('canvas-container');
// const session = await cameraKit.createSession();
// canvasContainer.appendChild(session.output.live);

(async function () {
  const cameraKit = await bootstrapCameraKit({
  
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ1ODU0NDA3LCJzdWIiOiJkZWQ4NjMzMy04NTI3LTQwMWUtOTIyYi05MGM5NmMyOWU0OTF-U1RBR0lOR34wZWUzZmU3YS05NDE5LTRjOGItODhkZS0zNjMzYzdhZWQ0MGQifQ.wOlS9MrQnJRBO9vgmNK0kV09xG4cvMFspdjhErjqkmg',
  });
  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;

  // 1. Definimos la función de resize
  function resizeCanvas() {
    const width = liveRenderTarget.clientWidth;
    const height = (width / 9) * 16; // Mantener 9:16
    liveRenderTarget.width = width;
    liveRenderTarget.height = height;
  }
  
  // 2. Llamamos resizeCanvas() ANTES de iniciar sesión
  resizeCanvas();
  const session = await cameraKit.createSession({ liveRenderTarget });
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  await session.setSource(mediaStream);
  await session.play();

  const captureButton = document.getElementById('captureBtn')!;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const resultSection = document.getElementById('result-section')!;
const capturedImage = document.getElementById('captured-image') as HTMLImageElement;
const canvasWrapper = document.getElementById('canvas-wrapper')!;
const shareButton = document.createElement('button');

shareButton.textContent = '📤 Compartir Foto';
shareButton.style.marginTop = '16px';
shareButton.style.padding = '12px';
shareButton.style.fontSize = '18px';
shareButton.style.backgroundColor = '#28a745';
shareButton.style.color = 'white';
shareButton.style.border = 'none';
shareButton.style.borderRadius = '8px';
shareButton.style.cursor = 'pointer';
shareButton.style.display = 'none'; // Al inicio oculto
resultSection.appendChild(shareButton);

let finalImageDataUrl = '';

captureButton.addEventListener('click', function () {
  const imageData = canvas.toDataURL('image/png');

  const finalCanvas = document.createElement('canvas');
  const ctx = finalCanvas.getContext('2d')!;
  
  finalCanvas.width = 1080; // ejemplo de tamaño final
  finalCanvas.height = 1920; // 9:16

  const photo = new Image();
  photo.src = imageData;

  const frame = new Image();
  frame.src = '/frames/marco.webp';

  photo.onload = () => {
    ctx.drawImage(photo, 0, 0, finalCanvas.width, finalCanvas.height);

    frame.onload = () => {
      ctx.drawImage(frame, 0, 0, finalCanvas.width, finalCanvas.height);

      // Ahora tenés una imagen lista
      const finalImage = finalCanvas.toDataURL('image/png');
      capturedImage.src = finalImage;

      canvasWrapper.style.display = 'none';
      resultSection.style.display = 'flex';
    };
  };
});

// Ahora manejamos el compartir
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
  const lens = await cameraKit.lensRepository.loadLens(
     'f0c4c183-eabc-4ddd-bbeb-10cae4734b52','c2e781a8-be7f-48b9-b7e1-bf02923ab16d'
   
  );

  await session.applyLens(lens);
})();