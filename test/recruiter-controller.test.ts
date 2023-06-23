import { stub, restore } from "sinon";
import { expect } from "chai";
import "mocha";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Recruiter from "../src/models/recruiter";
import { loginRecruiter, signupRecruiter } from "../src/controllers/recruiter";
import { mockRequest, mockResponse } from "mock-req-res";
import {
  DATABASE_ERROR,
  TEST_MOCKED_TOKEN,
  TEST_USER_EMAIL,
  TEST_USER_ID,
  TEST_USER_PASSWORD,
  TEST_USER_NAME,
  USER_CREATED,
  USER_WITH_EMAIL_NOT_FOUND,
  WRONG_PASSWORD,
} from "../src/utils/constants";
import { CustomError } from "../src/utils/types";

describe("Auth Controller", function () {
  it("should create a new user successfully with valid data", async () => {
    const req = mockRequest({
      body: {
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      json: stub(),
    });

    const next = stub();

    const bcryptHash = stub(bcrypt, "hash").resolves("mockHashedPw");

    const mockUser = {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      _id: TEST_USER_ID,
    };

    const userSave = stub(Recruiter.prototype, "save").resolves(mockUser);

    await signupRecruiter(req, res, next);

    setTimeout(() => {
      expect(bcryptHash.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: USER_CREATED,
          userId: mockUser._id,
        })
      ).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(next.called).to.be.false;
    }, 100);
  });

  it("should throw error when database is not connected while creating a new user", async () => {
    const req = mockRequest({
      body: {
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      json: stub(),
    });

    const next = stub();

    const bcryptHash = stub(bcrypt, "hash").resolves("mockHashedPw");

    const userSave = stub(Recruiter.prototype, "save").rejects(
      new Error(DATABASE_ERROR)
    );

    await signupRecruiter(req, res, next);

    setTimeout(() => {
      expect(bcryptHash.calledOnce).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(Error);
      expect(next.args[0][0].message).to.equal(DATABASE_ERROR);
    }, 100);
  });

  it("should throw an error if accessing the database fails", async () => {
    const req = mockRequest({
      body: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      json: stub(),
    });

    const next = stub();

    const userFindOne = stub(Recruiter, "findOne").rejects(
      new Error(DATABASE_ERROR)
    );

    await loginRecruiter(req, res, next);

    setTimeout(() => {
      expect(userFindOne.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.false;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(Error);
      expect(next.args[0][0].message).to.equal(DATABASE_ERROR);
    }, 100);
  });

  it("should throw an error if undefined user is retreived from database", async () => {
    const req = mockRequest({
      body: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      json: stub(),
    });

    const next = stub();

    const userFindOne = stub(Recruiter, "findOne").resolves(undefined);

    await loginRecruiter(req, res, next);

    setTimeout(() => {
      expect(userFindOne.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.false;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(CustomError);
      expect(next.args[0][0].message).to.equal(USER_WITH_EMAIL_NOT_FOUND);
    }, 100);
  });

  it("should throw an error if wrong password is provided by user", async () => {
    const req = mockRequest({
      body: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      json: stub(),
    });

    const next = stub();

    const mockUser = {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      _id: TEST_USER_ID,
    };

    const userFindOne = stub(Recruiter, "findOne").resolves(mockUser);

    await loginRecruiter(req, res, next);

    setTimeout(() => {
      expect(userFindOne.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.false;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(CustomError);
      expect(next.args[0][0].message).to.equal(WRONG_PASSWORD);
    }, 100);
  });

  it("should login successfully with valid credentials", async () => {
    const req = mockRequest({
      body: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      json: stub(),
    });

    const next = stub();
    const mockUser = {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      _id: TEST_USER_ID,
    };
    const userFindOne = stub(Recruiter, "findOne").resolves(mockUser);

    const bcryptCompare = stub(bcrypt, "compare").resolves(true);

    const jwtSign = stub(jwt, "sign").callsFake((payload, secret, options) => {
      return TEST_MOCKED_TOKEN;
    });
    await loginRecruiter(req, res, next);

    setTimeout(() => {
      expect(bcryptCompare.calledOnce).to.be.true;
      expect(jwtSign.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          token: TEST_MOCKED_TOKEN,
          recruiterId: TEST_USER_ID,
        })
      ).to.be.true;
      expect(next.called).to.be.false;
    }, 100);
  });

  afterEach(() => restore());
});
