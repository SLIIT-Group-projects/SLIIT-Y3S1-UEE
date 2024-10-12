const multer = require('multer');
const path = require('path');
// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
