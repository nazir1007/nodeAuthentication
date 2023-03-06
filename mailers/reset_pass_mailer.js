const nodemailer = require('../config/nodemailer'); 

/* ----- Using nodemailer transporter method, send mail from 'specific_email_id' to
   any user who wants to update password using mail link ----- */
exports.resetPassword = (userWithAT) => {
    let htmlResetPassword = nodemailer.renderTemplate({userWithAT: userWithAT}, '/reset_password_temp.ejs');

    
    nodemailer.transporter.sendMail({
        from: 'mohdnazir1007@gmail.com',
        to: userWithAT.user.email,
        subject: 'Reset Password ',
        html: htmlResetPassword
    }, (err, info) => {
        if(err) {console.log('error at mailer ', err);
         return; 
        }
        console.log('Message Sent');
        return;

    })
}