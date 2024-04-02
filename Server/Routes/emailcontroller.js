const nodemailer = require('nodemailer');

// Function to send email notification using SMTP transport
function sendEmailNotification(name, description, deadline, employee_id, category_id) {
  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // SMTP server host (e.g., Gmail SMTP server: smtp.gmail.com)
    port: 465, // SMTP port (e.g., 465 for Gmail)
    secure: true, // Use SSL
    auth: {
      user: 'your_email@example.com', // Your email address
      pass: 'your_password' // Your email password
    }
  });

  // Email message options
  let mailOptions = {
    from: 'your_email@example.com', // Sender email address
    to: 'recipient_email@example.com', // Recipient email address
    subject: 'New Task Assigned', // Email subject
    text: `New task assigned:\nName: ${name}\nDescription: ${description}\nDeadline: ${deadline}\nEmployee ID: ${employee_id}\nCategory ID: ${category_id}` // Email body
  };

  // Send email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = { sendEmailNotification };
