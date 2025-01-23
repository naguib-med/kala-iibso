import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  console.log("sendVerificationEmail", email, token);
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to confirm your email address:</p>
      <a href="${confirmLink}">Confirm Email</a>
    `,
  });
};
