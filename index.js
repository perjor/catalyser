let features = ml5.featureExtractor('MobileNet');

const root = document.getElementById('root');
const infoBox = document.getElementById('catalyser-info');
const testingButton = document.getElementById('testingButton');
const uploadButton = document.getElementById('uploadButton');
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');

let webcamActive = false;

const classifier = features.classification(webcamVideo);

const trainingData = [];
const trainingObject = [
  {
    name: 'tailUp',
    label: 'Tail Up',
    size: 7,
  },
  {
    name: 'tailUpCurled',
    label: 'Tail Up',
    size: 4,
  },
  {
    name: 'tailFlat',
    label: 'Tail Flat',
    size: 7,
  },
  {
    name: 'tailFlatCurled',
    label: 'Tail Flat',
    size: 4,
  },
  // {
  //   name: 'tailPuffy',
  //   label: 'Tail Puffy',
  //   size: 3,
  // },
  // {
  //   name: 'tailBody',
  //   label: 'Tail Body',
  //   size: 1,
  // },
];

const testingData = [];
const testingObject = [
 
  {
    name: 'testTailUp',
    label: 'Tail Up',
    size: 2,
  },
  {
    name: 'testTailUpCurled',
    label: 'Tail Up',
    size: 2,
  },
  {
    name: 'testTailFlat',
    label: 'Tail Flat',
    size: 2,
  },
  {
    name: 'testTailFlatCurled',
    label: 'Tail Flat',
    size: 1,
  },
  {
    name: 'testTailPuffy',
    label: 'Tail Puffy',
    size: 2,
  },
];

// Adds all images to the DOM and returns an array
const insertAllImagesIntoRoot = (url, size, render = true) => {
  if (render) {
    let title = document.createElement("h2")
    title.innerHTML = url;
    root.appendChild(title);
  }
  
  const array = [];
  // Loop through all images and add to Array
  for (let i = 1; i <= size; i++) {
    let img = document.createElement("img")
    img.src = `./images/${url}${i}.jpg`;
    img.className = 'tail';
    // if render is true, render the images on the HTML
    if (render) {
      const div = document.createElement("div");
      div.id = `${url}${i}`;
      div.className = 'tailContainer'
      div.appendChild(img);
      root.appendChild(div);
    }
    array.push(img);
  }
  // The array returned is used by the image classifier
  return array;
}

// This adds a set of images to the classifier and calls the trainClassifier when done
const addSetToClassifier = async (arr, label, cb) => {
  console.log(`Adding ${arr.length}x ${label} to classifier`);
  
  arr.forEach((image, i) => {
    if (arr.length - 1 !== i) {
      classifier.addImage(image, label);
    } else {
      classifier.addImage(image, label, cb);
    }
  });
}

// This trains the classifier and tests all the images when done
const trainClassifier = async () => {
  infoBox.innerHTML = 'Training the Machine Learning Algorithm';
  const res = await classifier.train((lossRate) => {console.log(lossRate);
  });
  activateButtons();
}

function activateButtons() {
  infoBox.innerHTML = 'Done!';
  testingButton.removeAttribute('disabled');
  testingButton.className = 'btn'; 
  uploadButton.removeAttribute('disabled');
  uploadButton.className = 'btn';
  webcamButton.removeAttribute('disabled');
  webcamButton.className = 'btn';
}

function startTesting() {
  testingData.forEach((data, i) => {
    testAllImages(data, testingObject[i]);
  });
  testingButton.remove();
}

function startWebcam() {
  if (webcamVideo.style.display === 'inline-block') {
    console.log('Closed webcam');
    
    webcamActive = false;
    webcamVideo.style.display = 'none';
    webcamButton.innerHTML = 'Use the webcam';
    infoBox.innerHTML = 'Closed the webcam';
    const track = webcamVideo.srcObject.getTracks()[0];
    track.stop();
    return false;
  }
  webcamButton.innerHTML = 'Stop the webcam';

  const maxWidth = '640px';
  const maxHeight = '480px';
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

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: false, video: constraints })
    .then(stream => {
    console.log('Opened webcam');

      webcamVideo.srcObject = stream;
      webcamVideo.style.display = 'inline-block';
      webcamActive = true;
    })
    .catch(err => console.log("Webcam error!", err))
  }
}

function takePictureWithWebcam() {
  console.log('Taking picture');
  
  classifier.classify((err, res) => {
    if (err) {
      console.error(err);
    } else {
      infoBox.innerHTML = res;
    }
  });
}

function startUpload(file) {
  uploadButton.innerHTML = 'Processing Image';
  const img = document.createElement("img");
  console.dir(file);
  const reader = new FileReader();
  reader.onload = (evt) => {
    console.log(evt.target.result);
    
    img.src = evt.target.result;
    classifier.classify(img, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(res);
      }
    });
  }
  reader.readAsText(file.files[0]);
}

const testAllImages = async (array, testingObject) => {
  await array.forEach((image, i) => {
    classifier.classify(image, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`${testingObject.label} => ${res}`);
        const imgDiv = document.getElementById(`testing/${testingObject.name}${i+1}`);
        
        const result = document.createElement("span");
        result.innerHTML = res;
        imgDiv.appendChild(result);
      }
    });
  });
}

const initializeImages = async () => {
  infoBox.innerHTML = 'Loading Test Images into the Machine Learning API';
  // Add Training Data
  await trainingObject.forEach(data => {
    trainingData.push(insertAllImagesIntoRoot(`training/${data.name}`, data.size, false));
  })

  // Add Test Data
  await testingObject.forEach(data => {
    testingData.push(insertAllImagesIntoRoot(`testing/${data.name}`, data.size));
  })
}

// This one loops the data object and adds them 1 by 1 to the image classifier
const addAllImagesToClassifier = async () => {
  await trainingData.forEach( async (data, i) => {
    if (trainingData.length - 1 !== i) {
      await addSetToClassifier(data, trainingObject[i].label);
    } else {
      await addSetToClassifier(data, trainingObject[i].label, trainClassifier);
    }
  })
}

const main = async () => {
  await initializeImages();
  addAllImagesToClassifier();
}

main();

function draw() {
  if (webcamVideo.style.display !== 'none' && webcamActive) {
    takePictureWithWebcam()
  }
}