const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

async function startStreaming() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  localVideo.srcObject = stream;

  const ws = new WebSocket('wss://buttercup-sprinkle-dragonfruit.glitch.me');
  ws.binaryType = 'arraybuffer';

  ws.onopen = () => {
    console.log('Connected to server');
  };

  ws.onmessage = (event) => {
    const remoteStream = new MediaSource();
    remoteStream.addEventListener('sourceopen', () => {
      const sourceBuffer = remoteStream.addSourceBuffer('video/webm; codecs="vp8"');
      sourceBuffer.appendBuffer(event.data);
    });
    console.log(remoteVideo.src);
    remoteVideo.src = URL.createObjectURL(remoteStream);
  };

  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs="vp8"' });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      ws.send(event.data);
    }
  };

  mediaRecorder.start(100);
}

startStreaming();
