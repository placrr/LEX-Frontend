import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function otpHtml(otp: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
<tr><td align="center">
<table width="400" cellpadding="0" cellspacing="0" style="max-width:400px;width:100%">

  <tr>
    <td style="padding:0 0 32px">
      <span style="font-size:20px;font-weight:700;color:#111">Placr.</span>
    </td>
  </tr>

  <tr>
    <td>
      <p style="margin:0 0 8px;font-size:15px;color:#111;font-weight:600">Your verification code</p>
      <p style="margin:0 0 24px;font-size:13px;color:#666;line-height:1.5">Enter this code to sign in to your Placr account.</p>
    </td>
  </tr>

  <tr>
    <td style="padding:0 0 24px">
      <span style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:8px;color:#111;background:#f5f5f5;padding:16px 24px;border-radius:8px">${otp}</span>
    </td>
  </tr>

  <tr>
    <td>
      <p style="margin:0 0 32px;font-size:12px;color:#999">This code expires in 5 minutes. If you didn't request this, ignore this email.</p>
    </td>
  </tr>

  <tr>
    <td style="border-top:1px solid #eee;padding:20px 0 0">
      <p style="margin:0;font-size:11px;color:#ccc">Placr &middot; KIIT University</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function sendOTPEmail(to: string, otp: string) {
  await resend.emails.send({
    from: "Placr <onboarding@resend.dev>",
    to,
    subject: "Your Placr Verification Code",
    text: `Your Placr verification code is ${otp}. It expires in 5 minutes. If you didn't request this, ignore this email.`,
    html: otpHtml(otp),
  })
}
