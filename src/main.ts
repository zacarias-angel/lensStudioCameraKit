
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
  
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ1ODU0NDA3LCJzdWIiOiJkZWQ4NjMzMy04NTI3LTQwMWUtOTIyYi05MGM5NmMyOWU0OTF-UFJPRFVDVElPTn45OGIzOTg1NS0yMDZiLTQwNDItYTExYS02NTFhN2Q3YWYwZWUifQ.H-ZoSNJFBnv-MrQyBgAaiwAori7N4LpIHw-HIf2efDM',
  });
  const liveRenderTarget = document.getElementById(
    'canvas'
  ) as HTMLCanvasElement;
  const session = await cameraKit.createSession({ liveRenderTarget });
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  await session.setSource(mediaStream);
  await session.play();

  const lens = await cameraKit.lensRepository.loadLens(
     'f0c4c183-eabc-4ddd-bbeb-10cae4734b52','c2e781a8-be7f-48b9-b7e1-bf02923ab16d'
   
  );

  await session.applyLens(lens);
})();