import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const generateOtp = async (req, res) => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  return OTP;
};

export async function sendOTPEmail(email) {
  // --------------------------------------------------------
  console.log("sending otp");
  const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const opt = await generateOtp();

  //send mail with defined transport object

  const mailOptions = {
    //sender's email
    from: process.env.MAILER_USER,

    //recipient's email
    to: email,

    //subject of the email
    subject: `OTP for Postaway`,

    //text of the email
    text: `Your OTP is ${opt}. It is valid for 10 minutes.`,

    //html body of the email
    html: `<h3>Your OTP is ${opt}. It is valid for 10 minutes.</h3>`,
  };
  // --------------------------------------------------------

  //Send the email and catch errors if any

  //send the email
  try {
    //send the email and log the success message
    const result = await transporter.sendMail(mailOptions);
    console.log("Success: OTP Email sent to " + email);
  } catch (error) {
    //catch any errors and log them
    console.log("Error: Email sent fail with error: " + error);
  }

  return opt;
}
