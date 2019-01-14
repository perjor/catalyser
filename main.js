let features = ml5.featureExtractor('MobileNet');
const classifier = features.classification();
let tailUp, tailUpCurled, tailFlat, tailFlatCurled, tailPuffy, tailBody, tailDown, tailDownCurled = [];
let testTailUp, testTailUpCurled, testtailFlatCurled = [];

const loadAllImages = (url, size) => {
  const arr = [];
  for (let i = 1; i <= size; i++) {
    arr[i-1] = loadImage(`images/${url}${i}.jpg`);
  }
  return arr;
}

function preload() {
  // Training Data
  tailUp = loadAllImages('training/tailUp', 10);
  tailUpCurled = loadAllImages('training/tailUpCurled', 7);
  tailFlat = loadAllImages('training/tailFlat', 4);
  tailFlatCurled = loadAllImages('training/tailFlatCurled', 4);
  tailPuffy = loadAllImages('training/tailPuffy', 2);
  tailBody = loadAllImages('training/tailBody', 1);
  tailDown = loadAllImages('training/tailDown', 1);
  tailDownCurled = loadAllImages('training/tailDownCurled', 1);

  // Testing Data
  testTailUp = loadAllImages('testing/testTailUp', 2);
  testTailUpCurled = loadAllImages('testing/testTailUpCurled', 2);
  testtailFlatCurled = loadAllImages('testing/testTailUp', 1);
}

function setup() {
  // const imagesAdded = async () => {
  //   const res = await classifier.train((resp) => {
  //     console.log(resp);
  //   });
  //   classifier.classify(testTailUp1, (err, res) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       console.log(res);
  //     }
  //   });
  //   classifier.classify(testtailFlatCurled1, (err, res) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       console.log(res);
  //     }
  //   });
  // }
  
  // classifier.addImage(tailUp1, 'Tail Up');
  // classifier.addImage(tailUp2, 'Tail Up'); 
  // classifier.addImage(tailUp3, 'Tail Up');
  // classifier.addImage(tailUpCurled1, 'Tail Up Curled');
  // classifier.addImage(tailUpCurled2, 'Tail Up Curled');
  // classifier.addImage(tailFlat1, 'Tail Flat');
  // classifier.addImage(tailFlatCurled1, 'Tail Flat Curled', imagesAdded);  
}
