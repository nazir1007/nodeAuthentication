module.exports.key_values = {

    // ----- for Node mailer ----- //
    nodemailer_service: "gmail",
    nodemailer_host: "smtp.gmail.com",
    nodemailer_port: 587,
//----- add Email Id used for sending mail to other user ------- //
    nodemailer_user: "",
//----- add password for above user ID (create password using app password from google services) ------ //
    nodemailer_pass: "",
    
    // ------ mongoose DB path ------ //
    mongoose_db: "mongodb://localhost/node_authentication", 
    
    // ----- for Google captcha ------ //
    re_captcha_secret_key : "6Lf4btUkAAAAAO6GPqg9A5jKeBBpHnk2lZKq7wNi",

    // ------ for google authentication ------- //
    g_client_id: "207922909127-7fuo04g10eide5hukobui7u420k1slef.apps.googleusercontent.com", 
    g_client_secret : "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",
    g_callback_url : "http://localhost:8000/auth/google/callback"
};