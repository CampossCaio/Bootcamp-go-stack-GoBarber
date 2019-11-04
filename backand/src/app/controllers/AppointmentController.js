import * as Yup from 'yup';
import { parseISO, isBefore, startOfHour } from 'date-fns';

import User from '../models/User';
import Appointments from '../models/Appointments';
import File from '../models/File';

class AppointmentsController {
  /**
   * Lista todos os agendamentos feitos pelo usuário utilizando page
   */
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
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

    return res.json(appointments);
  }
}

export default new AppointmentsController();
