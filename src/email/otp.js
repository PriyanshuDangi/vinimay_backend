const sgMail = require("@sendgrid/mail");

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

const sendOTP = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: "smartgenius098@gmail.com",
      subject: `VINIMAY : Verify your webmail address`,
      text: `Welcome to the VINIMAY app. Your otp for verification is ${otp} .`,
      html: `Welcome to the VINIMAY app. Your otp for verification is <b>${otp}</b> . Please don't share it with anyone. `,
    };
    // sgMail.send(msg);
    const m = await sgMail.send(msg);
    // console.log(m);
    console.log("sent");
  } catch (err) {
    console.log(err);
  }
};

// sendOTP("106119096@nitt.edu", 2476);

module.exports = sendOTP;
