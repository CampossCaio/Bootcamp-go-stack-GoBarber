import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';


// Criando e exportando o objeto de configuração do multer
export default {
  storage: multer.diskStorage({
    // Caminho para onde o arquivo será encaminhado
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),

    // Configurando e gerando um hash para que o nome do arquivo seja único.
    filename: (req, file, cb) => {
      // Gera alguns caracteres aleatórios
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
