import { browser, image, loadLayersModel} from '@tensorflow/tfjs';
try {
  
let isExtensionOn = true
// Load MobileNet model
let mobileNet;
const modelUrl = chrome.runtime.getURL('model/model.json');

loadLayersModel(modelUrl).then((model) => {
  mobileNet = model;
}).catch(console.log)

const GENDER_TYPES = {'man': 0, 'female': 1}
// Function to blur dog images
async function blurImages(images) {
  try {
    
    // Loop through images and classify each one
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if(img.width === 0 || img.height === 0) continue
      const tensor = browser.fromPixels(img);
      const resized = image.resizeBilinear(tensor, [96, 96]);
      const batched = resized.expandDims(0);
      const predictions = await mobileNet.predict(batched).data();
      const isFemale = predictions[GENDER_TYPES.female] > predictions[GENDER_TYPES.man]
      console.log('isFemale: ', isFemale)
      tensor.dispose();
      resized.dispose();
      batched.dispose();
      // If the image is classified as a dog, blur it
      if (isFemale) {
        console.log('blured img: ', img)
        const blackImg = new Image();
        blackImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFDgKLBzbYQAAAABJRU5ErkJggg==";
        blackImg.width = img.width;
        blackImg.height = img.height;
        img.parentNode.replaceChild(blackImg, img);
        // img.style.filter = 'grayscale(100%)'
      }
    }
  } catch (error) {
    console.log(error)
  }
}

function toggleExtension() {
  isExtensionOn = !isExtensionOn;
  if (isExtensionOn) {
    blurImages(images);
  } 
  // else {
  //   unblurImages(images);
  // }
}


const observer = new MutationObserver((mutations, observer) => {
    // Loop through each mutation in the list
    mutations.forEach(mutation => {
        if (!mutation.addedNodes) return;

        mutation.addedNodes.forEach(node => {
            if (node.nodeName.toLowerCase() !== 'img') return
            if (isExtensionOn) blurImages([node]);
        });

        if (isExtensionOn) {
            // unblurImages(mutation.removedNodes);
        }
    });
});

// Define the options for the observer
const observerOptions = {
  childList: true, // observe direct children of the target node
  subtree: true, // observe all descendants of the target node
  attributes: false, // do not observe changes to attributes
  characterData: false // do not observe changes to text content
};

// Start observing the target node with the specified options
observer.observe(document.body, observerOptions);

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  // Handle the message here
  setTimeout(() => {
    sendResponse(message)
  }, 2000)
  return true
});
} catch (error) {
  console.log(error)
}