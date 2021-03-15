const errorHandler = (err, req, res, next) => {
  const message = err.stack || err;
  console.log(message);

  res.status(500).send(err.message || err);
  next();
};

module.exports = errorHandler;
//err
// const message = isContent ? 'NOT_FOUND' : 'MISSING_PATH';
// next(message);

//err.stack
//throw new로 에러 던진 것들은 stack에 쌓임. 그 에러처리
