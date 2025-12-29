const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
    const { name, email, password, role, location } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'email already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role,
            location,
            isVerified: true // Auto-verify
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Auto-login: Create session
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location };
        res.json(req.session.user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Register first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location };
        res.json(req.session.user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Could not log out.');
        res.clearCookie('connect.sid'); // Default cookie name for express-session
        res.json({ msg: 'Logged out successfully' });
    });
};



exports.getMe = (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ msg: 'Not authenticated' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    let resetUrl; // Declare outside try block for scope access

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Email does not exist' });
        }

        // Generate Token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token and expire (10 mins)
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create Reset URL
        // In production, this should be the frontend URL
        resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        // Send Email using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Farmer Alert System" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Token',
            text: message
        });

        res.status(200).json({ success: true, data: 'Email sent successfully' });
    } catch (err) {
        console.error("Email send failed (Soft Fail):", err.message);

        // Fallback for Development/Demo: Return link to frontend if email fails
        if (resetUrl) {
            console.log("fallback_reset_link:", resetUrl);
            return res.status(200).json({
                success: true,
                data: 'Email simulation mode active.',
                devLink: resetUrl
            });
        }

        // User requested to show success even if it fails
        res.status(200).json({ success: true, data: 'Email sent successfully' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    // Get token from params
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // Clear token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
