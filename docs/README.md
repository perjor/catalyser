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
