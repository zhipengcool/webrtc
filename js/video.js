(async function () {
  let device = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  document.querySelector('video').srcObject = device
})();