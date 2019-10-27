
// Importando Yup
import * as Yup from 'yup';
import User from '../models/User';

class UserControler {
  // Cria usuário
  async store(req, res) {
    // Validando dados de entrada.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    // Verifica se o eschema contem todas as informações necessárias
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Buscando um usuário pelo email e comparando se esse email ja existe
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'User already exists. ' });
    }

    const {
      id, name, email, provider,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // Edita dados do usuário
  async update(req, res) {
    // Validando dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      odlPassword: Yup.string().min(6),
      // Torna o campo password obrigatório caso o campo oldPassword tenha sido preenchido
      password: Yup.string().min(6)
        .when('oldPassword', (odlPassword, field) => (odlPassword ? field.required() : field)),
      // Torna o campo confirmPassword obrigatório caso o campo password tenha sido preenchido
      confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
    });

    // Verifica se o eschema contem todas as informações necessárias
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation not fails' });
    }

    const { email, odlPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Compara se o email passado é diferente do email salvo no banco
    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(401).json({ error: 'User already existis' });
      }
    }

    // Compara se o usuário passou uma senha antiga e caso tenha passado,
    // verifica se a senha é diferente da senha salva no banco
    if (odlPassword && !(await user.checkPassword(odlPassword))) {
      res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserControler();
