const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const socket = new WebSocket('ws://buttercup-sprinkle-dragonfruit.glitch.me');

async function startVideoStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        localVideo.srcObject = stream;

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                socket.send(event.data);
            }
        };
        mediaRecorder.start(100); // Graba en fragmentos de 100 ms
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

startVideoStream();

socket.onmessage = (event) => {
    const videoBlob = new Blob([event.data], { type: 'video/webm' });
    remoteVideo.src = URL.createObjectURL(videoBlob);
};

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

socket.onclose = () => {
    console.log('Desconectado del servidor WebSocket');
};
