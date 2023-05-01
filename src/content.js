import { browser, image, loadLayersModel} from '@tensorflow/tfjs';
let isExtensionOn = true
// Load MobileNet model
let mobileNet;
loadLayersModel('https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/5')
  .then(model => {
    mobileNet = model;
  });

// Function to blur dog images
async function blurImages(images) {
  // Loop through images and classify each one
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const tensor = browser.fromPixels(img);
    const resized = image.resizeBilinear(tensor, [224, 224]);
    const batched = resized.expandDims(0);
    const predictions = await mobileNet.predict(batched).data();
    tensor.dispose();
    resized.dispose();
    batched.dispose();
    // If the image is classified as a dog, blur it
    if (predictions[151] > 0.5) {
      img.style.filter = 'blur(5px)';
    }
  }
}

function toggleExtension() {
  isExtensionOn = !isExtensionOn;
  if (isExtensionOn) {
    blurImages(images);
  } else {
    unblurImages(images);
  }
}


const observer = new MutationObserver((mutations, observer) => {
    // Loop through each mutation in the list
    mutations.forEach(mutation => {
        if (!mutation.addedNodes) return;

        mutation.addedNodes.forEach(node => {
            if (node.nodeName.toLowerCase() !== 'img') return
            if (isExtensionOn) blurImages([node]);
        });

        // if (isExtensionOn) {
        //     unblurImages(mutation.removedNodes);
        // }
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
