'use strict';

var assert = require('assert')
var umd = require('../')
var src = umd('sentinel-prime', 'return "sentinel"')
var namespacedSrc = umd('sentinel.prime', 'return "sentinel"')
var multiNamespaces = umd('a.b.c.d.e', 'return "sentinel"')
var amdDeps = umd('sentinel-prime', 'return "sentinel"', undefined, { amd: { deps: ['dep1', 'dep2'] } });

describe('with CommonJS', function () {
  it('uses module.exports', function () {
    var module = {exports: {}}
    Function('module,exports', src)(module,module.exports)
    assert(module.exports === 'sentinel')
  })
})
describe('with amd', function () {
  it('uses define', function () {
    var defed
    function define(d, fn) {
      assert.deepEqual(d, [], 'You must pass an empty array of dependencies to amd to prevent dependency scanning.');
      defed = fn()
    }
    define.amd = true
    Function('define', src)(define)
    assert(defed === 'sentinel')
  })
  it('uses the provided dependency array so the shorthand version of require can be used', function () {
    assert(amdDeps.indexOf('["dep1","dep2"]') > -1);
  });
})
describe('in the absense of a module system', function () {
  it('uses window', function () {
    var glob = {}
    Function('window', src)(glob)
    assert(glob.sentinelPrime === 'sentinel')
  })
  it('uses global', function () {
    var glob = {}
    Function('global,window', src)(glob)
    assert(glob.sentinelPrime === 'sentinel')
  })
  it('uses self', function () {
    var glob = {}
    Function('self,window,global', src)(glob)
    assert(glob.sentinelPrime === 'sentinel')
  })
  it('creates the proper namespaces', function() {
    var glob = {}
    Function('window', namespacedSrc)(glob)
    assert(glob.sentinel.prime === 'sentinel')
  })
  it('creates proper multiple namespaces', function() {
    var glob = {}
    Function('window', multiNamespaces)(glob)
    assert(glob.a.b.c.d.e === 'sentinel')
  })

})
