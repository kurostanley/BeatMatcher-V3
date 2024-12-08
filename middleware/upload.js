const multer = require('multer');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the original file name
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Export the upload middleware
module.exports = upload;