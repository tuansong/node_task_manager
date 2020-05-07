const sgMail = require('@sendgrid/mail');

sgMail.setApiKey( process.env.SENDGRID_API_KEY );

const sendWelcomeMail = ( email, name ) => {
    sgMail.send({
        to: email,
        from: 'cuccu771@gmail.com',
        subject: 'Welcome to Task Manager',
        text: `Welcome to our app, ${ name }`
    })
} 

const sendFarewellMail = ( email, name ) => {
    sgMail.send({
        to: email,
        from: 'cuccu771@gmail.com',
        subject: 'Goodbye!',
        text: `Hope you enjoy when using our app, ${ name }`
    })
} 

module.exports = {
    sendWelcomeMail, sendFarewellMail
}