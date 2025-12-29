const Crop = require('../models/Crop');


exports.createCrop = async (req, res) => {
    try {
        const { name } = req.body;
        // Image comes from Multer middleware
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        if (!name || !image) {
            return res.status(400).json({ msg: 'Name and Image are required' });
        }

        const newCrop = new Crop({
            name,
            image,
            diseases: []
        });

        const savedCrop = await newCrop.save();
        res.json(savedCrop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.addDisease = async (req, res) => {
    try {
        const { name, symptoms, solution } = req.body;
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({ msg: 'Crop not found' });
        }

        crop.diseases.push({ name, symptoms, solution });
        await crop.save();

        res.json(crop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getCrops = async (req, res) => {
    try {
        const crops = await Crop.find().sort({ name: 1 });
        res.json(crops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) return res.status(404).json({ msg: 'Crop not found' });

        await Crop.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Crop removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.deleteDisease = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) return res.status(404).json({ msg: 'Crop not found' });

        // Filter out the disease to remove
        const newDiseases = crop.diseases.filter(
            d => d._id.toString() !== req.params.diseaseId
        );

        crop.diseases = newDiseases;
        await crop.save();
        res.json(crop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
