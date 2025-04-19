export const sendEmailOtp = (otp: string) => `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>VERB OTP Verification</title>
    <style>
      body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
      }

      .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
      }

      .logo {
          width: 120px;
          margin-bottom: 20px;
          margin:auto;
            font-size: 24px;
          color: #333;
          font-weight: bold;
      }

      .header {
          font-size: 24px;
          color: #333;
          font-weight: bold;
      }

      .message {
          font-size: 12px;
          color: #555;
          margin: 20px 0;
      }

      .otp {
          font-size: 28px;
          font-weight: bold;
          color: #007BFF;
          background: #eef5ff;
          padding: 10px 20px;
          display: inline-block;
          border-radius: 6px;
          margin-top: 10px;
      }

      .footer {
          font-size: 12px;
          color: #777;
          margin-top: 15px;
      }

      @media screen and (max-width: 600px) {
          .container {
              padding: 15px;
          }

          .header {
              font-size: 20px;
          }

          .otp {
              font-size: 24px;
              padding: 8px 16px;
          }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h1 class="logo">VERB.</h1>
      <p class="message">Hello, <br />Use the OTP below to verify your email and complete your registration for VERB.</p>
      <div class="otp">${otp}</div>
      <p class="message">This OTP is valid for the next <b>10 minutes</b>. Do not share this code with anyone.</p>
      <div class="footer">If you didn’t request this, please ignore this email or contact our support team.</div>
    </div>
  </body>
</html>
`;
