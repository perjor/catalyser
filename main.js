let features = ml5.featureExtractor('MobileNet');
const classifier = features.classification();

const tailUp1 = document.getElementById('tailUp1');
const test1 = document.getElementById('test1');

classifier.addImage(tailUp1, 'Tail');
// classifier.addImage(puffinImage2, 'Puffin');
// classifier.addImage(puffinImage3, 'Puffin');
// classifier.addImage(snowLeopardImage1, 'Snow Leopard');
// classifier.addImage(snowLeopardImage2, 'Snow Leopard');
classifier.train();

classifier.classify(test1, gotResult);

function gotResult(labels) {
  console.log(labels);
}