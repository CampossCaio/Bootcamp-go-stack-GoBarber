import jwt from 'jsonwebtoken';
// transforma uma função de callback em async
import { promisify } from 'util';
import authConfig from '../../config/auth';


export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificando se contem o token
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // separando a string pelo espaço e pegando apenas o token
  const [, token] = authHeader.split(' ');

  try {
    // Verificando se o token é válido
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Incluindo o id do usuário dentro do req
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
