import { Meteor } from 'meteor/meteor';
import { SSR } from 'meteor/meteorhacks:ssr';
import { Email } from 'meteor/email';
import { ZipZap } from 'meteor/udondan:zipzap';

/* global Assets */

/**
 * Email sender to distribute RadGrad newsletter. Utilizes SSR to compile and render HTML/CSS code within the email.
 * @param to The recipient.
 * @param from The sender.
 * @param subject The email subject line.
 * @param emailData Custom data to be rendered in the email template. SSR is used to compile and
 * render the final content.
 */
export function sendEmail({ to, cc, from, subject, templateData }) {
  if (Meteor.isServer) {
    SSR.compileTemplate('htmlEmail', Assets.getText('email/newsletter.html'));
    const html = SSR.render('htmlEmail', templateData);
    const zip = new ZipZap();
    const filename = 'newsletter.html';
    zip.file(filename, html);
    zip.saveAs('/home/weng/Documents/newsletter.zip');
    /* Email.send({
      to,
      from,
      subject,
      html,
    }); */
  }
}
