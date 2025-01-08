import { bootstrapCameraKit } from "@snap/camera-kit";
( async function () {
  const camerakit = await bootstrapCameraKit({
    apiToken:"eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzM2MzU3NDU1LCJzdWIiOiI1MTU2OGUxNi1mYWFjLTQ2M2MtYmQ2Yi1mMDUzZmVhYTY1MjR-U1RBR0lOR35lNmVlNGI5Ny03YWJiLTRlMTMtOTVlMi1jNGJlMmZlOThlZTEifQ.qRqpBtBlwgcarhSGpkMA9MYiqLspBAy8D2i2yJhGIWI"
  })
  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
const session = await camerakit.createSession({liveRenderTarget});
const meiaStream = await navigator.mediaDevices.getUserMedia({
  video:{
    facingMode:'user'
  }
})
await session.setSource(meiaStream);
await session.play();
const lens = await camerakit.lensRepository.loadLens("fd13e5c0-c233-4dc1-b826-1a51eda48f51","8fa188a6-d070-4f7d-9fd0-154189e21dee")
  session.applyLens(lens)
})