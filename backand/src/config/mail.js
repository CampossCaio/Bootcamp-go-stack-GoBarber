export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  sucure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreplay@gobarber.com>',
  },
};
