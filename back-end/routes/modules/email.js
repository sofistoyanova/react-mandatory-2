const nodemailer = require('nodemailer')

const sendEmail = async (email, username, url) => {

    let transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sofi.stoyanova2@gmail.com', // generated ethereal user
          pass: 'TheTimeIs2' // generated ethereal password
        }
      });

      try {
        let info = await transporter.sendMail({
            from: 'Sofi Stoyanova', // sender address
            to: email, // list of receivers
            subject: "Forgotten password", // Subject line
            text: "Hello world?", // plain text body
            html: `
            <p>Hey ${username},</p>
            <p>You requested a link to reset your passwword</p>
            <p>Open this link in the browser to change your password</p>
            <a href=${url}>${url}</a>
            <p>Please, use this link within 1 hour</p>
            `
          });
      
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch(err) {
        console.log(err)
    }
}

module.exports = sendEmail
//sendEmail('ss@blazarcapital.com')