import { Meteor } from 'meteor/meteor';
import { SSR } from 'meteor/meteorhacks:ssr';
import { Email } from 'meteor/email';

/* global Assets */

/**
 * Email sender to distribute RadGrad newsletter. Utilizes SSR to compile and render HTML/CSS code within the email.
 * @param to The recipient.
 * @param cc The cc recipients.
 * @param from The sender.
 * @param subject The email subject line.
 * @param templateData Custom data to be rendered in the email template. SSR is used to compile and
 * render the final content.
 */
export function sendEmail({
  to, bcc, from, replyTo, subject, templateData, filename,
}) {
  if (Meteor.isServer) {
    SSR.compileTemplate('htmlEmail', Assets.getText(`email/${filename}`));
    const html = SSR.render('htmlEmail', templateData);
    Email.send({
      to,
      bcc,
      replyTo,
      from,
      subject,
      html,
    });
  }
}
