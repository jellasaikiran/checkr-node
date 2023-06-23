import { expect } from "chai";
import { describe } from "mocha";
import jwt from "jsonwebtoken";
import { stub } from "sinon";
import { mockRequest, mockResponse } from "mock-req-res";
import isAuth from "../src/middlewares/is-auth";
import { TEST_USER_ID } from "../src/utils/constants";

describe("Auth middleware", function () {

  it("should throw an error if no authorization header is present", function () {
    const req = mockRequest({ get: (headerName: any) => null });
    const res = mockResponse();
    expect(isAuth.bind(this, req, res, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if no authorization header is only one string", function () {
    const req = mockRequest({
      get: (headerName: any) => "dummystring",
    });
    const res = mockResponse();
    expect(isAuth.bind(this, req, res, () => {})).to.throw();
  });

  it("should throw an error if token cannot be verified", function () {
    const req = mockRequest({
      get: (headerName: any) => "Bearer dummystring",
    });
    const jwtVerify = stub(jwt, "verify").resolves({
      recruiterId: TEST_USER_ID,
    });
    const res = mockResponse();

    isAuth(req, res, () => {});
    expect(req).to.have.property("recruiterId");
    expect(jwtVerify.called).to.be.true;
    jwtVerify.restore();
  });
  
});
