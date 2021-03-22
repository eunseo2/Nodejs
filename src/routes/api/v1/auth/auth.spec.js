// jest를 이용해서 unit test

const httpMocks = require('node-mocks-http');

const { User } = require('database/models');
const { mockUser } = require('test/mock');
const { register, login, logout } = require('./auth.ctrl');

// test에서 req,res,next 필요함.
let req = null;
let res = null;
let next = null;

User.findOne = null;
User.register = null;

// 공통되는 코드 // 모든 test 실행전에 먼저 실행
beforeEach(() => {
  User.findOne = jest.fn(); //mock 함수 생성
  User.register = jest.fn();

  // 단위테스트에서 request, response 객체 얻기
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn(); //spy
});

describe('/api/v1/auth', () => {
  describe('[POST] /register', () => {
    let existUser = null;
    beforeEach(async () => {
      // [post] / register describe 테스트케이스 전 실행
      const { payload, user } = await mockUser();
      existUser = user;
      req.body = payload; // 테스트 데이터 가져오기
    });

    describe('[Success]', () => {
      it('should hava a register function', () => {
        expect(typeof register).toBe('function');
      });

      it('should return 201 status code in response', async () => {
        User.findOne.mockResolvedValue(null); //가짜 함수가 어떠한 결과값을 알려줄때?
        User.register.mockResolvedValue(existUser);
        await register(req, res, next);
        expect(res.statusCode).toBe(201); //상태값
        expect(res._isEndCalled()).toBe(true); // .send()가 잘 보내지면 true
      });
    });

    describe('Failure', () => {
      it('should return 400 status code in response', async () => {
        req.body.email = null; // email 없음
        await register(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBe(true);
      });

      it('should return 409 status code in response', async () => {
        User.findOne.mockResolvedValue(existUser); // 이미 user가 있을경우
        await register(req, res, next);
        expect(res.statusCode).toBe(409);
        expect(res._isEndCalled()).toBe(true);
      });

      it('should handle error : User.register', async () => {
        const errorMessage = { message: 'throw User.register error' };
        User.findOne.mockResolvedValue(null);
        User.register.mockRejectedValue(errorMessage);
        await register(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('[POST] / login', () => {
    let loggedUser = null;
    beforeEach(async () => {
      const { payload, user } = await mockUser();
      const { username, ...rest } = payload;
      user.validatePassword = jest.fn();
      loggedUser = user;
      req.body = { ...rest };
    });

    describe('[Success]', () => {
      it('should hava a login function', () => {
        expect(typeof login).toBe('function');
      });
      it('should return 200 ststus code in response', async () => {
        User.findOne.mockResolvedValue(loggedUser);
        loggedUser.validatePassword.mockReturnValue(true);
        await login(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBe(true);
      });
    });

    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        req.body.email = null; // email 없음
        await login(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBe(true);
      });

      it('should handle error: User.findeOne', async () => {
        const errorMessage = { message: 'throw User.findOne' };
        User.findOne.mockRejectedValue(errorMessage);
        await login(req, res, next);
        expect(next).toHaveBeenLastCalledWith(errorMessage);
      });

      it('should return 404 status code in response', async () => {
        User.findOne.mockResolvedValue(null); // user가 없음
        await login(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBe(true);
      });

      it('should return 403 status code in response', async () => {
        User.findOne.mockResolvedValue(loggedUser);
        loggedUser.validatePassword.mockReturnValue(false);
        await login(req, res, next);
        expect(res.statusCode).toBe(403);
        expect(res._isEndCalled()).toBe(true);
      });

      it('should handle error, user.validatePassword', async () => {
        const error = new Error('throw user.validatePassword');
        User.findOne.mockResolvedValue(loggedUser);
        loggedUser.validatePassword.mockImplementation(() => {
          throw error;
        });
        await login(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('[POST] /logout', () => {
    describe('[Success]', () => {
      it('should hava a logout function', () => {
        expect(typeof logout).toBe('function');
      });
      it('should return 200 status code in response', async () => {
        await logout(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBe(true);
      });
    });
  });
});
