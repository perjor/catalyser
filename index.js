let features = ml5.featureExtractor('MobileNet');
const classifier = features.classification();

const root = document.getElementById('root');
const infoBox = document.getElementById('catalyser-info');
const testingButton = document.getElementById('testingButton');
const uploadButton = document.getElementById('uploadButton');

const trainingData = [];
const trainingObject = [
  {
    name: 'tailUp',
    label: 'Tail Up',
    size: 10,
  },
  {
    name: 'tailUpCurled',
    label: 'Tail Up Curled',
    size: 5,
  },
  {
    name: 'tailFlat',
    label: 'Tail Flat',
    size: 5,
  },
  {
    name: 'tailFlatCurled',
    label: 'Tail Flat Curled',
    size: 4,
  },
  {
    name: 'tailPuffy',
    label: 'Tail Puffy',
    size: 3,
  },
  {
    name: 'tailBody',
    label: 'Tail Body',
    size: 1,
  },
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
    label: 'Tail Up Curled',
    size: 2,
  },
  {
    name: 'testTailFlat',
    label: 'Tail Flat',
    size: 2,
  },
  {
    name: 'testTailFlatCurled',
    label: 'Tail Flat Curled',
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
    if (render) {
      const div = document.createElement("div");
      div.id = `${url}${i}`;
      div.className = 'tailContainer'
      div.appendChild(img);
      root.appendChild(div);
    }
    array.push(img);
  }
  return array;
}

// This adds images to the classifier and calls the imagesAdded when done
const addAllImages = async (arr, label, cb) => {
  console.log(`Adding ${label} to classifier`);
  
  arr.forEach((image, i) => {
    if (arr.length - 1 !== i) {
      classifier.addImage(image, label);
    } else {
      classifier.addImage(image, label, cb);
    }
  });
}

// This trains the classifier and tests all the images when done
const imagesAdded = async () => {
  infoBox.innerHTML = 'Training the Machine Learning Algorithm';
  const res = await classifier.train(() => {});
  infoBox.innerHTML = 'Done!';
  activateButtons();
}

function activateButtons() {
  testingButton.removeAttribute('disabled');
  testingButton.className = 'btn'; 
  uploadButton.removeAttribute('disabled');
  uploadButton.className = 'btn';
}

function startTesting() {
  testingData.forEach((data, i) => {
    testAllImages(data, testingObject[i]);
  });
  testingButton.remove();
}

function startUpload(file) {
  uploadButton.innerHTML = 'Processing Image';
  const img = document.createElement("img");
  console.dir(file);
  const reader = new FileReader();
  reader.onload = (evt) => {
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

function initializeImages() {
  infoBox.innerHTML = 'Loading Test Images into the Machine Learning API';
  // Add Training Data
  trainingObject.forEach(data => {
    trainingData.push(insertAllImagesIntoRoot(`training/${data.name}`, data.size, false));
  })

  // Add Test Data
  testingObject.forEach(data => {
    testingData.push(insertAllImagesIntoRoot(`testing/${data.name}`, data.size));
  })
}

const addImagesToClassifier = async () => {
  await trainingData.forEach( async (data, i) => {
    if (trainingData.length - 1 !== i) {
      await addAllImages(data, trainingObject[i].label);
    } else {
      await addAllImages(data, trainingObject[i].label, imagesAdded);
    }
  })
}

function main() {
  initializeImages();
  addImagesToClassifier();
}

main();