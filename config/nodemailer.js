// ----- NodeMailer is being used for send mail to user ----- //
const nodemailer = require('nodemailer');
const ejs = require('ejs'); 
const path = require('path'); 
const keys = require('./app_key');

// ----- Transporter: who delivers the mail ------ //
let transporter = nodemailer.createTransport({
    service: keys.key_values.nodemailer_service,
    host: keys.key_values.nodemailer_host,
    port: keys.key_values.nodemailer_port,
    secure: false,
    auth: {
        user: keys.key_values.nodemailer_user,
        pass: keys.key_values.nodemailer_pass
    }
});

// ------ Template : The mail template ------ //
let renderTemplate = (data, relativePath) => {
    let mailHTML;

    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template) {
            if(err) {console.log('err: nodemailer config: ', err); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}