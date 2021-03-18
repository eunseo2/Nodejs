const { User } = require('database/models');

const { decodeToken, setTokenCookie } = require('lib/token');

// refresh토큰 만료 30전
const refresh = async (res, refreshToken) => {
  try {
    const decoded = await decodeToken(refreshToken);
    const user = await User.findByPk(decoded.user.id); //pk 조회

    if (!user) {
      throw new Error('Invalid User error');
    }
    const tokens = await user.refreshUserToken(decoded.exp, refreshToken);
    setTokenCookie(res, tokens);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const consumeToken = async (req, res, next) => {
  const {
    access_token: accessToken,
    refresh_token: refreshToken,
  } = req.cookies;

  try {
    if (!accessToken) {
      throw new Error('No access token');
    }

    const accessTokenData = await decodeToken(accessToken);
    const { id: userId } = accessTokenData.user;

    const user = await User.findByPk(userId);

    req.user = user;

    // refresh token when exp < 30mins
    const diff = accessTokenData.exp * 1000 - new Date().getTime();
    if (diff < 1000 * 60 * 30 && refreshToken) {
      await refresh(res, refreshToken);
    }
  } catch (err) {
    if (!refreshToken) return next();
    try {
      // retry...
      const user = await refresh(res, refreshToken);
      req.user = user;
    } catch (e) {
      throw new Error(e);
    }
  }

  return next();
};

module.exports = consumeToken;
