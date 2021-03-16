const Joi = require('joi');
const { Op } = require('sequelize');

const { validateSchema } = require('lib/utils');
const { setTokenCookie, removeTokenCookie } = require('lib/token');
const { User } = require('database/models');
const db = require('database/db');

exports.register = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().min(0).max(10).required(), //0~10 글자
    password: Joi.string().min(6).max(20).required(),
  });

  if (!validateSchema(res, schema, req.body)) return;

  const { username, email, password } = req.body;

  let existsUser = null;
  try {
    existsUser = await User.findOne({
      where: {
        [Op.or]: {
          username,
          email,
        }, // select * from user where username or email
      },
    });
  } catch (err) {
    next(err);
    return;
  }

  if (existsUser) {
    res.sendStatus(409);
    return;
  }

  const t = await db.transaction();

  try {
    const user = await User.register({
      username,
      email,
      password,
      transaction: t,
    });

    const tokens = await user.generateUserToken();

    setTokenCookie(res, tokens);

    await t.commit();

    res.status(201).send(user);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });

  if (!validateSchema(res, schema, req.body)) return;

  const { email, password } = req.body;

  let user = null;
  try {
    user = await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email', 'password'],
    });
  } catch (err) {
    next(err);
    return;
  }

  if (!user) {
    res.status(404).send('Not found user');
    return;
  }

  try {
    const validate = user.validatePassword(password);

    if (!validate) {
      res.status(403).send('Wrong password');
      return;
    }
    const tokens = await user.generateUserToken();

    setTokenCookie(res, tokens);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  res.sendStatus(200);
};

exports.check = async (req, res, next) => {
  res.send('check');
};
