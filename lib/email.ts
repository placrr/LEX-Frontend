import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

function otpHtml(otp: string) {
  const year = new Date().getFullYear()

  const boxes = otp
    .split("")
    .map(
      (d) =>
        `<td style="width:46px;height:54px;background:#ffffff;border:2px solid #e5e7eb;border-radius:14px;text-align:center;font-size:24px;font-weight:700;color:#111827;font-family:'Segoe UI',Helvetica,Arial,sans-serif">${d}</td>`
    )
    .join('<td style="width:8px"></td>')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">

  <!-- Logo -->
  <tr>
    <td style="padding:0 0 28px;text-align:center">
      <span style="font-size:24px;font-weight:800;color:#111827;letter-spacing:-0.5px;font-family:'Segoe UI',Helvetica,Arial,sans-serif">Placr.</span>
    </td>
  </tr>

  <!-- Card -->
  <tr><td>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">

    <!-- Greeting -->
    <tr>
      <td style="padding:40px 40px 0;text-align:center">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#111827;line-height:1.3">Verify your email address</h1>
        <p style="margin:10px 0 0;font-size:14px;color:#6b7280;line-height:1.6">We received a sign-in request for your account. Enter the verification code below to continue.</p>
      </td>
    </tr>

    <!-- Code label -->
    <tr>
      <td style="padding:32px 40px 0;text-align:center">
        <p style="margin:0;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1.5px">Your code</p>
      </td>
    </tr>

    <!-- OTP boxes -->
    <tr>
      <td style="padding:16px 40px 0;text-align:center">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto">
          <tr>${boxes}</tr>
        </table>
      </td>
    </tr>

    <!-- Expiry -->
    <tr>
      <td style="padding:20px 40px 0;text-align:center">
        <span style="display:inline-block;background:#f3f4f6;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:600;color:#6b7280">Valid for 5 minutes</span>
      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td style="padding:32px 40px 0">
        <div style="border-top:1px solid #f3f4f6"></div>
      </td>
    </tr>

    <!-- Security -->
    <tr>
      <td style="padding:24px 40px 36px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;border:1px solid #f3f4f6">
          <tr>
            <td style="padding:16px 20px">
              <p style="margin:0 0 2px;font-size:12px;font-weight:600;color:#374151">Security Notice</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
                If you did not request this code, no action is needed. Never share this code with anyone — Placr will never ask for it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
  </td></tr>

  <!-- Footer -->
  <tr>
    <td style="padding:24px 0 0;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af">&copy; ${year} Placr. All rights reserved.</p>
      <p style="margin:4px 0 0;font-size:11px;color:#d1d5db">Built at KIIT University</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function sendOTPEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"Placr" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Placr Verification Code",
    text: `Your Placr verification code is ${otp}. It expires in 5 minutes. If you didn't request this, ignore this email.`,
    html: otpHtml(otp),
  })
}
