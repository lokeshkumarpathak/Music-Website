const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('C:\Users\dell\OneDrive\Desktop\NIT Lab Sem 4\Project\Face-Detection-JavaScript-master\models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('C:\Users\dell\OneDrive\Desktop\NIT Lab Sem 4\Project\Face-Detection-JavaScript-master\models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('C:\Users\dell\OneDrive\Desktop\NIT Lab Sem 4\Project\Face-Detection-JavaScript-master\models'),
  faceapi.nets.faceExpressionNet.loadFromUri('C:\Users\dell\OneDrive\Desktop\NIT Lab Sem 4\Project\Face-Detection-JavaScript-master\models')
]).then(startVideo)

function startVideo() {
  console.log("hi");
  let video=document.getElementById("video");
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video:true}).then(function(s){
            video.srcObject=s;
        })
        .catch(function(err){
            console.log(err);
        });
    }
    else{
        console.log("No");
    }
}

video.addEventListener('play', () => {
  console.log("Hello");
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    // Capture different emotions
    resizedDetections.forEach(result => {
      const { expressions } = result
      let emotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b)
      console.log('Emotion:', emotion)
    })
  }, 100)
})
