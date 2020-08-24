const sgMail = require("@sendgrid/mail");

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

const sendOTP = (email, otp) => {
  try {
    const msg = {
      to: email,
      from: "smartgenius098@gmail.com",
      subject: `VINIMAY : Verify your webmail address`,
      text: `Welcome to the VINIMAY app. Your otp for verification is ${otp} .`,
      html: `Welcome to the VINIMAY app. Your otp for verification is <b>${otp}</b> . Please don't share it with anyone. `,
    };
    const m = sgMail.send(msg);
    console.log("sent");
  } catch (err) {
    console.log(err);
  }
};

const sendIntrested = (email, intrestedName, productTitle, productId) => {
  try {
    const link = process.env.DOMAIN + "product/" + productId;
    const msg = {
      to: email,
      from: "smartgenius098@gmail.com",
      subject: `${intrestedName} in intrested in buying`,
      text: `${intrestedName} is intrested in buying your product :- ${productTitle}`,
      html: `${intrestedName} is intrested in buying your product :- <a href="${link}">${productTitle}</a> <br/><br/> If link is not working paste the below link in your browser <br/> ${link}`,
    };
    const m = sgMail.send(msg);
    console.log("sent");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendOTP, sendIntrested };
