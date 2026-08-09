//server/Routes/Auth.js
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const mongose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.js");
const authenticate = require("../middlewares/authenticate.js");
const nodemailer = require("nodemailer");
dotenv.config();
//configure emailer transporter with gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (NOT regular password)
  },
});
//User signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    //validation of all fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create token and return user + token to client
    const token = jwt.sign(
      {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //validation of email
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.json({
      token,
      user: { _id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// View Profile
// GET /api/auth/profile
// Protected — requires JWT
// ==========================================
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      "fullName email createdAt",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("View profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ==========================================
// Update Profile
// PUT /api/auth/profile
// Body: { fullName?, email? }
// Protected — requires JWT
// ==========================================
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName && !email) {
      return res.status(400).json({
        message: "At least one field (fullName or email) is required",
      });
    }

    // If email is being changed, check it's not taken
    if (email) {
      const existing = await UserModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email.toLowerCase();

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true },
    ).select("fullName email");

    res.json({
      fullName: updatedUser.fullName,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ==========================================
// Change Password
// POST /api/auth/change-password
// Body: { currentPassword, newPassword }
// Protected — requires JWT
// ==========================================
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters" });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
});

// ==========================================
// ROUTE 1: Send OTP to Email
// POST /api/auth/send-otp
// Body: { email }
// ==========================================
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (5 minutes from now)
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Email content with enhanced mobile responsiveness and starry theme
    const mailOptions = {
      from: `"DataAgent AI Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 DataAgent AI: Password Reset Verification Required",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>DataAgent AI Security Token</title>
  <style>
    /* Reset & Basics */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    
    /* Responsive */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 0 !important; border-radius: 0 !important; }
      .header { padding: 30px 20px !important; }
      .content { padding: 30px 20px !important; }
      .token-code { font-size: 36px !important; letter-spacing: 8px !important; }
    }

    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      body { background-color: #0f172a !important; }
      .email-wrapper { background-color: #0f172a !important; }
      .container-table { background-color: #1e293b !important; border-color: #334155 !important; }
      .greeting { color: #f1f5f9 !important; }
      .description { color: #cbd5e1 !important; }
      .token-container { background-color: #0f172a !important; border-color: #334155 !important; }
      .token-label { color: #94a3b8 !important; }
      .token-code { color: #818cf8 !important; }
      .info-box { background-color: #451a1a !important; border-left-color: #f59e0b !important; }
      .info-text { color: #fbbf24 !important; }
      .info-text strong { color: #fcd34d !important; }
      .footer { background-color: #0f172a !important; border-top-color: #334155 !important; }
    }
  </style>
</head>
<body style="background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">

  <!-- Wrapper Table -->
  <table class="email-wrapper" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center" style="padding: 0;">
        
        <!-- Main Content Table -->
        <table class="container-table container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td class="header" align="center" style="background-color: #4f46e5; padding: 40px 24px;">
              <!-- PNG Image used for Gmail compatibility instead of inline SVG -->
              <img src="https://img.icons8.com/ios-filled/50/ffffff/combo-chart--v1.png" alt="DataAgent AI Graph" width="40" height="40" style="display: block; margin: 0 auto 16px auto; opacity: 0.9;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                DataAgent <span style="font-weight: 300; color: #c7d2fe;">AI</span>
              </h1>
              <p style="margin: 8px 0 0 0; color: #c7d2fe; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                Secure Account Recovery
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="content" style="padding: 36px 32px; text-align: left;">
              <h2 class="greeting" style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 600;">
                Hello <span style="color: #4f46e5;">${user.fullName}</span> 👋
              </h2>
              
              <p class="description" style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                A password reset request was initiated for your <strong>DataAgent AI</strong> account. To securely restore access to your analytics platform, please use the verification code below.
              </p>

              <!-- Token Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="token-container" align="center" style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 24px;">
                    <p class="token-label" style="margin: 0 0 12px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                      Verification Code
                    </p>
                    <p class="token-code" style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 700; color: #4f46e5; letter-spacing: 10px;">
                      ${otp}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td class="info-box" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 16px;">
                    <p class="info-text" style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      <strong>⚠️ Security Notice:</strong> This code is valid for <strong>5 minutes</strong>. Do not share it with anyone. If you didn't request this, please contact support immediately.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" align="center" style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                This is an automated message from DataAgent AI.<br>Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent successfully to your email",
      email: email,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

// ==========================================
// ROUTE 2: Verify OTP
// POST /api/auth/verify-otp
// Body: { email, otp }
// ==========================================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP exists
    if (!user.resetOTP) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one." });
    }

    // Check if OTP has expired
    if (Date.now() > user.resetOTPExpires) {
      // Clear expired OTP
      user.resetOTP = null;
      user.resetOTPExpires = null;
      await user.save();
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP matches
    if (user.resetOTP !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    res.status(200).json({
      message: "OTP verified successfully",
      valid: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res
      .status(500)
      .json({ message: "Failed to verify OTP. Please try again." });
  }
});

// ==========================================
// ROUTE 3: Reset Password
// POST /api/auth/reset-password
// Body: { email, otp, newPassword }
// ==========================================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Find user
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP one final time
    if (!user.resetOTP || user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.resetOTPExpires) {
      user.resetOTP = null;
      user.resetOTPExpires = null;
      await user.save();
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    res.status(200).json({
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ message: "Failed to reset password. Please try again." });
  }
});

module.exports = router;
