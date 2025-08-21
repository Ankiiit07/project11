import express from 'express';
import { sendEmail } from '../services/emailService';
import { AppError } from '../utils/AppError';

const router = express.Router();

// Send email endpoint
router.post('/send', async (req, res, next) => {
  try {
    const { email, subject, template, data } = req.body;

    if (!email || !subject || !template) {
      throw new AppError('Email, subject, and template are required', 400);
    }

    await sendEmail({
      email,
      subject,
      template,
      data: data || {}
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 