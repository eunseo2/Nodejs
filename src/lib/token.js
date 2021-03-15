const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const { SECRET_KEY, CLIENT_HOST, API_HOST } = process.env;

if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  throw new Error('MISSING_ENVAR');
}

// Token 생성  암호화됨
const generateToken = (payload, options) => {
  const jwtOptions = {
    issuer: API_HOST, //토큰 발행자
    expriseIN: '30d', // 토큰 만료기간
    ...options,
  };

  if (!jwtOptions.expriseIN) {
    // removes expiresIn when expiresIn is given as undefined
    delete jwtOptions.expriseIN;
  }

  // payload : 토큰에 넣을 데이터, 비밀키, 옵션, 콜백함수
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(toekn);
    });
  });
};

//  token을 decode 하면 user:eunseo email: dmstj@gmail.com '''
const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decode) => {
      //검증
      if (err) reject(err);
      resolve(decode);
    });
  });
};

const setTokenCookie = (res, tokens) => {
  const { accessToken, refreshToken } = tokens;
  const isDev = process.env.NODE_ENV !== 'production';

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    domain: !IS_DEV ? CLIENT_HOST : undefined,
    maxAge: 1000 * 60 * 60 * 1, //1hour
    secure: !IS_DEV,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    domain: !IS_DEV ? CLIENT_HOST : undefined,
    maxAge: 1000 * 60 * 60 * 24 * 30, //30day
    secure: !IS_DEV,
  });
};

module.exports = {
  generateToken,
  decodeToken,
  setTokenCookie,
};
