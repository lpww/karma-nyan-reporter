'use strict';

var rewire = require('rewire');
var chai = require('chai');
var sinon = require('sinon');

chai.config.includeStack = true;
chai.use(require('sinon-chai'));

var assert = chai.assert;
var eq = assert.equal;
var ok = assert.ok;


describe('data/types.js test suite', function() {
  var dt, clcFake, right;
  var tab = 3;

  beforeEach(function(done) {
    right = 'right>';

    clcFake = {
      'right': sinon.stub(),
      'white': sinon.stub(),
      'red': sinon.stub(),
      'yellow': sinon.stub(),
      'redBright': sinon.stub(),
      'blackBright': sinon.stub()
    };

    clcFake.right.returns(right);

    dt = rewire('../lib/data/types');
    dt.__set__('clc', clcFake);
    done();
  });

  /**
   * Suite - class tests
   */

  describe('Suite - class tests', function() {
    var sut, name, suites, tests;

    beforeEach(function(done) {
      name = 'suite';
      suites = ['a', 'b', 'c'];
      tests = [1, 2, 3];

      sut = new dt.Suite(name);

      sut.suites = suites;
      sut.tests = tests;

      done();
    });

    it('should have the properties set correctly', function() {
      eq(name, sut.name);
      eq(0, sut.depth);
      eq(3, sut.suites.length);
      eq(3, sut.tests.length);
    });

    it('should return a string as expected when depth is 0', function() {
      var underlineFake = sinon.stub();
      underlineFake.returns('underline>' + sut.name);

      clcFake.white = {
        underline: underlineFake
      };

      var expected = [
        right + 'underline>' + name,
        tests.join('\n\n'),
        '',
        suites.join('\n\n'),
        '',
        '', ''
      ].join('\n');

      var actual = sut.toString();

      eq(expected, actual);
      ok(underlineFake.calledOnce);
      ok(underlineFake.calledWithExactly(name));
    });

    it('should return a string as expected when depth is > 0', function() {
      var actual, expected;

      clcFake.white.returns('white>' + sut.name);

      expected = [
        right + 'white>' + name,
        tests.join('\n\n'),
        '',
        suites.join('\n\n'),
        '',
        '', ''
      ].join('\n');

      sut.depth = 1;
      actual = sut.toString();

      eq(expected, actual);
      ok(clcFake.right.calledOnce);
      ok(clcFake.right.calledWithExactly(sut.depth * tab + 1));
      ok(clcFake.white.calledOnce);
      ok(clcFake.white.calledWithExactly(name));
    });
  });

  /**
   * Test - class tests
   */

  describe('Test - class tests', function() {
    var sut, name, depth, browsers;

    beforeEach(function(done) {
      name = 'test';
      depth = 5;
      browsers = ['a', 'b', 'c'];

      sut = new dt.Test(name);

      sut.depth = depth;
      sut.browsers = browsers;

      done();
    });

    it('should have the properties set correctly', function() {
      eq(name, sut.name);
      eq(depth, sut.depth);
      eq(browsers, sut.browsers);
    });

    it('should return the expected string when toString is called', function() {
      var actual, expected;
      var redReturn = 'red>' + name;

      clcFake.red.returns(redReturn);

      expected = [
        right + redReturn,
        browsers.join('\n')
      ].join('\n');

      actual = sut.toString();

      eq(expected, actual);
      ok(clcFake.right.calledOnce);
      ok(clcFake.right.calledWithExactly(depth * tab + 1));
      ok(clcFake.red.calledOnce);
      ok(clcFake.red.calledWithExactly(name));
    });
  });

  /**
   * Browser - class tests
   */

  describe('Browser - class tests', function() {
    var sut, name, depth, errors;

    beforeEach(function(done) {
      name = 'browser';
      depth = 4;
      errors = ['x', 'y', 'z'];

      sut = new dt.Browser(name);
      sut.depth = depth;
      sut.errors = errors;

      done();
    });

    it('should have the properties set correctly', function() {
      eq(name, sut.name);
      eq(depth, sut.depth);
      eq(errors, sut.errors);
    });

    it('should call clc.right as expected when toString is called', function() {
      sut.toString();

      eq(4, clcFake.right.callCount);
      ok(clcFake.right.getCall(0).calledWithExactly(depth * tab + 1));
      ok(clcFake.right.getCall(1).calledWithExactly((depth + 1) * tab + 1));
      ok(clcFake.right.getCall(2).calledWithExactly((depth + 2) * tab + 1));
      ok(clcFake.right.getCall(3).calledWithExactly((depth + 2) * tab + 1));
    });

    it('should call the color methods on clc as expected when toString is called', function() {
      sut.toString();

      ok(clcFake.yellow.calledOnce);
      ok(clcFake.yellow.calledWithExactly(name));

      ok(clcFake.redBright.calledOnce);
      ok(clcFake.redBright.calledWithExactly(errors[0]));

      ok(clcFake.blackBright.calledTwice);
      ok(clcFake.blackBright.getCall(0).calledWithExactly(errors[1]));
      ok(clcFake.blackBright.getCall(1).calledWithExactly(errors[2]));
    });

    it('should return the expected string when toString is called', function() {
      var expected, actual;
      var yellow = 'yellow>';
      var redBright = 'redBright>';
      var blackBright = 'blackBright>';

      clcFake.yellow.returns(yellow);
      clcFake.redBright.returns(redBright);
      clcFake.blackBright.returns(blackBright);

      expected = [
        right + yellow,
        right + '1) ' + redBright,
        right + blackBright,
        right + blackBright,
      ].join('\n');

      actual = sut.toString();

      eq(expected, actual);
    });
  });

});
