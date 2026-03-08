import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendOTPEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "KIIT Verification OTP",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`
  })
}