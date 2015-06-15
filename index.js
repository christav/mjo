function createObject() {
  var args = Array.prototype.slice.call(arguments, 0);
  return args
    .filter(isNotNullOrUndefined)
    .reduce(createFromSource, {});
}

function extendObject(target) {
  var sources = Array.prototype.slice.call(arguments, 1);
  return sources.filter(isNotNullOrUndefined).reduce(createFromSource, target);
}

function createFromSource(result, source) {
  if (isArgumentsObj(source)) {
    return createFromArray(result, Array.prototype.slice.call(source, 0));
  }

  if (Array.isArray(source)) {
    return createFromArray(result, source);
  }

  if (isObject(source)) {
    return extend(result, source);
  }
  return result;
}

// Type based creation functions.

function createFromArray(result, sources) {
  return sources.reduce(createFromSource, result);
}

//
// Predicate for not null/undefined
//
function isNotNullOrUndefined(value) {
  return typeof value !== 'undefined' && value !== null;
}

// Quickie check if something is an arguments object.
function isArgumentsObj(obj) {
  return !!obj && typeof obj === 'object' && ('callee' in obj) && typeof obj.length === 'number';
}

function isObject(obj) {
  return !!obj && typeof obj === 'object';
}

if (typeof Object.assign === 'function') {
  function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);
    return Object.assign(target, sources);
  }
} else {
  function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function (source) {
      Object.keys(source).forEach(function(key) {
        target[key] = source[key];
      });
    });
    return target;
  }
}

module.exports.o = createObject;
module.exports.extend = extendObject;
