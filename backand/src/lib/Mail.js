import nodemailer from 'nodemailer';
// import nodemailerhbs from 'nodemailer-express-handlebars';
// import exphbs from 'express-handlebars';
// import { resolve } from 'path';
import mailconfig from '../config/mail';

class Mail {
  constructor() {
    const {
      host, port, secure, auth,
    } = mailconfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    // this.configureTemplates();
  }
  /**
 *  configureTemplates() {
    const viewpath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use('compile', nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewpath, 'layouts'),
        partialsDir: resolve(viewpath, 'partiais'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewpath,
      extName: '.hbs',
    }));
  }
 */


  sendMail(message) {
    return this.transporter.sendMail({
      ...mailconfig.default,
      ...message,
    });
  }
}

export default new Mail();
