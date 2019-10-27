module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    //Faz com que não seja obrigatório o uso do this dentro dos métodos
    "class-methods-use-this": "off",
    //Permite manipular valores passados por parametros
    "n0-param-reassingn": "off",
    //Faz com que não seja obrigatorio utilizar camelcase nas variáveis
    "camelcase": "off",
    //Permite que eu declare a cariavel next e não a utilize.
    "no-unused-vars": ["error", {"argsIgnorePattern": "next"}]
  },
};
