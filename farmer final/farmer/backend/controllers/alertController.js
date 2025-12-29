const Alert = require('../models/Alert');


exports.getAlerts = async (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.id : null;

        let query = {};
        if (userId) {
            query = { hiddenBy: { $ne: userId } };
        }

        const alerts = await Alert.find(query).sort({ sentAt: -1 });

       
        const alertsWithStatus = alerts.map(alert => ({
            ...alert.toObject(),
            read: userId ? alert.readBy.includes(userId) : false
        }));

        res.json(alertsWithStatus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createAlert = async (req, res) => {
    const { message, severity, affectedCrop, targetLocation } = req.body;

    try {
        const newAlert = new Alert({
            message,
            severity,
            affectedCrop,
            targetLocation,
            createdBy: req.session.user.id
        });

        const alert = await newAlert.save();

       
        req.io.emit('newAlert', alert);

        res.json(alert);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.markAlertsRead = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        await Alert.updateMany(
            { readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );
        res.json({ msg: 'Alerts marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteAlert = async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Alert removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.hideAlert = async (req, res) => {
    try {
        const userId = req.session.user.id;
        await Alert.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { hiddenBy: userId } }
        );
        res.json({ msg: 'Alert hidden' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
