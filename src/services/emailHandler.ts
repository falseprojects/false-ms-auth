import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Enviar o e-mail
  await transporter.sendMail({
    from: '"lucascv8525@gmail.com" <no-reply@seuapp.com>',
    to,
    subject,
    text,
  });
}
