import { format, parseISO, pt } from 'date-fns';
import Mail from '../../lib/Mail';


class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    console.log('A fila executou');
    const { appointment } = data;
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      text: 'Você tem um agendamento cancelado',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM' , as ' H:mm'h' ",
          {
            locate: pt,
          },
        ),
      },
    });
  }
}

export default new CancellationMail();
