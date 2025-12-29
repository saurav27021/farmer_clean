const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createCrop, addDisease, getCrops, deleteCrop, deleteDisease } = require('../controllers/cropController');
const { authMiddleware: protect } = require('../middleware/authMiddleware');

// Multer Storage Engines
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'crop-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Routes
// Note: We are allowing any authenticated user to VIEW crops, 
// but strictly only "admin" to CREATE/EDIT them?
// For simpler demo, currently just checking 'protect' (logged in).
// Ideally, add an admin middleware. I'll stick to protect for now, 
// and handle "Admin Access" via UI visibility or user role check in controller.

router.post('/', protect, upload.single('image'), createCrop);
router.put('/:id/disease', protect, addDisease);
router.put('/:id/disease', protect, addDisease);
router.delete('/:id', protect, deleteCrop);
router.delete('/:id/disease/:diseaseId', protect, deleteDisease);
router.get('/', protect, getCrops);

module.exports = router;
