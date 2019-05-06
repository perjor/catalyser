---
title: Catalyser
tags: [ML, Javascript]
date: 2019-01-11
---

# Catalyser

## First search

I search for tensor flow on youtube and watch the first video, [Tensorflow in 5 minutes](https://www.youtube.com/watch?v=2FmcHiLCwTU).  
You have to give your program a learning curve, determining how fast it will improve.  
I stop the video because tensorflow in 5 minutes is a bad idea.

## Deep learning intro

I start watching [Deep learning, chapter 1](https://www.youtube.com/watch?v=aircAruvnKk) to get a grasp on basic machine learning.  
To detect a handwritten number it splits a 28x28 picture in to neurons.
Each layer breaks down the solution in a chance from 0 to 1. The final number with the highest chance gets chosen.  

You choose a region and give the region weights and the borders a negative weight. Then to get that data between a value of 0 and 1 you push it into a sigmoid.  
A mathematical basis of linear algebra is useful because it works a lot with matrices.

## AI Javascript

Tensorflow for js exists for only 5 months. You can already do quite some exciting stuff. I watched the video, [AI JavaScript Rocks](https://www.youtube.com/watch?v=TjQmZeyIiTk).  
They have a website where you can see all the websites that use [AI with javascript](https://aijs.rocks/).

## Llama detector

I found a [llama detector](https://aijs.rocks/inspire/llama-vision/) on the aijs.rocks website. This made me question if I could make this for cats. Seems the machine learning has already been done by [MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet). It's a library that excels at recognizing images. When you scan an image, it returns an array of the 3 most feasible results. 

```js
predictionModel.classify(video).then(predictions => {

      const topResult = predictions[0];

      if (topResult.className.includes('cat')) {
```

I take the top prediction out of the array and if it includes the word cat, (it mostly finds a type of cat), I will return that it's a cat.

You can test the first iteration here [Catalyser v0.0.1](https://catalyser.jordypereira.be/v-0-0-1)

## Cat basics

I've searched some articles to get a quick grasp at the meaning of the Cat's tail.  
Google -> 'Cat tail cues'
[This article seems to mention a whole bunch of cues](https://www.humanesociety.org/resources/cat-chat-understanding-feline-language).
[This one has some nice images](https://www.adventurecats.org/pawsome-reads/read-cats-body-language/).

## Tensorflow

### Intro

I'm going to [watch an intro](https://www.youtube.com/watch?v=Qt3ZABW5lD0&t=0s&index=2&list=PLRqwX-V7Uu6YIeVA3dNxbR9PYj4wV31oQ) to tensorflow js to get a starting point.

In the first video he explains where Tensorflow comes from. It's a machine learning library in c++. Now thanks to WEBGL we can use the GPU in the browser.

2 guys have rewritten it in JS, which is now branded as tensorflow.js.  
Keras is a layer on top of tensorflow.js that is now part of tensorflow.js. So it has 2 APIs: The core API and the Layers API, which is a bit simpler to use.

On top of that you have ml5js which is an even more abstracted version of tensorflow.js to get started quickly.

### Basics

In the second video he went over the basic block of tensorflow, a tensor. A tensor can be any shape from a Scalar (1 number), a vector ( a list) or a matrix (a 2d grid).

```js
tf.tensor([2, 2, 2, 2, 3, 4], [1, 2, 3]).print();
```

### Rest of the playlist

I choose to continue watching his whole playlist with examples and more info about the layer API and how to train your own model.

## My own app

I decide to jump straight to ML5, another higher level library on top of tensorflow. I watch [The Coding Train](https://www.youtube.com/watch?v=jmznx0Q1fP0) his introduction video, as well as his [Image Classification with mobile net](https://www.youtube.com/watch?v=yNkAuWz5lnY&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=2). I start watching his [Webcam Image Classification](https://www.youtube.com/watch?v=D9BoBSkLvFo&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=3) but halfway through I feel like I can start on my own.

I have a basic idea of what I want to do and start right away to implement it.  
I'm going to retrain a pre-trained model using the ml5 library and the MobileNet models.

[ML5 Training](https://ml5js.org/docs/training-introduction) explains that you have to use the featureExtractor to use your own images. I collect a dataset with cat tails from google and get started. I sort my data into training and test data, and I decide to use the direction of the tails and the amount of curl as parameters. i start off with about 5 images of a tail standing up, 4 images of a curled tail standing up etc. It are images of a tail only and cats with tails.

To read your own image in your first have to load it in your html page. I didn't feel like writing 40 img elements so I wrote a javascript function which reads an object and inserts all the training data based on the name.

```js
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
```

It seems creating the element is enough so I'll only add the test data to the HTML so we can compare it quickly.

After all of my images are made into an HTML element, I have to add them to my classifier. I have to insert them 1 by 1 so I split them up. This function loops over my trainingData array.

```js
const addAllImagesToClassifier = async () => {
  await trainingData.forEach( async (data, i) => {
    if (trainingData.length - 1 !== i) {
      await addSetToClassifier(data, trainingObject[i].label);
    } else {
      await addSetToClassifier(data, trainingObject[i].label, trainClassifier);
    }
  })
}
```

When the last one is done it runs the callback.  
The image classifier also just loops 1 set of images with the same label.

```js
// This adds a set of images to the classifier and calls the imagesAdded when done
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
```

When it's done it will call the trainClassifier.

To make a small interface, when the classifier is done training it activates some buttons. These buttons allow you to test the test data that's present on the screen.

```js
function startTesting() {
  testingData.forEach((data, i) => {
    testAllImages(data, testingObject[i]);
  });
  testingButton.remove();
}
```

The function just loops our testingData array.

After some testing the results weren't what I wanted. Since in machine learning your output is purely decided by your input, I decided to add more training data and cut the images up to only contain tails.

It seems to just give everything the label 'Tail Up'. Coincidentally this is also the first object in my training data array. Putting 'Tail Flat' at the top confirms my suspicion and labels everything as so. Seems there's a problem with my code. Let's continue watching [The Coding Train](https://www.youtube.com/watch?v=D9BoBSkLvFo&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=3).

Okay, I've found the problem. The documentation clearly says it only distinguishes between 2 sets of images. Too bad.

I'm trying to get it to work with my webcam. It's working on localhost, but when I deploy it on Netlify and open it in chrome, it doesn't ask for webcam permission. On Firefox it does, but it doesn't call the draw function.

I've found a workaround for the number of sets I can train in [this open Github issue](https://github.com/ml5js/ml5-library/issues/164).

I moved the webcam logic to when the webcam actually starts, and it seems to work on chrome now. It seems to skip a few images before adding them, so I need to make sure that it waits for all of the images to be loaded in the DOM.

You can make creating a DOM element async by adding `element.async = true`. Then I'm resolving a promise when the last img is loaded.

```js
img.addEventListener('load', (e) => {
  resolve('done');
})
```

## Reworking the data

The data you put into your app is very important. That's why I'm going to refactor all my tails to contain full cat images. I'm also going to separate the checks. The first check will be the position of the tail, up, down / flat or against the body. After that I'll check the puffiness of the tail.

I've got a training database of 50 cat images. I think that's a good start.

I continue watching videos of The Coding Train. I now have 27 Cat Tail Up, 21 Cat Tail Flat / Down and 13 Cat Tail Body. I'm equalizing them all at 13 each and it's giving a lot better results then when I'm putting more of one in.

## GPU

Since it still requires a lot of graphical processing power to train the model, I included the option to load in a model trained on my desktop, which is a bit more performant than my mobile phone.

> TODO  
> Loading Bar behind the title  

---
[Demo](https://streamable.com/i4bd5)  
[Website](https://catalyser.jordypereira.com/)  
[Twitter](https://twitter.com/_perjor)
