import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const sendContactMessage = catchAsync(async (req: Request, res: Response) => {
  const { name, email, subject, message, category } = req.body;

  // Send email to business
  try {
    await sendEmail({
      email: process.env.EMAIL_FROM || 'cafeatonce@gmail.com',
      subject: `Contact Form: ${subject}`,
      template: 'contactForm',
      data: {
        customerName: name,
        customerEmail: email,
        subject,
        message,
        category,
      },
    });

    // Send confirmation email to customer
    await sendEmail({
      email: email,
      subject: 'Thank you for contacting Cafe at Once',
      template: 'contactConfirmation',
      data: {
        customerName: name,
        subject,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw new AppError('Failed to send message. Please try again later.', 500);
  }
});