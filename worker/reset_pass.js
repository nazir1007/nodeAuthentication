const queue = require('../config/kue');

const resetPasswordMailer = require('../mailers/reset_pass_mailer');

queue.process('NodeAuthPassResetEmail', function(job, done) {
    console.log('Emails worker is processing the job ', job.data);

    resetPasswordMailer.resetPassword(job.data);
});