// Emailtemplate.js

export const RESET_PASSWORD_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password</title>

  <style>
    body{
      margin:0;
      padding:0;
      background:#f4f4f4;
      font-family:Arial,sans-serif;
    }

    .container{
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:10px;
      overflow:hidden;
      border:1px solid #e5e5e5;
      box-shadow:0 4px 10px rgba(0,0,0,0.08);
    }

    .header{
      background:#4CAF50;
      padding:24px;
      text-align:center;
      color:#fff;
      font-size:28px;
      font-weight:bold;
    }

    .content{
      padding:30px;
      color:#333;
      line-height:1.7;
    }

    .button{
      display:inline-block;
      margin-top:20px;
      padding:14px 28px;
      background:#4CAF50;
      color:#fff !important;
      text-decoration:none;
      border-radius:6px;
      font-size:16px;
      font-weight:bold;
    }

    .link-box{
      margin-top:20px;
      padding:12px;
      background:#f8f8f8;
      border:1px dashed #4CAF50;
      border-radius:5px;
      word-break:break-word;
      color:#333;
      font-size:14px;
    }

    .footer{
      background:#f9f9f9;
      padding:16px;
      text-align:center;
      font-size:12px;
      color:#777;
      border-top:1px solid #eee;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      Reset Your Password
    </div>

    <div class="content">
      <p>Hello,</p>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the button below to reset your password:
      </p>

      <a href="{resetLink}" class="button">
        Reset Password
      </a>

      <p>
        Or copy and paste this link into your browser:
      </p>

      <div class="link-box">
        {resetLink}
      </div>

      <p>
        This link will expire in 15 minutes.
      </p>

      <p>
        If you did not request a password reset,
        you can safely ignore this email.
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Cloudmate Technologies LLP.
      All rights reserved.
    </div>

  </div>

</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome</title>

  <style>
    body{
      margin:0;
      padding:0;
      background:#f4f4f4;
      font-family:Arial,sans-serif;
    }

    .container{
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:10px;
      overflow:hidden;
      border:1px solid #e5e5e5;
      box-shadow:0 4px 10px rgba(0,0,0,0.08);
    }

    .header{
      background:#007BFF;
      color:#fff;
      text-align:center;
      padding:24px;
      font-size:28px;
      font-weight:bold;
    }

    .content{
      padding:30px;
      color:#333;
      line-height:1.7;
    }

    .button{
      display:inline-block;
      margin-top:20px;
      padding:14px 28px;
      background:#007BFF;
      color:#fff !important;
      text-decoration:none;
      border-radius:6px;
      font-size:16px;
      font-weight:bold;
    }

    .footer{
      background:#f9f9f9;
      padding:16px;
      text-align:center;
      font-size:12px;
      color:#777;
      border-top:1px solid #eee;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      Welcome to Our Community
    </div>

    <div class="content">

      <p>Hello {name},</p>

      <p>
        Welcome to our platform.
        We’re excited to have you with us.
      </p>

      <p>
        You can now explore all features and services.
      </p>

      <a href="{websiteLink}" class="button">
        Get Started
      </a>

      <p>
        If you have any questions,
        feel free to contact our support team.
      </p>

    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Cloudmate Technologies LLP.
      All rights reserved.
    </div>

  </div>

</body>
</html>
`;
