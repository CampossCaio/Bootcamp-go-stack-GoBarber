/* eslint-disable eqeqeq */
import * as Yup from 'yup';
import {
  parseISO, isBefore, startOfHour, format, subHours,
} from 'date-fns';

import User from '../models/User';
import Appointments from '../models/Appointments';
import File from '../models/File';
import Notification from '../schemas/Notification';
// import Mail from '../../lib/Mail';
import Queue from '../../lib/Queue';
import CancelattionMail from '../Jobs/Cancellationmail';

class AppointmentsController {
  /**
   * Lista todos os agendamentos feitos pelo usuário utilizando page
   */
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },

      ],
    });

    return res.json(appointments);
  }

  /**
   * Create appontment
   */
  async store(req, res) {
    // Validando dados de entrada
    const schema = Yup.object().shape({
      provider_id: Yup.number().required().integer(),
      date: Yup.date().required(),
    });

    // Validando os campos passados na requisição
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation not fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_d is a provider
     */
    const checkProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // verificando se esse provider existe
    if (!checkProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    if (checkProvider.id == req.userId) {
      return res.status(401).json({ error: 'Provider can not schedule with himself ' });
    }

    /**
     * Converte o date para um objeto DATE do javascript
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * Checks if the date has passed
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permited' });
    }

    /**
     * check date avaibility
     */
    const checkAvailability = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointmens date is not available' });
    }

    /**
     * Create appointments
     */
    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formatedDate = format(
      hourStart,
      "'dia' dd 'de' mm 'as' hh':'mm",
    );
    await Notification.create({
      content: `Ǹovo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointments);
  }

  async delete(req, res) {
    const { id } = req.params;

    const appointment = await Appointments.findByPk(id,
      {
        include: [
          {
            model: User,
            as: 'provider',
            attributes: ['name', 'email'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['name'],
          },
        ],
      });

    if (appointment.canceled_at != null) {
      return res.status(401).json({
        error: 'You can only cancel existing appointments ',
      });
    }

    if (appointment.user_id != req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // Pegando a hora atual subtraindo duas horas
    const dataWithSub = subHours(appointment.date, 2);

    if (!isBefore(dataWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only calcel appointments 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date();

    appointment.save();

    /*
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      text: 'Você tem um agendamento cancelado',
    });
  */

    Queue.add(CancelattionMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentsController();
