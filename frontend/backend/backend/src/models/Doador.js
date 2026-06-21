import mongoose from 'mongoose'

/*
  MODEL: DOADOR

  Este schema representa o cadastro do doador no MongoDB.

  Ajuste feito nesta versão:
  - Adicionado o campo "genero".
  - O campo é opcional e começa como "Prefiro não dizer".
  - Mantivemos os campos antigos para não quebrar cadastros já existentes.
*/

const doadorSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    senha: {
      type: String,
      required: true
    },

    telefone: {
      type: String,
      default: '',
      trim: true
    },

    documento: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    /*
      Tipo de pessoa:
      - fisica
      - juridica
    */
    tipoPessoa: {
      type: String,
      default: 'fisica',
      trim: true
    },

    /*
      Campo novo:
      Usado para salvar a opção marcada no cadastro do doador.

      Exemplos:
      - Prefiro não dizer
      - Feminino
      - Masculino
      - Mulher trans
      - Homem trans
      - Pessoa não binária
      - Agênero
      - Gênero fluido
      - Outro
    */
    genero: {
      type: String,
      default: 'Prefiro não dizer',
      trim: true
    },

    pais: {
      type: String,
      default: 'Brasil',
      trim: true
    },

    estado: {
      type: String,
      default: '',
      trim: true
    },

    municipio: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Doador', doadorSchema)