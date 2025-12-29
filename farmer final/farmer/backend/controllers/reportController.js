const Report = require('../models/Report');
const Alert = require('../models/Alert');

exports.createReport = async (req, res) => {
    const { cropName, pestOrDiseaseName, severityLevel, symptoms, notes, location } = req.body;

    try {
        const newReport = new Report({
            farmer: req.session.user.id,
            cropName,
            pestOrDiseaseName,
            severityLevel,
            symptoms,
            notes,
            location
        });

        const report = await newReport.save();

        
        req.io.emit('newReport', report);

      
        if (severityLevel === 'High') {
            const alertMessage = `⚠️ CRITICAL: High severity ${pestOrDiseaseName} reported on ${cropName} in ${location}!`;
            await createSystemAlert(req.io, alertMessage, 'High', cropName, location);
        }

        // 2. Threshold Rule: If > 3 reports of same pest in same location in last 24h
        const recentReports = await Report.find({
            pestOrDiseaseName,
            location,
            reportedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if (recentReports.length >= 3) {
            const alertMessage = `📢 OUTBREAK WARNING: Multiple reports of ${pestOrDiseaseName} in ${location}. Take precautions.`;
            // Check if similar alert already exists to prevent spam
            const existingAlert = await Alert.findOne({
                message: alertMessage,
                sentAt: { $gte: new Date(Date.now() - 1 * 60 * 60 * 1000) } // Check last hour
            });

            if (!existingAlert) {
                await createSystemAlert(req.io, alertMessage, 'Medium', cropName, location);
            }
        }

        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Helper to create and broadcast alert
async function createSystemAlert(io, message, severity, affectedCrop, targetLocation) {
    try {
        const newAlert = new Alert({
            message,
            severity,
            affectedCrop,
            targetLocation,
            // System generated alerts might not have a createdBy or use a dedicated System ID
            // For now, we leave createdBy undefined or handle in Model
        });
        const savedAlert = await newAlert.save();
        io.emit('newAlert', savedAlert);
        console.log('System Alert Generated:', message);
    } catch (err) {
        console.error('Error creating system alert:', err);
    }
}


exports.getReports = async (req, res) => {
    try {
        let reports;
        // Check role from session (or req.user if middleware sets it)
        const user = req.session.user || req.user;

        if (user && user.role === 'admin') {
            reports = await Report.find().sort({ reportedAt: -1 }).populate('farmer', 'name');
        } else {
            // Farmer sees only their own
            reports = await Report.find({ farmer: user.id }).sort({ reportedAt: -1 }).populate('farmer', 'name');
        }
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/reports/:id/resolve
// @desc    Resolve a report (Admin Only)
exports.resolveReport = async (req, res) => {
    try {
        const { solution } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ msg: 'Report not found' });

        report.status = 'Resolved';
        report.solution = solution;
        await report.save();

        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ msg: 'Report not found' });

        await Report.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Report removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
