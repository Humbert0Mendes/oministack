const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  //Realiza busca dos usuários
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    //Busca de acordo com as condições
    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislike } }
      ]
    });

    return res.json(users);
  },

  //Cria usuário
  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return res.json(userExists);
    }

    //Recupera dados da Api do Github
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    console.log(response.data);

    const { name, bio, avatar_url: avatar } = response.data;

    //Salva os dados recuperados na base de dados
    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });
    return res.json(dev);
  }
};
