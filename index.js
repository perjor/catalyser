// HTML Elements
const root = document.getElementById('root');
const infoBox = document.getElementById('catalyser-info');
const statusBox = document.getElementById('catalyser-status');
const testingButton = document.getElementById('testingButton');
const uploadButton = document.getElementById('uploadButton');
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const imageUploaded = document.getElementById('imageUploaded');

// Global Variables
let webcamActive = false;

// Training Data
let trainingData = [];
const trainingObject = [
  {
    name: 'tailUp',
    label: 'Tail Up',
    size: 27,
  },
  {
    name: 'tailFlat',
    label: 'Tail Flat',
    size: 21,
  },
  {
    name: 'tailBody',
    label: 'Tail Body',
    size: 13,
  },
];

// Testing Data
const testingObject = [
 
  {
    name: 'tailUp',
    label: 'Tail Up',
    size: 4,
  },
  {
    name: 'tailFlat',
    label: 'Tail Flat',
    size: 4,
  },
  {
    name: 'tailBody',
    label: 'Tail Body',
    size: 4,
  },
];

// Setup Mobilenet
function countLabels(array) {
  const labels = new Set([]);
  array.forEach(arr => {
    labels.add(arr.label)
  })
  return labels.size;
}

const configMobilenet = {   
  version: 1,
  alpha: 0,
  topk: 3,
  learningRate: 0.0001,
  hiddenUnits: 100,
  epochs: 120,
  numClasses: countLabels(trainingObject),
  batchSize: 0.4,
};

let features;
let classifier;

// Adds all images to the DOM and returns an array
const insertImageSetIntoTheDom = async (url, size, render = true) => {
  if (render) {
    let title = document.createElement("h2")
    title.innerHTML = url;
    root.appendChild(title);
  }
  
  const array = [];
  // Loop through all images and add to Array
  for (let i = 1; i <= size; i++) {
    await new Promise((resolve, reject) => {
      let img = document.createElement("img")
      img.src = `./images/${url}${i}.jpg`;
      img.className = 'tail';
      img.async = true;
      // if render is true, render the images on the HTML
      if (render) {
        const div = document.createElement("div");
        div.id = `${url}${i}`;
        div.className = 'tailContainer'
        div.appendChild(img);
        root.appendChild(div);
      }
      img.addEventListener('load', (e) => {
        statusBox.innerHTML = `Inserting ${url}${i}`;
        resolve('done');
      })
      array.push(img);
    });
  }
  // The array returned is used by the image classifier
  return array;
}

const insertMultipleSetsIntoTheDom = async (dataObject, folder = '/', render = true) => {
  const array = [];

  for (const set of dataObject) {
    const setElement = await insertImageSetIntoTheDom(`${folder}${set.name}`, set.size, render);
    array.push(setElement);
  }

  return array;
}

// This adds a set of images to the classifier and calls the startTraining when done
const addSetToClassifier = async (array, label, cb) => {
  console.log(`Adding ${array.length}x ${label} to classifier`);
  statusBox.innerHTML = '';
  array.forEach((image, i) => {
    if (array.length - 1 !== i) {
      classifier.addImage(image, label);
    } else {
      classifier.addImage(image, label, cb);
    }
  });
}

// This trains the classifier
const startTraining = async () => {
  infoBox.innerHTML = 'Training the Machine Learning Algorithm: ';
  const res = await classifier.train((lossRate) => {statusBox.innerHTML = lossRate;
  });
  activateButtons();
}

function activateButtons() {
  infoBox.innerHTML = 'Done training!';
  testingButton.removeAttribute('disabled');
  testingButton.className = 'btn'; 
  uploadButton.removeAttribute('disabled');
  uploadButton.className = 'btn';
  webcamButton.removeAttribute('disabled');
  webcamButton.className = 'btn';
}

const startTesting = async () => {
  // Add Test Data to the DOM
  infoBox.innerHTML = 'Loading in test data..';
  const testingData = await insertMultipleSetsIntoTheDom(testingObject, 'testing/');
  
  // Test the Data
  infoBox.innerHTML = 'Performing the tests..';
  testingData.forEach( (imageSet, i) => {
    testAllImagesInASet(imageSet, testingObject[i]);
  });
  infoBox.innerHTML = 'Done testing!';
  statusBox.innerHTML = '';
  testingButton.remove();
}

function startWebcam() {
  if (webcamVideo.style.display === 'inline-block') {
    closeWebcam();
    return false;
  }
  webcamButton.innerHTML = 'Stop the webcam';  
  imageUploaded.src = '';
  imageUploaded.style.display = 'none';

  const idealWidth = window.innerWidth - 20;
  const idealHeight = window.innerHeight;

  const constraints = {
    width: {ideal: idealWidth},
    height: {ideal: idealHeight},
    facingMode: 'environment', // Rear-facing camera if available
  };

  // Need to set dimensions explicitly on the video element for tensorflow
  // (https://github.com/tensorflow/tfjs/issues/322)
  webcamVideo.width = idealWidth;
  webcamVideo.height = idealHeight;

  // If device doesn't support webcam, exit
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    webcamButton.innerHTML = 'Webcam not supported';
    return false;
  }

  navigator.mediaDevices.getUserMedia({ audio: false, video: constraints })
  .then(stream => {
  console.log('Opened webcam');

    if ('srcObject' in webcamVideo) {
      webcamVideo.srcObject = stream;
    } else {
      webcamVideo.src = window.URL.createObjectURL(stream);
    }
    webcamVideo.style.display = 'inline-block';
    webcamActive = true;
  })
  .catch(err => console.log("getUserMedia error", err))
}

function closeWebcam() {
  console.log('Closed webcam');
  webcamActive = false;
  webcamVideo.style.display = 'none';
  webcamButton.innerHTML = 'Use the webcam';
  const track = webcamVideo.srcObject.getTracks()[0];
  track.stop();
  infoBox.innerHTML = 'Closed the webcam';
}

function takePictureWithWebcam() {
  classifier.classify(webcamVideo, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      infoBox.innerHTML = res;
    }
  });
}

function startUpload(file) {
  uploadButton.innerHTML = 'Processing Image';
  const reader = new FileReader();
  reader.onload = (evt) => {
    uploadButton.innerHTML = 'Upload a new image';
    imageUploaded.src = evt.target.result;
    imageUploaded.style.display = 'inline-block';
    classifier.classify(imageUploaded, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        infoBox.innerHTML = res;
      }
    });
  }
  reader.readAsDataURL(file.files[0]);
}

const testAllImagesInASet = async (array, testingObject) => {
  // Test the test data
  await array.forEach((image, i) => {
    classifier.classify(image, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        const imgDiv = document.getElementById(`testing/${testingObject.name}${i+1}`);
        
        const result = document.createElement("span");
        result.innerHTML = res;
        imgDiv.appendChild(result);
      }
    });
  });
}

const initializeImages = async () => {
  infoBox.innerHTML = 'Loading Training Images into the DOM: ';
  // Add Training Data
  trainingData = await insertMultipleSetsIntoTheDom(trainingObject, 'training/', false);
}

// This one loops the data object and adds them 1 by 1 to the image classifier
const addAllImageSetsToClassifier = async () => {
  infoBox.innerHTML = 'Loading Training Images into the Machine Learning API.. ';
  await trainingData.forEach( async (data, i) => {
    if (trainingData.length - 1 !== i) {
      await addSetToClassifier(data, trainingObject[i].label);
    } else {
      await addSetToClassifier(data, trainingObject[i].label, startTraining);
    }
  })
}

const main = async () => {
  await initializeImages();
  features = ml5.featureExtractor('MobileNet', configMobilenet);
  classifier = features.classification();
  addAllImageSetsToClassifier();
}

main();

function draw() {
  if (webcamVideo.style.display !== 'none' && webcamActive) {
    takePictureWithWebcam()
  }
}