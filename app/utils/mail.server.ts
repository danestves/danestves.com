// Dependencies
import Mailgun from "mailgun-js";

// Internals
import { markdownToHtmlDocument } from "./markdown.server";

const mailgun = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY!,
  domain: process.env.MAILGUN_DOMAIN!,
});

type MailData = {
  email: string;
  name: string;
  subject: string;
  text: string;
};

async function sendContactEmail(
  { email, name, subject, text }: MailData,
  callback?: (error: Mailgun.Error, body: Mailgun.messages.SendResponse) => void
) {
  const html = await markdownToHtmlDocument(text);

  return mailgun
    .messages()
    .send(
      { to: `"Daniel Esteves" <${process.env.MAILGUN_TO}>`, from: `"${name}" <${email}>`, html, subject, text },
      callback
    );
}

export { sendContactEmail };
