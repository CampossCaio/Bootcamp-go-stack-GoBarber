import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // Buscando os usuários onde privider é true
    const providers = await User.findAll({
      where: { provider: true },
      // Informando quais campos eu quero buscar
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],


    });
    res.json(providers);
  }
}

export default new ProviderController();
