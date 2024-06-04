import NodeMailer from "nodemailer";

const sendOtpMail = async (otp: string, email: string) => {
  const template = `
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Secure Talk</a>
  </div>
  <p style="font-size:1.1em">Hi,</p>
  <p>Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
  <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>Your Brand Inc</p>
    <p>1600 Amphitheatre Parkway</p>
    <p>California</p>
  </div>
</div>
</div>
`;
  const mailer = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "nodemailer.calistomathias@gmail.com",
      pass: "jkha wyjx mxpz vehy",
    },
  });

  const info = await mailer.sendMail({
    from: "SecureTalk <nodemailer-securetalk@gmail.com>",
    to: email,
    subject: "Login OTP for SecureTalk",
    html: template,
  });
};

export default sendOtpMail;
