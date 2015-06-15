'use strict';

var joe = require('joe');
var expect = require('chai').expect;
var should = require('chai').should();
var mjo = require('..');

joe.describe('Object', function (describe, it) {
  describe('construction', function (describe, it) {
    it('should construct empty object', function () {
      var obj = mjo.o();
      expect(obj).to.be.an('object');
      expect(Object.keys(obj)).to.have.length(0);
    });

    it('should construct object with given properties', function () {
      var obj = mjo.o({a: 1, b: '2'});
      expect(obj).to.be.an('object');
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal('2');
      expect(Object.keys(obj)).to.have.length(2);
    });

    it('should construct from multiple source objects', function () {
      var obj = mjo.o({a: 1}, {b: '2'});
      expect(obj).to.be.an('object');
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal('2');
      expect(Object.keys(obj)).to.have.length(2);
    });

    it('should allow null in parameter list', function () {
      var obj = mjo.o({a: 1}, null, {b: '2'});
      expect(obj).to.be.an('object');
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal('2');
      expect(Object.keys(obj)).to.have.length(2);
    });

    it('should flatten array in parameter list', function () {
      var obj = mjo.o({a: 1}, [{b: '2'}, {c: 3}], {d: 4});
      expect(obj).to.be.an('object');
      expect(obj).to.have.all.keys({a:0, b:0, c:0, d:0});
    });

    it('should flatten arbitrarily deep arrays and ignore nulls and empty arrays', function () {
      var obj = mjo.o([[[{a:1}], [[null, {b: '2'}], {c: 3}], null], [{d: 4}], []]);
      expect(obj).to.be.an('object');
      expect(obj).to.have.all.keys({a:0, b:0, c:0, d:0});
      expect(obj).to.have.property('a', 1);
      expect(obj).to.have.property('b', '2');
      expect(obj).to.have.property('c', 3);
      expect(obj).to.have.property('d', 4);
    });
  });

  describe('extension', function (describe, it) {
    it('should return original object', function () {
      var obj = {a: 1};
      var o2 = mjo.extend(obj, {});
      expect(o2).equals(obj);
    });

    it('should add properties to original object', function () {
      var obj = {a: 1};
      mjo.extend(obj, {b: '2'}, [{c: 3, d: 4}]);
      expect(obj).to.have.all.keys(['a', 'b', 'c', 'd']);
      expect(obj).to.have.property('a', 1);
      expect(obj).to.have.property('b', '2');
      expect(obj).to.have.property('c', 3);
      expect(obj).to.have.property('d', 4);
    });
  });
});