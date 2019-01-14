let features = ml5.featureExtractor('MobileNet');
const classifier = features.classification();

const root = document.getElementById('root');

let tailUp, tailUpCurled, tailFlat, tailFlatCurled, tailPuffy, tailBody, tailDown, tailDownCurled = [];
let testTailUp, testTailUpCurled, testTailFlat, testTailFlatCurled, testTailPuffy = [];

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
  const res = await classifier.train(() => {});
  testAllImages(testTailUp, 'Tail Up');
  testAllImages(testTailUpCurled, 'Tail Up');
  testAllImages(testTailFlat, 'Tail Flat');
  testAllImages(testTailFlatCurled, 'Tail Flat');
  testAllImages(testTailPuffy, 'Tail Puffy');
}

const testAllImages = (array, label) => {
  array.forEach(image => {
    classifier.classify(image, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`${label} => ${res}`);
      }
    });
  });
}

function initializeImages() {
  // Add Training Data
  tailUp = insertAllImagesIntoRoot('training/tailUp', 10);
  tailUpCurled = insertAllImagesIntoRoot('training/tailUpCurled', 9);
  tailFlat = insertAllImagesIntoRoot('training/tailFlat', 5);
  tailFlatCurled = insertAllImagesIntoRoot('training/tailFlatCurled', 4);
  tailPuffy = insertAllImagesIntoRoot('training/tailPuffy', 3);
  tailDown = insertAllImagesIntoRoot('training/tailDown', 1);
  tailDownCurled = insertAllImagesIntoRoot('training/tailDownCurled', 1);
  tailBody = insertAllImagesIntoRoot('training/tailBody', 1);

  // Add Test Data
  testTailUp = insertAllImagesIntoRoot('testing/testTailUp', 2);
  testTailUpCurled = insertAllImagesIntoRoot('testing/testTailUpCurled', 2);
  testTailFlat = insertAllImagesIntoRoot('testing/testTailFlat', 2);
  testTailFlatCurled = insertAllImagesIntoRoot('testing/testTailFlatCurled', 1);
  testTailPuffy = insertAllImagesIntoRoot('testing/testTailPuffy', 2);
}

const addImagesToClassifier = async () => {
  await addAllImages(tailUp, 'Tail Up');
  await addAllImages(tailUpCurled, 'Tail Up');
  await addAllImages(tailFlat, 'Tail Flat');
  await addAllImages(tailFlatCurled, 'Tail Flat');
  await addAllImages(tailPuffy, 'Tail Puffy');
  await addAllImages(tailDown, 'Tail Down');
  await addAllImages(tailDownCurled, 'Tail Down');
  await addAllImages(tailBody, 'Tail Body', imagesAdded);
}

function main() {
  initializeImages();
  addImagesToClassifier();
}

main();