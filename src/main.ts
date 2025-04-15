
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
  
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ0NzM4NzYxLCJzdWIiOiI4OGQzMjc3NS03OTQwLTRkZGMtOTcyNS01ZDQ2N2NlOWI1MWR-U1RBR0lOR34zNDk1MDBhMS04ZDU0LTQ3YjctOWQ4ZC04MTdjZGMwZGM0ZmIifQ.sAlN1WVm_kUGlP7GpnWT3uauZtq8vq8L2ZuGc8dbFkY',
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
     '771b13a7-4034-43b2-a6a7-bb5f8ef5a756','f94eb3d0-bdd5-4d29-ba3c-306fb3d0fbe1'
   
  );

  await session.applyLens(lens);
})();