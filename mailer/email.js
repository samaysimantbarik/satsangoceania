var nodemailer = require('nodemailer');
const config= require('config');

function sendmail(recipient,subject,html,next){
var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: config.get("email.username"),
      pass: config.get("email.password")
    }
  });

  var mailOptions = {
    from: config.get("email.username"),
    to: recipient,
    subject: subject,
    text: 'Account Information',
    html: html
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return next(error);
      }
      else{
          return next("","success");
      }
  });
}
module.exports=sendmail;