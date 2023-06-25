import { stub, restore } from "sinon";
import { expect } from "chai";
import "mocha";

import Candidate from "../src/models/candidate";
import {
  addCandidate,
  getCandidateById,
  getCandidates,
} from "../src/controllers/candidate";
import { mockRequest, mockResponse } from "mock-req-res";
import {
  TEST_USER_ID,
  TEST_CANDIDATE_RESPONSE,
  CANDIDATE_CREATED,
  DATABASE_ERROR,
} from "../src/utils/constants";

describe("Candidates Controller", function () {
  it("should create a new candidate successfully with valid data", async () => {
    const req = mockRequest({
      body: TEST_CANDIDATE_RESPONSE[0],
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      json: stub(),
    });

    const next = stub();

    const mockUser = {
      ...TEST_CANDIDATE_RESPONSE[0],
      _id: TEST_USER_ID,
    };

    const candidateSave = stub(Candidate.prototype, "save").resolves(mockUser);

    await addCandidate(req, res, next);

    setTimeout(() => {
      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: CANDIDATE_CREATED,
          candidateId: mockUser._id,
        })
      ).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(next.called).to.be.false;
    }, 100);
  });

  it("should return throw error when database not connected while adding new candidate", async () => {
    const req = mockRequest({
      userId: TEST_USER_ID,
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      send: stub(),
    });

    const next = stub();

    const candiateSave = stub(Candidate.prototype, "save").rejects(
      new Error(DATABASE_ERROR)
    );

    await addCandidate(req, res, next);

    setTimeout(() => {
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(Error);
      expect(next.args[0][0].message).to.equal(DATABASE_ERROR);
    }, 100);
  });

  it("should return candidates list by id", async () => {
    const req = mockRequest({
      userId: TEST_USER_ID,
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      send: stub(),
    });

    const next = stub();

    const candidateFind = stub(Candidate, "find").resolves(
      TEST_CANDIDATE_RESPONSE
    );

    await getCandidateById(req, res, next);

    setTimeout(() => {
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(TEST_CANDIDATE_RESPONSE)).to.be.true;
      expect(next.called).to.be.false;
    }, 100);
  });

  it("should return throw error when database not connected while getting candidates list by id", async () => {
    const req = mockRequest({
      userId: TEST_USER_ID,
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      send: stub(),
    });

    const next = stub();

    const candidateFind = stub(Candidate, "find").rejects(
      new Error(DATABASE_ERROR)
    );

    await getCandidateById(req, res, next);

    setTimeout(() => {
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(Error);
      expect(next.args[0][0].message).to.equal(DATABASE_ERROR);
    }, 100);
  });

  it("should return candidates list", async () => {
    const req = mockRequest({
      userId: TEST_USER_ID,
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      send: stub(),
    });

    const next = stub();

    const candidateFindAll = stub(Candidate, "find").resolves(
      TEST_CANDIDATE_RESPONSE
    );

    await getCandidates(req, res, next);

    setTimeout(() => {
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(TEST_CANDIDATE_RESPONSE)).to.be.true;
      expect(next.called).to.be.false;
    }, 100);
  });

  it("should return throw error when database not connected while getting candidates list", async () => {
    const req = mockRequest({
      userId: TEST_USER_ID,
    });

    const res = mockResponse({
      status: stub().returnsThis(),
      send: stub(),
    });

    const next = stub();

    const candidateFindAll = stub(Candidate, "find").rejects(
      new Error(DATABASE_ERROR)
    );

    await getCandidates(req, res, next);

    setTimeout(() => {
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(Error);
      expect(next.args[0][0].message).to.equal(DATABASE_ERROR);
    }, 100);
  });

  // it("should throw an error if undefined user is retreived from database", async () => {
  //   const req = mockRequest({
  //     body: {
  //       email: TEST_USER_EMAIL,
  //       password: TEST_USER_PASSWORD,
  //     },
  //   });

  //   const res = mockResponse({
  //     status: stub().returnsThis(),
  //     json: stub(),
  //   });

  //   const next = stub();

  //   const userFindOne = stub(Recruiter, "findOne").resolves(undefined);

  //   await loginRecruiter(req, res, next);

  //   setTimeout(() => {
  //     expect(userFindOne.calledOnce).to.be.true;
  //     expect(res.status.called).to.be.false;
  //     expect(res.json.called).to.be.false;
  //     expect(next.calledOnce).to.be.true;
  //     expect(next.args[0][0]).to.be.instanceOf(CustomError);
  //     expect(next.args[0][0].message).to.equal(USER_WITH_EMAIL_NOT_FOUND);
  //   }, 100);
  // });

  // it("should throw an error if wrong password is provided by user", async () => {
  //   const req = mockRequest({
  //     body: {
  //       email: TEST_USER_EMAIL,
  //       password: TEST_USER_PASSWORD,
  //     },
  //   });

  //   const res = mockResponse({
  //     status: stub().returnsThis(),
  //     json: stub(),
  //   });

  //   const next = stub();

  //   const mockUser = {
  //     email: TEST_USER_EMAIL,
  //     password: TEST_USER_PASSWORD,
  //     _id: TEST_USER_ID,
  //   };

  //   const userFindOne = stub(Recruiter, "findOne").resolves(mockUser);

  //   await loginRecruiter(req, res, next);

  //   setTimeout(() => {
  //     expect(userFindOne.calledOnce).to.be.true;
  //     expect(res.status.called).to.be.false;
  //     expect(res.json.called).to.be.false;
  //     expect(next.calledOnce).to.be.true;
  //     expect(next.args[0][0]).to.be.instanceOf(CustomError);
  //     expect(next.args[0][0].message).to.equal(WRONG_PASSWORD);
  //   }, 100);
  // });

  // it("should login successfully with valid credentials", async () => {
  //   const req = mockRequest({
  //     body: {
  //       email: TEST_USER_EMAIL,
  //       password: TEST_USER_PASSWORD,
  //     },
  //   });

  //   const res = mockResponse({
  //     status: stub().returnsThis(),
  //     json: stub(),
  //   });

  //   const next = stub();
  //   const mockUser = {
  //     email: TEST_USER_EMAIL,
  //     password: TEST_USER_PASSWORD,
  //     _id: TEST_USER_ID,
  //   };
  //   const userFindOne = stub(Recruiter, "findOne").resolves(mockUser);

  //   const bcryptCompare = stub(bcrypt, "compare").resolves(true);

  //   const jwtSign = stub(jwt, "sign").callsFake((payload, secret, options) => {
  //     return TEST_MOCKED_TOKEN;
  //   });
  //   await loginRecruiter(req, res, next);

  //   setTimeout(() => {
  //     expect(bcryptCompare.calledOnce).to.be.true;
  //     expect(jwtSign.calledOnce).to.be.true;
  //     expect(res.status.calledWith(200)).to.be.true;
  //     expect(
  //       res.json.calledWith({
  //         token: TEST_MOCKED_TOKEN,
  //         recruiterId: TEST_USER_ID,
  //       })
  //     ).to.be.true;
  //     expect(next.called).to.be.false;
  //   }, 100);
  // });

  afterEach(() => restore());
});
