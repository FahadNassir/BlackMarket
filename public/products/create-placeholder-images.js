const fs = require('fs');
const sharp = require('sharp');

const products = ['headphones', 'smartwatch', 'laptop', 'smartphone', 'mouse', 'keyboard'];

products.forEach(product => {
  const imagePath = `${product}.jpg`;
  
  sharp({
    create: {
      width: 600,
      height: 400,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .png()
  .toFile(imagePath)
  .then(() => {
    console.log(`Created ${imagePath}`);
  })
  .catch(err => {
    console.error(`Error creating ${imagePath}:`, err);
  });
});
