import gmail from 'gmail-send';
import { gmail as gmailConfig } from '../config';

export function sendEmail(to, subject, text) {
  const send = gmail({
    user: gmailConfig.user,
    pass: gmailConfig.pass,
    to,
    subject,
  });

  send({
    text,
  }, (error, result, fullResult) => {
    if (error) console.error(error);
    console.log(result);
  });
}
