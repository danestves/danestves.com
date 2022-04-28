// Dependencies

// Internals
import { markdownToHtmlDocument } from "./markdown.server";

type MailData = {
  email: string;
  name: string;
  subject: string;
  text: string;
};

async function sendContactEmail({ email, name, subject, text }: MailData): Promise<{ message: string; id?: string }> {
  const auth = `${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}`;
  const html = await markdownToHtmlDocument(text);
  const body = new URLSearchParams({
    to: `"Daniel Esteves" <${process.env.MAILGUN_TO}>`,
    from: `"${name}" <${email}>`,
    html,
    subject,
    text,
  });

  return fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
    body,
    headers: {
      Authorization: `Basic ${auth}`,
    },
    method: "post",
  }).then((res) => res.json());
}

export { sendContactEmail };
