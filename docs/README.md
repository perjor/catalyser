# Catalyser

## First search
I search tensor flow on youtube and watch the first [video, Tensorflow in 5 minutes](https://www.youtube.com/watch?v=2FmcHiLCwTU)

You have to give your program a learning curve, determining how fast it will improve.

I stop the video because tensorflow in 5 minutes is a bad idea.

## Deep learning intro
I start watching [Deep learning, chapter 1](https://www.youtube.com/watch?v=aircAruvnKk) to get a grasp on basic machine learning.  
To detect a handwritten number it splits a 28x28 picture to neurons.
Each layer breaks down the solution in a chance from 0 to 1. The final number with the highest chance gets chosen.  

You choose a region and give the region weights and the borders a negative weight. Then to get that data between a value of 0 and 1 you push it into a sigmoid.  
A mathemetical basis of linear algebra is useful because it works a lot with matrices.

## AI Javascript
Tensorflow for js exists for only 5 months. You can already do quite some exciting stuff. I watched the [video, AI JavaScript Rocks](https://www.youtube.com/watch?v=TjQmZeyIiTk).  
They have a website where you can see alll websites that use [AI with javascript](https://aijs.rocks/).

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
https://www.humanesociety.org/resources/cat-chat-understanding-feline-language
This article seems to mention a whole bunch of cues.
https://www.adventurecats.org/pawsome-reads/read-cats-body-language/
This one has some nice images

## Tensorflow
### Intro
I'm going to [watch an intro](https://www.youtube.com/watch?v=Qt3ZABW5lD0&t=0s&index=2&list=PLRqwX-V7Uu6YIeVA3dNxbR9PYj4wV31oQ) to tensorflow js to get a starting point. 

In the first video he explains where Tensorflow comes from. It's a machine learning library in c++. Now thanks to WEBGL we can use the GPU in the browser. 
2 guys have rewritten it in JS, which is now branded as tensorflow.js. 
Keras is a layer on top of tensorflow.js that is now part of tensorflowjs. So it has 2 APIs: The core API and the Layers API, which is a bit simpler to use. 

On top of that you have ml5js which is an even more abstracted version of tensorflow.js to get started quickly.

### Basics
In the second video he went over the basic block of tensorflow, a tensor. A tensor can be any shape from a Scalar (1 number), a vector ( a list) or a matrix (a 2d grid).
```js
tf.tensor([2, 2, 2, 2, 3, 4], [1, 2, 3]).print();
```