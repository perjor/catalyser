let features = ml5.featureExtractor('MobileNet');
const classifier = features.classification();

const root = document.getElementById('root');

let tailUp, tailUpCurled, tailFlat, tailFlatCurled, tailPuffy, tailBody, tailDown, tailDownCurled = [];
let testTailUp, testTailUpCurled, testTailFlatCurled = [];

// Adds all images to the DOM and returns an array
const insertAllImagesIntoRoot = (url, size) => {
  let title = document.createElement("h2")
  title.innerHTML = url;
  root.appendChild(title);

  const array = [];
  for (let i = 1; i <= size; i++) {
    let img = document.createElement("img")
    img.src = `./images/${url}${i}.jpg`;
    root.appendChild(img);
    array.push(img);
  }
  return array;
}

// This adds images to the classifier and calls the imagesAdded when done
const addAllImages = async (arr, label, cb) => {
  console.log('Adding images to classifier');
  
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
  const res = await classifier.train(() => {});
  testAllImages(testTailUp);
  // testAllImages(testTailUpCurled);
  // testAllImages(testtailFlatCurled);
}

const testAllImages = (array) => {
  console.log('Testing all Images', array);
  array.forEach(image => {
    classifier.classify(image, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(res);
      }
    });
  });
}

function initializeImages() {
  tailUp = insertAllImagesIntoRoot('training/tailUp', 10);
  tailUpCurled = insertAllImagesIntoRoot('training/tailUpCurled', 7);
  testTailUp = insertAllImagesIntoRoot('testing/testTailUp', 2);
  testTailUpCurled = insertAllImagesIntoRoot('testing/testTailUpCurled', 2);
}

function addImagesToClassifier() {
  addAllImages(tailUp, 'Tail Up');
  addAllImages(tailUpCurled, 'Tail Up Curled', imagesAdded);
}

function main() {
  initializeImages();
  addImagesToClassifier();
}

main();