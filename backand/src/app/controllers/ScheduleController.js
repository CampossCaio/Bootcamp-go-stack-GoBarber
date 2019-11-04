import User from '../models/User';
import Appointment from '../models/Appointments';

class ScheduleController {
  async index(req, res) {
    /**
    * Checando se o usuário é um provider
    */
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        date,
      },
    });
    return res.json(appointment);
  }
}

export default new ScheduleController();
