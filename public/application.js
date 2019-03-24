webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(18);
var hide = __webpack_require__(11);
var redefine = __webpack_require__(12);
var ctx = __webpack_require__(19);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(49)('wks');
var uid = __webpack_require__(34);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(21);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(3)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(1);
var IE8_DOM_DEFINE = __webpack_require__(102);
var toPrimitive = __webpack_require__(23);
var dP = Object.defineProperty;

exports.f = __webpack_require__(7) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var createDesc = __webpack_require__(33);
module.exports = __webpack_require__(7) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(11);
var has = __webpack_require__(14);
var SRC = __webpack_require__(34)('src');
var $toString = __webpack_require__(149);
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(18).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var fails = __webpack_require__(3);
var defined = __webpack_require__(24);
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(50);
var defined = __webpack_require__(24);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(51);
var createDesc = __webpack_require__(33);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(23);
var has = __webpack_require__(14);
var IE8_DOM_DEFINE = __webpack_require__(102);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(7) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(14);
var toObject = __webpack_require__(9);
var IE_PROTO = __webpack_require__(71)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.4' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(10);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(3);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(18);
var fails = __webpack_require__(3);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(19);
var IObject = __webpack_require__(50);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(6);
var asc = __webpack_require__(87);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if (__webpack_require__(7)) {
  var LIBRARY = __webpack_require__(30);
  var global = __webpack_require__(2);
  var fails = __webpack_require__(3);
  var $export = __webpack_require__(0);
  var $typed = __webpack_require__(64);
  var $buffer = __webpack_require__(95);
  var ctx = __webpack_require__(19);
  var anInstance = __webpack_require__(40);
  var propertyDesc = __webpack_require__(33);
  var hide = __webpack_require__(11);
  var redefineAll = __webpack_require__(42);
  var toInteger = __webpack_require__(21);
  var toLength = __webpack_require__(6);
  var toIndex = __webpack_require__(130);
  var toAbsoluteIndex = __webpack_require__(36);
  var toPrimitive = __webpack_require__(23);
  var has = __webpack_require__(14);
  var classof = __webpack_require__(46);
  var isObject = __webpack_require__(4);
  var toObject = __webpack_require__(9);
  var isArrayIter = __webpack_require__(84);
  var create = __webpack_require__(37);
  var getPrototypeOf = __webpack_require__(17);
  var gOPN = __webpack_require__(38).f;
  var getIterFn = __webpack_require__(86);
  var uid = __webpack_require__(34);
  var wks = __webpack_require__(5);
  var createArrayMethod = __webpack_require__(26);
  var createArrayIncludes = __webpack_require__(54);
  var speciesConstructor = __webpack_require__(53);
  var ArrayIterators = __webpack_require__(89);
  var Iterators = __webpack_require__(48);
  var $iterDetect = __webpack_require__(59);
  var setSpecies = __webpack_require__(39);
  var arrayFill = __webpack_require__(88);
  var arrayCopyWithin = __webpack_require__(119);
  var $DP = __webpack_require__(8);
  var $GOPD = __webpack_require__(16);
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var Map = __webpack_require__(125);
var $export = __webpack_require__(0);
var shared = __webpack_require__(49)('metadata');
var store = shared.store || (shared.store = new (__webpack_require__(128))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(34)('meta');
var isObject = __webpack_require__(4);
var has = __webpack_require__(14);
var setDesc = __webpack_require__(8).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(3)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(11)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(104);
var enumBugKeys = __webpack_require__(72);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(21);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(1);
var dPs = __webpack_require__(105);
var enumBugKeys = __webpack_require__(72);
var IE_PROTO = __webpack_require__(71)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(69)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(73).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(104);
var hiddenKeys = __webpack_require__(72).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var dP = __webpack_require__(8);
var DESCRIPTORS = __webpack_require__(7);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(19);
var call = __webpack_require__(117);
var isArrayIter = __webpack_require__(84);
var anObject = __webpack_require__(1);
var toLength = __webpack_require__(6);
var getIterFn = __webpack_require__(86);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(12);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var store = {
    user: {
        token: ''
    },
    gameId: '',
    requestlimits: {
        // if set to true, disallow another request
        reset: false,
        getGameHistory: false,
        selectSpace: false
    },
    settings: {
        isVsAi: true,
        difficulty: 1 // enum: 0, 1, or 2 with 2 being hardest
    }

};

module.exports = store;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(8).f;
var has = __webpack_require__(14);
var TAG = __webpack_require__(5)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(20);
var TAG = __webpack_require__(5)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var defined = __webpack_require__(24);
var fails = __webpack_require__(3);
var spaces = __webpack_require__(75);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(18);
var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(30) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(20);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(1);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(10);
var SPECIES = __webpack_require__(5)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(6);
var toAbsoluteIndex = __webpack_require__(36);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 55 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(20);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(21);
var defined = __webpack_require__(24);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4);
var cof = __webpack_require__(20);
var MATCH = __webpack_require__(5)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(5)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(46);
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(121);
var redefine = __webpack_require__(12);
var hide = __webpack_require__(11);
var fails = __webpack_require__(3);
var defined = __webpack_require__(24);
var wks = __webpack_require__(5);
var regexpExec = __webpack_require__(90);

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var redefineAll = __webpack_require__(42);
var meta = __webpack_require__(31);
var forOf = __webpack_require__(41);
var anInstance = __webpack_require__(40);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var $iterDetect = __webpack_require__(59);
var setToStringTag = __webpack_require__(45);
var inheritIfRequired = __webpack_require__(76);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(11);
var uid = __webpack_require__(34);
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(30) || !__webpack_require__(3)(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete __webpack_require__(2)[K];
});


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(0);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var ctx = __webpack_require__(19);
var forOf = __webpack_require__(41);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(18);
var LIBRARY = __webpack_require__(30);
var wksExt = __webpack_require__(103);
var defineProperty = __webpack_require__(8).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(49)('keys');
var uid = __webpack_require__(34);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(19)(Function.call, __webpack_require__(16).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var setPrototypeOf = __webpack_require__(74).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(21);
var defined = __webpack_require__(24);

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};


/***/ }),
/* 78 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};


/***/ }),
/* 79 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(30);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var hide = __webpack_require__(11);
var Iterators = __webpack_require__(48);
var $iterCreate = __webpack_require__(81);
var setToStringTag = __webpack_require__(45);
var getPrototypeOf = __webpack_require__(17);
var ITERATOR = __webpack_require__(5)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(37);
var descriptor = __webpack_require__(33);
var setToStringTag = __webpack_require__(45);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(11)(IteratorPrototype, __webpack_require__(5)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(58);
var defined = __webpack_require__(24);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(48);
var ITERATOR = __webpack_require__(5)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(8);
var createDesc = __webpack_require__(33);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(46);
var ITERATOR = __webpack_require__(5)('iterator');
var Iterators = __webpack_require__(48);
module.exports = __webpack_require__(18).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(238);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(6);
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(32);
var step = __webpack_require__(120);
var Iterators = __webpack_require__(48);
var toIObject = __webpack_require__(15);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(80)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(52);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__(57)(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(19);
var invoke = __webpack_require__(110);
var html = __webpack_require__(73);
var cel = __webpack_require__(69);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(20)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var macrotask = __webpack_require__(92).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(20)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(10);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(7);
var LIBRARY = __webpack_require__(30);
var $typed = __webpack_require__(64);
var hide = __webpack_require__(11);
var redefineAll = __webpack_require__(42);
var fails = __webpack_require__(3);
var anInstance = __webpack_require__(40);
var toInteger = __webpack_require__(21);
var toLength = __webpack_require__(6);
var toIndex = __webpack_require__(130);
var gOPN = __webpack_require__(38).f;
var dP = __webpack_require__(8).f;
var arrayFill = __webpack_require__(88);
var setToStringTag = __webpack_require__(45);
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var shuffleArr = function shuffleArr(arr) {
    if (arr.length === 1) return arr;
    // shuffles an array in random order
    // adapted to JS from Fisher-Yates shuffle algorithm
    var currentIndex = arr.length;
    var temporaryValue = void 0;
    var randomIndex = void 0;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }
    return arr;
};

module.exports = shuffleArr;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// App Settings

// TODO: pull more settings into this file

var appSettings = {
    aiDelay: 1800 // time for ai to take turn in ms


    // API Settings
};var apiUrl = void 0;
var apiUrls = {
    production: 'https://tic-tac-toe-wdi-production.herokuapp.com/',
    development: 'https://tic-tac-toe-wdi.herokuapp.com/'

    // check if environment is local or deployed
};if (window.location.hostname === 'localhost') {
    apiUrl = apiUrls.development;
} else {
    apiUrl = apiUrls.production;
}

module.exports = {
    apiUrl: apiUrl,
    appSettings: appSettings
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Gameboard = function Gameboard(turn, cells, user) {
    this.cells = cells || ["", "", "", "", "", "", "", "", ""]; // array of 9 strings
    this.turn = turn || "x"; // enum: `x` or `o`
    this.starts = "x";
    this.winner = null; // enum: null, `x`, `o`, or `tie`
    this.user = user || "x"; // enum: `x` or `o`
};

Gameboard.prototype = {

    selectCell: function selectCell(cellIndex) {
        // if cell unavailable, returns false
        if (this.cells[cellIndex] || this.winner) {
            return false;
        } else {
            // if cell avaialable, selects it and returns true
            this.cells[cellIndex] = this.turn;
            // change turn
            this.turn = this.turn === "x" ? "o" : "x";
            // check for winner
            this.checkForWinner();
            return true;
        }
    },

    checkForWinner: function checkForWinner() {
        // set winning index combinations
        var winningCombinations = ["048", "264", "036", "147", "258", "012", "345", "678"];
        // check for each winning combination
        for (var i = 0; i < winningCombinations.length; i++) {
            var comb = winningCombinations[i];
            // if combination index 0 and 1 match and arent falsey set isWin to true
            var isWin = this.cells[comb[0]] && this.cells[comb[0]] === this.cells[comb[1]];
            // if combination index 1 and 2 also match keep isWin as true
            isWin = isWin && this.cells[comb[1]] === this.cells[comb[2]];
            // if is win set winner and return true
            if (isWin) {
                this.winner = this.cells[comb[0]];
                return true;
            }
        }
        // if tie, set winner to tie and return true
        var emptyCells = this.cells.filter(function (cell) {
            return !cell;
        });
        if (!emptyCells.length) {
            // if length 0, all cells are filled and it is a tie
            this.winner = "tie";
            return true;
        }
        // if no win found return false
        return false;
    },

    reset: function reset(turn) {
        // resets gameboard
        this.cells = ["", "", "", "", "", "", "", "", ""];
        this.starts = this.starts === "x" ? "o" : "x";
        this.turn = turn || this.starts;
        this.winner = null;
    }
};

module.exports = Gameboard;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _vivus = __webpack_require__(354);

var _vivus2 = _interopRequireDefault(_vivus);

var _svgs = __webpack_require__(355);

var _svgs2 = _interopRequireDefault(_svgs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messages = __webpack_require__(138);
var shuffleArr = __webpack_require__(96);
var Gameboard = __webpack_require__(98);
var store = __webpack_require__(44);

// note there are two paragraph tags for displaying messages in the HTML
// #game-message for displaying winner messages, #player-turn-message for turns

var updateCell = function updateCell(target, currTurn) {
    // create unique id to give the svg
    var svgId = 'svg-' + target.dataset.marker;
    var svgArr = currTurn === 'x' ? _svgs2.default.Xs : _svgs2.default.Os;
    // select random one of 5 svgs in the array
    $(target).html(svgArr[Math.floor(Math.random() * 5)]);
    // give the svg the unique id
    $(target).children().attr('id', svgId);
    // start Vivus.js animation (animation is side effect of constructor)
    // NOTE: duration is in frames not time, oneByOne means one svg path at a time, no delay between them
    // eslint-disable-next-line
    new _vivus2.default(svgId, { duration: 25, type: 'oneByOne' });
    // clear game message
    $('#game-message').text('');
};

var invalidCell = function invalidCell() {
    // select a random invalidMove message to display
    $('#game-message').text(shuffleArr(messages.invalidMove)[0]);
};

var displayWinner = function displayWinner(winner) {
    if (winner.length === 1) {
        // if game was not a tie, display relevant message based on gamepiece that won and whether in AI mode
        if (store.settings.isVsAi) {
            var msg = winner === 'o' ? shuffleArr(messages.broWins)[0] : shuffleArr(messages.userWins)[0];
            $('#game-message').text(msg);
            // if bro lost, display angry bro picture
            if (winner === 'x') {
                $('.nm-bro').css('background-image', 'url(' + 'https://imagizer.imageshack.com/v2/347x425q90/923/qQlR96.jpg' + ')');
            }
        } else {
            $('#game-message').text('Winner is ' + winner.toUpperCase() + '. Reset board to play again!');
        }
    } else {
        // otherwise display a random tie message (same for singleplayer and AI)
        $('#game-message').text(shuffleArr(messages.tie)[0]);
    }
};

var updateTurn = function updateTurn(turn) {
    var won = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!won) {
        // if game not won, check if in AI or singleplayer mode then display relevant message
        if (store.settings.isVsAi) {
            var msg = turn === 'o' ? shuffleArr(messages.brosTurn)[0] : shuffleArr(messages.usersTurn)[0];
            $('#player-turn-message').text(msg);
        } else {
            $('#player-turn-message').text(turn.toUpperCase() + '\'s turn.');
        }
    } else {
        // if game won display random message that game is over
        $('#player-turn-message').text(shuffleArr(messages.gameOver)[0]);
    }
};

var resetGameMessage = function resetGameMessage() {
    $('#game-message').text('');
};

var clearBoard = function clearBoard() {
    // NOTE: jQuery seems to automatically iterate over node lists, this selection expected to be length 9
    $('.gameboard--marker').text('');
    // reset bro image to happy (will be mad if user won)
    $('.nm-bro').css('background-image', 'url(' + 'https://imagizer.imageshack.com/img921/6088/ZyPmRq.jpg' + ')');
};

var displayGameHistory = function displayGameHistory(payload) {
    // sort array of finished games by id
    var sortedGames = payload.games.sort(function (a, b) {
        return Number(a.id) - Number(b.id);
    });
    // create ordered array of gameBoards
    var gameBoards = sortedGames.map(function (game) {
        return game.cells;
    });
    // construct contents for HTML display table, with game headers
    var tableContents = '\n        <tr>\n            <th>Game #</th>\n            <th>Winner</th> \n            <th>Turns Taken</th>\n        </tr>\n    ';
    // loop over every gameBoard and create a row to push to tableContents
    gameBoards.map(function (gameBoard, i) {
        // create new gameboard object and run checkForWinner method
        var board = new Gameboard('x', gameBoard);
        board.checkForWinner();
        // set variables to insert into row
        var gameNumber = i + 1;
        var winner = board.winner;
        var turnsTaken = board.cells.filter(function (cell) {
            return cell;
        }).length;
        // add row for current game to tableContents
        tableContents += '\n            <tr>\n                <td>' + gameNumber + '</td>\n                <td>' + winner.toUpperCase() + '</td> \n                <td>' + turnsTaken + '</td>\n            </tr>\n        ';
    });
    // if there were no gameBoards, notify user
    if (!gameBoards.length) {
        tableContents = '<p>You haven\'t finished any games yet,<br/> play a game or refresh to view games.</p>';
    }
    // set table's html to newly constructed tableContents
    $('#game-history').html(tableContents);
};

var clearGameHistory = function clearGameHistory() {
    // clear table data and headers
    $('#game-history').html('');
};

var askToSignIn = function askToSignIn() {
    // if user tries action not permitted while unsigned in, notify them and select first field of auth forms
    $('#auth-message').text('Who do you know here, chief?! You need to be logged in to do that.');
    $('#sign-up-input').select();
};

module.exports = {
    updateCell: updateCell,
    invalidCell: invalidCell,
    displayWinner: displayWinner,
    updateTurn: updateTurn,
    resetGameMessage: resetGameMessage,
    clearBoard: clearBoard,
    displayGameHistory: displayGameHistory,
    clearGameHistory: clearGameHistory,
    askToSignIn: askToSignIn
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 100 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(144);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(7) && !__webpack_require__(3)(function () {
  return Object.defineProperty(__webpack_require__(69)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);
var toIObject = __webpack_require__(15);
var arrayIndexOf = __webpack_require__(54)(false);
var IE_PROTO = __webpack_require__(71)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var anObject = __webpack_require__(1);
var getKeys = __webpack_require__(35);

module.exports = __webpack_require__(7) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(15);
var gOPN = __webpack_require__(38).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(35);
var gOPS = __webpack_require__(55);
var pIE = __webpack_require__(51);
var toObject = __webpack_require__(9);
var IObject = __webpack_require__(50);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(3)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 108 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(10);
var isObject = __webpack_require__(4);
var invoke = __webpack_require__(110);
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};


/***/ }),
/* 110 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt;
var $trim = __webpack_require__(47).trim;
var ws = __webpack_require__(75);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(2).parseFloat;
var $trim = __webpack_require__(47).trim;

module.exports = 1 / $parseFloat(__webpack_require__(75) + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(20);
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4);
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),
/* 115 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var sign = __webpack_require__(78);
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(1);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(10);
var toObject = __webpack_require__(9);
var IObject = __webpack_require__(50);
var toLength = __webpack_require__(6);

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(6);

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),
/* 120 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__(90);
__webpack_require__(0)({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(7) && /./g.flags != 'g') __webpack_require__(8).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(52)
});


/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var newPromiseCapability = __webpack_require__(94);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(126);
var validate = __webpack_require__(43);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(63)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(8).f;
var create = __webpack_require__(37);
var redefineAll = __webpack_require__(42);
var ctx = __webpack_require__(19);
var anInstance = __webpack_require__(40);
var forOf = __webpack_require__(41);
var $iterDefine = __webpack_require__(80);
var step = __webpack_require__(120);
var setSpecies = __webpack_require__(39);
var DESCRIPTORS = __webpack_require__(7);
var fastKey = __webpack_require__(31).fastKey;
var validate = __webpack_require__(43);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(126);
var validate = __webpack_require__(43);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(63)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var each = __webpack_require__(26)(0);
var redefine = __webpack_require__(12);
var meta = __webpack_require__(31);
var assign = __webpack_require__(107);
var weak = __webpack_require__(129);
var isObject = __webpack_require__(4);
var validate = __webpack_require__(43);
var NATIVE_WEAK_MAP = __webpack_require__(43);
var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(63)(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (NATIVE_WEAK_MAP && IS_IE11) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll = __webpack_require__(42);
var getWeak = __webpack_require__(31).getWeak;
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var anInstance = __webpack_require__(40);
var forOf = __webpack_require__(41);
var createArrayMethod = __webpack_require__(26);
var $has = __webpack_require__(14);
var validate = __webpack_require__(43);
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__(21);
var toLength = __webpack_require__(6);
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(38);
var gOPS = __webpack_require__(55);
var anObject = __webpack_require__(1);
var Reflect = __webpack_require__(2).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = __webpack_require__(56);
var isObject = __webpack_require__(4);
var toLength = __webpack_require__(6);
var ctx = __webpack_require__(19);
var IS_CONCAT_SPREADABLE = __webpack_require__(5)('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(6);
var repeat = __webpack_require__(77);
var defined = __webpack_require__(24);

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__(35);
var toIObject = __webpack_require__(15);
var isEnum = __webpack_require__(51).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(46);
var from = __webpack_require__(136);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(41);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 137 */
/***/ (function(module, exports) {

// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// TODO: needs tree shaking, not all messages are used in app
// attributes of messages object should be in format of array with at least one value
var messages = {
    // Auth Related
    signInSuccess: ["You're in bro, now lets play a game.", "You're signed in, Chief."],
    signInFailure: ["Something's not checking out with your login information guy.", "You're gonna need the right login info if you wanna rage, bro."],
    signUpSuccess: ["You're all signed up pledge, sign in so we can get a game going.", "You're good dude, just sign in so we can start"],
    signUpFailure: ["You can't sign up with that info, chief.", "Someones already got that nickname here bro"],
    changePwSuccess: ["You changed the secret password. Don't forget it next time you try to get in the house."],
    changePwFailure: ["Couldn't change your password. Make sure you type in your previous password first bro."],
    signOutSuccess: ["YOU'RE OUT BRO, just leave."],
    signOutFailure: ["You couldn't be logged out dog, once a brother always a brother."],
    // Game related
    xsTurn: ["It's X's turn. Make a move.", "It's X's turn. Let's see what they pick."],
    osTurn: ["It's O's turn. Make a move.", "It's O's turn. Come on O."],
    brosTurn: ["My turn, let me think here.", "Hold on while I select the perfect move...", "Give me a chance to make my move.", "My turn.", "Let me see here. Which spot should I pick?", "My turn.", "I'm up.", "I'm up."],
    usersTurn: ["You're up, chief. Make it count.", "You're up, chief. Make it count.", "Your turn nerd.", "Will you make a move already, I don't have all day.", "Take your turn, bro.", "We're all waiting for you to take your turn...", "Your turn", "Your turn", "Your turn", "You're up, bud.", "You're up, bud.", "You're up, bud."],
    oWins: ["\"O\"mg bro. O just totally won.", "O won the game, O isn't lame."],
    xWins: ["X marks the spot where the game was won.", "X is the champion, my friend, dunn dun dunn."],
    tie: ["Nobody wins, nobody loses. Play again.", "No more spaces, looks like it's a tie.", "Tie game. How boring..."],
    broWins: ["Hah. I won. get wrecked loser.", "Hell yeah in your face. I won.", "Did you really think you stood a chance against me? I won.", "The champion reigns supreme. I won."],
    userWins: ["You win this time punk. Let's play again.", "What the hell. Who plays like that? You win this time guy.", "Miracles do happen. You won.", "The sun was in my eyes. Enjoy the win while you can."],
    gameOver: ["Game over, nerd.", "Game over.", "The game's over bud."],
    invalidMove: ["Woah, I can't let you place a marker there chief.", "That spots not gonna work man.", "You can't place a marker there.", "You can't move there! When pledges try to make invalid moves they get dropped."]
};

module.exports = messages;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Gameboard = __webpack_require__(98);
var ui = __webpack_require__(99);
var api = __webpack_require__(140);
var store = __webpack_require__(44);

// initialize gameboard object
var board = new Gameboard();

var selectSpace = function selectSpace(target) {
    var currTurn = board.turn;
    // if valid space selected, print to ui
    var space = target.dataset.marker;
    if (board.selectCell(space)) {
        ui.updateCell(target, currTurn);
        // update ui with current turn
        ui.updateTurn(board.turn);
        // if game won, print to the ui
        if (board.winner) {
            ui.displayWinner(board.winner);
            ui.updateTurn(board.winner, true);
        }
        // assemble object for PATCH request to update API
        var patchObj = {
            "game": {
                "cell": {
                    "index": space,
                    "value": currTurn
                },
                "over": Boolean(board.winner)
            }
            // pass assembled object to API
        };api.updateGame(patchObj);
        // return true if space selection was valid
        return true;
    } else {
        // notify user and return false if space selection was invalid
        ui.invalidCell();
        return false;
    }
};

var reset = function reset() {
    if (!store.requestlimits.reset) {
        // limit reset requests to one per half second
        store.requestlimits.reset = true;
        setTimeout(function () {
            store.requestlimits.reset = false;
        }, 500);
        // reset board
        board.reset();
        // create game in api, will return promise if user logged in, undefined if not
        var game = api.createGame();
        // if user was logged in, write gameId to store
        game && game.then(function () {
            store.gameId = game.responseJSON.game.id;
        });
        // reset ui and update the turn
        ui.resetGameMessage();
        ui.clearBoard();
        ui.updateTurn(board.turn);
    }
};

var getBoard = function getBoard() {
    // shares current board cells and turn with other files
    return { cells: board.cells, turn: board.turn };
};

var getBoardWinner = function getBoardWinner() {
    // checks current board for winner and shares the result ('x','o','tie', or null)
    board.checkForWinner();
    return board.winner;
};

module.exports = { selectSpace: selectSpace, reset: reset, getBoard: getBoard, getBoardWinner: getBoardWinner };

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _require = __webpack_require__(97),
    apiUrl = _require.apiUrl;

var store = __webpack_require__(44);

var createGame = function createGame() {
    var token = store.user.token;

    if (token) {
        return $.ajax({
            url: apiUrl + "games",
            method: "POST",
            headers: {
                Authorization: "Token token=" + token
            }
        });
    }
};

var updateGame = function updateGame(patchObj) {
    var token = store.user.token,
        gameId = store.gameId;

    if (token) {
        return $.ajax({
            url: apiUrl + "games/" + gameId,
            method: "PATCH",
            headers: {
                Authorization: "Token token=" + token
            },
            data: patchObj
        });
    }
};

var getGameHistory = function getGameHistory() {
    var token = store.user.token;

    if (token) {
        return $.ajax({
            url: apiUrl + "games?over=true",
            method: "GET",
            headers: {
                Authorization: "Token token=" + token
            }
        });
    }
};

module.exports = {
    createGame: createGame,
    updateGame: updateGame,
    getGameHistory: getGameHistory
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// import materialize

__webpack_require__(142);

__webpack_require__(145);

// allows usage of new JS features
__webpack_require__(146);

// load manifests
// scripts
__webpack_require__(348);

// styles
__webpack_require__(358);

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(143);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(101)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../css-loader/index.js?url=false!./materialize.min.css", function() {
		var newContent = require("!!../../../css-loader/index.js?url=false!./materialize.min.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(100)(false);
// imports


// module
exports.push([module.i, "/*!\r\n * Materialize v1.0.0-rc.2 (http://materializecss.com)\r\n * Copyright 2014-2017 Materialize\r\n * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)\r\n */\r\n.materialize-red{background-color:#e51c23 !important}.materialize-red-text{color:#e51c23 !important}.materialize-red.lighten-5{background-color:#fdeaeb !important}.materialize-red-text.text-lighten-5{color:#fdeaeb !important}.materialize-red.lighten-4{background-color:#f8c1c3 !important}.materialize-red-text.text-lighten-4{color:#f8c1c3 !important}.materialize-red.lighten-3{background-color:#f3989b !important}.materialize-red-text.text-lighten-3{color:#f3989b !important}.materialize-red.lighten-2{background-color:#ee6e73 !important}.materialize-red-text.text-lighten-2{color:#ee6e73 !important}.materialize-red.lighten-1{background-color:#ea454b !important}.materialize-red-text.text-lighten-1{color:#ea454b !important}.materialize-red.darken-1{background-color:#d0181e !important}.materialize-red-text.text-darken-1{color:#d0181e !important}.materialize-red.darken-2{background-color:#b9151b !important}.materialize-red-text.text-darken-2{color:#b9151b !important}.materialize-red.darken-3{background-color:#a21318 !important}.materialize-red-text.text-darken-3{color:#a21318 !important}.materialize-red.darken-4{background-color:#8b1014 !important}.materialize-red-text.text-darken-4{color:#8b1014 !important}.red{background-color:#F44336 !important}.red-text{color:#F44336 !important}.red.lighten-5{background-color:#FFEBEE !important}.red-text.text-lighten-5{color:#FFEBEE !important}.red.lighten-4{background-color:#FFCDD2 !important}.red-text.text-lighten-4{color:#FFCDD2 !important}.red.lighten-3{background-color:#EF9A9A !important}.red-text.text-lighten-3{color:#EF9A9A !important}.red.lighten-2{background-color:#E57373 !important}.red-text.text-lighten-2{color:#E57373 !important}.red.lighten-1{background-color:#EF5350 !important}.red-text.text-lighten-1{color:#EF5350 !important}.red.darken-1{background-color:#E53935 !important}.red-text.text-darken-1{color:#E53935 !important}.red.darken-2{background-color:#D32F2F !important}.red-text.text-darken-2{color:#D32F2F !important}.red.darken-3{background-color:#C62828 !important}.red-text.text-darken-3{color:#C62828 !important}.red.darken-4{background-color:#B71C1C !important}.red-text.text-darken-4{color:#B71C1C !important}.red.accent-1{background-color:#FF8A80 !important}.red-text.text-accent-1{color:#FF8A80 !important}.red.accent-2{background-color:#FF5252 !important}.red-text.text-accent-2{color:#FF5252 !important}.red.accent-3{background-color:#FF1744 !important}.red-text.text-accent-3{color:#FF1744 !important}.red.accent-4{background-color:#D50000 !important}.red-text.text-accent-4{color:#D50000 !important}.pink{background-color:#e91e63 !important}.pink-text{color:#e91e63 !important}.pink.lighten-5{background-color:#fce4ec !important}.pink-text.text-lighten-5{color:#fce4ec !important}.pink.lighten-4{background-color:#f8bbd0 !important}.pink-text.text-lighten-4{color:#f8bbd0 !important}.pink.lighten-3{background-color:#f48fb1 !important}.pink-text.text-lighten-3{color:#f48fb1 !important}.pink.lighten-2{background-color:#f06292 !important}.pink-text.text-lighten-2{color:#f06292 !important}.pink.lighten-1{background-color:#ec407a !important}.pink-text.text-lighten-1{color:#ec407a !important}.pink.darken-1{background-color:#d81b60 !important}.pink-text.text-darken-1{color:#d81b60 !important}.pink.darken-2{background-color:#c2185b !important}.pink-text.text-darken-2{color:#c2185b !important}.pink.darken-3{background-color:#ad1457 !important}.pink-text.text-darken-3{color:#ad1457 !important}.pink.darken-4{background-color:#880e4f !important}.pink-text.text-darken-4{color:#880e4f !important}.pink.accent-1{background-color:#ff80ab !important}.pink-text.text-accent-1{color:#ff80ab !important}.pink.accent-2{background-color:#ff4081 !important}.pink-text.text-accent-2{color:#ff4081 !important}.pink.accent-3{background-color:#f50057 !important}.pink-text.text-accent-3{color:#f50057 !important}.pink.accent-4{background-color:#c51162 !important}.pink-text.text-accent-4{color:#c51162 !important}.purple{background-color:#9c27b0 !important}.purple-text{color:#9c27b0 !important}.purple.lighten-5{background-color:#f3e5f5 !important}.purple-text.text-lighten-5{color:#f3e5f5 !important}.purple.lighten-4{background-color:#e1bee7 !important}.purple-text.text-lighten-4{color:#e1bee7 !important}.purple.lighten-3{background-color:#ce93d8 !important}.purple-text.text-lighten-3{color:#ce93d8 !important}.purple.lighten-2{background-color:#ba68c8 !important}.purple-text.text-lighten-2{color:#ba68c8 !important}.purple.lighten-1{background-color:#ab47bc !important}.purple-text.text-lighten-1{color:#ab47bc !important}.purple.darken-1{background-color:#8e24aa !important}.purple-text.text-darken-1{color:#8e24aa !important}.purple.darken-2{background-color:#7b1fa2 !important}.purple-text.text-darken-2{color:#7b1fa2 !important}.purple.darken-3{background-color:#6a1b9a !important}.purple-text.text-darken-3{color:#6a1b9a !important}.purple.darken-4{background-color:#4a148c !important}.purple-text.text-darken-4{color:#4a148c !important}.purple.accent-1{background-color:#ea80fc !important}.purple-text.text-accent-1{color:#ea80fc !important}.purple.accent-2{background-color:#e040fb !important}.purple-text.text-accent-2{color:#e040fb !important}.purple.accent-3{background-color:#d500f9 !important}.purple-text.text-accent-3{color:#d500f9 !important}.purple.accent-4{background-color:#a0f !important}.purple-text.text-accent-4{color:#a0f !important}.deep-purple{background-color:#673ab7 !important}.deep-purple-text{color:#673ab7 !important}.deep-purple.lighten-5{background-color:#ede7f6 !important}.deep-purple-text.text-lighten-5{color:#ede7f6 !important}.deep-purple.lighten-4{background-color:#d1c4e9 !important}.deep-purple-text.text-lighten-4{color:#d1c4e9 !important}.deep-purple.lighten-3{background-color:#b39ddb !important}.deep-purple-text.text-lighten-3{color:#b39ddb !important}.deep-purple.lighten-2{background-color:#9575cd !important}.deep-purple-text.text-lighten-2{color:#9575cd !important}.deep-purple.lighten-1{background-color:#7e57c2 !important}.deep-purple-text.text-lighten-1{color:#7e57c2 !important}.deep-purple.darken-1{background-color:#5e35b1 !important}.deep-purple-text.text-darken-1{color:#5e35b1 !important}.deep-purple.darken-2{background-color:#512da8 !important}.deep-purple-text.text-darken-2{color:#512da8 !important}.deep-purple.darken-3{background-color:#4527a0 !important}.deep-purple-text.text-darken-3{color:#4527a0 !important}.deep-purple.darken-4{background-color:#311b92 !important}.deep-purple-text.text-darken-4{color:#311b92 !important}.deep-purple.accent-1{background-color:#b388ff !important}.deep-purple-text.text-accent-1{color:#b388ff !important}.deep-purple.accent-2{background-color:#7c4dff !important}.deep-purple-text.text-accent-2{color:#7c4dff !important}.deep-purple.accent-3{background-color:#651fff !important}.deep-purple-text.text-accent-3{color:#651fff !important}.deep-purple.accent-4{background-color:#6200ea !important}.deep-purple-text.text-accent-4{color:#6200ea !important}.indigo{background-color:#3f51b5 !important}.indigo-text{color:#3f51b5 !important}.indigo.lighten-5{background-color:#e8eaf6 !important}.indigo-text.text-lighten-5{color:#e8eaf6 !important}.indigo.lighten-4{background-color:#c5cae9 !important}.indigo-text.text-lighten-4{color:#c5cae9 !important}.indigo.lighten-3{background-color:#9fa8da !important}.indigo-text.text-lighten-3{color:#9fa8da !important}.indigo.lighten-2{background-color:#7986cb !important}.indigo-text.text-lighten-2{color:#7986cb !important}.indigo.lighten-1{background-color:#5c6bc0 !important}.indigo-text.text-lighten-1{color:#5c6bc0 !important}.indigo.darken-1{background-color:#3949ab !important}.indigo-text.text-darken-1{color:#3949ab !important}.indigo.darken-2{background-color:#303f9f !important}.indigo-text.text-darken-2{color:#303f9f !important}.indigo.darken-3{background-color:#283593 !important}.indigo-text.text-darken-3{color:#283593 !important}.indigo.darken-4{background-color:#1a237e !important}.indigo-text.text-darken-4{color:#1a237e !important}.indigo.accent-1{background-color:#8c9eff !important}.indigo-text.text-accent-1{color:#8c9eff !important}.indigo.accent-2{background-color:#536dfe !important}.indigo-text.text-accent-2{color:#536dfe !important}.indigo.accent-3{background-color:#3d5afe !important}.indigo-text.text-accent-3{color:#3d5afe !important}.indigo.accent-4{background-color:#304ffe !important}.indigo-text.text-accent-4{color:#304ffe !important}.blue{background-color:#2196F3 !important}.blue-text{color:#2196F3 !important}.blue.lighten-5{background-color:#E3F2FD !important}.blue-text.text-lighten-5{color:#E3F2FD !important}.blue.lighten-4{background-color:#BBDEFB !important}.blue-text.text-lighten-4{color:#BBDEFB !important}.blue.lighten-3{background-color:#90CAF9 !important}.blue-text.text-lighten-3{color:#90CAF9 !important}.blue.lighten-2{background-color:#64B5F6 !important}.blue-text.text-lighten-2{color:#64B5F6 !important}.blue.lighten-1{background-color:#42A5F5 !important}.blue-text.text-lighten-1{color:#42A5F5 !important}.blue.darken-1{background-color:#1E88E5 !important}.blue-text.text-darken-1{color:#1E88E5 !important}.blue.darken-2{background-color:#1976D2 !important}.blue-text.text-darken-2{color:#1976D2 !important}.blue.darken-3{background-color:#1565C0 !important}.blue-text.text-darken-3{color:#1565C0 !important}.blue.darken-4{background-color:#0D47A1 !important}.blue-text.text-darken-4{color:#0D47A1 !important}.blue.accent-1{background-color:#82B1FF !important}.blue-text.text-accent-1{color:#82B1FF !important}.blue.accent-2{background-color:#448AFF !important}.blue-text.text-accent-2{color:#448AFF !important}.blue.accent-3{background-color:#2979FF !important}.blue-text.text-accent-3{color:#2979FF !important}.blue.accent-4{background-color:#2962FF !important}.blue-text.text-accent-4{color:#2962FF !important}.light-blue{background-color:#03a9f4 !important}.light-blue-text{color:#03a9f4 !important}.light-blue.lighten-5{background-color:#e1f5fe !important}.light-blue-text.text-lighten-5{color:#e1f5fe !important}.light-blue.lighten-4{background-color:#b3e5fc !important}.light-blue-text.text-lighten-4{color:#b3e5fc !important}.light-blue.lighten-3{background-color:#81d4fa !important}.light-blue-text.text-lighten-3{color:#81d4fa !important}.light-blue.lighten-2{background-color:#4fc3f7 !important}.light-blue-text.text-lighten-2{color:#4fc3f7 !important}.light-blue.lighten-1{background-color:#29b6f6 !important}.light-blue-text.text-lighten-1{color:#29b6f6 !important}.light-blue.darken-1{background-color:#039be5 !important}.light-blue-text.text-darken-1{color:#039be5 !important}.light-blue.darken-2{background-color:#0288d1 !important}.light-blue-text.text-darken-2{color:#0288d1 !important}.light-blue.darken-3{background-color:#0277bd !important}.light-blue-text.text-darken-3{color:#0277bd !important}.light-blue.darken-4{background-color:#01579b !important}.light-blue-text.text-darken-4{color:#01579b !important}.light-blue.accent-1{background-color:#80d8ff !important}.light-blue-text.text-accent-1{color:#80d8ff !important}.light-blue.accent-2{background-color:#40c4ff !important}.light-blue-text.text-accent-2{color:#40c4ff !important}.light-blue.accent-3{background-color:#00b0ff !important}.light-blue-text.text-accent-3{color:#00b0ff !important}.light-blue.accent-4{background-color:#0091ea !important}.light-blue-text.text-accent-4{color:#0091ea !important}.cyan{background-color:#00bcd4 !important}.cyan-text{color:#00bcd4 !important}.cyan.lighten-5{background-color:#e0f7fa !important}.cyan-text.text-lighten-5{color:#e0f7fa !important}.cyan.lighten-4{background-color:#b2ebf2 !important}.cyan-text.text-lighten-4{color:#b2ebf2 !important}.cyan.lighten-3{background-color:#80deea !important}.cyan-text.text-lighten-3{color:#80deea !important}.cyan.lighten-2{background-color:#4dd0e1 !important}.cyan-text.text-lighten-2{color:#4dd0e1 !important}.cyan.lighten-1{background-color:#26c6da !important}.cyan-text.text-lighten-1{color:#26c6da !important}.cyan.darken-1{background-color:#00acc1 !important}.cyan-text.text-darken-1{color:#00acc1 !important}.cyan.darken-2{background-color:#0097a7 !important}.cyan-text.text-darken-2{color:#0097a7 !important}.cyan.darken-3{background-color:#00838f !important}.cyan-text.text-darken-3{color:#00838f !important}.cyan.darken-4{background-color:#006064 !important}.cyan-text.text-darken-4{color:#006064 !important}.cyan.accent-1{background-color:#84ffff !important}.cyan-text.text-accent-1{color:#84ffff !important}.cyan.accent-2{background-color:#18ffff !important}.cyan-text.text-accent-2{color:#18ffff !important}.cyan.accent-3{background-color:#00e5ff !important}.cyan-text.text-accent-3{color:#00e5ff !important}.cyan.accent-4{background-color:#00b8d4 !important}.cyan-text.text-accent-4{color:#00b8d4 !important}.teal{background-color:#009688 !important}.teal-text{color:#009688 !important}.teal.lighten-5{background-color:#e0f2f1 !important}.teal-text.text-lighten-5{color:#e0f2f1 !important}.teal.lighten-4{background-color:#b2dfdb !important}.teal-text.text-lighten-4{color:#b2dfdb !important}.teal.lighten-3{background-color:#80cbc4 !important}.teal-text.text-lighten-3{color:#80cbc4 !important}.teal.lighten-2{background-color:#4db6ac !important}.teal-text.text-lighten-2{color:#4db6ac !important}.teal.lighten-1{background-color:#26a69a !important}.teal-text.text-lighten-1{color:#26a69a !important}.teal.darken-1{background-color:#00897b !important}.teal-text.text-darken-1{color:#00897b !important}.teal.darken-2{background-color:#00796b !important}.teal-text.text-darken-2{color:#00796b !important}.teal.darken-3{background-color:#00695c !important}.teal-text.text-darken-3{color:#00695c !important}.teal.darken-4{background-color:#004d40 !important}.teal-text.text-darken-4{color:#004d40 !important}.teal.accent-1{background-color:#a7ffeb !important}.teal-text.text-accent-1{color:#a7ffeb !important}.teal.accent-2{background-color:#64ffda !important}.teal-text.text-accent-2{color:#64ffda !important}.teal.accent-3{background-color:#1de9b6 !important}.teal-text.text-accent-3{color:#1de9b6 !important}.teal.accent-4{background-color:#00bfa5 !important}.teal-text.text-accent-4{color:#00bfa5 !important}.green{background-color:#4CAF50 !important}.green-text{color:#4CAF50 !important}.green.lighten-5{background-color:#E8F5E9 !important}.green-text.text-lighten-5{color:#E8F5E9 !important}.green.lighten-4{background-color:#C8E6C9 !important}.green-text.text-lighten-4{color:#C8E6C9 !important}.green.lighten-3{background-color:#A5D6A7 !important}.green-text.text-lighten-3{color:#A5D6A7 !important}.green.lighten-2{background-color:#81C784 !important}.green-text.text-lighten-2{color:#81C784 !important}.green.lighten-1{background-color:#66BB6A !important}.green-text.text-lighten-1{color:#66BB6A !important}.green.darken-1{background-color:#43A047 !important}.green-text.text-darken-1{color:#43A047 !important}.green.darken-2{background-color:#388E3C !important}.green-text.text-darken-2{color:#388E3C !important}.green.darken-3{background-color:#2E7D32 !important}.green-text.text-darken-3{color:#2E7D32 !important}.green.darken-4{background-color:#1B5E20 !important}.green-text.text-darken-4{color:#1B5E20 !important}.green.accent-1{background-color:#B9F6CA !important}.green-text.text-accent-1{color:#B9F6CA !important}.green.accent-2{background-color:#69F0AE !important}.green-text.text-accent-2{color:#69F0AE !important}.green.accent-3{background-color:#00E676 !important}.green-text.text-accent-3{color:#00E676 !important}.green.accent-4{background-color:#00C853 !important}.green-text.text-accent-4{color:#00C853 !important}.light-green{background-color:#8bc34a !important}.light-green-text{color:#8bc34a !important}.light-green.lighten-5{background-color:#f1f8e9 !important}.light-green-text.text-lighten-5{color:#f1f8e9 !important}.light-green.lighten-4{background-color:#dcedc8 !important}.light-green-text.text-lighten-4{color:#dcedc8 !important}.light-green.lighten-3{background-color:#c5e1a5 !important}.light-green-text.text-lighten-3{color:#c5e1a5 !important}.light-green.lighten-2{background-color:#aed581 !important}.light-green-text.text-lighten-2{color:#aed581 !important}.light-green.lighten-1{background-color:#9ccc65 !important}.light-green-text.text-lighten-1{color:#9ccc65 !important}.light-green.darken-1{background-color:#7cb342 !important}.light-green-text.text-darken-1{color:#7cb342 !important}.light-green.darken-2{background-color:#689f38 !important}.light-green-text.text-darken-2{color:#689f38 !important}.light-green.darken-3{background-color:#558b2f !important}.light-green-text.text-darken-3{color:#558b2f !important}.light-green.darken-4{background-color:#33691e !important}.light-green-text.text-darken-4{color:#33691e !important}.light-green.accent-1{background-color:#ccff90 !important}.light-green-text.text-accent-1{color:#ccff90 !important}.light-green.accent-2{background-color:#b2ff59 !important}.light-green-text.text-accent-2{color:#b2ff59 !important}.light-green.accent-3{background-color:#76ff03 !important}.light-green-text.text-accent-3{color:#76ff03 !important}.light-green.accent-4{background-color:#64dd17 !important}.light-green-text.text-accent-4{color:#64dd17 !important}.lime{background-color:#cddc39 !important}.lime-text{color:#cddc39 !important}.lime.lighten-5{background-color:#f9fbe7 !important}.lime-text.text-lighten-5{color:#f9fbe7 !important}.lime.lighten-4{background-color:#f0f4c3 !important}.lime-text.text-lighten-4{color:#f0f4c3 !important}.lime.lighten-3{background-color:#e6ee9c !important}.lime-text.text-lighten-3{color:#e6ee9c !important}.lime.lighten-2{background-color:#dce775 !important}.lime-text.text-lighten-2{color:#dce775 !important}.lime.lighten-1{background-color:#d4e157 !important}.lime-text.text-lighten-1{color:#d4e157 !important}.lime.darken-1{background-color:#c0ca33 !important}.lime-text.text-darken-1{color:#c0ca33 !important}.lime.darken-2{background-color:#afb42b !important}.lime-text.text-darken-2{color:#afb42b !important}.lime.darken-3{background-color:#9e9d24 !important}.lime-text.text-darken-3{color:#9e9d24 !important}.lime.darken-4{background-color:#827717 !important}.lime-text.text-darken-4{color:#827717 !important}.lime.accent-1{background-color:#f4ff81 !important}.lime-text.text-accent-1{color:#f4ff81 !important}.lime.accent-2{background-color:#eeff41 !important}.lime-text.text-accent-2{color:#eeff41 !important}.lime.accent-3{background-color:#c6ff00 !important}.lime-text.text-accent-3{color:#c6ff00 !important}.lime.accent-4{background-color:#aeea00 !important}.lime-text.text-accent-4{color:#aeea00 !important}.yellow{background-color:#ffeb3b !important}.yellow-text{color:#ffeb3b !important}.yellow.lighten-5{background-color:#fffde7 !important}.yellow-text.text-lighten-5{color:#fffde7 !important}.yellow.lighten-4{background-color:#fff9c4 !important}.yellow-text.text-lighten-4{color:#fff9c4 !important}.yellow.lighten-3{background-color:#fff59d !important}.yellow-text.text-lighten-3{color:#fff59d !important}.yellow.lighten-2{background-color:#fff176 !important}.yellow-text.text-lighten-2{color:#fff176 !important}.yellow.lighten-1{background-color:#ffee58 !important}.yellow-text.text-lighten-1{color:#ffee58 !important}.yellow.darken-1{background-color:#fdd835 !important}.yellow-text.text-darken-1{color:#fdd835 !important}.yellow.darken-2{background-color:#fbc02d !important}.yellow-text.text-darken-2{color:#fbc02d !important}.yellow.darken-3{background-color:#f9a825 !important}.yellow-text.text-darken-3{color:#f9a825 !important}.yellow.darken-4{background-color:#f57f17 !important}.yellow-text.text-darken-4{color:#f57f17 !important}.yellow.accent-1{background-color:#ffff8d !important}.yellow-text.text-accent-1{color:#ffff8d !important}.yellow.accent-2{background-color:#ff0 !important}.yellow-text.text-accent-2{color:#ff0 !important}.yellow.accent-3{background-color:#ffea00 !important}.yellow-text.text-accent-3{color:#ffea00 !important}.yellow.accent-4{background-color:#ffd600 !important}.yellow-text.text-accent-4{color:#ffd600 !important}.amber{background-color:#ffc107 !important}.amber-text{color:#ffc107 !important}.amber.lighten-5{background-color:#fff8e1 !important}.amber-text.text-lighten-5{color:#fff8e1 !important}.amber.lighten-4{background-color:#ffecb3 !important}.amber-text.text-lighten-4{color:#ffecb3 !important}.amber.lighten-3{background-color:#ffe082 !important}.amber-text.text-lighten-3{color:#ffe082 !important}.amber.lighten-2{background-color:#ffd54f !important}.amber-text.text-lighten-2{color:#ffd54f !important}.amber.lighten-1{background-color:#ffca28 !important}.amber-text.text-lighten-1{color:#ffca28 !important}.amber.darken-1{background-color:#ffb300 !important}.amber-text.text-darken-1{color:#ffb300 !important}.amber.darken-2{background-color:#ffa000 !important}.amber-text.text-darken-2{color:#ffa000 !important}.amber.darken-3{background-color:#ff8f00 !important}.amber-text.text-darken-3{color:#ff8f00 !important}.amber.darken-4{background-color:#ff6f00 !important}.amber-text.text-darken-4{color:#ff6f00 !important}.amber.accent-1{background-color:#ffe57f !important}.amber-text.text-accent-1{color:#ffe57f !important}.amber.accent-2{background-color:#ffd740 !important}.amber-text.text-accent-2{color:#ffd740 !important}.amber.accent-3{background-color:#ffc400 !important}.amber-text.text-accent-3{color:#ffc400 !important}.amber.accent-4{background-color:#ffab00 !important}.amber-text.text-accent-4{color:#ffab00 !important}.orange{background-color:#ff9800 !important}.orange-text{color:#ff9800 !important}.orange.lighten-5{background-color:#fff3e0 !important}.orange-text.text-lighten-5{color:#fff3e0 !important}.orange.lighten-4{background-color:#ffe0b2 !important}.orange-text.text-lighten-4{color:#ffe0b2 !important}.orange.lighten-3{background-color:#ffcc80 !important}.orange-text.text-lighten-3{color:#ffcc80 !important}.orange.lighten-2{background-color:#ffb74d !important}.orange-text.text-lighten-2{color:#ffb74d !important}.orange.lighten-1{background-color:#ffa726 !important}.orange-text.text-lighten-1{color:#ffa726 !important}.orange.darken-1{background-color:#fb8c00 !important}.orange-text.text-darken-1{color:#fb8c00 !important}.orange.darken-2{background-color:#f57c00 !important}.orange-text.text-darken-2{color:#f57c00 !important}.orange.darken-3{background-color:#ef6c00 !important}.orange-text.text-darken-3{color:#ef6c00 !important}.orange.darken-4{background-color:#e65100 !important}.orange-text.text-darken-4{color:#e65100 !important}.orange.accent-1{background-color:#ffd180 !important}.orange-text.text-accent-1{color:#ffd180 !important}.orange.accent-2{background-color:#ffab40 !important}.orange-text.text-accent-2{color:#ffab40 !important}.orange.accent-3{background-color:#ff9100 !important}.orange-text.text-accent-3{color:#ff9100 !important}.orange.accent-4{background-color:#ff6d00 !important}.orange-text.text-accent-4{color:#ff6d00 !important}.deep-orange{background-color:#ff5722 !important}.deep-orange-text{color:#ff5722 !important}.deep-orange.lighten-5{background-color:#fbe9e7 !important}.deep-orange-text.text-lighten-5{color:#fbe9e7 !important}.deep-orange.lighten-4{background-color:#ffccbc !important}.deep-orange-text.text-lighten-4{color:#ffccbc !important}.deep-orange.lighten-3{background-color:#ffab91 !important}.deep-orange-text.text-lighten-3{color:#ffab91 !important}.deep-orange.lighten-2{background-color:#ff8a65 !important}.deep-orange-text.text-lighten-2{color:#ff8a65 !important}.deep-orange.lighten-1{background-color:#ff7043 !important}.deep-orange-text.text-lighten-1{color:#ff7043 !important}.deep-orange.darken-1{background-color:#f4511e !important}.deep-orange-text.text-darken-1{color:#f4511e !important}.deep-orange.darken-2{background-color:#e64a19 !important}.deep-orange-text.text-darken-2{color:#e64a19 !important}.deep-orange.darken-3{background-color:#d84315 !important}.deep-orange-text.text-darken-3{color:#d84315 !important}.deep-orange.darken-4{background-color:#bf360c !important}.deep-orange-text.text-darken-4{color:#bf360c !important}.deep-orange.accent-1{background-color:#ff9e80 !important}.deep-orange-text.text-accent-1{color:#ff9e80 !important}.deep-orange.accent-2{background-color:#ff6e40 !important}.deep-orange-text.text-accent-2{color:#ff6e40 !important}.deep-orange.accent-3{background-color:#ff3d00 !important}.deep-orange-text.text-accent-3{color:#ff3d00 !important}.deep-orange.accent-4{background-color:#dd2c00 !important}.deep-orange-text.text-accent-4{color:#dd2c00 !important}.brown{background-color:#795548 !important}.brown-text{color:#795548 !important}.brown.lighten-5{background-color:#efebe9 !important}.brown-text.text-lighten-5{color:#efebe9 !important}.brown.lighten-4{background-color:#d7ccc8 !important}.brown-text.text-lighten-4{color:#d7ccc8 !important}.brown.lighten-3{background-color:#bcaaa4 !important}.brown-text.text-lighten-3{color:#bcaaa4 !important}.brown.lighten-2{background-color:#a1887f !important}.brown-text.text-lighten-2{color:#a1887f !important}.brown.lighten-1{background-color:#8d6e63 !important}.brown-text.text-lighten-1{color:#8d6e63 !important}.brown.darken-1{background-color:#6d4c41 !important}.brown-text.text-darken-1{color:#6d4c41 !important}.brown.darken-2{background-color:#5d4037 !important}.brown-text.text-darken-2{color:#5d4037 !important}.brown.darken-3{background-color:#4e342e !important}.brown-text.text-darken-3{color:#4e342e !important}.brown.darken-4{background-color:#3e2723 !important}.brown-text.text-darken-4{color:#3e2723 !important}.blue-grey{background-color:#607d8b !important}.blue-grey-text{color:#607d8b !important}.blue-grey.lighten-5{background-color:#eceff1 !important}.blue-grey-text.text-lighten-5{color:#eceff1 !important}.blue-grey.lighten-4{background-color:#cfd8dc !important}.blue-grey-text.text-lighten-4{color:#cfd8dc !important}.blue-grey.lighten-3{background-color:#b0bec5 !important}.blue-grey-text.text-lighten-3{color:#b0bec5 !important}.blue-grey.lighten-2{background-color:#90a4ae !important}.blue-grey-text.text-lighten-2{color:#90a4ae !important}.blue-grey.lighten-1{background-color:#78909c !important}.blue-grey-text.text-lighten-1{color:#78909c !important}.blue-grey.darken-1{background-color:#546e7a !important}.blue-grey-text.text-darken-1{color:#546e7a !important}.blue-grey.darken-2{background-color:#455a64 !important}.blue-grey-text.text-darken-2{color:#455a64 !important}.blue-grey.darken-3{background-color:#37474f !important}.blue-grey-text.text-darken-3{color:#37474f !important}.blue-grey.darken-4{background-color:#263238 !important}.blue-grey-text.text-darken-4{color:#263238 !important}.grey{background-color:#9e9e9e !important}.grey-text{color:#9e9e9e !important}.grey.lighten-5{background-color:#fafafa !important}.grey-text.text-lighten-5{color:#fafafa !important}.grey.lighten-4{background-color:#f5f5f5 !important}.grey-text.text-lighten-4{color:#f5f5f5 !important}.grey.lighten-3{background-color:#eee !important}.grey-text.text-lighten-3{color:#eee !important}.grey.lighten-2{background-color:#e0e0e0 !important}.grey-text.text-lighten-2{color:#e0e0e0 !important}.grey.lighten-1{background-color:#bdbdbd !important}.grey-text.text-lighten-1{color:#bdbdbd !important}.grey.darken-1{background-color:#757575 !important}.grey-text.text-darken-1{color:#757575 !important}.grey.darken-2{background-color:#616161 !important}.grey-text.text-darken-2{color:#616161 !important}.grey.darken-3{background-color:#424242 !important}.grey-text.text-darken-3{color:#424242 !important}.grey.darken-4{background-color:#212121 !important}.grey-text.text-darken-4{color:#212121 !important}.black{background-color:#000 !important}.black-text{color:#000 !important}.white{background-color:#fff !important}.white-text{color:#fff !important}.transparent{background-color:rgba(0,0,0,0) !important}.transparent-text{color:rgba(0,0,0,0) !important}/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:0.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace, monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;-webkit-text-decoration:underline dotted;-moz-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}button,html [type=\"button\"],[type=\"reset\"],[type=\"submit\"]{-webkit-appearance:button}button::-moz-focus-inner,[type=\"button\"]::-moz-focus-inner,[type=\"reset\"]::-moz-focus-inner,[type=\"submit\"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=\"button\"]:-moz-focusring,[type=\"reset\"]:-moz-focusring,[type=\"submit\"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=\"checkbox\"],[type=\"radio\"]{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0}[type=\"number\"]::-webkit-inner-spin-button,[type=\"number\"]::-webkit-outer-spin-button{height:auto}[type=\"search\"]{-webkit-appearance:textfield;outline-offset:-2px}[type=\"search\"]::-webkit-search-cancel-button,[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}html{-webkit-box-sizing:border-box;box-sizing:border-box}*,*:before,*:after{-webkit-box-sizing:inherit;box-sizing:inherit}button,input,optgroup,select,textarea{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif}ul:not(.browser-default){padding-left:0;list-style-type:none}ul:not(.browser-default)>li{list-style-type:none}a{color:#039be5;text-decoration:none;-webkit-tap-highlight-color:transparent}.valign-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.clearfix{clear:both}.z-depth-0{-webkit-box-shadow:none !important;box-shadow:none !important}.z-depth-1,nav,.card-panel,.card,.toast,.btn,.btn-large,.btn-small,.btn-floating,.dropdown-content,.collapsible,.sidenav{-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);box-shadow:0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)}.z-depth-1-half,.btn:hover,.btn-large:hover,.btn-small:hover,.btn-floating:hover{-webkit-box-shadow:0 3px 3px 0 rgba(0,0,0,0.14),0 1px 7px 0 rgba(0,0,0,0.12),0 3px 1px -1px rgba(0,0,0,0.2);box-shadow:0 3px 3px 0 rgba(0,0,0,0.14),0 1px 7px 0 rgba(0,0,0,0.12),0 3px 1px -1px rgba(0,0,0,0.2)}.z-depth-2{-webkit-box-shadow:0 4px 5px 0 rgba(0,0,0,0.14),0 1px 10px 0 rgba(0,0,0,0.12),0 2px 4px -1px rgba(0,0,0,0.3);box-shadow:0 4px 5px 0 rgba(0,0,0,0.14),0 1px 10px 0 rgba(0,0,0,0.12),0 2px 4px -1px rgba(0,0,0,0.3)}.z-depth-3{-webkit-box-shadow:0 8px 17px 2px rgba(0,0,0,0.14),0 3px 14px 2px rgba(0,0,0,0.12),0 5px 5px -3px rgba(0,0,0,0.2);box-shadow:0 8px 17px 2px rgba(0,0,0,0.14),0 3px 14px 2px rgba(0,0,0,0.12),0 5px 5px -3px rgba(0,0,0,0.2)}.z-depth-4{-webkit-box-shadow:0 16px 24px 2px rgba(0,0,0,0.14),0 6px 30px 5px rgba(0,0,0,0.12),0 8px 10px -7px rgba(0,0,0,0.2);box-shadow:0 16px 24px 2px rgba(0,0,0,0.14),0 6px 30px 5px rgba(0,0,0,0.12),0 8px 10px -7px rgba(0,0,0,0.2)}.z-depth-5,.modal{-webkit-box-shadow:0 24px 38px 3px rgba(0,0,0,0.14),0 9px 46px 8px rgba(0,0,0,0.12),0 11px 15px -7px rgba(0,0,0,0.2);box-shadow:0 24px 38px 3px rgba(0,0,0,0.14),0 9px 46px 8px rgba(0,0,0,0.12),0 11px 15px -7px rgba(0,0,0,0.2)}.hoverable{-webkit-transition:-webkit-box-shadow .25s;transition:-webkit-box-shadow .25s;transition:box-shadow .25s;transition:box-shadow .25s, -webkit-box-shadow .25s}.hoverable:hover{-webkit-box-shadow:0 8px 17px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);box-shadow:0 8px 17px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)}.divider{height:1px;overflow:hidden;background-color:#e0e0e0}blockquote{margin:20px 0;padding-left:1.5rem;border-left:5px solid #ee6e73}i{line-height:inherit}i.left{float:left;margin-right:15px}i.right{float:right;margin-left:15px}i.tiny{font-size:1rem}i.small{font-size:2rem}i.medium{font-size:4rem}i.large{font-size:6rem}img.responsive-img,video.responsive-video{max-width:100%;height:auto}.pagination li{display:inline-block;border-radius:2px;text-align:center;vertical-align:top;height:30px}.pagination li a{color:#444;display:inline-block;font-size:1.2rem;padding:0 10px;line-height:30px}.pagination li.active a{color:#fff}.pagination li.active{background-color:#ee6e73}.pagination li.disabled a{cursor:default;color:#999}.pagination li i{font-size:2rem}.pagination li.pages ul li{display:inline-block;float:none}@media only screen and (max-width: 992px){.pagination{width:100%}.pagination li.prev,.pagination li.next{width:10%}.pagination li.pages{width:80%;overflow:hidden;white-space:nowrap}}.breadcrumb{font-size:18px;color:rgba(255,255,255,0.7)}.breadcrumb i,.breadcrumb [class^=\"mdi-\"],.breadcrumb [class*=\"mdi-\"],.breadcrumb i.material-icons{display:inline-block;float:left;font-size:24px}.breadcrumb:before{content:'\\E5CC';color:rgba(255,255,255,0.7);vertical-align:top;display:inline-block;font-family:'Material Icons';font-weight:normal;font-style:normal;font-size:25px;margin:0 10px 0 8px;-webkit-font-smoothing:antialiased}.breadcrumb:first-child:before{display:none}.breadcrumb:last-child{color:#fff}.parallax-container{position:relative;overflow:hidden;height:500px}.parallax-container .parallax{position:absolute;top:0;left:0;right:0;bottom:0;z-index:-1}.parallax-container .parallax img{opacity:0;position:absolute;left:50%;bottom:0;min-width:100%;min-height:100%;-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);-webkit-transform:translateX(-50%);transform:translateX(-50%)}.pin-top,.pin-bottom{position:relative}.pinned{position:fixed !important}ul.staggered-list li{opacity:0}.fade-in{opacity:0;-webkit-transform-origin:0 50%;transform-origin:0 50%}@media only screen and (max-width: 600px){.hide-on-small-only,.hide-on-small-and-down{display:none !important}}@media only screen and (max-width: 992px){.hide-on-med-and-down{display:none !important}}@media only screen and (min-width: 601px){.hide-on-med-and-up{display:none !important}}@media only screen and (min-width: 600px) and (max-width: 992px){.hide-on-med-only{display:none !important}}@media only screen and (min-width: 993px){.hide-on-large-only{display:none !important}}@media only screen and (min-width: 1201px){.hide-on-extra-large-only{display:none !important}}@media only screen and (min-width: 1201px){.show-on-extra-large{display:block !important}}@media only screen and (min-width: 993px){.show-on-large{display:block !important}}@media only screen and (min-width: 600px) and (max-width: 992px){.show-on-medium{display:block !important}}@media only screen and (max-width: 600px){.show-on-small{display:block !important}}@media only screen and (min-width: 601px){.show-on-medium-and-up{display:block !important}}@media only screen and (max-width: 992px){.show-on-medium-and-down{display:block !important}}@media only screen and (max-width: 600px){.center-on-small-only{text-align:center}}.page-footer{padding-top:20px;color:#fff;background-color:#ee6e73}.page-footer .footer-copyright{overflow:hidden;min-height:50px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:10px 0px;color:rgba(255,255,255,0.8);background-color:rgba(51,51,51,0.08)}table,th,td{border:none}table{width:100%;display:table;border-collapse:collapse;border-spacing:0}table.striped tr{border-bottom:none}table.striped>tbody>tr:nth-child(odd){background-color:rgba(242,242,242,0.5)}table.striped>tbody>tr>td{border-radius:0}table.highlight>tbody>tr{-webkit-transition:background-color .25s ease;transition:background-color .25s ease}table.highlight>tbody>tr:hover{background-color:rgba(242,242,242,0.5)}table.centered thead tr th,table.centered tbody tr td{text-align:center}tr{border-bottom:1px solid rgba(0,0,0,0.12)}td,th{padding:15px 5px;display:table-cell;text-align:left;vertical-align:middle;border-radius:2px}@media only screen and (max-width: 992px){table.responsive-table{width:100%;border-collapse:collapse;border-spacing:0;display:block;position:relative}table.responsive-table td:empty:before{content:'\\A0'}table.responsive-table th,table.responsive-table td{margin:0;vertical-align:top}table.responsive-table th{text-align:left}table.responsive-table thead{display:block;float:left}table.responsive-table thead tr{display:block;padding:0 10px 0 0}table.responsive-table thead tr th::before{content:\"\\A0\"}table.responsive-table tbody{display:block;width:auto;position:relative;overflow-x:auto;white-space:nowrap}table.responsive-table tbody tr{display:inline-block;vertical-align:top}table.responsive-table th{display:block;text-align:right}table.responsive-table td{display:block;min-height:1.25em;text-align:left}table.responsive-table tr{border-bottom:none;padding:0 10px}table.responsive-table thead{border:0;border-right:1px solid rgba(0,0,0,0.12)}}.collection{margin:.5rem 0 1rem 0;border:1px solid #e0e0e0;border-radius:2px;overflow:hidden;position:relative}.collection .collection-item{background-color:#fff;line-height:1.5rem;padding:10px 20px;margin:0;border-bottom:1px solid #e0e0e0}.collection .collection-item.avatar{min-height:84px;padding-left:72px;position:relative}.collection .collection-item.avatar:not(.circle-clipper)>.circle,.collection .collection-item.avatar :not(.circle-clipper)>.circle{position:absolute;width:42px;height:42px;overflow:hidden;left:15px;display:inline-block;vertical-align:middle}.collection .collection-item.avatar i.circle{font-size:18px;line-height:42px;color:#fff;background-color:#999;text-align:center}.collection .collection-item.avatar .title{font-size:16px}.collection .collection-item.avatar p{margin:0}.collection .collection-item.avatar .secondary-content{position:absolute;top:16px;right:16px}.collection .collection-item:last-child{border-bottom:none}.collection .collection-item.active{background-color:#26a69a;color:#eafaf9}.collection .collection-item.active .secondary-content{color:#fff}.collection a.collection-item{display:block;-webkit-transition:.25s;transition:.25s;color:#26a69a}.collection a.collection-item:not(.active):hover{background-color:#ddd}.collection.with-header .collection-header{background-color:#fff;border-bottom:1px solid #e0e0e0;padding:10px 20px}.collection.with-header .collection-item{padding-left:30px}.collection.with-header .collection-item.avatar{padding-left:72px}.secondary-content{float:right;color:#26a69a}.collapsible .collection{margin:0;border:none}.video-container{position:relative;padding-bottom:56.25%;height:0;overflow:hidden}.video-container iframe,.video-container object,.video-container embed{position:absolute;top:0;left:0;width:100%;height:100%}.progress{position:relative;height:4px;display:block;width:100%;background-color:#acece6;border-radius:2px;margin:.5rem 0 1rem 0;overflow:hidden}.progress .determinate{position:absolute;top:0;left:0;bottom:0;background-color:#26a69a;-webkit-transition:width .3s linear;transition:width .3s linear}.progress .indeterminate{background-color:#26a69a}.progress .indeterminate:before{content:'';position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left, right;-webkit-animation:indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;animation:indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite}.progress .indeterminate:after{content:'';position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left, right;-webkit-animation:indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;animation:indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;-webkit-animation-delay:1.15s;animation-delay:1.15s}@-webkit-keyframes indeterminate{0%{left:-35%;right:100%}60%{left:100%;right:-90%}100%{left:100%;right:-90%}}@keyframes indeterminate{0%{left:-35%;right:100%}60%{left:100%;right:-90%}100%{left:100%;right:-90%}}@-webkit-keyframes indeterminate-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}100%{left:107%;right:-8%}}@keyframes indeterminate-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}100%{left:107%;right:-8%}}.hide{display:none !important}.left-align{text-align:left}.right-align{text-align:right}.center,.center-align{text-align:center}.left{float:left !important}.right{float:right !important}.no-select,input[type=range],input[type=range]+.thumb{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.circle{border-radius:50%}.center-block{display:block;margin-left:auto;margin-right:auto}.truncate{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.no-padding{padding:0 !important}span.badge{min-width:3rem;padding:0 6px;margin-left:14px;text-align:center;font-size:1rem;line-height:22px;height:22px;color:#757575;float:right;-webkit-box-sizing:border-box;box-sizing:border-box}span.badge.new{font-weight:300;font-size:0.8rem;color:#fff;background-color:#26a69a;border-radius:2px}span.badge.new:after{content:\" new\"}span.badge[data-badge-caption]::after{content:\" \" attr(data-badge-caption)}nav ul a span.badge{display:inline-block;float:none;margin-left:4px;line-height:22px;height:22px;-webkit-font-smoothing:auto}.collection-item span.badge{margin-top:calc(.75rem - 11px)}.collapsible span.badge{margin-left:auto}.sidenav span.badge{margin-top:calc(24px - 11px)}table span.badge{display:inline-block;float:none;margin-left:auto}.material-icons{text-rendering:optimizeLegibility;-webkit-font-feature-settings:'liga';-moz-font-feature-settings:'liga';font-feature-settings:'liga'}.container{margin:0 auto;max-width:1280px;width:90%}@media only screen and (min-width: 601px){.container{width:85%}}@media only screen and (min-width: 993px){.container{width:70%}}.col .row{margin-left:-.75rem;margin-right:-.75rem}.section{padding-top:1rem;padding-bottom:1rem}.section.no-pad{padding:0}.section.no-pad-bot{padding-bottom:0}.section.no-pad-top{padding-top:0}.row{margin-left:auto;margin-right:auto;margin-bottom:20px}.row:after{content:\"\";display:table;clear:both}.row .col{float:left;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0 .75rem;min-height:1px}.row .col[class*=\"push-\"],.row .col[class*=\"pull-\"]{position:relative}.row .col.s1{width:8.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.s2{width:16.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.s3{width:25%;margin-left:auto;left:auto;right:auto}.row .col.s4{width:33.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.s5{width:41.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.s6{width:50%;margin-left:auto;left:auto;right:auto}.row .col.s7{width:58.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.s8{width:66.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.s9{width:75%;margin-left:auto;left:auto;right:auto}.row .col.s10{width:83.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.s11{width:91.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.s12{width:100%;margin-left:auto;left:auto;right:auto}.row .col.offset-s1{margin-left:8.3333333333%}.row .col.pull-s1{right:8.3333333333%}.row .col.push-s1{left:8.3333333333%}.row .col.offset-s2{margin-left:16.6666666667%}.row .col.pull-s2{right:16.6666666667%}.row .col.push-s2{left:16.6666666667%}.row .col.offset-s3{margin-left:25%}.row .col.pull-s3{right:25%}.row .col.push-s3{left:25%}.row .col.offset-s4{margin-left:33.3333333333%}.row .col.pull-s4{right:33.3333333333%}.row .col.push-s4{left:33.3333333333%}.row .col.offset-s5{margin-left:41.6666666667%}.row .col.pull-s5{right:41.6666666667%}.row .col.push-s5{left:41.6666666667%}.row .col.offset-s6{margin-left:50%}.row .col.pull-s6{right:50%}.row .col.push-s6{left:50%}.row .col.offset-s7{margin-left:58.3333333333%}.row .col.pull-s7{right:58.3333333333%}.row .col.push-s7{left:58.3333333333%}.row .col.offset-s8{margin-left:66.6666666667%}.row .col.pull-s8{right:66.6666666667%}.row .col.push-s8{left:66.6666666667%}.row .col.offset-s9{margin-left:75%}.row .col.pull-s9{right:75%}.row .col.push-s9{left:75%}.row .col.offset-s10{margin-left:83.3333333333%}.row .col.pull-s10{right:83.3333333333%}.row .col.push-s10{left:83.3333333333%}.row .col.offset-s11{margin-left:91.6666666667%}.row .col.pull-s11{right:91.6666666667%}.row .col.push-s11{left:91.6666666667%}.row .col.offset-s12{margin-left:100%}.row .col.pull-s12{right:100%}.row .col.push-s12{left:100%}@media only screen and (min-width: 601px){.row .col.m1{width:8.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.m2{width:16.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.m3{width:25%;margin-left:auto;left:auto;right:auto}.row .col.m4{width:33.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.m5{width:41.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.m6{width:50%;margin-left:auto;left:auto;right:auto}.row .col.m7{width:58.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.m8{width:66.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.m9{width:75%;margin-left:auto;left:auto;right:auto}.row .col.m10{width:83.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.m11{width:91.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.m12{width:100%;margin-left:auto;left:auto;right:auto}.row .col.offset-m1{margin-left:8.3333333333%}.row .col.pull-m1{right:8.3333333333%}.row .col.push-m1{left:8.3333333333%}.row .col.offset-m2{margin-left:16.6666666667%}.row .col.pull-m2{right:16.6666666667%}.row .col.push-m2{left:16.6666666667%}.row .col.offset-m3{margin-left:25%}.row .col.pull-m3{right:25%}.row .col.push-m3{left:25%}.row .col.offset-m4{margin-left:33.3333333333%}.row .col.pull-m4{right:33.3333333333%}.row .col.push-m4{left:33.3333333333%}.row .col.offset-m5{margin-left:41.6666666667%}.row .col.pull-m5{right:41.6666666667%}.row .col.push-m5{left:41.6666666667%}.row .col.offset-m6{margin-left:50%}.row .col.pull-m6{right:50%}.row .col.push-m6{left:50%}.row .col.offset-m7{margin-left:58.3333333333%}.row .col.pull-m7{right:58.3333333333%}.row .col.push-m7{left:58.3333333333%}.row .col.offset-m8{margin-left:66.6666666667%}.row .col.pull-m8{right:66.6666666667%}.row .col.push-m8{left:66.6666666667%}.row .col.offset-m9{margin-left:75%}.row .col.pull-m9{right:75%}.row .col.push-m9{left:75%}.row .col.offset-m10{margin-left:83.3333333333%}.row .col.pull-m10{right:83.3333333333%}.row .col.push-m10{left:83.3333333333%}.row .col.offset-m11{margin-left:91.6666666667%}.row .col.pull-m11{right:91.6666666667%}.row .col.push-m11{left:91.6666666667%}.row .col.offset-m12{margin-left:100%}.row .col.pull-m12{right:100%}.row .col.push-m12{left:100%}}@media only screen and (min-width: 993px){.row .col.l1{width:8.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.l2{width:16.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.l3{width:25%;margin-left:auto;left:auto;right:auto}.row .col.l4{width:33.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.l5{width:41.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.l6{width:50%;margin-left:auto;left:auto;right:auto}.row .col.l7{width:58.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.l8{width:66.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.l9{width:75%;margin-left:auto;left:auto;right:auto}.row .col.l10{width:83.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.l11{width:91.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.l12{width:100%;margin-left:auto;left:auto;right:auto}.row .col.offset-l1{margin-left:8.3333333333%}.row .col.pull-l1{right:8.3333333333%}.row .col.push-l1{left:8.3333333333%}.row .col.offset-l2{margin-left:16.6666666667%}.row .col.pull-l2{right:16.6666666667%}.row .col.push-l2{left:16.6666666667%}.row .col.offset-l3{margin-left:25%}.row .col.pull-l3{right:25%}.row .col.push-l3{left:25%}.row .col.offset-l4{margin-left:33.3333333333%}.row .col.pull-l4{right:33.3333333333%}.row .col.push-l4{left:33.3333333333%}.row .col.offset-l5{margin-left:41.6666666667%}.row .col.pull-l5{right:41.6666666667%}.row .col.push-l5{left:41.6666666667%}.row .col.offset-l6{margin-left:50%}.row .col.pull-l6{right:50%}.row .col.push-l6{left:50%}.row .col.offset-l7{margin-left:58.3333333333%}.row .col.pull-l7{right:58.3333333333%}.row .col.push-l7{left:58.3333333333%}.row .col.offset-l8{margin-left:66.6666666667%}.row .col.pull-l8{right:66.6666666667%}.row .col.push-l8{left:66.6666666667%}.row .col.offset-l9{margin-left:75%}.row .col.pull-l9{right:75%}.row .col.push-l9{left:75%}.row .col.offset-l10{margin-left:83.3333333333%}.row .col.pull-l10{right:83.3333333333%}.row .col.push-l10{left:83.3333333333%}.row .col.offset-l11{margin-left:91.6666666667%}.row .col.pull-l11{right:91.6666666667%}.row .col.push-l11{left:91.6666666667%}.row .col.offset-l12{margin-left:100%}.row .col.pull-l12{right:100%}.row .col.push-l12{left:100%}}@media only screen and (min-width: 1201px){.row .col.xl1{width:8.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.xl2{width:16.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.xl3{width:25%;margin-left:auto;left:auto;right:auto}.row .col.xl4{width:33.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.xl5{width:41.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.xl6{width:50%;margin-left:auto;left:auto;right:auto}.row .col.xl7{width:58.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.xl8{width:66.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.xl9{width:75%;margin-left:auto;left:auto;right:auto}.row .col.xl10{width:83.3333333333%;margin-left:auto;left:auto;right:auto}.row .col.xl11{width:91.6666666667%;margin-left:auto;left:auto;right:auto}.row .col.xl12{width:100%;margin-left:auto;left:auto;right:auto}.row .col.offset-xl1{margin-left:8.3333333333%}.row .col.pull-xl1{right:8.3333333333%}.row .col.push-xl1{left:8.3333333333%}.row .col.offset-xl2{margin-left:16.6666666667%}.row .col.pull-xl2{right:16.6666666667%}.row .col.push-xl2{left:16.6666666667%}.row .col.offset-xl3{margin-left:25%}.row .col.pull-xl3{right:25%}.row .col.push-xl3{left:25%}.row .col.offset-xl4{margin-left:33.3333333333%}.row .col.pull-xl4{right:33.3333333333%}.row .col.push-xl4{left:33.3333333333%}.row .col.offset-xl5{margin-left:41.6666666667%}.row .col.pull-xl5{right:41.6666666667%}.row .col.push-xl5{left:41.6666666667%}.row .col.offset-xl6{margin-left:50%}.row .col.pull-xl6{right:50%}.row .col.push-xl6{left:50%}.row .col.offset-xl7{margin-left:58.3333333333%}.row .col.pull-xl7{right:58.3333333333%}.row .col.push-xl7{left:58.3333333333%}.row .col.offset-xl8{margin-left:66.6666666667%}.row .col.pull-xl8{right:66.6666666667%}.row .col.push-xl8{left:66.6666666667%}.row .col.offset-xl9{margin-left:75%}.row .col.pull-xl9{right:75%}.row .col.push-xl9{left:75%}.row .col.offset-xl10{margin-left:83.3333333333%}.row .col.pull-xl10{right:83.3333333333%}.row .col.push-xl10{left:83.3333333333%}.row .col.offset-xl11{margin-left:91.6666666667%}.row .col.pull-xl11{right:91.6666666667%}.row .col.push-xl11{left:91.6666666667%}.row .col.offset-xl12{margin-left:100%}.row .col.pull-xl12{right:100%}.row .col.push-xl12{left:100%}}nav{color:#fff;background-color:#ee6e73;width:100%;height:56px;line-height:56px}nav.nav-extended{height:auto}nav.nav-extended .nav-wrapper{min-height:56px;height:auto}nav.nav-extended .nav-content{position:relative;line-height:normal}nav a{color:#fff}nav i,nav [class^=\"mdi-\"],nav [class*=\"mdi-\"],nav i.material-icons{display:block;font-size:24px;height:56px;line-height:56px}nav .nav-wrapper{position:relative;height:100%}@media only screen and (min-width: 993px){nav a.sidenav-trigger{display:none}}nav .sidenav-trigger{float:left;position:relative;z-index:1;height:56px;margin:0 18px}nav .sidenav-trigger i{height:56px;line-height:56px}nav .brand-logo{position:absolute;color:#fff;display:inline-block;font-size:2.1rem;padding:0}nav .brand-logo.center{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}@media only screen and (max-width: 992px){nav .brand-logo{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}nav .brand-logo.left,nav .brand-logo.right{padding:0;-webkit-transform:none;transform:none}nav .brand-logo.left{left:0.5rem}nav .brand-logo.right{right:0.5rem;left:auto}}nav .brand-logo.right{right:0.5rem;padding:0}nav .brand-logo i,nav .brand-logo [class^=\"mdi-\"],nav .brand-logo [class*=\"mdi-\"],nav .brand-logo i.material-icons{float:left;margin-right:15px}nav .nav-title{display:inline-block;font-size:32px;padding:28px 0}nav ul{margin:0}nav ul li{-webkit-transition:background-color .3s;transition:background-color .3s;float:left;padding:0}nav ul li.active{background-color:rgba(0,0,0,0.1)}nav ul a{-webkit-transition:background-color .3s;transition:background-color .3s;font-size:1rem;color:#fff;display:block;padding:0 15px;cursor:pointer}nav ul a.btn,nav ul a.btn-large,nav ul a.btn-small,nav ul a.btn-large,nav ul a.btn-flat,nav ul a.btn-floating{margin-top:-2px;margin-left:15px;margin-right:15px}nav ul a.btn>.material-icons,nav ul a.btn-large>.material-icons,nav ul a.btn-small>.material-icons,nav ul a.btn-large>.material-icons,nav ul a.btn-flat>.material-icons,nav ul a.btn-floating>.material-icons{height:inherit;line-height:inherit}nav ul a:hover{background-color:rgba(0,0,0,0.1)}nav ul.left{float:left}nav form{height:100%}nav .input-field{margin:0;height:100%}nav .input-field input{height:100%;font-size:1.2rem;border:none;padding-left:2rem}nav .input-field input:focus,nav .input-field input[type=text]:valid,nav .input-field input[type=password]:valid,nav .input-field input[type=email]:valid,nav .input-field input[type=url]:valid,nav .input-field input[type=date]:valid{border:none;-webkit-box-shadow:none;box-shadow:none}nav .input-field label{top:0;left:0}nav .input-field label i{color:rgba(255,255,255,0.7);-webkit-transition:color .3s;transition:color .3s}nav .input-field label.active i{color:#fff}.navbar-fixed{position:relative;height:56px;z-index:997}.navbar-fixed nav{position:fixed}@media only screen and (min-width: 601px){nav.nav-extended .nav-wrapper{min-height:64px}nav,nav .nav-wrapper i,nav a.sidenav-trigger,nav a.sidenav-trigger i{height:64px;line-height:64px}.navbar-fixed{height:64px}}a{text-decoration:none}html{line-height:1.5;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif;font-weight:normal;color:rgba(0,0,0,0.87)}@media only screen and (min-width: 0){html{font-size:14px}}@media only screen and (min-width: 992px){html{font-size:14.5px}}@media only screen and (min-width: 1200px){html{font-size:15px}}h1,h2,h3,h4,h5,h6{font-weight:400;line-height:1.3}h1 a,h2 a,h3 a,h4 a,h5 a,h6 a{font-weight:inherit}h1{font-size:4.2rem;line-height:110%;margin:2.8rem 0 1.68rem 0}h2{font-size:3.56rem;line-height:110%;margin:2.3733333333rem 0 1.424rem 0}h3{font-size:2.92rem;line-height:110%;margin:1.9466666667rem 0 1.168rem 0}h4{font-size:2.28rem;line-height:110%;margin:1.52rem 0 .912rem 0}h5{font-size:1.64rem;line-height:110%;margin:1.0933333333rem 0 .656rem 0}h6{font-size:1.15rem;line-height:110%;margin:.7666666667rem 0 .46rem 0}em{font-style:italic}strong{font-weight:500}small{font-size:75%}.light{font-weight:300}.thin{font-weight:200}@media only screen and (min-width: 360px){.flow-text{font-size:1.2rem}}@media only screen and (min-width: 390px){.flow-text{font-size:1.224rem}}@media only screen and (min-width: 420px){.flow-text{font-size:1.248rem}}@media only screen and (min-width: 450px){.flow-text{font-size:1.272rem}}@media only screen and (min-width: 480px){.flow-text{font-size:1.296rem}}@media only screen and (min-width: 510px){.flow-text{font-size:1.32rem}}@media only screen and (min-width: 540px){.flow-text{font-size:1.344rem}}@media only screen and (min-width: 570px){.flow-text{font-size:1.368rem}}@media only screen and (min-width: 600px){.flow-text{font-size:1.392rem}}@media only screen and (min-width: 630px){.flow-text{font-size:1.416rem}}@media only screen and (min-width: 660px){.flow-text{font-size:1.44rem}}@media only screen and (min-width: 690px){.flow-text{font-size:1.464rem}}@media only screen and (min-width: 720px){.flow-text{font-size:1.488rem}}@media only screen and (min-width: 750px){.flow-text{font-size:1.512rem}}@media only screen and (min-width: 780px){.flow-text{font-size:1.536rem}}@media only screen and (min-width: 810px){.flow-text{font-size:1.56rem}}@media only screen and (min-width: 840px){.flow-text{font-size:1.584rem}}@media only screen and (min-width: 870px){.flow-text{font-size:1.608rem}}@media only screen and (min-width: 900px){.flow-text{font-size:1.632rem}}@media only screen and (min-width: 930px){.flow-text{font-size:1.656rem}}@media only screen and (min-width: 960px){.flow-text{font-size:1.68rem}}@media only screen and (max-width: 360px){.flow-text{font-size:1.2rem}}.scale-transition{-webkit-transition:-webkit-transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important;transition:-webkit-transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important;transition:transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important;transition:transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63), -webkit-transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important}.scale-transition.scale-out{-webkit-transform:scale(0);transform:scale(0);-webkit-transition:-webkit-transform .2s !important;transition:-webkit-transform .2s !important;transition:transform .2s !important;transition:transform .2s, -webkit-transform .2s !important}.scale-transition.scale-in{-webkit-transform:scale(1);transform:scale(1)}.card-panel{-webkit-transition:-webkit-box-shadow .25s;transition:-webkit-box-shadow .25s;transition:box-shadow .25s;transition:box-shadow .25s, -webkit-box-shadow .25s;padding:24px;margin:.5rem 0 1rem 0;border-radius:2px;background-color:#fff}.card{position:relative;margin:.5rem 0 1rem 0;background-color:#fff;-webkit-transition:-webkit-box-shadow .25s;transition:-webkit-box-shadow .25s;transition:box-shadow .25s;transition:box-shadow .25s, -webkit-box-shadow .25s;border-radius:2px}.card .card-title{font-size:24px;font-weight:300}.card .card-title.activator{cursor:pointer}.card.small,.card.medium,.card.large{position:relative}.card.small .card-image,.card.medium .card-image,.card.large .card-image{max-height:60%;overflow:hidden}.card.small .card-image+.card-content,.card.medium .card-image+.card-content,.card.large .card-image+.card-content{max-height:40%}.card.small .card-content,.card.medium .card-content,.card.large .card-content{max-height:100%;overflow:hidden}.card.small .card-action,.card.medium .card-action,.card.large .card-action{position:absolute;bottom:0;left:0;right:0}.card.small{height:300px}.card.medium{height:400px}.card.large{height:500px}.card.horizontal{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.card.horizontal.small .card-image,.card.horizontal.medium .card-image,.card.horizontal.large .card-image{height:100%;max-height:none;overflow:visible}.card.horizontal.small .card-image img,.card.horizontal.medium .card-image img,.card.horizontal.large .card-image img{height:100%}.card.horizontal .card-image{max-width:50%}.card.horizontal .card-image img{border-radius:2px 0 0 2px;max-width:100%;width:auto}.card.horizontal .card-stacked{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;position:relative}.card.horizontal .card-stacked .card-content{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1}.card.sticky-action .card-action{z-index:2}.card.sticky-action .card-reveal{z-index:1;padding-bottom:64px}.card .card-image{position:relative}.card .card-image img{display:block;border-radius:2px 2px 0 0;position:relative;left:0;right:0;top:0;bottom:0;width:100%}.card .card-image .card-title{color:#fff;position:absolute;bottom:0;left:0;max-width:100%;padding:24px}.card .card-content{padding:24px;border-radius:0 0 2px 2px}.card .card-content p{margin:0}.card .card-content .card-title{display:block;line-height:32px;margin-bottom:8px}.card .card-content .card-title i{line-height:32px}.card .card-action{background-color:inherit;border-top:1px solid rgba(160,160,160,0.2);position:relative;padding:16px 24px}.card .card-action:last-child{border-radius:0 0 2px 2px}.card .card-action a:not(.btn):not(.btn-large):not(.btn-small):not(.btn-large):not(.btn-floating){color:#ffab40;margin-right:24px;-webkit-transition:color .3s ease;transition:color .3s ease;text-transform:uppercase}.card .card-action a:not(.btn):not(.btn-large):not(.btn-small):not(.btn-large):not(.btn-floating):hover{color:#ffd8a6}.card .card-reveal{padding:24px;position:absolute;background-color:#fff;width:100%;overflow-y:auto;left:0;top:100%;height:100%;z-index:3;display:none}.card .card-reveal .card-title{cursor:pointer;display:block}#toast-container{display:block;position:fixed;z-index:10000}@media only screen and (max-width: 600px){#toast-container{min-width:100%;bottom:0%}}@media only screen and (min-width: 601px) and (max-width: 992px){#toast-container{left:5%;bottom:7%;max-width:90%}}@media only screen and (min-width: 993px){#toast-container{top:10%;right:7%;max-width:86%}}.toast{border-radius:2px;top:35px;width:auto;margin-top:10px;position:relative;max-width:100%;height:auto;min-height:48px;line-height:1.5em;background-color:#323232;padding:10px 25px;font-size:1.1rem;font-weight:300;color:#fff;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;cursor:default}.toast .toast-action{color:#eeff41;font-weight:500;margin-right:-25px;margin-left:3rem}.toast.rounded{border-radius:24px}@media only screen and (max-width: 600px){.toast{width:100%;border-radius:0}}.tabs{position:relative;overflow-x:auto;overflow-y:hidden;height:48px;width:100%;background-color:#fff;margin:0 auto;white-space:nowrap}.tabs.tabs-transparent{background-color:transparent}.tabs.tabs-transparent .tab a,.tabs.tabs-transparent .tab.disabled a,.tabs.tabs-transparent .tab.disabled a:hover{color:rgba(255,255,255,0.7)}.tabs.tabs-transparent .tab a:hover,.tabs.tabs-transparent .tab a.active{color:#fff}.tabs.tabs-transparent .indicator{background-color:#fff}.tabs.tabs-fixed-width{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.tabs.tabs-fixed-width .tab{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1}.tabs .tab{display:inline-block;text-align:center;line-height:48px;height:48px;padding:0;margin:0;text-transform:uppercase}.tabs .tab a{color:rgba(238,110,115,0.7);display:block;width:100%;height:100%;padding:0 24px;font-size:14px;text-overflow:ellipsis;overflow:hidden;-webkit-transition:color .28s ease, background-color .28s ease;transition:color .28s ease, background-color .28s ease}.tabs .tab a:focus,.tabs .tab a:focus.active{background-color:rgba(246,178,181,0.2);outline:none}.tabs .tab a:hover,.tabs .tab a.active{background-color:transparent;color:#ee6e73}.tabs .tab.disabled a,.tabs .tab.disabled a:hover{color:rgba(238,110,115,0.4);cursor:default}.tabs .indicator{position:absolute;bottom:0;height:2px;background-color:#f6b2b5;will-change:left, right}@media only screen and (max-width: 992px){.tabs{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.tabs .tab{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1}.tabs .tab a{padding:0 12px}}.material-tooltip{padding:10px 8px;font-size:1rem;z-index:2000;background-color:transparent;border-radius:2px;color:#fff;min-height:36px;line-height:120%;opacity:0;position:absolute;text-align:center;max-width:calc(100% - 4px);overflow:hidden;left:0;top:0;pointer-events:none;visibility:hidden;background-color:#323232}.backdrop{position:absolute;opacity:0;height:7px;width:14px;border-radius:0 0 50% 50%;background-color:#323232;z-index:-1;-webkit-transform-origin:50% 0%;transform-origin:50% 0%;visibility:hidden}.btn,.btn-large,.btn-small,.btn-flat{border:none;border-radius:2px;display:inline-block;height:36px;line-height:36px;padding:0 16px;text-transform:uppercase;vertical-align:middle;-webkit-tap-highlight-color:transparent}.btn.disabled,.disabled.btn-large,.disabled.btn-small,.btn-floating.disabled,.btn-large.disabled,.btn-small.disabled,.btn-flat.disabled,.btn:disabled,.btn-large:disabled,.btn-small:disabled,.btn-floating:disabled,.btn-large:disabled,.btn-small:disabled,.btn-flat:disabled,.btn[disabled],.btn-large[disabled],.btn-small[disabled],.btn-floating[disabled],.btn-large[disabled],.btn-small[disabled],.btn-flat[disabled]{pointer-events:none;background-color:#DFDFDF !important;-webkit-box-shadow:none;box-shadow:none;color:#9F9F9F !important;cursor:default}.btn.disabled:hover,.disabled.btn-large:hover,.disabled.btn-small:hover,.btn-floating.disabled:hover,.btn-large.disabled:hover,.btn-small.disabled:hover,.btn-flat.disabled:hover,.btn:disabled:hover,.btn-large:disabled:hover,.btn-small:disabled:hover,.btn-floating:disabled:hover,.btn-large:disabled:hover,.btn-small:disabled:hover,.btn-flat:disabled:hover,.btn[disabled]:hover,.btn-large[disabled]:hover,.btn-small[disabled]:hover,.btn-floating[disabled]:hover,.btn-large[disabled]:hover,.btn-small[disabled]:hover,.btn-flat[disabled]:hover{background-color:#DFDFDF !important;color:#9F9F9F !important}.btn,.btn-large,.btn-small,.btn-floating,.btn-large,.btn-small,.btn-flat{font-size:14px;outline:0}.btn i,.btn-large i,.btn-small i,.btn-floating i,.btn-large i,.btn-small i,.btn-flat i{font-size:1.3rem;line-height:inherit}.btn:focus,.btn-large:focus,.btn-small:focus,.btn-floating:focus{background-color:#1d7d74}.btn,.btn-large,.btn-small{text-decoration:none;color:#fff;background-color:#26a69a;text-align:center;letter-spacing:.5px;-webkit-transition:background-color .2s ease-out;transition:background-color .2s ease-out;cursor:pointer}.btn:hover,.btn-large:hover,.btn-small:hover{background-color:#2bbbad}.btn-floating{display:inline-block;color:#fff;position:relative;overflow:hidden;z-index:1;width:40px;height:40px;line-height:40px;padding:0;background-color:#26a69a;border-radius:50%;-webkit-transition:background-color .3s;transition:background-color .3s;cursor:pointer;vertical-align:middle}.btn-floating:hover{background-color:#26a69a}.btn-floating:before{border-radius:0}.btn-floating.btn-large{width:56px;height:56px;padding:0}.btn-floating.btn-large.halfway-fab{bottom:-28px}.btn-floating.btn-large i{line-height:56px}.btn-floating.btn-small{width:32.4px;height:32.4px}.btn-floating.btn-small.halfway-fab{bottom:-16.2px}.btn-floating.btn-small i{line-height:32.4px}.btn-floating.halfway-fab{position:absolute;right:24px;bottom:-20px}.btn-floating.halfway-fab.left{right:auto;left:24px}.btn-floating i{width:inherit;display:inline-block;text-align:center;color:#fff;font-size:1.6rem;line-height:40px}button.btn-floating{border:none}.fixed-action-btn{position:fixed;right:23px;bottom:23px;padding-top:15px;margin-bottom:0;z-index:997}.fixed-action-btn.active ul{visibility:visible}.fixed-action-btn.direction-left,.fixed-action-btn.direction-right{padding:0 0 0 15px}.fixed-action-btn.direction-left ul,.fixed-action-btn.direction-right ul{text-align:right;right:64px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);height:100%;left:auto;width:500px}.fixed-action-btn.direction-left ul li,.fixed-action-btn.direction-right ul li{display:inline-block;margin:7.5px 15px 0 0}.fixed-action-btn.direction-right{padding:0 15px 0 0}.fixed-action-btn.direction-right ul{text-align:left;direction:rtl;left:64px;right:auto}.fixed-action-btn.direction-right ul li{margin:7.5px 0 0 15px}.fixed-action-btn.direction-bottom{padding:0 0 15px 0}.fixed-action-btn.direction-bottom ul{top:64px;bottom:auto;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:reverse;-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.fixed-action-btn.direction-bottom ul li{margin:15px 0 0 0}.fixed-action-btn.toolbar{padding:0;height:56px}.fixed-action-btn.toolbar.active>a i{opacity:0}.fixed-action-btn.toolbar ul{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;top:0;bottom:0;z-index:1}.fixed-action-btn.toolbar ul li{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;display:inline-block;margin:0;height:100%;-webkit-transition:none;transition:none}.fixed-action-btn.toolbar ul li a{display:block;overflow:hidden;position:relative;width:100%;height:100%;background-color:transparent;-webkit-box-shadow:none;box-shadow:none;color:#fff;line-height:56px;z-index:1}.fixed-action-btn.toolbar ul li a i{line-height:inherit}.fixed-action-btn ul{left:0;right:0;text-align:center;position:absolute;bottom:64px;margin:0;visibility:hidden}.fixed-action-btn ul li{margin-bottom:15px}.fixed-action-btn ul a.btn-floating{opacity:0}.fixed-action-btn .fab-backdrop{position:absolute;top:0;left:0;z-index:-1;width:40px;height:40px;background-color:#26a69a;border-radius:50%;-webkit-transform:scale(0);transform:scale(0)}.btn-flat{-webkit-box-shadow:none;box-shadow:none;background-color:transparent;color:#343434;cursor:pointer;-webkit-transition:background-color .2s;transition:background-color .2s}.btn-flat:focus,.btn-flat:hover{-webkit-box-shadow:none;box-shadow:none}.btn-flat:focus{background-color:rgba(0,0,0,0.1)}.btn-flat.disabled,.btn-flat.btn-flat[disabled]{background-color:transparent !important;color:#b3b2b2 !important;cursor:default}.btn-large{height:54px;line-height:54px;font-size:15px;padding:0 28px}.btn-large i{font-size:1.6rem}.btn-small{height:32.4px;line-height:32.4px;font-size:13px}.btn-small i{font-size:1.2rem}.btn-block{display:block}.dropdown-content{background-color:#fff;margin:0;display:none;min-width:100px;overflow-y:auto;opacity:0;position:absolute;left:0;top:0;z-index:9999;-webkit-transform-origin:0 0;transform-origin:0 0}.dropdown-content:focus{outline:0}.dropdown-content li{clear:both;color:rgba(0,0,0,0.87);cursor:pointer;min-height:50px;line-height:1.5rem;width:100%;text-align:left}.dropdown-content li:hover,.dropdown-content li.active{background-color:#eee}.dropdown-content li:focus{outline:none}.dropdown-content li.divider{min-height:0;height:1px}.dropdown-content li>a,.dropdown-content li>span{font-size:16px;color:#26a69a;display:block;line-height:22px;padding:14px 16px}.dropdown-content li>span>label{top:1px;left:0;height:18px}.dropdown-content li>a>i{height:inherit;line-height:inherit;float:left;margin:0 24px 0 0;width:24px}body.keyboard-focused .dropdown-content li:focus{background-color:#dadada}.input-field.col .dropdown-content [type=\"checkbox\"]+label{top:1px;left:0;height:18px;-webkit-transform:none;transform:none}.dropdown-trigger{cursor:pointer}/*!\r\n * Waves v0.6.0\r\n * http://fian.my.id/Waves\r\n *\r\n * Copyright 2014 Alfiana E. Sibuea and other contributors\r\n * Released under the MIT license\r\n * https://github.com/fians/Waves/blob/master/LICENSE\r\n */.waves-effect{position:relative;cursor:pointer;display:inline-block;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;vertical-align:middle;z-index:1;-webkit-transition:.3s ease-out;transition:.3s ease-out}.waves-effect .waves-ripple{position:absolute;border-radius:50%;width:20px;height:20px;margin-top:-10px;margin-left:-10px;opacity:0;background:rgba(0,0,0,0.2);-webkit-transition:all 0.7s ease-out;transition:all 0.7s ease-out;-webkit-transition-property:opacity, -webkit-transform;transition-property:opacity, -webkit-transform;transition-property:transform, opacity;transition-property:transform, opacity, -webkit-transform;-webkit-transform:scale(0);transform:scale(0);pointer-events:none}.waves-effect.waves-light .waves-ripple{background-color:rgba(255,255,255,0.45)}.waves-effect.waves-red .waves-ripple{background-color:rgba(244,67,54,0.7)}.waves-effect.waves-yellow .waves-ripple{background-color:rgba(255,235,59,0.7)}.waves-effect.waves-orange .waves-ripple{background-color:rgba(255,152,0,0.7)}.waves-effect.waves-purple .waves-ripple{background-color:rgba(156,39,176,0.7)}.waves-effect.waves-green .waves-ripple{background-color:rgba(76,175,80,0.7)}.waves-effect.waves-teal .waves-ripple{background-color:rgba(0,150,136,0.7)}.waves-effect input[type=\"button\"],.waves-effect input[type=\"reset\"],.waves-effect input[type=\"submit\"]{border:0;font-style:normal;font-size:inherit;text-transform:inherit;background:none}.waves-effect img{position:relative;z-index:-1}.waves-notransition{-webkit-transition:none !important;transition:none !important}.waves-circle{-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-mask-image:-webkit-radial-gradient(circle, white 100%, black 100%)}.waves-input-wrapper{border-radius:0.2em;vertical-align:bottom}.waves-input-wrapper .waves-button-input{position:relative;top:0;left:0;z-index:1}.waves-circle{text-align:center;width:2.5em;height:2.5em;line-height:2.5em;border-radius:50%;-webkit-mask-image:none}.waves-block{display:block}.waves-effect .waves-ripple{z-index:-1}.modal{display:none;position:fixed;left:0;right:0;background-color:#fafafa;padding:0;max-height:70%;width:55%;margin:auto;overflow-y:auto;border-radius:2px;will-change:top, opacity}.modal:focus{outline:none}@media only screen and (max-width: 992px){.modal{width:80%}}.modal h1,.modal h2,.modal h3,.modal h4{margin-top:0}.modal .modal-content{padding:24px}.modal .modal-close{cursor:pointer}.modal .modal-footer{border-radius:0 0 2px 2px;background-color:#fafafa;padding:4px 6px;height:56px;width:100%;text-align:right}.modal .modal-footer .btn,.modal .modal-footer .btn-large,.modal .modal-footer .btn-small,.modal .modal-footer .btn-flat{margin:6px 0}.modal-overlay{position:fixed;z-index:999;top:-25%;left:0;bottom:0;right:0;height:125%;width:100%;background:#000;display:none;will-change:opacity}.modal.modal-fixed-footer{padding:0;height:70%}.modal.modal-fixed-footer .modal-content{position:absolute;height:calc(100% - 56px);max-height:100%;width:100%;overflow-y:auto}.modal.modal-fixed-footer .modal-footer{border-top:1px solid rgba(0,0,0,0.1);position:absolute;bottom:0}.modal.bottom-sheet{top:auto;bottom:-100%;margin:0;width:100%;max-height:45%;border-radius:0;will-change:bottom, opacity}.collapsible{border-top:1px solid #ddd;border-right:1px solid #ddd;border-left:1px solid #ddd;margin:.5rem 0 1rem 0}.collapsible-header{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;cursor:pointer;-webkit-tap-highlight-color:transparent;line-height:1.5;padding:1rem;background-color:#fff;border-bottom:1px solid #ddd}.collapsible-header:focus{outline:0}.collapsible-header i{width:2rem;font-size:1.6rem;display:inline-block;text-align:center;margin-right:1rem}.keyboard-focused .collapsible-header:focus{background-color:#eee}.collapsible-body{display:none;border-bottom:1px solid #ddd;-webkit-box-sizing:border-box;box-sizing:border-box;padding:2rem}.sidenav .collapsible,.sidenav.fixed .collapsible{border:none;-webkit-box-shadow:none;box-shadow:none}.sidenav .collapsible li,.sidenav.fixed .collapsible li{padding:0}.sidenav .collapsible-header,.sidenav.fixed .collapsible-header{background-color:transparent;border:none;line-height:inherit;height:inherit;padding:0 16px}.sidenav .collapsible-header:hover,.sidenav.fixed .collapsible-header:hover{background-color:rgba(0,0,0,0.05)}.sidenav .collapsible-header i,.sidenav.fixed .collapsible-header i{line-height:inherit}.sidenav .collapsible-body,.sidenav.fixed .collapsible-body{border:0;background-color:#fff}.sidenav .collapsible-body li a,.sidenav.fixed .collapsible-body li a{padding:0 23.5px 0 31px}.collapsible.popout{border:none;-webkit-box-shadow:none;box-shadow:none}.collapsible.popout>li{-webkit-box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);margin:0 24px;-webkit-transition:margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);transition:margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)}.collapsible.popout>li.active{-webkit-box-shadow:0 5px 11px 0 rgba(0,0,0,0.18),0 4px 15px 0 rgba(0,0,0,0.15);box-shadow:0 5px 11px 0 rgba(0,0,0,0.18),0 4px 15px 0 rgba(0,0,0,0.15);margin:16px 0}.chip{display:inline-block;height:32px;font-size:13px;font-weight:500;color:rgba(0,0,0,0.6);line-height:32px;padding:0 12px;border-radius:16px;background-color:#e4e4e4;margin-bottom:5px;margin-right:5px}.chip:focus{outline:none;background-color:#26a69a;color:#fff}.chip>img{float:left;margin:0 8px 0 -12px;height:32px;width:32px;border-radius:50%}.chip .close{cursor:pointer;float:right;font-size:16px;line-height:32px;padding-left:8px}.chips{border:none;border-bottom:1px solid #9e9e9e;-webkit-box-shadow:none;box-shadow:none;margin:0 0 8px 0;min-height:45px;outline:none;-webkit-transition:all .3s;transition:all .3s}.chips.focus{border-bottom:1px solid #26a69a;-webkit-box-shadow:0 1px 0 0 #26a69a;box-shadow:0 1px 0 0 #26a69a}.chips:hover{cursor:text}.chips .input{background:none;border:0;color:rgba(0,0,0,0.6);display:inline-block;font-size:16px;height:3rem;line-height:32px;outline:0;margin:0;padding:0 !important;width:120px !important}.chips .input:focus{border:0 !important;-webkit-box-shadow:none !important;box-shadow:none !important}.chips .autocomplete-content{margin-top:0;margin-bottom:0}.prefix ~ .chips{margin-left:3rem;width:92%;width:calc(100% - 3rem)}.chips:empty ~ label{font-size:0.8rem;-webkit-transform:translateY(-140%);transform:translateY(-140%)}.materialboxed{display:block;cursor:-webkit-zoom-in;cursor:zoom-in;position:relative;-webkit-transition:opacity .4s;transition:opacity .4s;-webkit-backface-visibility:hidden}.materialboxed:hover:not(.active){opacity:.8}.materialboxed.active{cursor:-webkit-zoom-out;cursor:zoom-out}#materialbox-overlay{position:fixed;top:0;right:0;bottom:0;left:0;background-color:#292929;z-index:1000;will-change:opacity}.materialbox-caption{position:fixed;display:none;color:#fff;line-height:50px;bottom:0;left:0;width:100%;text-align:center;padding:0% 15%;height:50px;z-index:1000;-webkit-font-smoothing:antialiased}select:focus{outline:1px solid #c9f3ef}button:focus{outline:none;background-color:#2ab7a9}label{font-size:.8rem;color:#9e9e9e}::-webkit-input-placeholder{color:#d1d1d1}::-moz-placeholder{color:#d1d1d1}:-ms-input-placeholder{color:#d1d1d1}::-ms-input-placeholder{color:#d1d1d1}::placeholder{color:#d1d1d1}input:not([type]),input[type=text]:not(.browser-default),input[type=password]:not(.browser-default),input[type=email]:not(.browser-default),input[type=url]:not(.browser-default),input[type=time]:not(.browser-default),input[type=date]:not(.browser-default),input[type=datetime]:not(.browser-default),input[type=datetime-local]:not(.browser-default),input[type=tel]:not(.browser-default),input[type=number]:not(.browser-default),input[type=search]:not(.browser-default),textarea.materialize-textarea{background-color:transparent;border:none;border-bottom:1px solid #9e9e9e;border-radius:0;outline:none;height:3rem;width:100%;font-size:16px;margin:0 0 8px 0;padding:0;-webkit-box-shadow:none;box-shadow:none;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-transition:border .3s, -webkit-box-shadow .3s;transition:border .3s, -webkit-box-shadow .3s;transition:box-shadow .3s, border .3s;transition:box-shadow .3s, border .3s, -webkit-box-shadow .3s}input:not([type]):disabled,input:not([type])[readonly=\"readonly\"],input[type=text]:not(.browser-default):disabled,input[type=text]:not(.browser-default)[readonly=\"readonly\"],input[type=password]:not(.browser-default):disabled,input[type=password]:not(.browser-default)[readonly=\"readonly\"],input[type=email]:not(.browser-default):disabled,input[type=email]:not(.browser-default)[readonly=\"readonly\"],input[type=url]:not(.browser-default):disabled,input[type=url]:not(.browser-default)[readonly=\"readonly\"],input[type=time]:not(.browser-default):disabled,input[type=time]:not(.browser-default)[readonly=\"readonly\"],input[type=date]:not(.browser-default):disabled,input[type=date]:not(.browser-default)[readonly=\"readonly\"],input[type=datetime]:not(.browser-default):disabled,input[type=datetime]:not(.browser-default)[readonly=\"readonly\"],input[type=datetime-local]:not(.browser-default):disabled,input[type=datetime-local]:not(.browser-default)[readonly=\"readonly\"],input[type=tel]:not(.browser-default):disabled,input[type=tel]:not(.browser-default)[readonly=\"readonly\"],input[type=number]:not(.browser-default):disabled,input[type=number]:not(.browser-default)[readonly=\"readonly\"],input[type=search]:not(.browser-default):disabled,input[type=search]:not(.browser-default)[readonly=\"readonly\"],textarea.materialize-textarea:disabled,textarea.materialize-textarea[readonly=\"readonly\"]{color:rgba(0,0,0,0.42);border-bottom:1px dotted rgba(0,0,0,0.42)}input:not([type]):disabled+label,input:not([type])[readonly=\"readonly\"]+label,input[type=text]:not(.browser-default):disabled+label,input[type=text]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=password]:not(.browser-default):disabled+label,input[type=password]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=email]:not(.browser-default):disabled+label,input[type=email]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=url]:not(.browser-default):disabled+label,input[type=url]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=time]:not(.browser-default):disabled+label,input[type=time]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=date]:not(.browser-default):disabled+label,input[type=date]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=datetime]:not(.browser-default):disabled+label,input[type=datetime]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=datetime-local]:not(.browser-default):disabled+label,input[type=datetime-local]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=tel]:not(.browser-default):disabled+label,input[type=tel]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=number]:not(.browser-default):disabled+label,input[type=number]:not(.browser-default)[readonly=\"readonly\"]+label,input[type=search]:not(.browser-default):disabled+label,input[type=search]:not(.browser-default)[readonly=\"readonly\"]+label,textarea.materialize-textarea:disabled+label,textarea.materialize-textarea[readonly=\"readonly\"]+label{color:rgba(0,0,0,0.42)}input:not([type]):focus:not([readonly]),input[type=text]:not(.browser-default):focus:not([readonly]),input[type=password]:not(.browser-default):focus:not([readonly]),input[type=email]:not(.browser-default):focus:not([readonly]),input[type=url]:not(.browser-default):focus:not([readonly]),input[type=time]:not(.browser-default):focus:not([readonly]),input[type=date]:not(.browser-default):focus:not([readonly]),input[type=datetime]:not(.browser-default):focus:not([readonly]),input[type=datetime-local]:not(.browser-default):focus:not([readonly]),input[type=tel]:not(.browser-default):focus:not([readonly]),input[type=number]:not(.browser-default):focus:not([readonly]),input[type=search]:not(.browser-default):focus:not([readonly]),textarea.materialize-textarea:focus:not([readonly]){border-bottom:1px solid #26a69a;-webkit-box-shadow:0 1px 0 0 #26a69a;box-shadow:0 1px 0 0 #26a69a}input:not([type]):focus:not([readonly])+label,input[type=text]:not(.browser-default):focus:not([readonly])+label,input[type=password]:not(.browser-default):focus:not([readonly])+label,input[type=email]:not(.browser-default):focus:not([readonly])+label,input[type=url]:not(.browser-default):focus:not([readonly])+label,input[type=time]:not(.browser-default):focus:not([readonly])+label,input[type=date]:not(.browser-default):focus:not([readonly])+label,input[type=datetime]:not(.browser-default):focus:not([readonly])+label,input[type=datetime-local]:not(.browser-default):focus:not([readonly])+label,input[type=tel]:not(.browser-default):focus:not([readonly])+label,input[type=number]:not(.browser-default):focus:not([readonly])+label,input[type=search]:not(.browser-default):focus:not([readonly])+label,textarea.materialize-textarea:focus:not([readonly])+label{color:#26a69a}input:not([type]):focus.valid ~ label,input[type=text]:not(.browser-default):focus.valid ~ label,input[type=password]:not(.browser-default):focus.valid ~ label,input[type=email]:not(.browser-default):focus.valid ~ label,input[type=url]:not(.browser-default):focus.valid ~ label,input[type=time]:not(.browser-default):focus.valid ~ label,input[type=date]:not(.browser-default):focus.valid ~ label,input[type=datetime]:not(.browser-default):focus.valid ~ label,input[type=datetime-local]:not(.browser-default):focus.valid ~ label,input[type=tel]:not(.browser-default):focus.valid ~ label,input[type=number]:not(.browser-default):focus.valid ~ label,input[type=search]:not(.browser-default):focus.valid ~ label,textarea.materialize-textarea:focus.valid ~ label{color:#4CAF50}input:not([type]):focus.invalid ~ label,input[type=text]:not(.browser-default):focus.invalid ~ label,input[type=password]:not(.browser-default):focus.invalid ~ label,input[type=email]:not(.browser-default):focus.invalid ~ label,input[type=url]:not(.browser-default):focus.invalid ~ label,input[type=time]:not(.browser-default):focus.invalid ~ label,input[type=date]:not(.browser-default):focus.invalid ~ label,input[type=datetime]:not(.browser-default):focus.invalid ~ label,input[type=datetime-local]:not(.browser-default):focus.invalid ~ label,input[type=tel]:not(.browser-default):focus.invalid ~ label,input[type=number]:not(.browser-default):focus.invalid ~ label,input[type=search]:not(.browser-default):focus.invalid ~ label,textarea.materialize-textarea:focus.invalid ~ label{color:#F44336}input:not([type]).validate+label,input[type=text]:not(.browser-default).validate+label,input[type=password]:not(.browser-default).validate+label,input[type=email]:not(.browser-default).validate+label,input[type=url]:not(.browser-default).validate+label,input[type=time]:not(.browser-default).validate+label,input[type=date]:not(.browser-default).validate+label,input[type=datetime]:not(.browser-default).validate+label,input[type=datetime-local]:not(.browser-default).validate+label,input[type=tel]:not(.browser-default).validate+label,input[type=number]:not(.browser-default).validate+label,input[type=search]:not(.browser-default).validate+label,textarea.materialize-textarea.validate+label{width:100%}input.valid:not([type]),input.valid:not([type]):focus,input.valid[type=text]:not(.browser-default),input.valid[type=text]:not(.browser-default):focus,input.valid[type=password]:not(.browser-default),input.valid[type=password]:not(.browser-default):focus,input.valid[type=email]:not(.browser-default),input.valid[type=email]:not(.browser-default):focus,input.valid[type=url]:not(.browser-default),input.valid[type=url]:not(.browser-default):focus,input.valid[type=time]:not(.browser-default),input.valid[type=time]:not(.browser-default):focus,input.valid[type=date]:not(.browser-default),input.valid[type=date]:not(.browser-default):focus,input.valid[type=datetime]:not(.browser-default),input.valid[type=datetime]:not(.browser-default):focus,input.valid[type=datetime-local]:not(.browser-default),input.valid[type=datetime-local]:not(.browser-default):focus,input.valid[type=tel]:not(.browser-default),input.valid[type=tel]:not(.browser-default):focus,input.valid[type=number]:not(.browser-default),input.valid[type=number]:not(.browser-default):focus,input.valid[type=search]:not(.browser-default),input.valid[type=search]:not(.browser-default):focus,textarea.materialize-textarea.valid,textarea.materialize-textarea.valid:focus,.select-wrapper.valid>input.select-dropdown{border-bottom:1px solid #4CAF50;-webkit-box-shadow:0 1px 0 0 #4CAF50;box-shadow:0 1px 0 0 #4CAF50}input.invalid:not([type]),input.invalid:not([type]):focus,input.invalid[type=text]:not(.browser-default),input.invalid[type=text]:not(.browser-default):focus,input.invalid[type=password]:not(.browser-default),input.invalid[type=password]:not(.browser-default):focus,input.invalid[type=email]:not(.browser-default),input.invalid[type=email]:not(.browser-default):focus,input.invalid[type=url]:not(.browser-default),input.invalid[type=url]:not(.browser-default):focus,input.invalid[type=time]:not(.browser-default),input.invalid[type=time]:not(.browser-default):focus,input.invalid[type=date]:not(.browser-default),input.invalid[type=date]:not(.browser-default):focus,input.invalid[type=datetime]:not(.browser-default),input.invalid[type=datetime]:not(.browser-default):focus,input.invalid[type=datetime-local]:not(.browser-default),input.invalid[type=datetime-local]:not(.browser-default):focus,input.invalid[type=tel]:not(.browser-default),input.invalid[type=tel]:not(.browser-default):focus,input.invalid[type=number]:not(.browser-default),input.invalid[type=number]:not(.browser-default):focus,input.invalid[type=search]:not(.browser-default),input.invalid[type=search]:not(.browser-default):focus,textarea.materialize-textarea.invalid,textarea.materialize-textarea.invalid:focus,.select-wrapper.invalid>input.select-dropdown,.select-wrapper.invalid>input.select-dropdown:focus{border-bottom:1px solid #F44336;-webkit-box-shadow:0 1px 0 0 #F44336;box-shadow:0 1px 0 0 #F44336}input:not([type]).valid ~ .helper-text[data-success],input:not([type]):focus.valid ~ .helper-text[data-success],input:not([type]).invalid ~ .helper-text[data-error],input:not([type]):focus.invalid ~ .helper-text[data-error],input[type=text]:not(.browser-default).valid ~ .helper-text[data-success],input[type=text]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=text]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=text]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=password]:not(.browser-default).valid ~ .helper-text[data-success],input[type=password]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=password]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=password]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=email]:not(.browser-default).valid ~ .helper-text[data-success],input[type=email]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=email]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=email]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=url]:not(.browser-default).valid ~ .helper-text[data-success],input[type=url]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=url]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=url]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=time]:not(.browser-default).valid ~ .helper-text[data-success],input[type=time]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=time]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=time]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=date]:not(.browser-default).valid ~ .helper-text[data-success],input[type=date]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=date]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=date]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=datetime]:not(.browser-default).valid ~ .helper-text[data-success],input[type=datetime]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=datetime]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=datetime]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=datetime-local]:not(.browser-default).valid ~ .helper-text[data-success],input[type=datetime-local]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=datetime-local]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=datetime-local]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=tel]:not(.browser-default).valid ~ .helper-text[data-success],input[type=tel]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=tel]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=tel]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=number]:not(.browser-default).valid ~ .helper-text[data-success],input[type=number]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=number]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=number]:not(.browser-default):focus.invalid ~ .helper-text[data-error],input[type=search]:not(.browser-default).valid ~ .helper-text[data-success],input[type=search]:not(.browser-default):focus.valid ~ .helper-text[data-success],input[type=search]:not(.browser-default).invalid ~ .helper-text[data-error],input[type=search]:not(.browser-default):focus.invalid ~ .helper-text[data-error],textarea.materialize-textarea.valid ~ .helper-text[data-success],textarea.materialize-textarea:focus.valid ~ .helper-text[data-success],textarea.materialize-textarea.invalid ~ .helper-text[data-error],textarea.materialize-textarea:focus.invalid ~ .helper-text[data-error],.select-wrapper.valid .helper-text[data-success],.select-wrapper.invalid ~ .helper-text[data-error]{color:transparent;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}input:not([type]).valid ~ .helper-text:after,input:not([type]):focus.valid ~ .helper-text:after,input[type=text]:not(.browser-default).valid ~ .helper-text:after,input[type=text]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=password]:not(.browser-default).valid ~ .helper-text:after,input[type=password]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=email]:not(.browser-default).valid ~ .helper-text:after,input[type=email]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=url]:not(.browser-default).valid ~ .helper-text:after,input[type=url]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=time]:not(.browser-default).valid ~ .helper-text:after,input[type=time]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=date]:not(.browser-default).valid ~ .helper-text:after,input[type=date]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=datetime]:not(.browser-default).valid ~ .helper-text:after,input[type=datetime]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=datetime-local]:not(.browser-default).valid ~ .helper-text:after,input[type=datetime-local]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=tel]:not(.browser-default).valid ~ .helper-text:after,input[type=tel]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=number]:not(.browser-default).valid ~ .helper-text:after,input[type=number]:not(.browser-default):focus.valid ~ .helper-text:after,input[type=search]:not(.browser-default).valid ~ .helper-text:after,input[type=search]:not(.browser-default):focus.valid ~ .helper-text:after,textarea.materialize-textarea.valid ~ .helper-text:after,textarea.materialize-textarea:focus.valid ~ .helper-text:after,.select-wrapper.valid ~ .helper-text:after{content:attr(data-success);color:#4CAF50}input:not([type]).invalid ~ .helper-text:after,input:not([type]):focus.invalid ~ .helper-text:after,input[type=text]:not(.browser-default).invalid ~ .helper-text:after,input[type=text]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=password]:not(.browser-default).invalid ~ .helper-text:after,input[type=password]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=email]:not(.browser-default).invalid ~ .helper-text:after,input[type=email]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=url]:not(.browser-default).invalid ~ .helper-text:after,input[type=url]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=time]:not(.browser-default).invalid ~ .helper-text:after,input[type=time]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=date]:not(.browser-default).invalid ~ .helper-text:after,input[type=date]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=datetime]:not(.browser-default).invalid ~ .helper-text:after,input[type=datetime]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=datetime-local]:not(.browser-default).invalid ~ .helper-text:after,input[type=datetime-local]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=tel]:not(.browser-default).invalid ~ .helper-text:after,input[type=tel]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=number]:not(.browser-default).invalid ~ .helper-text:after,input[type=number]:not(.browser-default):focus.invalid ~ .helper-text:after,input[type=search]:not(.browser-default).invalid ~ .helper-text:after,input[type=search]:not(.browser-default):focus.invalid ~ .helper-text:after,textarea.materialize-textarea.invalid ~ .helper-text:after,textarea.materialize-textarea:focus.invalid ~ .helper-text:after,.select-wrapper.invalid ~ .helper-text:after{content:attr(data-error);color:#F44336}input:not([type])+label:after,input[type=text]:not(.browser-default)+label:after,input[type=password]:not(.browser-default)+label:after,input[type=email]:not(.browser-default)+label:after,input[type=url]:not(.browser-default)+label:after,input[type=time]:not(.browser-default)+label:after,input[type=date]:not(.browser-default)+label:after,input[type=datetime]:not(.browser-default)+label:after,input[type=datetime-local]:not(.browser-default)+label:after,input[type=tel]:not(.browser-default)+label:after,input[type=number]:not(.browser-default)+label:after,input[type=search]:not(.browser-default)+label:after,textarea.materialize-textarea+label:after,.select-wrapper+label:after{display:block;content:\"\";position:absolute;top:100%;left:0;opacity:0;-webkit-transition:.2s opacity ease-out, .2s color ease-out;transition:.2s opacity ease-out, .2s color ease-out}.input-field{position:relative;margin-top:1rem;margin-bottom:1rem}.input-field.inline{display:inline-block;vertical-align:middle;margin-left:5px}.input-field.inline input,.input-field.inline .select-dropdown{margin-bottom:1rem}.input-field.col label{left:.75rem}.input-field.col .prefix ~ label,.input-field.col .prefix ~ .validate ~ label{width:calc(100% - 3rem - 1.5rem)}.input-field>label{color:#9e9e9e;position:absolute;top:0;left:0;font-size:1rem;cursor:text;-webkit-transition:color .2s ease-out, -webkit-transform .2s ease-out;transition:color .2s ease-out, -webkit-transform .2s ease-out;transition:transform .2s ease-out, color .2s ease-out;transition:transform .2s ease-out, color .2s ease-out, -webkit-transform .2s ease-out;-webkit-transform-origin:0% 100%;transform-origin:0% 100%;text-align:initial;-webkit-transform:translateY(12px);transform:translateY(12px)}.input-field>label:not(.label-icon).active{-webkit-transform:translateY(-14px) scale(0.8);transform:translateY(-14px) scale(0.8);-webkit-transform-origin:0 0;transform-origin:0 0}.input-field>input[type]:-webkit-autofill:not(.browser-default)+label,.input-field>input[type=date]:not(.browser-default)+label,.input-field>input[type=time]:not(.browser-default)+label{-webkit-transform:translateY(-14px) scale(0.8);transform:translateY(-14px) scale(0.8);-webkit-transform-origin:0 0;transform-origin:0 0}.input-field .helper-text{position:relative;min-height:18px;display:block;font-size:12px;color:rgba(0,0,0,0.54)}.input-field .helper-text::after{opacity:1;position:absolute;top:0;left:0}.input-field .prefix{position:absolute;width:3rem;font-size:2rem;-webkit-transition:color .2s;transition:color .2s;top:.5rem}.input-field .prefix.active{color:#26a69a}.input-field .prefix ~ input,.input-field .prefix ~ textarea,.input-field .prefix ~ label,.input-field .prefix ~ .validate ~ label,.input-field .prefix ~ .helper-text,.input-field .prefix ~ .autocomplete-content{margin-left:3rem;width:92%;width:calc(100% - 3rem)}.input-field .prefix ~ label{margin-left:3rem}@media only screen and (max-width: 992px){.input-field .prefix ~ input{width:86%;width:calc(100% - 3rem)}}@media only screen and (max-width: 600px){.input-field .prefix ~ input{width:80%;width:calc(100% - 3rem)}}.input-field input[type=search]{display:block;line-height:inherit;-webkit-transition:.3s background-color;transition:.3s background-color}.nav-wrapper .input-field input[type=search]{height:inherit;padding-left:4rem;width:calc(100% - 4rem);border:0;-webkit-box-shadow:none;box-shadow:none}.input-field input[type=search]:focus:not(.browser-default){background-color:#fff;border:0;-webkit-box-shadow:none;box-shadow:none;color:#444}.input-field input[type=search]:focus:not(.browser-default)+label i,.input-field input[type=search]:focus:not(.browser-default) ~ .mdi-navigation-close,.input-field input[type=search]:focus:not(.browser-default) ~ .material-icons{color:#444}.input-field input[type=search]+.label-icon{-webkit-transform:none;transform:none;left:1rem}.input-field input[type=search] ~ .mdi-navigation-close,.input-field input[type=search] ~ .material-icons{position:absolute;top:0;right:1rem;color:transparent;cursor:pointer;font-size:2rem;-webkit-transition:.3s color;transition:.3s color}textarea{width:100%;height:3rem;background-color:transparent}textarea.materialize-textarea{line-height:normal;overflow-y:hidden;padding:.8rem 0 .8rem 0;resize:none;min-height:3rem;-webkit-box-sizing:border-box;box-sizing:border-box}.hiddendiv{visibility:hidden;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word;padding-top:1.2rem;position:absolute;top:0;z-index:-1}.autocomplete-content li .highlight{color:#444}.autocomplete-content li img{height:40px;width:40px;margin:5px 15px}.character-counter{min-height:18px}[type=\"radio\"]:not(:checked),[type=\"radio\"]:checked{position:absolute;opacity:0;pointer-events:none}[type=\"radio\"]:not(:checked)+span,[type=\"radio\"]:checked+span{position:relative;padding-left:35px;cursor:pointer;display:inline-block;height:25px;line-height:25px;font-size:1rem;-webkit-transition:.28s ease;transition:.28s ease;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[type=\"radio\"]+span:before,[type=\"radio\"]+span:after{content:'';position:absolute;left:0;top:0;margin:4px;width:16px;height:16px;z-index:0;-webkit-transition:.28s ease;transition:.28s ease}[type=\"radio\"]:not(:checked)+span:before,[type=\"radio\"]:not(:checked)+span:after,[type=\"radio\"]:checked+span:before,[type=\"radio\"]:checked+span:after,[type=\"radio\"].with-gap:checked+span:before,[type=\"radio\"].with-gap:checked+span:after{border-radius:50%}[type=\"radio\"]:not(:checked)+span:before,[type=\"radio\"]:not(:checked)+span:after{border:2px solid #5a5a5a}[type=\"radio\"]:not(:checked)+span:after{-webkit-transform:scale(0);transform:scale(0)}[type=\"radio\"]:checked+span:before{border:2px solid transparent}[type=\"radio\"]:checked+span:after,[type=\"radio\"].with-gap:checked+span:before,[type=\"radio\"].with-gap:checked+span:after{border:2px solid #26a69a}[type=\"radio\"]:checked+span:after,[type=\"radio\"].with-gap:checked+span:after{background-color:#26a69a}[type=\"radio\"]:checked+span:after{-webkit-transform:scale(1.02);transform:scale(1.02)}[type=\"radio\"].with-gap:checked+span:after{-webkit-transform:scale(0.5);transform:scale(0.5)}[type=\"radio\"].tabbed:focus+span:before{-webkit-box-shadow:0 0 0 10px rgba(0,0,0,0.1);box-shadow:0 0 0 10px rgba(0,0,0,0.1)}[type=\"radio\"].with-gap:disabled:checked+span:before{border:2px solid rgba(0,0,0,0.42)}[type=\"radio\"].with-gap:disabled:checked+span:after{border:none;background-color:rgba(0,0,0,0.42)}[type=\"radio\"]:disabled:not(:checked)+span:before,[type=\"radio\"]:disabled:checked+span:before{background-color:transparent;border-color:rgba(0,0,0,0.42)}[type=\"radio\"]:disabled+span{color:rgba(0,0,0,0.42)}[type=\"radio\"]:disabled:not(:checked)+span:before{border-color:rgba(0,0,0,0.42)}[type=\"radio\"]:disabled:checked+span:after{background-color:rgba(0,0,0,0.42);border-color:#949494}[type=\"checkbox\"]:not(:checked),[type=\"checkbox\"]:checked{position:absolute;opacity:0;pointer-events:none}[type=\"checkbox\"]+span:not(.lever){position:relative;padding-left:35px;cursor:pointer;display:inline-block;height:25px;line-height:25px;font-size:1rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[type=\"checkbox\"]+span:not(.lever):before,[type=\"checkbox\"]:not(.filled-in)+span:not(.lever):after{content:'';position:absolute;top:0;left:0;width:18px;height:18px;z-index:0;border:2px solid #5a5a5a;border-radius:1px;margin-top:3px;-webkit-transition:.2s;transition:.2s}[type=\"checkbox\"]:not(.filled-in)+span:not(.lever):after{border:0;-webkit-transform:scale(0);transform:scale(0)}[type=\"checkbox\"]:not(:checked):disabled+span:not(.lever):before{border:none;background-color:rgba(0,0,0,0.42)}[type=\"checkbox\"].tabbed:focus+span:not(.lever):after{-webkit-transform:scale(1);transform:scale(1);border:0;border-radius:50%;-webkit-box-shadow:0 0 0 10px rgba(0,0,0,0.1);box-shadow:0 0 0 10px rgba(0,0,0,0.1);background-color:rgba(0,0,0,0.1)}[type=\"checkbox\"]:checked+span:not(.lever):before{top:-4px;left:-5px;width:12px;height:22px;border-top:2px solid transparent;border-left:2px solid transparent;border-right:2px solid #26a69a;border-bottom:2px solid #26a69a;-webkit-transform:rotate(40deg);transform:rotate(40deg);-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform-origin:100% 100%;transform-origin:100% 100%}[type=\"checkbox\"]:checked:disabled+span:before{border-right:2px solid rgba(0,0,0,0.42);border-bottom:2px solid rgba(0,0,0,0.42)}[type=\"checkbox\"]:indeterminate+span:not(.lever):before{top:-11px;left:-12px;width:10px;height:22px;border-top:none;border-left:none;border-right:2px solid #26a69a;border-bottom:none;-webkit-transform:rotate(90deg);transform:rotate(90deg);-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform-origin:100% 100%;transform-origin:100% 100%}[type=\"checkbox\"]:indeterminate:disabled+span:not(.lever):before{border-right:2px solid rgba(0,0,0,0.42);background-color:transparent}[type=\"checkbox\"].filled-in+span:not(.lever):after{border-radius:2px}[type=\"checkbox\"].filled-in+span:not(.lever):before,[type=\"checkbox\"].filled-in+span:not(.lever):after{content:'';left:0;position:absolute;-webkit-transition:border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;transition:border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;z-index:1}[type=\"checkbox\"].filled-in:not(:checked)+span:not(.lever):before{width:0;height:0;border:3px solid transparent;left:6px;top:10px;-webkit-transform:rotateZ(37deg);transform:rotateZ(37deg);-webkit-transform-origin:100% 100%;transform-origin:100% 100%}[type=\"checkbox\"].filled-in:not(:checked)+span:not(.lever):after{height:20px;width:20px;background-color:transparent;border:2px solid #5a5a5a;top:0px;z-index:0}[type=\"checkbox\"].filled-in:checked+span:not(.lever):before{top:0;left:1px;width:8px;height:13px;border-top:2px solid transparent;border-left:2px solid transparent;border-right:2px solid #fff;border-bottom:2px solid #fff;-webkit-transform:rotateZ(37deg);transform:rotateZ(37deg);-webkit-transform-origin:100% 100%;transform-origin:100% 100%}[type=\"checkbox\"].filled-in:checked+span:not(.lever):after{top:0;width:20px;height:20px;border:2px solid #26a69a;background-color:#26a69a;z-index:0}[type=\"checkbox\"].filled-in.tabbed:focus+span:not(.lever):after{border-radius:2px;border-color:#5a5a5a;background-color:rgba(0,0,0,0.1)}[type=\"checkbox\"].filled-in.tabbed:checked:focus+span:not(.lever):after{border-radius:2px;background-color:#26a69a;border-color:#26a69a}[type=\"checkbox\"].filled-in:disabled:not(:checked)+span:not(.lever):before{background-color:transparent;border:2px solid transparent}[type=\"checkbox\"].filled-in:disabled:not(:checked)+span:not(.lever):after{border-color:transparent;background-color:#949494}[type=\"checkbox\"].filled-in:disabled:checked+span:not(.lever):before{background-color:transparent}[type=\"checkbox\"].filled-in:disabled:checked+span:not(.lever):after{background-color:#949494;border-color:#949494}.switch,.switch *{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.switch label{cursor:pointer}.switch label input[type=checkbox]{opacity:0;width:0;height:0}.switch label input[type=checkbox]:checked+.lever{background-color:#84c7c1}.switch label input[type=checkbox]:checked+.lever:before,.switch label input[type=checkbox]:checked+.lever:after{left:18px}.switch label input[type=checkbox]:checked+.lever:after{background-color:#26a69a}.switch label .lever{content:\"\";display:inline-block;position:relative;width:36px;height:14px;background-color:rgba(0,0,0,0.38);border-radius:15px;margin-right:10px;-webkit-transition:background 0.3s ease;transition:background 0.3s ease;vertical-align:middle;margin:0 16px}.switch label .lever:before,.switch label .lever:after{content:\"\";position:absolute;display:inline-block;width:20px;height:20px;border-radius:50%;left:0;top:-3px;-webkit-transition:left 0.3s ease, background .3s ease, -webkit-box-shadow 0.1s ease, -webkit-transform .1s ease;transition:left 0.3s ease, background .3s ease, -webkit-box-shadow 0.1s ease, -webkit-transform .1s ease;transition:left 0.3s ease, background .3s ease, box-shadow 0.1s ease, transform .1s ease;transition:left 0.3s ease, background .3s ease, box-shadow 0.1s ease, transform .1s ease, -webkit-box-shadow 0.1s ease, -webkit-transform .1s ease}.switch label .lever:before{background-color:rgba(38,166,154,0.15)}.switch label .lever:after{background-color:#F1F1F1;-webkit-box-shadow:0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12);box-shadow:0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)}input[type=checkbox]:checked:not(:disabled) ~ .lever:active::before,input[type=checkbox]:checked:not(:disabled).tabbed:focus ~ .lever::before{-webkit-transform:scale(2.4);transform:scale(2.4);background-color:rgba(38,166,154,0.15)}input[type=checkbox]:not(:disabled) ~ .lever:active:before,input[type=checkbox]:not(:disabled).tabbed:focus ~ .lever::before{-webkit-transform:scale(2.4);transform:scale(2.4);background-color:rgba(0,0,0,0.08)}.switch input[type=checkbox][disabled]+.lever{cursor:default;background-color:rgba(0,0,0,0.12)}.switch label input[type=checkbox][disabled]+.lever:after,.switch label input[type=checkbox][disabled]:checked+.lever:after{background-color:#949494}select{display:none}select.browser-default{display:block}select{background-color:rgba(255,255,255,0.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.select-label{position:absolute}.select-wrapper{position:relative}.select-wrapper.valid+label,.select-wrapper.invalid+label{width:100%;pointer-events:none}.select-wrapper input.select-dropdown{position:relative;cursor:pointer;background-color:transparent;border:none;border-bottom:1px solid #9e9e9e;outline:none;height:3rem;line-height:3rem;width:100%;font-size:16px;margin:0 0 8px 0;padding:0;display:block;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1}.select-wrapper input.select-dropdown:focus{border-bottom:1px solid #26a69a}.select-wrapper .caret{position:absolute;right:0;top:0;bottom:0;margin:auto 0;z-index:0;fill:rgba(0,0,0,0.87)}.select-wrapper+label{position:absolute;top:-26px;font-size:.8rem}select:disabled{color:rgba(0,0,0,0.42)}.select-wrapper.disabled+label{color:rgba(0,0,0,0.42)}.select-wrapper.disabled .caret{fill:rgba(0,0,0,0.42)}.select-wrapper input.select-dropdown:disabled{color:rgba(0,0,0,0.42);cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.select-wrapper i{color:rgba(0,0,0,0.3)}.select-dropdown li.disabled,.select-dropdown li.disabled>span,.select-dropdown li.optgroup{color:rgba(0,0,0,0.3);background-color:transparent}body.keyboard-focused .select-dropdown.dropdown-content li:focus{background-color:rgba(0,0,0,0.08)}.select-dropdown.dropdown-content li:hover{background-color:rgba(0,0,0,0.08)}.select-dropdown.dropdown-content li.selected{background-color:rgba(0,0,0,0.03)}.prefix ~ .select-wrapper{margin-left:3rem;width:92%;width:calc(100% - 3rem)}.prefix ~ label{margin-left:3rem}.select-dropdown li img{height:40px;width:40px;margin:5px 15px;float:right}.select-dropdown li.optgroup{border-top:1px solid #eee}.select-dropdown li.optgroup.selected>span{color:rgba(0,0,0,0.7)}.select-dropdown li.optgroup>span{color:rgba(0,0,0,0.4)}.select-dropdown li.optgroup ~ li.optgroup-option{padding-left:1rem}.file-field{position:relative}.file-field .file-path-wrapper{overflow:hidden;padding-left:10px}.file-field input.file-path{width:100%}.file-field .btn,.file-field .btn-large,.file-field .btn-small{float:left;height:3rem;line-height:3rem}.file-field span{cursor:pointer}.file-field input[type=file]{position:absolute;top:0;right:0;left:0;bottom:0;width:100%;margin:0;padding:0;font-size:20px;cursor:pointer;opacity:0;filter:alpha(opacity=0)}.file-field input[type=file]::-webkit-file-upload-button{display:none}.range-field{position:relative}input[type=range],input[type=range]+.thumb{cursor:pointer}input[type=range]{position:relative;background-color:transparent;border:none;outline:none;width:100%;margin:15px 0;padding:0}input[type=range]:focus{outline:none}input[type=range]+.thumb{position:absolute;top:10px;left:0;border:none;height:0;width:0;border-radius:50%;background-color:#26a69a;margin-left:7px;-webkit-transform-origin:50% 50%;transform-origin:50% 50%;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}input[type=range]+.thumb .value{display:block;width:30px;text-align:center;color:#26a69a;font-size:0;-webkit-transform:rotate(45deg);transform:rotate(45deg)}input[type=range]+.thumb.active{border-radius:50% 50% 50% 0}input[type=range]+.thumb.active .value{color:#fff;margin-left:-1px;margin-top:8px;font-size:10px}input[type=range]{-webkit-appearance:none}input[type=range]::-webkit-slider-runnable-track{height:3px;background:#c2c0c2;border:none}input[type=range]::-webkit-slider-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#26a69a;-webkit-transition:-webkit-box-shadow .3s;transition:-webkit-box-shadow .3s;transition:box-shadow .3s;transition:box-shadow .3s, -webkit-box-shadow .3s;-webkit-appearance:none;background-color:#26a69a;-webkit-transform-origin:50% 50%;transform-origin:50% 50%;margin:-5px 0 0 0}.keyboard-focused input[type=range]:focus:not(.active)::-webkit-slider-thumb{-webkit-box-shadow:0 0 0 10px rgba(38,166,154,0.26);box-shadow:0 0 0 10px rgba(38,166,154,0.26)}input[type=range]{border:1px solid white}input[type=range]::-moz-range-track{height:3px;background:#c2c0c2;border:none}input[type=range]::-moz-focus-inner{border:0}input[type=range]::-moz-range-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#26a69a;-webkit-transition:-webkit-box-shadow .3s;transition:-webkit-box-shadow .3s;transition:box-shadow .3s;transition:box-shadow .3s, -webkit-box-shadow .3s;margin-top:-5px}input[type=range]:-moz-focusring{outline:1px solid #fff;outline-offset:-1px}.keyboard-focused input[type=range]:focus:not(.active)::-moz-range-thumb{box-shadow:0 0 0 10px rgba(38,166,154,0.26)}input[type=range]::-ms-track{height:3px;background:transparent;border-color:transparent;border-width:6px 0;color:transparent}input[type=range]::-ms-fill-lower{background:#777}input[type=range]::-ms-fill-upper{background:#ddd}input[type=range]::-ms-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#26a69a;-webkit-transition:-webkit-box-shadow .3s;transition:-webkit-box-shadow .3s;transition:box-shadow .3s;transition:box-shadow .3s, -webkit-box-shadow .3s}.keyboard-focused input[type=range]:focus:not(.active)::-ms-thumb{box-shadow:0 0 0 10px rgba(38,166,154,0.26)}.table-of-contents.fixed{position:fixed}.table-of-contents li{padding:2px 0}.table-of-contents a{display:inline-block;font-weight:300;color:#757575;padding-left:16px;height:1.5rem;line-height:1.5rem;letter-spacing:.4;display:inline-block}.table-of-contents a:hover{color:#a8a8a8;padding-left:15px;border-left:1px solid #ee6e73}.table-of-contents a.active{font-weight:500;padding-left:14px;border-left:2px solid #ee6e73}.sidenav{position:fixed;width:300px;left:0;top:0;margin:0;-webkit-transform:translateX(-100%);transform:translateX(-100%);height:100%;height:calc(100% + 60px);height:-moz-calc(100%);padding-bottom:60px;background-color:#fff;z-index:999;overflow-y:auto;will-change:transform;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform:translateX(-105%);transform:translateX(-105%)}.sidenav.right-aligned{right:0;-webkit-transform:translateX(105%);transform:translateX(105%);left:auto;-webkit-transform:translateX(100%);transform:translateX(100%)}.sidenav .collapsible{margin:0}.sidenav li{float:none;line-height:48px}.sidenav li.active{background-color:rgba(0,0,0,0.05)}.sidenav li>a{color:rgba(0,0,0,0.87);display:block;font-size:14px;font-weight:500;height:48px;line-height:48px;padding:0 32px}.sidenav li>a:hover{background-color:rgba(0,0,0,0.05)}.sidenav li>a.btn,.sidenav li>a.btn-large,.sidenav li>a.btn-small,.sidenav li>a.btn-large,.sidenav li>a.btn-flat,.sidenav li>a.btn-floating{margin:10px 15px}.sidenav li>a.btn,.sidenav li>a.btn-large,.sidenav li>a.btn-small,.sidenav li>a.btn-large,.sidenav li>a.btn-floating{color:#fff}.sidenav li>a.btn-flat{color:#343434}.sidenav li>a.btn:hover,.sidenav li>a.btn-large:hover,.sidenav li>a.btn-small:hover,.sidenav li>a.btn-large:hover{background-color:#2bbbad}.sidenav li>a.btn-floating:hover{background-color:#26a69a}.sidenav li>a>i,.sidenav li>a>[class^=\"mdi-\"],.sidenav li>a li>a>[class*=\"mdi-\"],.sidenav li>a>i.material-icons{float:left;height:48px;line-height:48px;margin:0 32px 0 0;width:24px;color:rgba(0,0,0,0.54)}.sidenav .divider{margin:8px 0 0 0}.sidenav .subheader{cursor:initial;pointer-events:none;color:rgba(0,0,0,0.54);font-size:14px;font-weight:500;line-height:48px}.sidenav .subheader:hover{background-color:transparent}.sidenav .user-view{position:relative;padding:32px 32px 0;margin-bottom:8px}.sidenav .user-view>a{height:auto;padding:0}.sidenav .user-view>a:hover{background-color:transparent}.sidenav .user-view .background{overflow:hidden;position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1}.sidenav .user-view .circle,.sidenav .user-view .name,.sidenav .user-view .email{display:block}.sidenav .user-view .circle{height:64px;width:64px}.sidenav .user-view .name,.sidenav .user-view .email{font-size:14px;line-height:24px}.sidenav .user-view .name{margin-top:16px;font-weight:500}.sidenav .user-view .email{padding-bottom:16px;font-weight:400}.drag-target{height:100%;width:10px;position:fixed;top:0;z-index:998}.drag-target.right-aligned{right:0}.sidenav.sidenav-fixed{left:0;-webkit-transform:translateX(0);transform:translateX(0);position:fixed}.sidenav.sidenav-fixed.right-aligned{right:0;left:auto}@media only screen and (max-width: 992px){.sidenav.sidenav-fixed{-webkit-transform:translateX(-105%);transform:translateX(-105%)}.sidenav.sidenav-fixed.right-aligned{-webkit-transform:translateX(105%);transform:translateX(105%)}.sidenav>a{padding:0 16px}.sidenav .user-view{padding:16px 16px 0}}.sidenav .collapsible-body>ul:not(.collapsible)>li.active,.sidenav.sidenav-fixed .collapsible-body>ul:not(.collapsible)>li.active{background-color:#ee6e73}.sidenav .collapsible-body>ul:not(.collapsible)>li.active a,.sidenav.sidenav-fixed .collapsible-body>ul:not(.collapsible)>li.active a{color:#fff}.sidenav .collapsible-body{padding:0}.sidenav-overlay{position:fixed;top:0;left:0;right:0;opacity:0;height:120vh;background-color:rgba(0,0,0,0.5);z-index:997;display:none}.preloader-wrapper{display:inline-block;position:relative;width:50px;height:50px}.preloader-wrapper.small{width:36px;height:36px}.preloader-wrapper.big{width:64px;height:64px}.preloader-wrapper.active{-webkit-animation:container-rotate 1568ms linear infinite;animation:container-rotate 1568ms linear infinite}@-webkit-keyframes container-rotate{to{-webkit-transform:rotate(360deg)}}@keyframes container-rotate{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.spinner-layer{position:absolute;width:100%;height:100%;opacity:0;border-color:#26a69a}.spinner-blue,.spinner-blue-only{border-color:#4285f4}.spinner-red,.spinner-red-only{border-color:#db4437}.spinner-yellow,.spinner-yellow-only{border-color:#f4b400}.spinner-green,.spinner-green-only{border-color:#0f9d58}.active .spinner-layer.spinner-blue{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.active .spinner-layer.spinner-red{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.active .spinner-layer.spinner-yellow{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.active .spinner-layer.spinner-green{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.active .spinner-layer,.active .spinner-layer.spinner-blue-only,.active .spinner-layer.spinner-red-only,.active .spinner-layer.spinner-yellow-only,.active .spinner-layer.spinner-green-only{opacity:1;-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}@-webkit-keyframes fill-unfill-rotate{12.5%{-webkit-transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg)}to{-webkit-transform:rotate(1080deg)}}@keyframes fill-unfill-rotate{12.5%{-webkit-transform:rotate(135deg);transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg);transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg);transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg);transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg);transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg);transform:rotate(945deg)}to{-webkit-transform:rotate(1080deg);transform:rotate(1080deg)}}@-webkit-keyframes blue-fade-in-out{from{opacity:1}25%{opacity:1}26%{opacity:0}89%{opacity:0}90%{opacity:1}100%{opacity:1}}@keyframes blue-fade-in-out{from{opacity:1}25%{opacity:1}26%{opacity:0}89%{opacity:0}90%{opacity:1}100%{opacity:1}}@-webkit-keyframes red-fade-in-out{from{opacity:0}15%{opacity:0}25%{opacity:1}50%{opacity:1}51%{opacity:0}}@keyframes red-fade-in-out{from{opacity:0}15%{opacity:0}25%{opacity:1}50%{opacity:1}51%{opacity:0}}@-webkit-keyframes yellow-fade-in-out{from{opacity:0}40%{opacity:0}50%{opacity:1}75%{opacity:1}76%{opacity:0}}@keyframes yellow-fade-in-out{from{opacity:0}40%{opacity:0}50%{opacity:1}75%{opacity:1}76%{opacity:0}}@-webkit-keyframes green-fade-in-out{from{opacity:0}65%{opacity:0}75%{opacity:1}90%{opacity:1}100%{opacity:0}}@keyframes green-fade-in-out{from{opacity:0}65%{opacity:0}75%{opacity:1}90%{opacity:1}100%{opacity:0}}.gap-patch{position:absolute;top:0;left:45%;width:10%;height:100%;overflow:hidden;border-color:inherit}.gap-patch .circle{width:1000%;left:-450%}.circle-clipper{display:inline-block;position:relative;width:50%;height:100%;overflow:hidden;border-color:inherit}.circle-clipper .circle{width:200%;height:100%;border-width:3px;border-style:solid;border-color:inherit;border-bottom-color:transparent !important;border-radius:50%;-webkit-animation:none;animation:none;position:absolute;top:0;right:0;bottom:0}.circle-clipper.left .circle{left:0;border-right-color:transparent !important;-webkit-transform:rotate(129deg);transform:rotate(129deg)}.circle-clipper.right .circle{left:-100%;border-left-color:transparent !important;-webkit-transform:rotate(-129deg);transform:rotate(-129deg)}.active .circle-clipper.left .circle{-webkit-animation:left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;animation:left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.active .circle-clipper.right .circle{-webkit-animation:right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;animation:right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}@-webkit-keyframes left-spin{from{-webkit-transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg)}}@keyframes left-spin{from{-webkit-transform:rotate(130deg);transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg);transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg);transform:rotate(130deg)}}@-webkit-keyframes right-spin{from{-webkit-transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg)}}@keyframes right-spin{from{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg);transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}}#spinnerContainer.cooldown{-webkit-animation:container-rotate 1568ms linear infinite,fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1);animation:container-rotate 1568ms linear infinite,fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1)}@-webkit-keyframes fade-out{from{opacity:1}to{opacity:0}}@keyframes fade-out{from{opacity:1}to{opacity:0}}.slider{position:relative;height:400px;width:100%}.slider.fullscreen{height:100%;width:100%;position:absolute;top:0;left:0;right:0;bottom:0}.slider.fullscreen ul.slides{height:100%}.slider.fullscreen ul.indicators{z-index:2;bottom:30px}.slider .slides{background-color:#9e9e9e;margin:0;height:400px}.slider .slides li{opacity:0;position:absolute;top:0;left:0;z-index:1;width:100%;height:inherit;overflow:hidden}.slider .slides li img{height:100%;width:100%;background-size:cover;background-position:center}.slider .slides li .caption{color:#fff;position:absolute;top:15%;left:15%;width:70%;opacity:0}.slider .slides li .caption p{color:#e0e0e0}.slider .slides li.active{z-index:2}.slider .indicators{position:absolute;text-align:center;left:0;right:0;bottom:0;margin:0}.slider .indicators .indicator-item{display:inline-block;position:relative;cursor:pointer;height:16px;width:16px;margin:0 12px;background-color:#e0e0e0;-webkit-transition:background-color .3s;transition:background-color .3s;border-radius:50%}.slider .indicators .indicator-item.active{background-color:#4CAF50}.carousel{overflow:hidden;position:relative;width:100%;height:400px;-webkit-perspective:500px;perspective:500px;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;-webkit-transform-origin:0% 50%;transform-origin:0% 50%}.carousel.carousel-slider{top:0;left:0}.carousel.carousel-slider .carousel-fixed-item{position:absolute;left:0;right:0;bottom:20px;z-index:1}.carousel.carousel-slider .carousel-fixed-item.with-indicators{bottom:68px}.carousel.carousel-slider .carousel-item{width:100%;height:100%;min-height:400px;position:absolute;top:0;left:0}.carousel.carousel-slider .carousel-item h2{font-size:24px;font-weight:500;line-height:32px}.carousel.carousel-slider .carousel-item p{font-size:15px}.carousel .carousel-item{visibility:hidden;width:200px;height:200px;position:absolute;top:0;left:0}.carousel .carousel-item>img{width:100%}.carousel .indicators{position:absolute;text-align:center;left:0;right:0;bottom:0;margin:0}.carousel .indicators .indicator-item{display:inline-block;position:relative;cursor:pointer;height:8px;width:8px;margin:24px 4px;background-color:rgba(255,255,255,0.5);-webkit-transition:background-color .3s;transition:background-color .3s;border-radius:50%}.carousel .indicators .indicator-item.active{background-color:#fff}.carousel.scrolling .carousel-item .materialboxed,.carousel .carousel-item:not(.active) .materialboxed{pointer-events:none}.tap-target-wrapper{width:800px;height:800px;position:fixed;z-index:1000;visibility:hidden;-webkit-transition:visibility 0s .3s;transition:visibility 0s .3s}.tap-target-wrapper.open{visibility:visible;-webkit-transition:visibility 0s;transition:visibility 0s}.tap-target-wrapper.open .tap-target{-webkit-transform:scale(1);transform:scale(1);opacity:.95;-webkit-transition:opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);transition:opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);transition:transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1);transition:transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)}.tap-target-wrapper.open .tap-target-wave::before{-webkit-transform:scale(1);transform:scale(1)}.tap-target-wrapper.open .tap-target-wave::after{visibility:visible;-webkit-animation:pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;animation:pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;-webkit-transition:opacity .3s,\r visibility 0s 1s,\r -webkit-transform .3s;transition:opacity .3s,\r visibility 0s 1s,\r -webkit-transform .3s;transition:opacity .3s,\r transform .3s,\r visibility 0s 1s;transition:opacity .3s,\r transform .3s,\r visibility 0s 1s,\r -webkit-transform .3s}.tap-target{position:absolute;font-size:1rem;border-radius:50%;background-color:#ee6e73;-webkit-box-shadow:0 20px 20px 0 rgba(0,0,0,0.14),0 10px 50px 0 rgba(0,0,0,0.12),0 30px 10px -20px rgba(0,0,0,0.2);box-shadow:0 20px 20px 0 rgba(0,0,0,0.14),0 10px 50px 0 rgba(0,0,0,0.12),0 30px 10px -20px rgba(0,0,0,0.2);width:100%;height:100%;opacity:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transition:opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);transition:opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);transition:transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1);transition:transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)}.tap-target-content{position:relative;display:table-cell}.tap-target-wave{position:absolute;border-radius:50%;z-index:10001}.tap-target-wave::before,.tap-target-wave::after{content:'';display:block;position:absolute;width:100%;height:100%;border-radius:50%;background-color:#ffffff}.tap-target-wave::before{-webkit-transform:scale(0);transform:scale(0);-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s, -webkit-transform .3s}.tap-target-wave::after{visibility:hidden;-webkit-transition:opacity .3s,\r visibility 0s,\r -webkit-transform .3s;transition:opacity .3s,\r visibility 0s,\r -webkit-transform .3s;transition:opacity .3s,\r transform .3s,\r visibility 0s;transition:opacity .3s,\r transform .3s,\r visibility 0s,\r -webkit-transform .3s;z-index:-1}.tap-target-origin{top:50%;left:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);z-index:10002;position:absolute !important}.tap-target-origin:not(.btn):not(.btn-large):not(.btn-small),.tap-target-origin:not(.btn):not(.btn-large):not(.btn-small):hover{background:none}@media only screen and (max-width: 600px){.tap-target,.tap-target-wrapper{width:600px;height:600px}}.pulse{overflow:visible;position:relative}.pulse::before{content:'';display:block;position:absolute;width:100%;height:100%;top:0;left:0;background-color:inherit;border-radius:inherit;-webkit-transition:opacity .3s, -webkit-transform .3s;transition:opacity .3s, -webkit-transform .3s;transition:opacity .3s, transform .3s;transition:opacity .3s, transform .3s, -webkit-transform .3s;-webkit-animation:pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;animation:pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;z-index:-1}@-webkit-keyframes pulse-animation{0%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}50%{opacity:0;-webkit-transform:scale(1.5);transform:scale(1.5)}100%{opacity:0;-webkit-transform:scale(1.5);transform:scale(1.5)}}@keyframes pulse-animation{0%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}50%{opacity:0;-webkit-transform:scale(1.5);transform:scale(1.5)}100%{opacity:0;-webkit-transform:scale(1.5);transform:scale(1.5)}}.datepicker-modal{max-width:325px;min-width:300px;max-height:none}.datepicker-container.modal-content{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:0}.datepicker-controls{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;width:280px;margin:0 auto}.datepicker-controls .selects-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.datepicker-controls .select-wrapper input{border-bottom:none;text-align:center;margin:0}.datepicker-controls .select-wrapper input:focus{border-bottom:none}.datepicker-controls .select-wrapper .caret{display:none}.datepicker-controls .select-year input{width:50px}.datepicker-controls .select-month input{width:70px}.month-prev,.month-next{margin-top:4px;cursor:pointer;background-color:transparent;border:none}.datepicker-date-display{-webkit-box-flex:1;-webkit-flex:1 auto;-ms-flex:1 auto;flex:1 auto;background-color:#26a69a;color:#fff;padding:20px 22px;font-weight:500}.datepicker-date-display .year-text{display:block;font-size:1.5rem;line-height:25px;color:rgba(255,255,255,0.7)}.datepicker-date-display .date-text{display:block;font-size:2.8rem;line-height:47px;font-weight:500}.datepicker-calendar-container{-webkit-box-flex:2.5;-webkit-flex:2.5 auto;-ms-flex:2.5 auto;flex:2.5 auto}.datepicker-table{width:280px;font-size:1rem;margin:0 auto}.datepicker-table thead{border-bottom:none}.datepicker-table th{padding:10px 5px;text-align:center}.datepicker-table tr{border:none}.datepicker-table abbr{text-decoration:none;color:#999}.datepicker-table td{border-radius:50%;padding:0}.datepicker-table td.is-today{color:#26a69a}.datepicker-table td.is-selected{background-color:#26a69a;color:#fff}.datepicker-table td.is-outside-current-month,.datepicker-table td.is-disabled{color:rgba(0,0,0,0.3);pointer-events:none}.datepicker-day-button{background-color:transparent;border:none;line-height:38px;display:block;width:100%;border-radius:50%;padding:0 5px;cursor:pointer;color:inherit}.datepicker-day-button:focus{background-color:rgba(43,161,150,0.25)}.datepicker-footer{width:280px;margin:0 auto;padding-bottom:5px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.datepicker-cancel,.datepicker-clear,.datepicker-today,.datepicker-done{color:#26a69a;padding:0 1rem}.datepicker-clear{color:#F44336}@media only screen and (min-width: 601px){.datepicker-modal{max-width:625px}.datepicker-container.modal-content{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}.datepicker-date-display{-webkit-box-flex:0;-webkit-flex:0 1 270px;-ms-flex:0 1 270px;flex:0 1 270px}.datepicker-controls,.datepicker-table,.datepicker-footer{width:320px}.datepicker-day-button{line-height:44px}}.timepicker-modal{max-width:325px;max-height:none}.timepicker-container.modal-content{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:0}.text-primary{color:#fff}.timepicker-digital-display{-webkit-box-flex:1;-webkit-flex:1 auto;-ms-flex:1 auto;flex:1 auto;background-color:#26a69a;padding:10px;font-weight:300}.timepicker-text-container{font-size:4rem;font-weight:bold;text-align:center;color:rgba(255,255,255,0.6);font-weight:400;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.timepicker-span-hours,.timepicker-span-minutes,.timepicker-span-am-pm div{cursor:pointer}.timepicker-span-hours{margin-right:3px}.timepicker-span-minutes{margin-left:3px}.timepicker-display-am-pm{font-size:1.3rem;position:absolute;right:1rem;bottom:1rem;font-weight:400}.timepicker-analog-display{-webkit-box-flex:2.5;-webkit-flex:2.5 auto;-ms-flex:2.5 auto;flex:2.5 auto}.timepicker-plate{background-color:#eee;border-radius:50%;width:270px;height:270px;overflow:visible;position:relative;margin:auto;margin-top:25px;margin-bottom:5px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.timepicker-canvas,.timepicker-dial{position:absolute;left:0;right:0;top:0;bottom:0}.timepicker-minutes{visibility:hidden}.timepicker-tick{border-radius:50%;color:rgba(0,0,0,0.87);line-height:40px;text-align:center;width:40px;height:40px;position:absolute;cursor:pointer;font-size:15px}.timepicker-tick.active,.timepicker-tick:hover{background-color:rgba(38,166,154,0.25)}.timepicker-dial{-webkit-transition:opacity 350ms, -webkit-transform 350ms;transition:opacity 350ms, -webkit-transform 350ms;transition:transform 350ms, opacity 350ms;transition:transform 350ms, opacity 350ms, -webkit-transform 350ms}.timepicker-dial-out{opacity:0}.timepicker-dial-out.timepicker-hours{-webkit-transform:scale(1.1, 1.1);transform:scale(1.1, 1.1)}.timepicker-dial-out.timepicker-minutes{-webkit-transform:scale(0.8, 0.8);transform:scale(0.8, 0.8)}.timepicker-canvas{-webkit-transition:opacity 175ms;transition:opacity 175ms}.timepicker-canvas line{stroke:#26a69a;stroke-width:4;stroke-linecap:round}.timepicker-canvas-out{opacity:0.25}.timepicker-canvas-bearing{stroke:none;fill:#26a69a}.timepicker-canvas-bg{stroke:none;fill:#26a69a}.timepicker-footer{margin:0 auto;padding:5px 1rem;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.timepicker-clear{color:#F44336}.timepicker-close{color:#26a69a}.timepicker-clear,.timepicker-close{padding:0 20px}@media only screen and (min-width: 601px){.timepicker-modal{max-width:600px}.timepicker-container.modal-content{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}.timepicker-text-container{top:32%}.timepicker-display-am-pm{position:relative;right:auto;bottom:auto;text-align:center;margin-top:1.2rem}}\n", ""]);

// exports


/***/ }),
/* 144 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery, jQuery, $, global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Materialize v1.0.0-rc.2 (http://materializecss.com)
 * Copyright 2014-2017 Materialize
 * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)
 */
var _get=function t(e,i,n){null===e&&(e=Function.prototype);var s=Object.getOwnPropertyDescriptor(e,i);if(void 0===s){var o=Object.getPrototypeOf(e);return null===o?void 0:t(o,i,n)}if("value"in s)return s.value;var a=s.get;return void 0!==a?a.call(n):void 0},_createClass=function(){function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}}();function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}window.cash=function(){var i,o=document,a=window,t=Array.prototype,r=t.slice,n=t.filter,s=t.push,e=function(){},h=function(t){return typeof t==typeof e&&t.call},d=function(t){return"string"==typeof t},l=/^#[\w-]*$/,u=/^\.[\w-]*$/,c=/<.+>/,p=/^\w+$/;function v(t,e){e=e||o;var i=u.test(t)?e.getElementsByClassName(t.slice(1)):p.test(t)?e.getElementsByTagName(t):e.querySelectorAll(t);return i}function f(t){if(!i){var e=(i=o.implementation.createHTMLDocument(null)).createElement("base");e.href=o.location.href,i.head.appendChild(e)}return i.body.innerHTML=t,i.body.childNodes}function m(t){"loading"!==o.readyState?t():o.addEventListener("DOMContentLoaded",t)}function g(t,e){if(!t)return this;if(t.cash&&t!==a)return t;var i,n=t,s=0;if(d(t))n=l.test(t)?o.getElementById(t.slice(1)):c.test(t)?f(t):v(t,e);else if(h(t))return m(t),this;if(!n)return this;if(n.nodeType||n===a)this[0]=n,this.length=1;else for(i=this.length=n.length;s<i;s++)this[s]=n[s];return this}function _(t,e){return new g(t,e)}var y=_.fn=_.prototype=g.prototype={cash:!0,length:0,push:s,splice:t.splice,map:t.map,init:g};function k(t,e){for(var i=t.length,n=0;n<i&&!1!==e.call(t[n],t[n],n,t);n++);}function b(t,e){var i=t&&(t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector);return!!i&&i.call(t,e)}function w(e){return d(e)?b:e.cash?function(t){return e.is(t)}:function(t,e){return t===e}}function C(t){return _(r.call(t).filter(function(t,e,i){return i.indexOf(t)===e}))}Object.defineProperty(y,"constructor",{value:_}),_.parseHTML=f,_.noop=e,_.isFunction=h,_.isString=d,_.extend=y.extend=function(t){t=t||{};var e=r.call(arguments),i=e.length,n=1;for(1===e.length&&(t=this,n=0);n<i;n++)if(e[n])for(var s in e[n])e[n].hasOwnProperty(s)&&(t[s]=e[n][s]);return t},_.extend({merge:function(t,e){for(var i=+e.length,n=t.length,s=0;s<i;n++,s++)t[n]=e[s];return t.length=n,t},each:k,matches:b,unique:C,isArray:Array.isArray,isNumeric:function(t){return!isNaN(parseFloat(t))&&isFinite(t)}});var E=_.uid="_cash"+Date.now();function M(t){return t[E]=t[E]||{}}function O(t,e,i){return M(t)[e]=i}function x(t,e){var i=M(t);return void 0===i[e]&&(i[e]=t.dataset?t.dataset[e]:_(t).attr("data-"+e)),i[e]}y.extend({data:function(e,i){if(d(e))return void 0===i?x(this[0],e):this.each(function(t){return O(t,e,i)});for(var t in e)this.data(t,e[t]);return this},removeData:function(s){return this.each(function(t){return i=s,void((n=M(e=t))?delete n[i]:e.dataset?delete e.dataset[i]:_(e).removeAttr("data-"+name));var e,i,n})}});var L=/\S+/g;function T(t){return d(t)&&t.match(L)}function $(t,e){return t.classList?t.classList.contains(e):new RegExp("(^| )"+e+"( |$)","gi").test(t.className)}function B(t,e,i){t.classList?t.classList.add(e):i.indexOf(" "+e+" ")&&(t.className+=" "+e)}function D(t,e){t.classList?t.classList.remove(e):t.className=t.className.replace(e,"")}y.extend({addClass:function(t){var n=T(t);return n?this.each(function(e){var i=" "+e.className+" ";k(n,function(t){B(e,t,i)})}):this},attr:function(e,i){if(e){if(d(e))return void 0===i?this[0]?this[0].getAttribute?this[0].getAttribute(e):this[0][e]:void 0:this.each(function(t){t.setAttribute?t.setAttribute(e,i):t[e]=i});for(var t in e)this.attr(t,e[t]);return this}},hasClass:function(t){var e=!1,i=T(t);return i&&i.length&&this.each(function(t){return!(e=$(t,i[0]))}),e},prop:function(e,i){if(d(e))return void 0===i?this[0][e]:this.each(function(t){t[e]=i});for(var t in e)this.prop(t,e[t]);return this},removeAttr:function(e){return this.each(function(t){t.removeAttribute?t.removeAttribute(e):delete t[e]})},removeClass:function(t){if(!arguments.length)return this.attr("class","");var i=T(t);return i?this.each(function(e){k(i,function(t){D(e,t)})}):this},removeProp:function(e){return this.each(function(t){delete t[e]})},toggleClass:function(t,e){if(void 0!==e)return this[e?"addClass":"removeClass"](t);var n=T(t);return n?this.each(function(e){var i=" "+e.className+" ";k(n,function(t){$(e,t)?D(e,t):B(e,t,i)})}):this}}),y.extend({add:function(t,e){return C(_.merge(this,_(t,e)))},each:function(t){return k(this,t),this},eq:function(t){return _(this.get(t))},filter:function(e){if(!e)return this;var i=h(e)?e:w(e);return _(n.call(this,function(t){return i(t,e)}))},first:function(){return this.eq(0)},get:function(t){return void 0===t?r.call(this):t<0?this[t+this.length]:this[t]},index:function(t){var e=t?_(t)[0]:this[0],i=t?this:_(e).parent().children();return r.call(i).indexOf(e)},last:function(){return this.eq(-1)}});var S,I,A,R,H,P,W=(H=/(?:^\w|[A-Z]|\b\w)/g,P=/[\s-_]+/g,function(t){return t.replace(H,function(t,e){return t[0===e?"toLowerCase":"toUpperCase"]()}).replace(P,"")}),j=(S={},I=document,A=I.createElement("div"),R=A.style,function(e){if(e=W(e),S[e])return S[e];var t=e.charAt(0).toUpperCase()+e.slice(1),i=(e+" "+["webkit","moz","ms","o"].join(t+" ")+t).split(" ");return k(i,function(t){if(t in R)return S[t]=e=S[e]=t,!1}),S[e]});function F(t,e){return parseInt(a.getComputedStyle(t[0],null)[e],10)||0}function q(e,i,t){var n,s=x(e,"_cashEvents"),o=s&&s[i];o&&(t?(e.removeEventListener(i,t),0<=(n=o.indexOf(t))&&o.splice(n,1)):(k(o,function(t){e.removeEventListener(i,t)}),o=[]))}function N(t,e){return"&"+encodeURIComponent(t)+"="+encodeURIComponent(e).replace(/%20/g,"+")}function z(t){var e,i,n,s=t.type;if(!s)return null;switch(s.toLowerCase()){case"select-one":return 0<=(n=(i=t).selectedIndex)?i.options[n].value:null;case"select-multiple":return e=[],k(t.options,function(t){t.selected&&e.push(t.value)}),e.length?e:null;case"radio":case"checkbox":return t.checked?t.value:null;default:return t.value?t.value:null}}function V(e,i,n){var t=d(i);t||!i.length?k(e,t?function(t){return t.insertAdjacentHTML(n?"afterbegin":"beforeend",i)}:function(t,e){return function(t,e,i){if(i){var n=t.childNodes[0];t.insertBefore(e,n)}else t.appendChild(e)}(t,0===e?i:i.cloneNode(!0),n)}):k(i,function(t){return V(e,t,n)})}_.prefixedProp=j,_.camelCase=W,y.extend({css:function(e,i){if(d(e))return e=j(e),1<arguments.length?this.each(function(t){return t.style[e]=i}):a.getComputedStyle(this[0])[e];for(var t in e)this.css(t,e[t]);return this}}),k(["Width","Height"],function(e){var t=e.toLowerCase();y[t]=function(){return this[0].getBoundingClientRect()[t]},y["inner"+e]=function(){return this[0]["client"+e]},y["outer"+e]=function(t){return this[0]["offset"+e]+(t?F(this,"margin"+("Width"===e?"Left":"Top"))+F(this,"margin"+("Width"===e?"Right":"Bottom")):0)}}),y.extend({off:function(e,i){return this.each(function(t){return q(t,e,i)})},on:function(a,i,r,l){var n;if(!d(a)){for(var t in a)this.on(t,i,a[t]);return this}return h(i)&&(r=i,i=null),"ready"===a?(m(r),this):(i&&(n=r,r=function(t){for(var e=t.target;!b(e,i);){if(e===this||null===e)return e=!1;e=e.parentNode}e&&n.call(e,t)}),this.each(function(t){var e,i,n,s,o=r;l&&(o=function(){r.apply(this,arguments),q(t,a,o)}),i=a,n=o,(s=x(e=t,"_cashEvents")||O(e,"_cashEvents",{}))[i]=s[i]||[],s[i].push(n),e.addEventListener(i,n)}))},one:function(t,e,i){return this.on(t,e,i,!0)},ready:m,trigger:function(t,e){if(document.createEvent){var i=document.createEvent("HTMLEvents");return i.initEvent(t,!0,!1),i=this.extend(i,e),this.each(function(t){return t.dispatchEvent(i)})}}}),y.extend({serialize:function(){var s="";return k(this[0].elements||this,function(t){if(!t.disabled&&"FIELDSET"!==t.tagName){var e=t.name;switch(t.type.toLowerCase()){case"file":case"reset":case"submit":case"button":break;case"select-multiple":var i=z(t);null!==i&&k(i,function(t){s+=N(e,t)});break;default:var n=z(t);null!==n&&(s+=N(e,n))}}}),s.substr(1)},val:function(e){return void 0===e?z(this[0]):this.each(function(t){return t.value=e})}}),y.extend({after:function(t){return _(t).insertAfter(this),this},append:function(t){return V(this,t),this},appendTo:function(t){return V(_(t),this),this},before:function(t){return _(t).insertBefore(this),this},clone:function(){return _(this.map(function(t){return t.cloneNode(!0)}))},empty:function(){return this.html(""),this},html:function(t){if(void 0===t)return this[0].innerHTML;var e=t.nodeType?t[0].outerHTML:t;return this.each(function(t){return t.innerHTML=e})},insertAfter:function(t){var s=this;return _(t).each(function(t,e){var i=t.parentNode,n=t.nextSibling;s.each(function(t){i.insertBefore(0===e?t:t.cloneNode(!0),n)})}),this},insertBefore:function(t){var s=this;return _(t).each(function(e,i){var n=e.parentNode;s.each(function(t){n.insertBefore(0===i?t:t.cloneNode(!0),e)})}),this},prepend:function(t){return V(this,t,!0),this},prependTo:function(t){return V(_(t),this,!0),this},remove:function(){return this.each(function(t){if(t.parentNode)return t.parentNode.removeChild(t)})},text:function(e){return void 0===e?this[0].textContent:this.each(function(t){return t.textContent=e})}});var X=o.documentElement;return y.extend({position:function(){var t=this[0];return{left:t.offsetLeft,top:t.offsetTop}},offset:function(){var t=this[0].getBoundingClientRect();return{top:t.top+a.pageYOffset-X.clientTop,left:t.left+a.pageXOffset-X.clientLeft}},offsetParent:function(){return _(this[0].offsetParent)}}),y.extend({children:function(e){var i=[];return this.each(function(t){s.apply(i,t.children)}),i=C(i),e?i.filter(function(t){return b(t,e)}):i},closest:function(t){return!t||this.length<1?_():this.is(t)?this.filter(t):this.parent().closest(t)},is:function(e){if(!e)return!1;var i=!1,n=w(e);return this.each(function(t){return!(i=n(t,e))}),i},find:function(e){if(!e||e.nodeType)return _(e&&this.has(e).length?e:null);var i=[];return this.each(function(t){s.apply(i,v(e,t))}),C(i)},has:function(e){var t=d(e)?function(t){return 0!==v(e,t).length}:function(t){return t.contains(e)};return this.filter(t)},next:function(){return _(this[0].nextElementSibling)},not:function(e){if(!e)return this;var i=w(e);return this.filter(function(t){return!i(t,e)})},parent:function(){var e=[];return this.each(function(t){t&&t.parentNode&&e.push(t.parentNode)}),C(e)},parents:function(e){var i,n=[];return this.each(function(t){for(i=t;i&&i.parentNode&&i!==o.body.parentNode;)i=i.parentNode,(!e||e&&b(i,e))&&n.push(i)}),C(n)},prev:function(){return _(this[0].previousElementSibling)},siblings:function(t){var e=this.parent().children(t),i=this[0];return e.filter(function(t){return t!==i})}}),_}();var Component=function(){function s(t,e,i){_classCallCheck(this,s),e instanceof Element||console.error(Error(e+" is not an HTML Element"));var n=t.getInstance(e);n&&n.destroy(),this.el=e,this.$el=cash(e)}return _createClass(s,null,[{key:"init",value:function(t,e,i){var n=null;if(e instanceof Element)n=new t(e,i);else if(e&&(e.jquery||e.cash||e instanceof NodeList)){for(var s=[],o=0;o<e.length;o++)s.push(new t(e[o],i));n=s}return n}}]),s}();!function(t){t.Package?M={}:t.M={},M.jQueryLoaded=!!__webpack_provided_window_dot_jQuery}(window), true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return M}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"==typeof exports||exports.nodeType||("undefined"!=typeof module&&!module.nodeType&&module.exports&&(exports=module.exports=M),exports.default=M),M.keys={TAB:9,ENTER:13,ESC:27,ARROW_UP:38,ARROW_DOWN:40},M.tabPressed=!1,M.keyDown=!1;var docHandleKeydown=function(t){M.keyDown=!0,t.which!==M.keys.TAB&&t.which!==M.keys.ARROW_DOWN&&t.which!==M.keys.ARROW_UP||(M.tabPressed=!0)},docHandleKeyup=function(t){M.keyDown=!1,t.which!==M.keys.TAB&&t.which!==M.keys.ARROW_DOWN&&t.which!==M.keys.ARROW_UP||(M.tabPressed=!1)},docHandleFocus=function(t){M.keyDown&&document.body.classList.add("keyboard-focused")},docHandleBlur=function(t){document.body.classList.remove("keyboard-focused")};document.addEventListener("keydown",docHandleKeydown,!0),document.addEventListener("keyup",docHandleKeyup,!0),document.addEventListener("focus",docHandleFocus,!0),document.addEventListener("blur",docHandleBlur,!0),M.initializeJqueryWrapper=function(n,s,o){jQuery.fn[s]=function(e){if(n.prototype[e]){var i=Array.prototype.slice.call(arguments,1);if("get"===e.slice(0,3)){var t=this.first()[0][o];return t[e].apply(t,i)}return this.each(function(){var t=this[o];t[e].apply(t,i)})}if("object"==typeof e||!e)return n.init(this,e),this;jQuery.error("Method "+e+" does not exist on jQuery."+s)}},M.AutoInit=function(t){var e=t||document.body,i={Autocomplete:e.querySelectorAll(".autocomplete:not(.no-autoinit)"),Carousel:e.querySelectorAll(".carousel:not(.no-autoinit)"),Chips:e.querySelectorAll(".chips:not(.no-autoinit)"),Collapsible:e.querySelectorAll(".collapsible:not(.no-autoinit)"),Datepicker:e.querySelectorAll(".datepicker:not(.no-autoinit)"),Dropdown:e.querySelectorAll(".dropdown-trigger:not(.no-autoinit)"),Materialbox:e.querySelectorAll(".materialboxed:not(.no-autoinit)"),Modal:e.querySelectorAll(".modal:not(.no-autoinit)"),Parallax:e.querySelectorAll(".parallax:not(.no-autoinit)"),Pushpin:e.querySelectorAll(".pushpin:not(.no-autoinit)"),ScrollSpy:e.querySelectorAll(".scrollspy:not(.no-autoinit)"),FormSelect:e.querySelectorAll("select:not(.no-autoinit)"),Sidenav:e.querySelectorAll(".sidenav:not(.no-autoinit)"),Tabs:e.querySelectorAll(".tabs:not(.no-autoinit)"),TapTarget:e.querySelectorAll(".tap-target:not(.no-autoinit)"),Timepicker:e.querySelectorAll(".timepicker:not(.no-autoinit)"),Tooltip:e.querySelectorAll(".tooltipped:not(.no-autoinit)"),FloatingActionButton:e.querySelectorAll(".fixed-action-btn:not(.no-autoinit)")};for(var n in i){M[n].init(i[n])}},M.objectSelectorString=function(t){return((t.prop("tagName")||"")+(t.attr("id")||"")+(t.attr("class")||"")).replace(/\s/g,"")},M.guid=function(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return function(){return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}}(),M.escapeHash=function(t){return t.replace(/(:|\.|\[|\]|,|=|\/)/g,"\\$1")},M.elementOrParentIsFixed=function(t){var e=$(t),i=e.add(e.parents()),n=!1;return i.each(function(){if("fixed"===$(this).css("position"))return!(n=!0)}),n},M.checkWithinContainer=function(t,e,i){var n={top:!1,right:!1,bottom:!1,left:!1},s=t.getBoundingClientRect(),o=t===document.body?Math.max(s.bottom,window.innerHeight):s.bottom,a=t.scrollLeft,r=t.scrollTop,l=e.left-a,h=e.top-r;return(l<s.left+i||l<i)&&(n.left=!0),(l+e.width>s.right-i||l+e.width>window.innerWidth-i)&&(n.right=!0),(h<s.top+i||h<i)&&(n.top=!0),(h+e.height>o-i||h+e.height>window.innerHeight-i)&&(n.bottom=!0),n},M.checkPossibleAlignments=function(t,e,i,n){var s={top:!0,right:!0,bottom:!0,left:!0,spaceOnTop:null,spaceOnRight:null,spaceOnBottom:null,spaceOnLeft:null},o="visible"===getComputedStyle(e).overflow,a=e.getBoundingClientRect(),r=Math.min(a.height,window.innerHeight),l=Math.min(a.width,window.innerWidth),h=t.getBoundingClientRect(),d=e.scrollLeft,u=e.scrollTop,c=i.left-d,p=i.top-u,v=i.top+h.height-u;return s.spaceOnRight=o?window.innerWidth-(h.left+i.width):l-(c+i.width),s.spaceOnRight<0&&(s.left=!1),s.spaceOnLeft=o?h.right-i.width:c-i.width+h.width,s.spaceOnLeft<0&&(s.right=!1),s.spaceOnBottom=o?window.innerHeight-(h.top+i.height+n):r-(p+i.height+n),s.spaceOnBottom<0&&(s.top=!1),s.spaceOnTop=o?h.bottom-(i.height+n):v-(i.height-n),s.spaceOnTop<0&&(s.bottom=!1),s},M.getOverflowParent=function(t){return null==t?null:t===document.body||"visible"!==getComputedStyle(t).overflow?t:M.getOverflowParent(t.parentElement)},M.getIdFromTrigger=function(t){var e=t.getAttribute("data-target");return e||(e=(e=t.getAttribute("href"))?e.slice(1):""),e},M.getDocumentScrollTop=function(){return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0},M.getDocumentScrollLeft=function(){return window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0};var getTime=Date.now||function(){return(new Date).getTime()};M.throttle=function(i,n,s){var o=void 0,a=void 0,r=void 0,l=null,h=0;s||(s={});var d=function(){h=!1===s.leading?0:getTime(),l=null,r=i.apply(o,a),o=a=null};return function(){var t=getTime();h||!1!==s.leading||(h=t);var e=n-(t-h);return o=this,a=arguments,e<=0?(clearTimeout(l),l=null,h=t,r=i.apply(o,a),o=a=null):l||!1===s.trailing||(l=setTimeout(d,e)),r}};var $jscomp={scope:{}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(t,e,i){if(i.get||i.set)throw new TypeError("ES3 does not support getters and setters.");t!=Array.prototype&&t!=Object.prototype&&(t[e]=i.value)},$jscomp.getGlobal=function(t){return"undefined"!=typeof window&&window===t?t:"undefined"!=typeof global&&null!=global?global:t},$jscomp.global=$jscomp.getGlobal(this),$jscomp.SYMBOL_PREFIX="jscomp_symbol_",$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){},$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)},$jscomp.symbolCounter_=0,$jscomp.Symbol=function(t){return $jscomp.SYMBOL_PREFIX+(t||"")+$jscomp.symbolCounter_++},$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var t=$jscomp.global.Symbol.iterator;t||(t=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator")),"function"!=typeof Array.prototype[t]&&$jscomp.defineProperty(Array.prototype,t,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}}),$jscomp.initSymbolIterator=function(){}},$jscomp.arrayIterator=function(t){var e=0;return $jscomp.iteratorPrototype(function(){return e<t.length?{done:!1,value:t[e++]}:{done:!0}})},$jscomp.iteratorPrototype=function(t){return $jscomp.initSymbolIterator(),(t={next:t})[$jscomp.global.Symbol.iterator]=function(){return this},t},$jscomp.array=$jscomp.array||{},$jscomp.iteratorFromArray=function(e,i){$jscomp.initSymbolIterator(),e instanceof String&&(e+="");var n=0,s={next:function(){if(n<e.length){var t=n++;return{value:i(t,e[t]),done:!1}}return s.next=function(){return{done:!0,value:void 0}},s.next()}};return s[Symbol.iterator]=function(){return s},s},$jscomp.polyfill=function(t,e,i,n){if(e){for(i=$jscomp.global,t=t.split("."),n=0;n<t.length-1;n++){var s=t[n];s in i||(i[s]={}),i=i[s]}(e=e(n=i[t=t[t.length-1]]))!=n&&null!=e&&$jscomp.defineProperty(i,t,{configurable:!0,writable:!0,value:e})}},$jscomp.polyfill("Array.prototype.keys",function(t){return t||function(){return $jscomp.iteratorFromArray(this,function(t){return t})}},"es6-impl","es3");var $jscomp$this=this;M.anime=function(){function s(t){if(!B.col(t))try{return document.querySelectorAll(t)}catch(t){}}function b(t,e){for(var i=t.length,n=2<=arguments.length?e:void 0,s=[],o=0;o<i;o++)if(o in t){var a=t[o];e.call(n,a,o,t)&&s.push(a)}return s}function d(t){return t.reduce(function(t,e){return t.concat(B.arr(e)?d(e):e)},[])}function o(t){return B.arr(t)?t:(B.str(t)&&(t=s(t)||t),t instanceof NodeList||t instanceof HTMLCollection?[].slice.call(t):[t])}function a(t,e){return t.some(function(t){return t===e})}function r(t){var e,i={};for(e in t)i[e]=t[e];return i}function u(t,e){var i,n=r(t);for(i in t)n[i]=e.hasOwnProperty(i)?e[i]:t[i];return n}function c(t,e){var i,n=r(t);for(i in e)n[i]=B.und(t[i])?e[i]:t[i];return n}function l(t){if(t=/([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(t))return t[2]}function h(t,e){return B.fnc(t)?t(e.target,e.id,e.total):t}function w(t,e){if(e in t.style)return getComputedStyle(t).getPropertyValue(e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase())||"0"}function p(t,e){return B.dom(t)&&a($,e)?"transform":B.dom(t)&&(t.getAttribute(e)||B.svg(t)&&t[e])?"attribute":B.dom(t)&&"transform"!==e&&w(t,e)?"css":null!=t[e]?"object":void 0}function v(t,e){switch(p(t,e)){case"transform":return function(t,i){var e,n=-1<(e=i).indexOf("translate")||"perspective"===e?"px":-1<e.indexOf("rotate")||-1<e.indexOf("skew")?"deg":void 0,n=-1<i.indexOf("scale")?1:0+n;if(!(t=t.style.transform))return n;for(var s=[],o=[],a=[],r=/(\w+)\((.+?)\)/g;s=r.exec(t);)o.push(s[1]),a.push(s[2]);return(t=b(a,function(t,e){return o[e]===i})).length?t[0]:n}(t,e);case"css":return w(t,e);case"attribute":return t.getAttribute(e)}return t[e]||0}function f(t,e){var i=/^(\*=|\+=|-=)/.exec(t);if(!i)return t;var n=l(t)||0;switch(e=parseFloat(e),t=parseFloat(t.replace(i[0],"")),i[0][0]){case"+":return e+t+n;case"-":return e-t+n;case"*":return e*t+n}}function m(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function i(t){t=t.points;for(var e,i=0,n=0;n<t.numberOfItems;n++){var s=t.getItem(n);0<n&&(i+=m(e,s)),e=s}return i}function g(t){if(t.getTotalLength)return t.getTotalLength();switch(t.tagName.toLowerCase()){case"circle":return 2*Math.PI*t.getAttribute("r");case"rect":return 2*t.getAttribute("width")+2*t.getAttribute("height");case"line":return m({x:t.getAttribute("x1"),y:t.getAttribute("y1")},{x:t.getAttribute("x2"),y:t.getAttribute("y2")});case"polyline":return i(t);case"polygon":var e=t.points;return i(t)+m(e.getItem(e.numberOfItems-1),e.getItem(0))}}function C(e,i){function t(t){return t=void 0===t?0:t,e.el.getPointAtLength(1<=i+t?i+t:0)}var n=t(),s=t(-1),o=t(1);switch(e.property){case"x":return n.x;case"y":return n.y;case"angle":return 180*Math.atan2(o.y-s.y,o.x-s.x)/Math.PI}}function _(t,e){var i,n=/-?\d*\.?\d+/g;if(i=B.pth(t)?t.totalLength:t,B.col(i))if(B.rgb(i)){var s=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(i);i=s?"rgba("+s[1]+",1)":i}else i=B.hex(i)?function(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(t,e,i,n){return e+e+i+i+n+n});var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);t=parseInt(e[1],16);var i=parseInt(e[2],16),e=parseInt(e[3],16);return"rgba("+t+","+i+","+e+",1)"}(i):B.hsl(i)?function(t){function e(t,e,i){return i<0&&(i+=1),1<i&&--i,i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t}var i=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(t);t=parseInt(i[1])/360;var n=parseInt(i[2])/100,s=parseInt(i[3])/100,i=i[4]||1;if(0==n)s=n=t=s;else{var o=s<.5?s*(1+n):s+n-s*n,a=2*s-o,s=e(a,o,t+1/3),n=e(a,o,t);t=e(a,o,t-1/3)}return"rgba("+255*s+","+255*n+","+255*t+","+i+")"}(i):void 0;else s=(s=l(i))?i.substr(0,i.length-s.length):i,i=e&&!/\s/g.test(i)?s+e:s;return{original:i+="",numbers:i.match(n)?i.match(n).map(Number):[0],strings:B.str(t)||e?i.split(n):[]}}function y(t){return b(t=t?d(B.arr(t)?t.map(o):o(t)):[],function(t,e,i){return i.indexOf(t)===e})}function k(t,i){var e=r(i);if(B.arr(t)){var n=t.length;2!==n||B.obj(t[0])?B.fnc(i.duration)||(e.duration=i.duration/n):t={value:t}}return o(t).map(function(t,e){return e=e?0:i.delay,t=B.obj(t)&&!B.pth(t)?t:{value:t},B.und(t.delay)&&(t.delay=e),t}).map(function(t){return c(t,e)})}function E(o,a){var r;return o.tweens.map(function(t){var e=(t=function(t,e){var i,n={};for(i in t){var s=h(t[i],e);B.arr(s)&&1===(s=s.map(function(t){return h(t,e)})).length&&(s=s[0]),n[i]=s}return n.duration=parseFloat(n.duration),n.delay=parseFloat(n.delay),n}(t,a)).value,i=v(a.target,o.name),n=r?r.to.original:i,n=B.arr(e)?e[0]:n,s=f(B.arr(e)?e[1]:e,n),i=l(s)||l(n)||l(i);return t.from=_(n,i),t.to=_(s,i),t.start=r?r.end:o.offset,t.end=t.start+t.delay+t.duration,t.easing=function(t){return B.arr(t)?D.apply(this,t):S[t]}(t.easing),t.elasticity=(1e3-Math.min(Math.max(t.elasticity,1),999))/1e3,t.isPath=B.pth(e),t.isColor=B.col(t.from.original),t.isColor&&(t.round=1),r=t})}function M(e,t,i,n){var s="delay"===e;return t.length?(s?Math.min:Math.max).apply(Math,t.map(function(t){return t[e]})):s?n.delay:i.offset+n.delay+n.duration}function n(t){var e,i,n,s,o=u(L,t),a=u(T,t),r=(i=t.targets,(n=y(i)).map(function(t,e){return{target:t,id:e,total:n.length}})),l=[],h=c(o,a);for(e in t)h.hasOwnProperty(e)||"targets"===e||l.push({name:e,offset:h.offset,tweens:k(t[e],a)});return s=l,t=b(d(r.map(function(n){return s.map(function(t){var e=p(n.target,t.name);if(e){var i=E(t,n);t={type:e,property:t.name,animatable:n,tweens:i,duration:i[i.length-1].end,delay:i[0].delay}}else t=void 0;return t})})),function(t){return!B.und(t)}),c(o,{children:[],animatables:r,animations:t,duration:M("duration",t,o,a),delay:M("delay",t,o,a)})}function O(t){function d(){return window.Promise&&new Promise(function(t){return _=t})}function u(t){return k.reversed?k.duration-t:t}function c(e){for(var t=0,i={},n=k.animations,s=n.length;t<s;){var o=n[t],a=o.animatable,r=o.tweens,l=r.length-1,h=r[l];l&&(h=b(r,function(t){return e<t.end})[0]||h);for(var r=Math.min(Math.max(e-h.start-h.delay,0),h.duration)/h.duration,d=isNaN(r)?1:h.easing(r,h.elasticity),r=h.to.strings,u=h.round,l=[],c=void 0,c=h.to.numbers.length,p=0;p<c;p++){var v=void 0,v=h.to.numbers[p],f=h.from.numbers[p],v=h.isPath?C(h.value,d*v):f+d*(v-f);u&&(h.isColor&&2<p||(v=Math.round(v*u)/u)),l.push(v)}if(h=r.length)for(c=r[0],d=0;d<h;d++)u=r[d+1],p=l[d],isNaN(p)||(c=u?c+(p+u):c+(p+" "));else c=l[0];I[o.type](a.target,o.property,c,i,a.id),o.currentValue=c,t++}if(t=Object.keys(i).length)for(n=0;n<t;n++)x||(x=w(document.body,"transform")?"transform":"-webkit-transform"),k.animatables[n].target.style[x]=i[n].join(" ");k.currentTime=e,k.progress=e/k.duration*100}function p(t){k[t]&&k[t](k)}function v(){k.remaining&&!0!==k.remaining&&k.remaining--}function e(t){var e=k.duration,i=k.offset,n=i+k.delay,s=k.currentTime,o=k.reversed,a=u(t);if(k.children.length){var r=k.children,l=r.length;if(a>=k.currentTime)for(var h=0;h<l;h++)r[h].seek(a);else for(;l--;)r[l].seek(a)}(n<=a||!e)&&(k.began||(k.began=!0,p("begin")),p("run")),i<a&&a<e?c(a):(a<=i&&0!==s&&(c(0),o&&v()),(e<=a&&s!==e||!e)&&(c(e),o||v())),p("update"),e<=t&&(k.remaining?(m=f,"alternate"===k.direction&&(k.reversed=!k.reversed)):(k.pause(),k.completed||(k.completed=!0,p("complete"),"Promise"in window&&(_(),y=d()))),g=0)}t=void 0===t?{}:t;var f,m,g=0,_=null,y=d(),k=n(t);return k.reset=function(){var t=k.direction,e=k.loop;for(k.currentTime=0,k.progress=0,k.paused=!0,k.began=!1,k.completed=!1,k.reversed="reverse"===t,k.remaining="alternate"===t&&1===e?2:e,c(0),t=k.children.length;t--;)k.children[t].reset()},k.tick=function(t){f=t,m||(m=f),e((g+f-m)*O.speed)},k.seek=function(t){e(u(t))},k.pause=function(){var t=A.indexOf(k);-1<t&&A.splice(t,1),k.paused=!0},k.play=function(){k.paused&&(k.paused=!1,m=0,g=u(k.currentTime),A.push(k),R||H())},k.reverse=function(){k.reversed=!k.reversed,m=0,g=u(k.currentTime)},k.restart=function(){k.pause(),k.reset(),k.play()},k.finished=y,k.reset(),k.autoplay&&k.play(),k}var x,L={update:void 0,begin:void 0,run:void 0,complete:void 0,loop:1,direction:"normal",autoplay:!0,offset:0},T={duration:1e3,delay:0,easing:"easeOutElastic",elasticity:500,round:0},$="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY perspective".split(" "),B={arr:function(t){return Array.isArray(t)},obj:function(t){return-1<Object.prototype.toString.call(t).indexOf("Object")},pth:function(t){return B.obj(t)&&t.hasOwnProperty("totalLength")},svg:function(t){return t instanceof SVGElement},dom:function(t){return t.nodeType||B.svg(t)},str:function(t){return"string"==typeof t},fnc:function(t){return"function"==typeof t},und:function(t){return void 0===t},hex:function(t){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t)},rgb:function(t){return/^rgb/.test(t)},hsl:function(t){return/^hsl/.test(t)},col:function(t){return B.hex(t)||B.rgb(t)||B.hsl(t)}},D=function(){function u(t,e,i){return(((1-3*i+3*e)*t+(3*i-6*e))*t+3*e)*t}return function(a,r,l,h){if(0<=a&&a<=1&&0<=l&&l<=1){var d=new Float32Array(11);if(a!==r||l!==h)for(var t=0;t<11;++t)d[t]=u(.1*t,a,l);return function(t){if(a===r&&l===h)return t;if(0===t)return 0;if(1===t)return 1;for(var e=0,i=1;10!==i&&d[i]<=t;++i)e+=.1;var i=e+(t-d[--i])/(d[i+1]-d[i])*.1,n=3*(1-3*l+3*a)*i*i+2*(3*l-6*a)*i+3*a;if(.001<=n){for(e=0;e<4&&0!=(n=3*(1-3*l+3*a)*i*i+2*(3*l-6*a)*i+3*a);++e)var s=u(i,a,l)-t,i=i-s/n;t=i}else if(0===n)t=i;else{for(var i=e,e=e+.1,o=0;0<(n=u(s=i+(e-i)/2,a,l)-t)?e=s:i=s,1e-7<Math.abs(n)&&++o<10;);t=s}return u(t,r,h)}}}}(),S=function(){function i(t,e){return 0===t||1===t?t:-Math.pow(2,10*(t-1))*Math.sin(2*(t-1-e/(2*Math.PI)*Math.asin(1))*Math.PI/e)}var t,n="Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),e={In:[[.55,.085,.68,.53],[.55,.055,.675,.19],[.895,.03,.685,.22],[.755,.05,.855,.06],[.47,0,.745,.715],[.95,.05,.795,.035],[.6,.04,.98,.335],[.6,-.28,.735,.045],i],Out:[[.25,.46,.45,.94],[.215,.61,.355,1],[.165,.84,.44,1],[.23,1,.32,1],[.39,.575,.565,1],[.19,1,.22,1],[.075,.82,.165,1],[.175,.885,.32,1.275],function(t,e){return 1-i(1-t,e)}],InOut:[[.455,.03,.515,.955],[.645,.045,.355,1],[.77,0,.175,1],[.86,0,.07,1],[.445,.05,.55,.95],[1,0,0,1],[.785,.135,.15,.86],[.68,-.55,.265,1.55],function(t,e){return t<.5?i(2*t,e)/2:1-i(-2*t+2,e)/2}]},s={linear:D(.25,.25,.75,.75)},o={};for(t in e)o.type=t,e[o.type].forEach(function(i){return function(t,e){s["ease"+i.type+n[e]]=B.fnc(t)?t:D.apply($jscomp$this,t)}}(o)),o={type:o.type};return s}(),I={css:function(t,e,i){return t.style[e]=i},attribute:function(t,e,i){return t.setAttribute(e,i)},object:function(t,e,i){return t[e]=i},transform:function(t,e,i,n,s){n[s]||(n[s]=[]),n[s].push(e+"("+i+")")}},A=[],R=0,H=function(){function n(){R=requestAnimationFrame(t)}function t(t){var e=A.length;if(e){for(var i=0;i<e;)A[i]&&A[i].tick(t),i++;n()}else cancelAnimationFrame(R),R=0}return n}();return O.version="2.2.0",O.speed=1,O.running=A,O.remove=function(t){t=y(t);for(var e=A.length;e--;)for(var i=A[e],n=i.animations,s=n.length;s--;)a(t,n[s].animatable.target)&&(n.splice(s,1),n.length||i.pause())},O.getValue=v,O.path=function(t,e){var i=B.str(t)?s(t)[0]:t,n=e||100;return function(t){return{el:i,property:t,totalLength:g(i)*(n/100)}}},O.setDashoffset=function(t){var e=g(t);return t.setAttribute("stroke-dasharray",e),e},O.bezier=D,O.easings=S,O.timeline=function(n){var s=O(n);return s.pause(),s.duration=0,s.add=function(t){return s.children.forEach(function(t){t.began=!0,t.completed=!0}),o(t).forEach(function(t){var e=c(t,u(T,n||{}));e.targets=e.targets||n.targets,t=s.duration;var i=e.offset;e.autoplay=!1,e.direction=s.direction,e.offset=B.und(i)?t:f(i,t),s.began=!0,s.completed=!0,s.seek(e.offset),(e=O(e)).began=!0,e.completed=!0,e.duration>t&&(s.duration=e.duration),s.children.push(e)}),s.seek(0),s.reset(),s.autoplay&&s.restart(),s},s},O.random=function(t,e){return Math.floor(Math.random()*(e-t+1))+t},O}(),function(r,l){"use strict";var e={accordion:!0,onOpenStart:void 0,onOpenEnd:void 0,onCloseStart:void 0,onCloseEnd:void 0,inDuration:300,outDuration:300},t=function(t){function s(t,e){_classCallCheck(this,s);var i=_possibleConstructorReturn(this,(s.__proto__||Object.getPrototypeOf(s)).call(this,s,t,e));(i.el.M_Collapsible=i).options=r.extend({},s.defaults,e),i.$headers=i.$el.children("li").children(".collapsible-header"),i.$headers.attr("tabindex",0),i._setupEventHandlers();var n=i.$el.children("li.active").children(".collapsible-body");return i.options.accordion?n.first().css("display","block"):n.css("display","block"),i}return _inherits(s,Component),_createClass(s,[{key:"destroy",value:function(){this._removeEventHandlers(),this.el.M_Collapsible=void 0}},{key:"_setupEventHandlers",value:function(){var e=this;this._handleCollapsibleClickBound=this._handleCollapsibleClick.bind(this),this._handleCollapsibleKeydownBound=this._handleCollapsibleKeydown.bind(this),this.el.addEventListener("click",this._handleCollapsibleClickBound),this.$headers.each(function(t){t.addEventListener("keydown",e._handleCollapsibleKeydownBound)})}},{key:"_removeEventHandlers",value:function(){var e=this;this.el.removeEventListener("click",this._handleCollapsibleClickBound),this.$headers.each(function(t){t.removeEventListener("keydown",e._handleCollapsibleKeydownBound)})}},{key:"_handleCollapsibleClick",value:function(t){var e=r(t.target).closest(".collapsible-header");if(t.target&&e.length){var i=e.closest(".collapsible");if(i[0]===this.el){var n=e.closest("li"),s=i.children("li"),o=n[0].classList.contains("active"),a=s.index(n);o?this.close(a):this.open(a)}}}},{key:"_handleCollapsibleKeydown",value:function(t){13===t.keyCode&&this._handleCollapsibleClickBound(t)}},{key:"_animateIn",value:function(t){var e=this,i=this.$el.children("li").eq(t);if(i.length){var n=i.children(".collapsible-body");l.remove(n[0]),n.css({display:"block",overflow:"hidden",height:0,paddingTop:"",paddingBottom:""});var s=n.css("padding-top"),o=n.css("padding-bottom"),a=n[0].scrollHeight;n.css({paddingTop:0,paddingBottom:0}),l({targets:n[0],height:a,paddingTop:s,paddingBottom:o,duration:this.options.inDuration,easing:"easeInOutCubic",complete:function(t){n.css({overflow:"",paddingTop:"",paddingBottom:"",height:""}),"function"==typeof e.options.onOpenEnd&&e.options.onOpenEnd.call(e,i[0])}})}}},{key:"_animateOut",value:function(t){var e=this,i=this.$el.children("li").eq(t);if(i.length){var n=i.children(".collapsible-body");l.remove(n[0]),n.css("overflow","hidden"),l({targets:n[0],height:0,paddingTop:0,paddingBottom:0,duration:this.options.outDuration,easing:"easeInOutCubic",complete:function(){n.css({height:"",overflow:"",padding:"",display:""}),"function"==typeof e.options.onCloseEnd&&e.options.onCloseEnd.call(e,i[0])}})}}},{key:"open",value:function(t){var i=this,e=this.$el.children("li").eq(t);if(e.length&&!e[0].classList.contains("active")){if("function"==typeof this.options.onOpenStart&&this.options.onOpenStart.call(this,e[0]),this.options.accordion){var n=this.$el.children("li");this.$el.children("li.active").each(function(t){var e=n.index(r(t));i.close(e)})}e[0].classList.add("active"),this._animateIn(t)}}},{key:"close",value:function(t){var e=this.$el.children("li").eq(t);e.length&&e[0].classList.contains("active")&&("function"==typeof this.options.onCloseStart&&this.options.onCloseStart.call(this,e[0]),e[0].classList.remove("active"),this._animateOut(t))}}],[{key:"init",value:function(t,e){return _get(s.__proto__||Object.getPrototypeOf(s),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Collapsible}},{key:"defaults",get:function(){return e}}]),s}();M.Collapsible=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"collapsible","M_Collapsible")}(cash,M.anime),function(h,s){"use strict";var e={alignment:"left",autoFocus:!0,constrainWidth:!0,container:null,coverTrigger:!0,closeOnClick:!0,hover:!1,inDuration:150,outDuration:250,onOpenStart:null,onOpenEnd:null,onCloseStart:null,onCloseEnd:null,onItemClick:null},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return i.el.M_Dropdown=i,n._dropdowns.push(i),i.id=M.getIdFromTrigger(t),i.dropdownEl=document.getElementById(i.id),i.$dropdownEl=h(i.dropdownEl),i.options=h.extend({},n.defaults,e),i.isOpen=!1,i.isScrollable=!1,i.isTouchMoving=!1,i.focusedIndex=-1,i.filterQuery=[],i.options.container?h(i.options.container).append(i.dropdownEl):i.$el.after(i.dropdownEl),i._makeDropdownFocusable(),i._resetFilterQueryBound=i._resetFilterQuery.bind(i),i._handleDocumentClickBound=i._handleDocumentClick.bind(i),i._handleDocumentTouchmoveBound=i._handleDocumentTouchmove.bind(i),i._handleDropdownClickBound=i._handleDropdownClick.bind(i),i._handleDropdownKeydownBound=i._handleDropdownKeydown.bind(i),i._handleTriggerKeydownBound=i._handleTriggerKeydown.bind(i),i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._resetDropdownStyles(),this._removeEventHandlers(),n._dropdowns.splice(n._dropdowns.indexOf(this),1),this.el.M_Dropdown=void 0}},{key:"_setupEventHandlers",value:function(){this.el.addEventListener("keydown",this._handleTriggerKeydownBound),this.dropdownEl.addEventListener("click",this._handleDropdownClickBound),this.options.hover?(this._handleMouseEnterBound=this._handleMouseEnter.bind(this),this.el.addEventListener("mouseenter",this._handleMouseEnterBound),this._handleMouseLeaveBound=this._handleMouseLeave.bind(this),this.el.addEventListener("mouseleave",this._handleMouseLeaveBound),this.dropdownEl.addEventListener("mouseleave",this._handleMouseLeaveBound)):(this._handleClickBound=this._handleClick.bind(this),this.el.addEventListener("click",this._handleClickBound))}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("keydown",this._handleTriggerKeydownBound),this.dropdownEl.removeEventListener("click",this._handleDropdownClickBound),this.options.hover?(this.el.removeEventListener("mouseenter",this._handleMouseEnterBound),this.el.removeEventListener("mouseleave",this._handleMouseLeaveBound),this.dropdownEl.removeEventListener("mouseleave",this._handleMouseLeaveBound)):this.el.removeEventListener("click",this._handleClickBound)}},{key:"_setupTemporaryEventHandlers",value:function(){document.body.addEventListener("click",this._handleDocumentClickBound,!0),document.body.addEventListener("touchend",this._handleDocumentClickBound),document.body.addEventListener("touchmove",this._handleDocumentTouchmoveBound),this.dropdownEl.addEventListener("keydown",this._handleDropdownKeydownBound)}},{key:"_removeTemporaryEventHandlers",value:function(){document.body.removeEventListener("click",this._handleDocumentClickBound,!0),document.body.removeEventListener("touchend",this._handleDocumentClickBound),document.body.removeEventListener("touchmove",this._handleDocumentTouchmoveBound),this.dropdownEl.removeEventListener("keydown",this._handleDropdownKeydownBound)}},{key:"_handleClick",value:function(t){t.preventDefault(),this.open()}},{key:"_handleMouseEnter",value:function(){this.open()}},{key:"_handleMouseLeave",value:function(t){var e=t.toElement||t.relatedTarget,i=!!h(e).closest(".dropdown-content").length,n=!1,s=h(e).closest(".dropdown-trigger");s.length&&s[0].M_Dropdown&&s[0].M_Dropdown.isOpen&&(n=!0),n||i||this.close()}},{key:"_handleDocumentClick",value:function(t){var e=this,i=h(t.target);this.options.closeOnClick&&i.closest(".dropdown-content").length&&!this.isTouchMoving?setTimeout(function(){e.close()},0):!i.closest(".dropdown-trigger").length&&i.closest(".dropdown-content").length||setTimeout(function(){e.close()},0),this.isTouchMoving=!1}},{key:"_handleTriggerKeydown",value:function(t){t.which!==M.keys.ARROW_DOWN&&t.which!==M.keys.ENTER||this.isOpen||(t.preventDefault(),this.open())}},{key:"_handleDocumentTouchmove",value:function(t){h(t.target).closest(".dropdown-content").length&&(this.isTouchMoving=!0)}},{key:"_handleDropdownClick",value:function(t){if("function"==typeof this.options.onItemClick){var e=h(t.target).closest("li")[0];this.options.onItemClick.call(this,e)}}},{key:"_handleDropdownKeydown",value:function(t){if(t.which===M.keys.TAB)t.preventDefault(),this.close();else if(t.which!==M.keys.ARROW_DOWN&&t.which!==M.keys.ARROW_UP||!this.isOpen)if(t.which===M.keys.ENTER&&this.isOpen){var e=this.dropdownEl.children[this.focusedIndex],i=h(e).find("a, button").first();i.length?i[0].click():e.click()}else t.which===M.keys.ESC&&this.isOpen&&(t.preventDefault(),this.close());else{t.preventDefault();var n=t.which===M.keys.ARROW_DOWN?1:-1,s=this.focusedIndex,o=!1;do{if(s+=n,this.dropdownEl.children[s]&&-1!==this.dropdownEl.children[s].tabIndex){o=!0;break}}while(s<this.dropdownEl.children.length&&0<=s);o&&(this.focusedIndex=s,this._focusFocusedItem())}var a=String.fromCharCode(t.which).toLowerCase();if(a&&-1===[9,13,27,38,40].indexOf(t.which)){this.filterQuery.push(a);var r=this.filterQuery.join(""),l=h(this.dropdownEl).find("li").filter(function(t){return 0===h(t).text().toLowerCase().indexOf(r)})[0];l&&(this.focusedIndex=h(l).index(),this._focusFocusedItem())}this.filterTimeout=setTimeout(this._resetFilterQueryBound,1e3)}},{key:"_resetFilterQuery",value:function(){this.filterQuery=[]}},{key:"_resetDropdownStyles",value:function(){this.$dropdownEl.css({display:"",width:"",height:"",left:"",top:"","transform-origin":"",transform:"",opacity:""})}},{key:"_makeDropdownFocusable",value:function(){this.dropdownEl.tabIndex=0,h(this.dropdownEl).children().each(function(t){t.getAttribute("tabindex")||t.setAttribute("tabindex",0)})}},{key:"_focusFocusedItem",value:function(){0<=this.focusedIndex&&this.focusedIndex<this.dropdownEl.children.length&&this.options.autoFocus&&this.dropdownEl.children[this.focusedIndex].focus()}},{key:"_getDropdownPosition",value:function(){this.el.offsetParent.getBoundingClientRect();var t=this.el.getBoundingClientRect(),e=this.dropdownEl.getBoundingClientRect(),i=e.height,n=e.width,s=t.left-e.left,o=t.top-e.top,a={left:s,top:o,height:i,width:n},r=this.dropdownEl.offsetParent?this.dropdownEl.offsetParent:this.dropdownEl.parentNode,l=M.checkPossibleAlignments(this.el,r,a,this.options.coverTrigger?0:t.height),h="top",d=this.options.alignment;if(o+=this.options.coverTrigger?0:t.height,this.isScrollable=!1,l.top||(l.bottom?h="bottom":(this.isScrollable=!0,l.spaceOnTop>l.spaceOnBottom?(h="bottom",i+=l.spaceOnTop,o-=l.spaceOnTop):i+=l.spaceOnBottom)),!l[d]){var u="left"===d?"right":"left";l[u]?d=u:l.spaceOnLeft>l.spaceOnRight?(d="right",n+=l.spaceOnLeft,s-=l.spaceOnLeft):(d="left",n+=l.spaceOnRight)}return"bottom"===h&&(o=o-e.height+(this.options.coverTrigger?t.height:0)),"right"===d&&(s=s-e.width+t.width),{x:s,y:o,verticalAlignment:h,horizontalAlignment:d,height:i,width:n}}},{key:"_animateIn",value:function(){var i=this;s.remove(this.dropdownEl),s({targets:this.dropdownEl,opacity:{value:[0,1],easing:"easeOutQuad"},scaleX:[.3,1],scaleY:[.3,1],duration:this.options.inDuration,easing:"easeOutQuint",complete:function(t){if(i.options.autoFocus&&i.dropdownEl.focus(),"function"==typeof i.options.onOpenEnd){var e=t.animatables[0].target;i.options.onOpenEnd.call(e,i.el)}}})}},{key:"_animateOut",value:function(){var e=this;s.remove(this.dropdownEl),s({targets:this.dropdownEl,opacity:{value:0,easing:"easeOutQuint"},scaleX:.3,scaleY:.3,duration:this.options.outDuration,easing:"easeOutQuint",complete:function(t){if(e._resetDropdownStyles(),"function"==typeof e.options.onCloseEnd){t.animatables[0].target;e.options.onCloseEnd.call(e,e.el)}}})}},{key:"_placeDropdown",value:function(){var t=this.options.constrainWidth?this.el.getBoundingClientRect().width:this.dropdownEl.getBoundingClientRect().width;this.dropdownEl.style.width=t+"px";var e=this._getDropdownPosition();this.dropdownEl.style.left=e.x+"px",this.dropdownEl.style.top=e.y+"px",this.dropdownEl.style.height=e.height+"px",this.dropdownEl.style.width=e.width+"px",this.dropdownEl.style.transformOrigin=("left"===e.horizontalAlignment?"0":"100%")+" "+("top"===e.verticalAlignment?"0":"100%")}},{key:"open",value:function(){this.isOpen||(this.isOpen=!0,"function"==typeof this.options.onOpenStart&&this.options.onOpenStart.call(this,this.el),this._resetDropdownStyles(),this.dropdownEl.style.display="block",this._placeDropdown(),this._animateIn(),this._setupTemporaryEventHandlers())}},{key:"close",value:function(){this.isOpen&&(this.isOpen=!1,this.focusedIndex=-1,"function"==typeof this.options.onCloseStart&&this.options.onCloseStart.call(this,this.el),this._animateOut(),this._removeTemporaryEventHandlers(),this.options.autoFocus&&this.el.focus())}},{key:"recalculateDimensions",value:function(){this.isOpen&&(this.$dropdownEl.css({width:"",height:"",left:"",top:"","transform-origin":""}),this._placeDropdown())}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Dropdown}},{key:"defaults",get:function(){return e}}]),n}();t._dropdowns=[],window.M.Dropdown=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"dropdown","M_Dropdown")}(cash,M.anime),function(s,i){"use strict";var e={opacity:.5,inDuration:250,outDuration:250,onOpenStart:null,onOpenEnd:null,onCloseStart:null,onCloseEnd:null,preventScrolling:!0,dismissible:!0,startingTop:"4%",endingTop:"10%"},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Modal=i).options=s.extend({},n.defaults,e),i.isOpen=!1,i.id=i.$el.attr("id"),i._openingTrigger=void 0,i.$overlay=s('<div class="modal-overlay"></div>'),i.el.tabIndex=0,i._nthModalOpened=0,n._count++,i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){n._count--,this._removeEventHandlers(),this.el.removeAttribute("style"),this.$overlay.remove(),this.el.M_Modal=void 0}},{key:"_setupEventHandlers",value:function(){this._handleOverlayClickBound=this._handleOverlayClick.bind(this),this._handleModalCloseClickBound=this._handleModalCloseClick.bind(this),1===n._count&&document.body.addEventListener("click",this._handleTriggerClick),this.$overlay[0].addEventListener("click",this._handleOverlayClickBound),this.el.addEventListener("click",this._handleModalCloseClickBound)}},{key:"_removeEventHandlers",value:function(){0===n._count&&document.body.removeEventListener("click",this._handleTriggerClick),this.$overlay[0].removeEventListener("click",this._handleOverlayClickBound),this.el.removeEventListener("click",this._handleModalCloseClickBound)}},{key:"_handleTriggerClick",value:function(t){var e=s(t.target).closest(".modal-trigger");if(e.length){var i=M.getIdFromTrigger(e[0]),n=document.getElementById(i).M_Modal;n&&n.open(e),t.preventDefault()}}},{key:"_handleOverlayClick",value:function(){this.options.dismissible&&this.close()}},{key:"_handleModalCloseClick",value:function(t){s(t.target).closest(".modal-close").length&&this.close()}},{key:"_handleKeydown",value:function(t){27===t.keyCode&&this.options.dismissible&&this.close()}},{key:"_handleFocus",value:function(t){this.el.contains(t.target)||this._nthModalOpened!==n._modalsOpen||this.el.focus()}},{key:"_animateIn",value:function(){var t=this;s.extend(this.el.style,{display:"block",opacity:0}),s.extend(this.$overlay[0].style,{display:"block",opacity:0}),i({targets:this.$overlay[0],opacity:this.options.opacity,duration:this.options.inDuration,easing:"easeOutQuad"});var e={targets:this.el,duration:this.options.inDuration,easing:"easeOutCubic",complete:function(){"function"==typeof t.options.onOpenEnd&&t.options.onOpenEnd.call(t,t.el,t._openingTrigger)}};this.el.classList.contains("bottom-sheet")?s.extend(e,{bottom:0,opacity:1}):s.extend(e,{top:[this.options.startingTop,this.options.endingTop],opacity:1,scaleX:[.8,1],scaleY:[.8,1]}),i(e)}},{key:"_animateOut",value:function(){var t=this;i({targets:this.$overlay[0],opacity:0,duration:this.options.outDuration,easing:"easeOutQuart"});var e={targets:this.el,duration:this.options.outDuration,easing:"easeOutCubic",complete:function(){t.el.style.display="none",t.$overlay.remove(),"function"==typeof t.options.onCloseEnd&&t.options.onCloseEnd.call(t,t.el)}};this.el.classList.contains("bottom-sheet")?s.extend(e,{bottom:"-100%",opacity:0}):s.extend(e,{top:[this.options.endingTop,this.options.startingTop],opacity:0,scaleX:.8,scaleY:.8}),i(e)}},{key:"open",value:function(t){if(!this.isOpen)return this.isOpen=!0,n._modalsOpen++,this._nthModalOpened=n._modalsOpen,this.$overlay[0].style.zIndex=1e3+2*n._modalsOpen,this.el.style.zIndex=1e3+2*n._modalsOpen+1,this._openingTrigger=t?t[0]:void 0,"function"==typeof this.options.onOpenStart&&this.options.onOpenStart.call(this,this.el,this._openingTrigger),this.options.preventScrolling&&(document.body.style.overflow="hidden"),this.el.classList.add("open"),this.el.insertAdjacentElement("afterend",this.$overlay[0]),this.options.dismissible&&(this._handleKeydownBound=this._handleKeydown.bind(this),this._handleFocusBound=this._handleFocus.bind(this),document.addEventListener("keydown",this._handleKeydownBound),document.addEventListener("focus",this._handleFocusBound,!0)),i.remove(this.el),i.remove(this.$overlay[0]),this._animateIn(),this.el.focus(),this}},{key:"close",value:function(){if(this.isOpen)return this.isOpen=!1,n._modalsOpen--,this._nthModalOpened=0,"function"==typeof this.options.onCloseStart&&this.options.onCloseStart.call(this,this.el),this.el.classList.remove("open"),0===n._modalsOpen&&(document.body.style.overflow=""),this.options.dismissible&&(document.removeEventListener("keydown",this._handleKeydownBound),document.removeEventListener("focus",this._handleFocusBound,!0)),i.remove(this.el),i.remove(this.$overlay[0]),this._animateOut(),this}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Modal}},{key:"defaults",get:function(){return e}}]),n}();t._modalsOpen=0,t._count=0,M.Modal=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"modal","M_Modal")}(cash,M.anime),function(o,a){"use strict";var e={inDuration:275,outDuration:200,onOpenStart:null,onOpenEnd:null,onCloseStart:null,onCloseEnd:null},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Materialbox=i).options=o.extend({},n.defaults,e),i.overlayActive=!1,i.doneAnimating=!0,i.placeholder=o("<div></div>").addClass("material-placeholder"),i.originalWidth=0,i.originalHeight=0,i.originInlineStyles=i.$el.attr("style"),i.caption=i.el.getAttribute("data-caption")||"",i.$el.before(i.placeholder),i.placeholder.append(i.$el),i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this.el.M_Materialbox=void 0,o(this.placeholder).after(this.el).remove(),this.$el.removeAttr("style")}},{key:"_setupEventHandlers",value:function(){this._handleMaterialboxClickBound=this._handleMaterialboxClick.bind(this),this.el.addEventListener("click",this._handleMaterialboxClickBound)}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("click",this._handleMaterialboxClickBound)}},{key:"_handleMaterialboxClick",value:function(t){!1===this.doneAnimating||this.overlayActive&&this.doneAnimating?this.close():this.open()}},{key:"_handleWindowScroll",value:function(){this.overlayActive&&this.close()}},{key:"_handleWindowResize",value:function(){this.overlayActive&&this.close()}},{key:"_handleWindowEscape",value:function(t){27===t.keyCode&&this.doneAnimating&&this.overlayActive&&this.close()}},{key:"_makeAncestorsOverflowVisible",value:function(){this.ancestorsChanged=o();for(var t=this.placeholder[0].parentNode;null!==t&&!o(t).is(document);){var e=o(t);"visible"!==e.css("overflow")&&(e.css("overflow","visible"),void 0===this.ancestorsChanged?this.ancestorsChanged=e:this.ancestorsChanged=this.ancestorsChanged.add(e)),t=t.parentNode}}},{key:"_animateImageIn",value:function(){var t=this,e={targets:this.el,height:[this.originalHeight,this.newHeight],width:[this.originalWidth,this.newWidth],left:M.getDocumentScrollLeft()+this.windowWidth/2-this.placeholder.offset().left-this.newWidth/2,top:M.getDocumentScrollTop()+this.windowHeight/2-this.placeholder.offset().top-this.newHeight/2,duration:this.options.inDuration,easing:"easeOutQuad",complete:function(){t.doneAnimating=!0,"function"==typeof t.options.onOpenEnd&&t.options.onOpenEnd.call(t,t.el)}};this.maxWidth=this.$el.css("max-width"),this.maxHeight=this.$el.css("max-height"),"none"!==this.maxWidth&&(e.maxWidth=this.newWidth),"none"!==this.maxHeight&&(e.maxHeight=this.newHeight),a(e)}},{key:"_animateImageOut",value:function(){var t=this,e={targets:this.el,width:this.originalWidth,height:this.originalHeight,left:0,top:0,duration:this.options.outDuration,easing:"easeOutQuad",complete:function(){t.placeholder.css({height:"",width:"",position:"",top:"",left:""}),t.attrWidth&&t.$el.attr("width",t.attrWidth),t.attrHeight&&t.$el.attr("height",t.attrHeight),t.$el.removeAttr("style"),t.originInlineStyles&&t.$el.attr("style",t.originInlineStyles),t.$el.removeClass("active"),t.doneAnimating=!0,t.ancestorsChanged.length&&t.ancestorsChanged.css("overflow",""),"function"==typeof t.options.onCloseEnd&&t.options.onCloseEnd.call(t,t.el)}};a(e)}},{key:"_updateVars",value:function(){this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight,this.caption=this.el.getAttribute("data-caption")||""}},{key:"open",value:function(){var t=this;this._updateVars(),this.originalWidth=this.el.getBoundingClientRect().width,this.originalHeight=this.el.getBoundingClientRect().height,this.doneAnimating=!1,this.$el.addClass("active"),this.overlayActive=!0,"function"==typeof this.options.onOpenStart&&this.options.onOpenStart.call(this,this.el),this.placeholder.css({width:this.placeholder[0].getBoundingClientRect().width+"px",height:this.placeholder[0].getBoundingClientRect().height+"px",position:"relative",top:0,left:0}),this._makeAncestorsOverflowVisible(),this.$el.css({position:"absolute","z-index":1e3,"will-change":"left, top, width, height"}),this.attrWidth=this.$el.attr("width"),this.attrHeight=this.$el.attr("height"),this.attrWidth&&(this.$el.css("width",this.attrWidth+"px"),this.$el.removeAttr("width")),this.attrHeight&&(this.$el.css("width",this.attrHeight+"px"),this.$el.removeAttr("height")),this.$overlay=o('<div id="materialbox-overlay"></div>').css({opacity:0}).one("click",function(){t.doneAnimating&&t.close()}),this.$el.before(this.$overlay);var e=this.$overlay[0].getBoundingClientRect();this.$overlay.css({width:this.windowWidth+"px",height:this.windowHeight+"px",left:-1*e.left+"px",top:-1*e.top+"px"}),a.remove(this.el),a.remove(this.$overlay[0]),a({targets:this.$overlay[0],opacity:1,duration:this.options.inDuration,easing:"easeOutQuad"}),""!==this.caption&&(this.$photocaption&&a.remove(this.$photoCaption[0]),this.$photoCaption=o('<div class="materialbox-caption"></div>'),this.$photoCaption.text(this.caption),o("body").append(this.$photoCaption),this.$photoCaption.css({display:"inline"}),a({targets:this.$photoCaption[0],opacity:1,duration:this.options.inDuration,easing:"easeOutQuad"}));var i=0,n=this.originalWidth/this.windowWidth,s=this.originalHeight/this.windowHeight;this.newWidth=0,this.newHeight=0,s<n?(i=this.originalHeight/this.originalWidth,this.newWidth=.9*this.windowWidth,this.newHeight=.9*this.windowWidth*i):(i=this.originalWidth/this.originalHeight,this.newWidth=.9*this.windowHeight*i,this.newHeight=.9*this.windowHeight),this._animateImageIn(),this._handleWindowScrollBound=this._handleWindowScroll.bind(this),this._handleWindowResizeBound=this._handleWindowResize.bind(this),this._handleWindowEscapeBound=this._handleWindowEscape.bind(this),window.addEventListener("scroll",this._handleWindowScrollBound),window.addEventListener("resize",this._handleWindowResizeBound),window.addEventListener("keyup",this._handleWindowEscapeBound)}},{key:"close",value:function(){var t=this;this._updateVars(),this.doneAnimating=!1,"function"==typeof this.options.onCloseStart&&this.options.onCloseStart.call(this,this.el),a.remove(this.el),a.remove(this.$overlay[0]),""!==this.caption&&a.remove(this.$photoCaption[0]),window.removeEventListener("scroll",this._handleWindowScrollBound),window.removeEventListener("resize",this._handleWindowResizeBound),window.removeEventListener("keyup",this._handleWindowEscapeBound),a({targets:this.$overlay[0],opacity:0,duration:this.options.outDuration,easing:"easeOutQuad",complete:function(){t.overlayActive=!1,t.$overlay.remove()}}),this._animateImageOut(),""!==this.caption&&a({targets:this.$photoCaption[0],opacity:0,duration:this.options.outDuration,easing:"easeOutQuad",complete:function(){t.$photoCaption.remove()}})}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Materialbox}},{key:"defaults",get:function(){return e}}]),n}();M.Materialbox=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"materialbox","M_Materialbox")}(cash,M.anime),function(s){"use strict";var e={responsiveThreshold:0},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Parallax=i).options=s.extend({},n.defaults,e),i._enabled=window.innerWidth>i.options.responsiveThreshold,i.$img=i.$el.find("img").first(),i.$img.each(function(){this.complete&&s(this).trigger("load")}),i._updateParallax(),i._setupEventHandlers(),i._setupStyles(),n._parallaxes.push(i),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){n._parallaxes.splice(n._parallaxes.indexOf(this),1),this.$img[0].style.transform="",this._removeEventHandlers(),this.$el[0].M_Parallax=void 0}},{key:"_setupEventHandlers",value:function(){this._handleImageLoadBound=this._handleImageLoad.bind(this),this.$img[0].addEventListener("load",this._handleImageLoadBound),0===n._parallaxes.length&&(n._handleScrollThrottled=M.throttle(n._handleScroll,5),window.addEventListener("scroll",n._handleScrollThrottled),n._handleWindowResizeThrottled=M.throttle(n._handleWindowResize,5),window.addEventListener("resize",n._handleWindowResizeThrottled))}},{key:"_removeEventHandlers",value:function(){this.$img[0].removeEventListener("load",this._handleImageLoadBound),0===n._parallaxes.length&&(window.removeEventListener("scroll",n._handleScrollThrottled),window.removeEventListener("resize",n._handleWindowResizeThrottled))}},{key:"_setupStyles",value:function(){this.$img[0].style.opacity=1}},{key:"_handleImageLoad",value:function(){this._updateParallax()}},{key:"_updateParallax",value:function(){var t=0<this.$el.height()?this.el.parentNode.offsetHeight:500,e=this.$img[0].offsetHeight-t,i=this.$el.offset().top+t,n=this.$el.offset().top,s=M.getDocumentScrollTop(),o=window.innerHeight,a=e*((s+o-n)/(t+o));this._enabled?s<i&&n<s+o&&(this.$img[0].style.transform="translate3D(-50%, "+a+"px, 0)"):this.$img[0].style.transform=""}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Parallax}},{key:"_handleScroll",value:function(){for(var t=0;t<n._parallaxes.length;t++){var e=n._parallaxes[t];e._updateParallax.call(e)}}},{key:"_handleWindowResize",value:function(){for(var t=0;t<n._parallaxes.length;t++){var e=n._parallaxes[t];e._enabled=window.innerWidth>e.options.responsiveThreshold}}},{key:"defaults",get:function(){return e}}]),n}();t._parallaxes=[],M.Parallax=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"parallax","M_Parallax")}(cash),function(a,s){"use strict";var e={duration:300,onShow:null,swipeable:!1,responsiveThreshold:1/0},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Tabs=i).options=a.extend({},n.defaults,e),i.$tabLinks=i.$el.children("li.tab").children("a"),i.index=0,i._setupActiveTabLink(),i.options.swipeable?i._setupSwipeableTabs():i._setupNormalTabs(),i._setTabsAndTabWidth(),i._createIndicator(),i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this._indicator.parentNode.removeChild(this._indicator),this.options.swipeable?this._teardownSwipeableTabs():this._teardownNormalTabs(),this.$el[0].M_Tabs=void 0}},{key:"_setupEventHandlers",value:function(){this._handleWindowResizeBound=this._handleWindowResize.bind(this),window.addEventListener("resize",this._handleWindowResizeBound),this._handleTabClickBound=this._handleTabClick.bind(this),this.el.addEventListener("click",this._handleTabClickBound)}},{key:"_removeEventHandlers",value:function(){window.removeEventListener("resize",this._handleWindowResizeBound),this.el.removeEventListener("click",this._handleTabClickBound)}},{key:"_handleWindowResize",value:function(){this._setTabsAndTabWidth(),0!==this.tabWidth&&0!==this.tabsWidth&&(this._indicator.style.left=this._calcLeftPos(this.$activeTabLink)+"px",this._indicator.style.right=this._calcRightPos(this.$activeTabLink)+"px")}},{key:"_handleTabClick",value:function(t){var e=this,i=a(t.target).closest("li.tab"),n=a(t.target).closest("a");if(n.length&&n.parent().hasClass("tab"))if(i.hasClass("disabled"))t.preventDefault();else if(!n.attr("target")){this.$activeTabLink.removeClass("active");var s=this.$content;this.$activeTabLink=n,this.$content=a(M.escapeHash(n[0].hash)),this.$tabLinks=this.$el.children("li.tab").children("a"),this.$activeTabLink.addClass("active");var o=this.index;this.index=Math.max(this.$tabLinks.index(n),0),this.options.swipeable?this._tabsCarousel&&this._tabsCarousel.set(this.index,function(){"function"==typeof e.options.onShow&&e.options.onShow.call(e,e.$content[0])}):this.$content.length&&(this.$content[0].style.display="block",this.$content.addClass("active"),"function"==typeof this.options.onShow&&this.options.onShow.call(this,this.$content[0]),s.length&&!s.is(this.$content)&&(s[0].style.display="none",s.removeClass("active"))),this._setTabsAndTabWidth(),this._animateIndicator(o),t.preventDefault()}}},{key:"_createIndicator",value:function(){var t=this,e=document.createElement("li");e.classList.add("indicator"),this.el.appendChild(e),this._indicator=e,setTimeout(function(){t._indicator.style.left=t._calcLeftPos(t.$activeTabLink)+"px",t._indicator.style.right=t._calcRightPos(t.$activeTabLink)+"px"},0)}},{key:"_setupActiveTabLink",value:function(){this.$activeTabLink=a(this.$tabLinks.filter('[href="'+location.hash+'"]')),0===this.$activeTabLink.length&&(this.$activeTabLink=this.$el.children("li.tab").children("a.active").first()),0===this.$activeTabLink.length&&(this.$activeTabLink=this.$el.children("li.tab").children("a").first()),this.$tabLinks.removeClass("active"),this.$activeTabLink[0].classList.add("active"),this.index=Math.max(this.$tabLinks.index(this.$activeTabLink),0),this.$activeTabLink.length&&(this.$content=a(M.escapeHash(this.$activeTabLink[0].hash)),this.$content.addClass("active"))}},{key:"_setupSwipeableTabs",value:function(){var i=this;window.innerWidth>this.options.responsiveThreshold&&(this.options.swipeable=!1);var n=a();this.$tabLinks.each(function(t){var e=a(M.escapeHash(t.hash));e.addClass("carousel-item"),n=n.add(e)});var t=a('<div class="tabs-content carousel carousel-slider"></div>');n.first().before(t),t.append(n),n[0].style.display="";var e=this.$activeTabLink.closest(".tab").index();this._tabsCarousel=M.Carousel.init(t[0],{fullWidth:!0,noWrap:!0,onCycleTo:function(t){var e=i.index;i.index=a(t).index(),i.$activeTabLink.removeClass("active"),i.$activeTabLink=i.$tabLinks.eq(i.index),i.$activeTabLink.addClass("active"),i._animateIndicator(e),"function"==typeof i.options.onShow&&i.options.onShow.call(i,i.$content[0])}}),this._tabsCarousel.set(e)}},{key:"_teardownSwipeableTabs",value:function(){var t=this._tabsCarousel.$el;this._tabsCarousel.destroy(),t.after(t.children()),t.remove()}},{key:"_setupNormalTabs",value:function(){this.$tabLinks.not(this.$activeTabLink).each(function(t){if(t.hash){var e=a(M.escapeHash(t.hash));e.length&&(e[0].style.display="none")}})}},{key:"_teardownNormalTabs",value:function(){this.$tabLinks.each(function(t){if(t.hash){var e=a(M.escapeHash(t.hash));e.length&&(e[0].style.display="")}})}},{key:"_setTabsAndTabWidth",value:function(){this.tabsWidth=this.$el.width(),this.tabWidth=Math.max(this.tabsWidth,this.el.scrollWidth)/this.$tabLinks.length}},{key:"_calcRightPos",value:function(t){return Math.ceil(this.tabsWidth-t.position().left-t[0].getBoundingClientRect().width)}},{key:"_calcLeftPos",value:function(t){return Math.floor(t.position().left)}},{key:"updateTabIndicator",value:function(){this._setTabsAndTabWidth(),this._animateIndicator(this.index)}},{key:"_animateIndicator",value:function(t){var e=0,i=0;0<=this.index-t?e=90:i=90;var n={targets:this._indicator,left:{value:this._calcLeftPos(this.$activeTabLink),delay:e},right:{value:this._calcRightPos(this.$activeTabLink),delay:i},duration:this.options.duration,easing:"easeOutQuad"};s.remove(this._indicator),s(n)}},{key:"select",value:function(t){var e=this.$tabLinks.filter('[href="#'+t+'"]');e.length&&e.trigger("click")}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Tabs}},{key:"defaults",get:function(){return e}}]),n}();window.M.Tabs=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"tabs","M_Tabs")}(cash,M.anime),function(d,e){"use strict";var i={exitDelay:200,enterDelay:0,html:null,margin:5,inDuration:250,outDuration:200,position:"bottom",transitionMovement:10},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Tooltip=i).options=d.extend({},n.defaults,e),i.isOpen=!1,i.isHovered=!1,i.isFocused=!1,i._appendTooltipEl(),i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){d(this.tooltipEl).remove(),this._removeEventHandlers(),this.el.M_Tooltip=void 0}},{key:"_appendTooltipEl",value:function(){var t=document.createElement("div");t.classList.add("material-tooltip"),this.tooltipEl=t;var e=document.createElement("div");e.classList.add("tooltip-content"),e.innerHTML=this.options.html,t.appendChild(e),document.body.appendChild(t)}},{key:"_updateTooltipContent",value:function(){this.tooltipEl.querySelector(".tooltip-content").innerHTML=this.options.html}},{key:"_setupEventHandlers",value:function(){this._handleMouseEnterBound=this._handleMouseEnter.bind(this),this._handleMouseLeaveBound=this._handleMouseLeave.bind(this),this._handleFocusBound=this._handleFocus.bind(this),this._handleBlurBound=this._handleBlur.bind(this),this.el.addEventListener("mouseenter",this._handleMouseEnterBound),this.el.addEventListener("mouseleave",this._handleMouseLeaveBound),this.el.addEventListener("focus",this._handleFocusBound,!0),this.el.addEventListener("blur",this._handleBlurBound,!0)}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("mouseenter",this._handleMouseEnterBound),this.el.removeEventListener("mouseleave",this._handleMouseLeaveBound),this.el.removeEventListener("focus",this._handleFocusBound,!0),this.el.removeEventListener("blur",this._handleBlurBound,!0)}},{key:"open",value:function(t){this.isOpen||(t=void 0===t||void 0,this.isOpen=!0,this.options=d.extend({},this.options,this._getAttributeOptions()),this._updateTooltipContent(),this._setEnterDelayTimeout(t))}},{key:"close",value:function(){this.isOpen&&(this.isHovered=!1,this.isFocused=!1,this.isOpen=!1,this._setExitDelayTimeout())}},{key:"_setExitDelayTimeout",value:function(){var t=this;clearTimeout(this._exitDelayTimeout),this._exitDelayTimeout=setTimeout(function(){t.isHovered||t.isFocused||t._animateOut()},this.options.exitDelay)}},{key:"_setEnterDelayTimeout",value:function(t){var e=this;clearTimeout(this._enterDelayTimeout),this._enterDelayTimeout=setTimeout(function(){(e.isHovered||e.isFocused||t)&&e._animateIn()},this.options.enterDelay)}},{key:"_positionTooltip",value:function(){var t,e=this.el,i=this.tooltipEl,n=e.offsetHeight,s=e.offsetWidth,o=i.offsetHeight,a=i.offsetWidth,r=this.options.margin,l=void 0,h=void 0;this.xMovement=0,this.yMovement=0,l=e.getBoundingClientRect().top+M.getDocumentScrollTop(),h=e.getBoundingClientRect().left+M.getDocumentScrollLeft(),"top"===this.options.position?(l+=-o-r,h+=s/2-a/2,this.yMovement=-this.options.transitionMovement):"right"===this.options.position?(l+=n/2-o/2,h+=s+r,this.xMovement=this.options.transitionMovement):"left"===this.options.position?(l+=n/2-o/2,h+=-a-r,this.xMovement=-this.options.transitionMovement):(l+=n+r,h+=s/2-a/2,this.yMovement=this.options.transitionMovement),t=this._repositionWithinScreen(h,l,a,o),d(i).css({top:t.y+"px",left:t.x+"px"})}},{key:"_repositionWithinScreen",value:function(t,e,i,n){var s=M.getDocumentScrollLeft(),o=M.getDocumentScrollTop(),a=t-s,r=e-o,l={left:a,top:r,width:i,height:n},h=this.options.margin+this.options.transitionMovement,d=M.checkWithinContainer(document.body,l,h);return d.left?a=h:d.right&&(a-=a+i-window.innerWidth),d.top?r=h:d.bottom&&(r-=r+n-window.innerHeight),{x:a+s,y:r+o}}},{key:"_animateIn",value:function(){this._positionTooltip(),this.tooltipEl.style.visibility="visible",e.remove(this.tooltipEl),e({targets:this.tooltipEl,opacity:1,translateX:this.xMovement,translateY:this.yMovement,duration:this.options.inDuration,easing:"easeOutCubic"})}},{key:"_animateOut",value:function(){e.remove(this.tooltipEl),e({targets:this.tooltipEl,opacity:0,translateX:0,translateY:0,duration:this.options.outDuration,easing:"easeOutCubic"})}},{key:"_handleMouseEnter",value:function(){this.isHovered=!0,this.isFocused=!1,this.open(!1)}},{key:"_handleMouseLeave",value:function(){this.isHovered=!1,this.isFocused=!1,this.close()}},{key:"_handleFocus",value:function(){M.tabPressed&&(this.isFocused=!0,this.open(!1))}},{key:"_handleBlur",value:function(){this.isFocused=!1,this.close()}},{key:"_getAttributeOptions",value:function(){var t={},e=this.el.getAttribute("data-tooltip"),i=this.el.getAttribute("data-position");return e&&(t.html=e),i&&(t.position=i),t}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Tooltip}},{key:"defaults",get:function(){return i}}]),n}();M.Tooltip=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"tooltip","M_Tooltip")}(cash,M.anime),function(i){"use strict";var t=t||{},e=document.querySelectorAll.bind(document);function m(t){var e="";for(var i in t)t.hasOwnProperty(i)&&(e+=i+":"+t[i]+";");return e}var g={duration:750,show:function(t,e){if(2===t.button)return!1;var i=e||this,n=document.createElement("div");n.className="waves-ripple",i.appendChild(n);var s,o,a,r,l,h,d,u=(h={top:0,left:0},d=(s=i)&&s.ownerDocument,o=d.documentElement,void 0!==s.getBoundingClientRect&&(h=s.getBoundingClientRect()),a=null!==(l=r=d)&&l===l.window?r:9===r.nodeType&&r.defaultView,{top:h.top+a.pageYOffset-o.clientTop,left:h.left+a.pageXOffset-o.clientLeft}),c=t.pageY-u.top,p=t.pageX-u.left,v="scale("+i.clientWidth/100*10+")";"touches"in t&&(c=t.touches[0].pageY-u.top,p=t.touches[0].pageX-u.left),n.setAttribute("data-hold",Date.now()),n.setAttribute("data-scale",v),n.setAttribute("data-x",p),n.setAttribute("data-y",c);var f={top:c+"px",left:p+"px"};n.className=n.className+" waves-notransition",n.setAttribute("style",m(f)),n.className=n.className.replace("waves-notransition",""),f["-webkit-transform"]=v,f["-moz-transform"]=v,f["-ms-transform"]=v,f["-o-transform"]=v,f.transform=v,f.opacity="1",f["-webkit-transition-duration"]=g.duration+"ms",f["-moz-transition-duration"]=g.duration+"ms",f["-o-transition-duration"]=g.duration+"ms",f["transition-duration"]=g.duration+"ms",f["-webkit-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",f["-moz-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",f["-o-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",f["transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",n.setAttribute("style",m(f))},hide:function(t){l.touchup(t);var e=this,i=(e.clientWidth,null),n=e.getElementsByClassName("waves-ripple");if(!(0<n.length))return!1;var s=(i=n[n.length-1]).getAttribute("data-x"),o=i.getAttribute("data-y"),a=i.getAttribute("data-scale"),r=350-(Date.now()-Number(i.getAttribute("data-hold")));r<0&&(r=0),setTimeout(function(){var t={top:o+"px",left:s+"px",opacity:"0","-webkit-transition-duration":g.duration+"ms","-moz-transition-duration":g.duration+"ms","-o-transition-duration":g.duration+"ms","transition-duration":g.duration+"ms","-webkit-transform":a,"-moz-transform":a,"-ms-transform":a,"-o-transform":a,transform:a};i.setAttribute("style",m(t)),setTimeout(function(){try{e.removeChild(i)}catch(t){return!1}},g.duration)},r)},wrapInput:function(t){for(var e=0;e<t.length;e++){var i=t[e];if("input"===i.tagName.toLowerCase()){var n=i.parentNode;if("i"===n.tagName.toLowerCase()&&-1!==n.className.indexOf("waves-effect"))continue;var s=document.createElement("i");s.className=i.className+" waves-input-wrapper";var o=i.getAttribute("style");o||(o=""),s.setAttribute("style",o),i.className="waves-button-input",i.removeAttribute("style"),n.replaceChild(s,i),s.appendChild(i)}}}},l={touches:0,allowEvent:function(t){var e=!0;return"touchstart"===t.type?l.touches+=1:"touchend"===t.type||"touchcancel"===t.type?setTimeout(function(){0<l.touches&&(l.touches-=1)},500):"mousedown"===t.type&&0<l.touches&&(e=!1),e},touchup:function(t){l.allowEvent(t)}};function n(t){var e=function(t){if(!1===l.allowEvent(t))return null;for(var e=null,i=t.target||t.srcElement;null!==i.parentNode;){if(!(i instanceof SVGElement)&&-1!==i.className.indexOf("waves-effect")){e=i;break}i=i.parentNode}return e}(t);null!==e&&(g.show(t,e),"ontouchstart"in i&&(e.addEventListener("touchend",g.hide,!1),e.addEventListener("touchcancel",g.hide,!1)),e.addEventListener("mouseup",g.hide,!1),e.addEventListener("mouseleave",g.hide,!1),e.addEventListener("dragend",g.hide,!1))}t.displayEffect=function(t){"duration"in(t=t||{})&&(g.duration=t.duration),g.wrapInput(e(".waves-effect")),"ontouchstart"in i&&document.body.addEventListener("touchstart",n,!1),document.body.addEventListener("mousedown",n,!1)},t.attach=function(t){"input"===t.tagName.toLowerCase()&&(g.wrapInput([t]),t=t.parentNode),"ontouchstart"in i&&t.addEventListener("touchstart",n,!1),t.addEventListener("mousedown",n,!1)},i.Waves=t,document.addEventListener("DOMContentLoaded",function(){t.displayEffect()},!1)}(window),function(i,n){"use strict";var t={html:"",displayLength:4e3,inDuration:300,outDuration:375,classes:"",completeCallback:null,activationPercent:.8},e=function(){function s(t){_classCallCheck(this,s),this.options=i.extend({},s.defaults,t),this.message=this.options.html,this.panning=!1,this.timeRemaining=this.options.displayLength,0===s._toasts.length&&s._createContainer(),s._toasts.push(this);var e=this._createToast();(e.M_Toast=this).el=e,this.$el=i(e),this._animateIn(),this._setTimer()}return _createClass(s,[{key:"_createToast",value:function(){var t=document.createElement("div");return t.classList.add("toast"),this.options.classes.length&&i(t).addClass(this.options.classes),("object"==typeof HTMLElement?this.message instanceof HTMLElement:this.message&&"object"==typeof this.message&&null!==this.message&&1===this.message.nodeType&&"string"==typeof this.message.nodeName)?t.appendChild(this.message):this.message.jquery?i(t).append(this.message[0]):t.innerHTML=this.message,s._container.appendChild(t),t}},{key:"_animateIn",value:function(){n({targets:this.el,top:0,opacity:1,duration:this.options.inDuration,easing:"easeOutCubic"})}},{key:"_setTimer",value:function(){var t=this;this.timeRemaining!==1/0&&(this.counterInterval=setInterval(function(){t.panning||(t.timeRemaining-=20),t.timeRemaining<=0&&t.dismiss()},20))}},{key:"dismiss",value:function(){var t=this;window.clearInterval(this.counterInterval);var e=this.el.offsetWidth*this.options.activationPercent;this.wasSwiped&&(this.el.style.transition="transform .05s, opacity .05s",this.el.style.transform="translateX("+e+"px)",this.el.style.opacity=0),n({targets:this.el,opacity:0,marginTop:-40,duration:this.options.outDuration,easing:"easeOutExpo",complete:function(){"function"==typeof t.options.completeCallback&&t.options.completeCallback(),t.$el.remove(),s._toasts.splice(s._toasts.indexOf(t),1),0===s._toasts.length&&s._removeContainer()}})}}],[{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Toast}},{key:"_createContainer",value:function(){var t=document.createElement("div");t.setAttribute("id","toast-container"),t.addEventListener("touchstart",s._onDragStart),t.addEventListener("touchmove",s._onDragMove),t.addEventListener("touchend",s._onDragEnd),t.addEventListener("mousedown",s._onDragStart),document.addEventListener("mousemove",s._onDragMove),document.addEventListener("mouseup",s._onDragEnd),document.body.appendChild(t),s._container=t}},{key:"_removeContainer",value:function(){document.removeEventListener("mousemove",s._onDragMove),document.removeEventListener("mouseup",s._onDragEnd),i(s._container).remove(),s._container=null}},{key:"_onDragStart",value:function(t){if(t.target&&i(t.target).closest(".toast").length){var e=i(t.target).closest(".toast")[0].M_Toast;e.panning=!0,(s._draggedToast=e).el.classList.add("panning"),e.el.style.transition="",e.startingXPos=s._xPos(t),e.time=Date.now(),e.xPos=s._xPos(t)}}},{key:"_onDragMove",value:function(t){if(s._draggedToast){t.preventDefault();var e=s._draggedToast;e.deltaX=Math.abs(e.xPos-s._xPos(t)),e.xPos=s._xPos(t),e.velocityX=e.deltaX/(Date.now()-e.time),e.time=Date.now();var i=e.xPos-e.startingXPos,n=e.el.offsetWidth*e.options.activationPercent;e.el.style.transform="translateX("+i+"px)",e.el.style.opacity=1-Math.abs(i/n)}}},{key:"_onDragEnd",value:function(){if(s._draggedToast){var t=s._draggedToast;t.panning=!1,t.el.classList.remove("panning");var e=t.xPos-t.startingXPos,i=t.el.offsetWidth*t.options.activationPercent;Math.abs(e)>i||1<t.velocityX?(t.wasSwiped=!0,t.dismiss()):(t.el.style.transition="transform .2s, opacity .2s",t.el.style.transform="",t.el.style.opacity=""),s._draggedToast=null}}},{key:"_xPos",value:function(t){return t.targetTouches&&1<=t.targetTouches.length?t.targetTouches[0].clientX:t.clientX}},{key:"dismissAll",value:function(){for(var t in s._toasts)s._toasts[t].dismiss()}},{key:"defaults",get:function(){return t}}]),s}();e._toasts=[],e._container=null,e._draggedToast=null,M.Toast=e,M.toast=function(t){return new e(t)}}(cash,M.anime),function(s,o){"use strict";var e={edge:"left",draggable:!0,inDuration:250,outDuration:200,onOpenStart:null,onOpenEnd:null,onCloseStart:null,onCloseEnd:null,preventScrolling:!0},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Sidenav=i).id=i.$el.attr("id"),i.options=s.extend({},n.defaults,e),i.isOpen=!1,i.isFixed=i.el.classList.contains("sidenav-fixed"),i.isDragged=!1,i.lastWindowWidth=window.innerWidth,i.lastWindowHeight=window.innerHeight,i._createOverlay(),i._createDragTarget(),i._setupEventHandlers(),i._setupClasses(),i._setupFixed(),n._sidenavs.push(i),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this._enableBodyScrolling(),this._overlay.parentNode.removeChild(this._overlay),this.dragTarget.parentNode.removeChild(this.dragTarget),this.el.M_Sidenav=void 0,this.el.style.transform="";var t=n._sidenavs.indexOf(this);0<=t&&n._sidenavs.splice(t,1)}},{key:"_createOverlay",value:function(){var t=document.createElement("div");this._closeBound=this.close.bind(this),t.classList.add("sidenav-overlay"),t.addEventListener("click",this._closeBound),document.body.appendChild(t),this._overlay=t}},{key:"_setupEventHandlers",value:function(){0===n._sidenavs.length&&document.body.addEventListener("click",this._handleTriggerClick),this._handleDragTargetDragBound=this._handleDragTargetDrag.bind(this),this._handleDragTargetReleaseBound=this._handleDragTargetRelease.bind(this),this._handleCloseDragBound=this._handleCloseDrag.bind(this),this._handleCloseReleaseBound=this._handleCloseRelease.bind(this),this._handleCloseTriggerClickBound=this._handleCloseTriggerClick.bind(this),this.dragTarget.addEventListener("touchmove",this._handleDragTargetDragBound),this.dragTarget.addEventListener("touchend",this._handleDragTargetReleaseBound),this._overlay.addEventListener("touchmove",this._handleCloseDragBound),this._overlay.addEventListener("touchend",this._handleCloseReleaseBound),this.el.addEventListener("touchmove",this._handleCloseDragBound),this.el.addEventListener("touchend",this._handleCloseReleaseBound),this.el.addEventListener("click",this._handleCloseTriggerClickBound),this.isFixed&&(this._handleWindowResizeBound=this._handleWindowResize.bind(this),window.addEventListener("resize",this._handleWindowResizeBound))}},{key:"_removeEventHandlers",value:function(){1===n._sidenavs.length&&document.body.removeEventListener("click",this._handleTriggerClick),this.dragTarget.removeEventListener("touchmove",this._handleDragTargetDragBound),this.dragTarget.removeEventListener("touchend",this._handleDragTargetReleaseBound),this._overlay.removeEventListener("touchmove",this._handleCloseDragBound),this._overlay.removeEventListener("touchend",this._handleCloseReleaseBound),this.el.removeEventListener("touchmove",this._handleCloseDragBound),this.el.removeEventListener("touchend",this._handleCloseReleaseBound),this.el.removeEventListener("click",this._handleCloseTriggerClickBound),this.isFixed&&window.removeEventListener("resize",this._handleWindowResizeBound)}},{key:"_handleTriggerClick",value:function(t){var e=s(t.target).closest(".sidenav-trigger");if(t.target&&e.length){var i=M.getIdFromTrigger(e[0]),n=document.getElementById(i).M_Sidenav;n&&n.open(e),t.preventDefault()}}},{key:"_startDrag",value:function(t){var e=t.targetTouches[0].clientX;this.isDragged=!0,this._startingXpos=e,this._xPos=this._startingXpos,this._time=Date.now(),this._width=this.el.getBoundingClientRect().width,this._overlay.style.display="block",this._initialScrollTop=this.isOpen?this.el.scrollTop:M.getDocumentScrollTop(),this._verticallyScrolling=!1,o.remove(this.el),o.remove(this._overlay)}},{key:"_dragMoveUpdate",value:function(t){var e=t.targetTouches[0].clientX,i=this.isOpen?this.el.scrollTop:M.getDocumentScrollTop();this.deltaX=Math.abs(this._xPos-e),this._xPos=e,this.velocityX=this.deltaX/(Date.now()-this._time),this._time=Date.now(),this._initialScrollTop!==i&&(this._verticallyScrolling=!0)}},{key:"_handleDragTargetDrag",value:function(t){if(this.options.draggable&&!this._isCurrentlyFixed()&&!this._verticallyScrolling){this.isDragged||this._startDrag(t),this._dragMoveUpdate(t);var e=this._xPos-this._startingXpos,i=0<e?"right":"left";e=Math.min(this._width,Math.abs(e)),this.options.edge===i&&(e=0);var n=e,s="translateX(-100%)";"right"===this.options.edge&&(s="translateX(100%)",n=-n),this.percentOpen=Math.min(1,e/this._width),this.el.style.transform=s+" translateX("+n+"px)",this._overlay.style.opacity=this.percentOpen}}},{key:"_handleDragTargetRelease",value:function(){this.isDragged&&(.2<this.percentOpen?this.open():this._animateOut(),this.isDragged=!1,this._verticallyScrolling=!1)}},{key:"_handleCloseDrag",value:function(t){if(this.isOpen){if(!this.options.draggable||this._isCurrentlyFixed()||this._verticallyScrolling)return;this.isDragged||this._startDrag(t),this._dragMoveUpdate(t);var e=this._xPos-this._startingXpos,i=0<e?"right":"left";e=Math.min(this._width,Math.abs(e)),this.options.edge!==i&&(e=0);var n=-e;"right"===this.options.edge&&(n=-n),this.percentOpen=Math.min(1,1-e/this._width),this.el.style.transform="translateX("+n+"px)",this._overlay.style.opacity=this.percentOpen}}},{key:"_handleCloseRelease",value:function(){this.isOpen&&this.isDragged&&(.8<this.percentOpen?this._animateIn():this.close(),this.isDragged=!1,this._verticallyScrolling=!1)}},{key:"_handleCloseTriggerClick",value:function(t){s(t.target).closest(".sidenav-close").length&&!this._isCurrentlyFixed()&&this.close()}},{key:"_handleWindowResize",value:function(){this.lastWindowWidth!==window.innerWidth&&(992<window.innerWidth?this.open():this.close()),this.lastWindowWidth=window.innerWidth,this.lastWindowHeight=window.innerHeight}},{key:"_setupClasses",value:function(){"right"===this.options.edge&&(this.el.classList.add("right-aligned"),this.dragTarget.classList.add("right-aligned"))}},{key:"_removeClasses",value:function(){this.el.classList.remove("right-aligned"),this.dragTarget.classList.remove("right-aligned")}},{key:"_setupFixed",value:function(){this._isCurrentlyFixed()&&this.open()}},{key:"_isCurrentlyFixed",value:function(){return this.isFixed&&992<window.innerWidth}},{key:"_createDragTarget",value:function(){var t=document.createElement("div");t.classList.add("drag-target"),document.body.appendChild(t),this.dragTarget=t}},{key:"_preventBodyScrolling",value:function(){document.body.style.overflow="hidden"}},{key:"_enableBodyScrolling",value:function(){document.body.style.overflow=""}},{key:"open",value:function(){!0!==this.isOpen&&(this.isOpen=!0,"function"==typeof this.options.onOpenStart&&this.options.onOpenStart.call(this,this.el),this._isCurrentlyFixed()?(o.remove(this.el),o({targets:this.el,translateX:0,duration:0,easing:"easeOutQuad"}),this._enableBodyScrolling(),this._overlay.style.display="none"):(this.options.preventScrolling&&this._preventBodyScrolling(),this.isDragged&&1==this.percentOpen||this._animateIn()))}},{key:"close",value:function(){if(!1!==this.isOpen)if(this.isOpen=!1,"function"==typeof this.options.onCloseStart&&this.options.onCloseStart.call(this,this.el),this._isCurrentlyFixed()){var t="left"===this.options.edge?"-105%":"105%";this.el.style.transform="translateX("+t+")"}else this._enableBodyScrolling(),this.isDragged&&0==this.percentOpen?this._overlay.style.display="none":this._animateOut()}},{key:"_animateIn",value:function(){this._animateSidenavIn(),this._animateOverlayIn()}},{key:"_animateSidenavIn",value:function(){var t=this,e="left"===this.options.edge?-1:1;this.isDragged&&(e="left"===this.options.edge?e+this.percentOpen:e-this.percentOpen),o.remove(this.el),o({targets:this.el,translateX:[100*e+"%",0],duration:this.options.inDuration,easing:"easeOutQuad",complete:function(){"function"==typeof t.options.onOpenEnd&&t.options.onOpenEnd.call(t,t.el)}})}},{key:"_animateOverlayIn",value:function(){var t=0;this.isDragged?t=this.percentOpen:s(this._overlay).css({display:"block"}),o.remove(this._overlay),o({targets:this._overlay,opacity:[t,1],duration:this.options.inDuration,easing:"easeOutQuad"})}},{key:"_animateOut",value:function(){this._animateSidenavOut(),this._animateOverlayOut()}},{key:"_animateSidenavOut",value:function(){var t=this,e="left"===this.options.edge?-1:1,i=0;this.isDragged&&(i="left"===this.options.edge?e+this.percentOpen:e-this.percentOpen),o.remove(this.el),o({targets:this.el,translateX:[100*i+"%",105*e+"%"],duration:this.options.outDuration,easing:"easeOutQuad",complete:function(){"function"==typeof t.options.onCloseEnd&&t.options.onCloseEnd.call(t,t.el)}})}},{key:"_animateOverlayOut",value:function(){var t=this;o.remove(this._overlay),o({targets:this._overlay,opacity:0,duration:this.options.outDuration,easing:"easeOutQuad",complete:function(){s(t._overlay).css("display","none")}})}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Sidenav}},{key:"defaults",get:function(){return e}}]),n}();t._sidenavs=[],window.M.Sidenav=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"sidenav","M_Sidenav")}(cash,M.anime),function(o,a){"use strict";var e={throttle:100,scrollOffset:200,activeClass:"active",getActiveElement:function(t){return'a[href="#'+t+'"]'}},t=function(t){function c(t,e){_classCallCheck(this,c);var i=_possibleConstructorReturn(this,(c.__proto__||Object.getPrototypeOf(c)).call(this,c,t,e));return(i.el.M_ScrollSpy=i).options=o.extend({},c.defaults,e),c._elements.push(i),c._count++,c._increment++,i.tickId=-1,i.id=c._increment,i._setupEventHandlers(),i._handleWindowScroll(),i}return _inherits(c,Component),_createClass(c,[{key:"destroy",value:function(){c._elements.splice(c._elements.indexOf(this),1),c._elementsInView.splice(c._elementsInView.indexOf(this),1),c._visibleElements.splice(c._visibleElements.indexOf(this.$el),1),c._count--,this._removeEventHandlers(),o(this.options.getActiveElement(this.$el.attr("id"))).removeClass(this.options.activeClass),this.el.M_ScrollSpy=void 0}},{key:"_setupEventHandlers",value:function(){var t=M.throttle(this._handleWindowScroll,200);this._handleThrottledResizeBound=t.bind(this),this._handleWindowScrollBound=this._handleWindowScroll.bind(this),1===c._count&&(window.addEventListener("scroll",this._handleWindowScrollBound),window.addEventListener("resize",this._handleThrottledResizeBound),document.body.addEventListener("click",this._handleTriggerClick))}},{key:"_removeEventHandlers",value:function(){0===c._count&&(window.removeEventListener("scroll",this._handleWindowScrollBound),window.removeEventListener("resize",this._handleThrottledResizeBound),document.body.removeEventListener("click",this._handleTriggerClick))}},{key:"_handleTriggerClick",value:function(t){for(var e=o(t.target),i=c._elements.length-1;0<=i;i--){var n=c._elements[i];if(e.is('a[href="#'+n.$el.attr("id")+'"]')){t.preventDefault();var s=n.$el.offset().top+1;a({targets:[document.documentElement,document.body],scrollTop:s-n.options.scrollOffset,duration:400,easing:"easeOutCubic"});break}}}},{key:"_handleWindowScroll",value:function(){c._ticks++;for(var t=M.getDocumentScrollTop(),e=M.getDocumentScrollLeft(),i=e+window.innerWidth,n=t+window.innerHeight,s=c._findElements(t,i,n,e),o=0;o<s.length;o++){var a=s[o];a.tickId<0&&a._enter(),a.tickId=c._ticks}for(var r=0;r<c._elementsInView.length;r++){var l=c._elementsInView[r],h=l.tickId;0<=h&&h!==c._ticks&&(l._exit(),l.tickId=-1)}c._elementsInView=s}},{key:"_enter",value:function(){(c._visibleElements=c._visibleElements.filter(function(t){return 0!=t.height()}))[0]?(o(this.options.getActiveElement(c._visibleElements[0].attr("id"))).removeClass(this.options.activeClass),c._visibleElements[0][0].M_ScrollSpy&&this.id<c._visibleElements[0][0].M_ScrollSpy.id?c._visibleElements.unshift(this.$el):c._visibleElements.push(this.$el)):c._visibleElements.push(this.$el),o(this.options.getActiveElement(c._visibleElements[0].attr("id"))).addClass(this.options.activeClass)}},{key:"_exit",value:function(){var e=this;(c._visibleElements=c._visibleElements.filter(function(t){return 0!=t.height()}))[0]&&(o(this.options.getActiveElement(c._visibleElements[0].attr("id"))).removeClass(this.options.activeClass),(c._visibleElements=c._visibleElements.filter(function(t){return t.attr("id")!=e.$el.attr("id")}))[0]&&o(this.options.getActiveElement(c._visibleElements[0].attr("id"))).addClass(this.options.activeClass))}}],[{key:"init",value:function(t,e){return _get(c.__proto__||Object.getPrototypeOf(c),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_ScrollSpy}},{key:"_findElements",value:function(t,e,i,n){for(var s=[],o=0;o<c._elements.length;o++){var a=c._elements[o],r=t+a.options.scrollOffset||200;if(0<a.$el.height()){var l=a.$el.offset().top,h=a.$el.offset().left,d=h+a.$el.width(),u=l+a.$el.height();!(e<h||d<n||i<l||u<r)&&s.push(a)}}return s}},{key:"defaults",get:function(){return e}}]),c}();t._elements=[],t._elementsInView=[],t._visibleElements=[],t._count=0,t._increment=0,t._ticks=0,M.ScrollSpy=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"scrollSpy","M_ScrollSpy")}(cash,M.anime),function(h){"use strict";var e={data:{},limit:1/0,onAutocomplete:null,minLength:1,sortFunction:function(t,e,i){return t.indexOf(i)-e.indexOf(i)}},t=function(t){function s(t,e){_classCallCheck(this,s);var i=_possibleConstructorReturn(this,(s.__proto__||Object.getPrototypeOf(s)).call(this,s,t,e));return(i.el.M_Autocomplete=i).options=h.extend({},s.defaults,e),i.isOpen=!1,i.count=0,i.activeIndex=-1,i.oldVal,i.$inputField=i.$el.closest(".input-field"),i.$active=h(),i._mousedown=!1,i._setupDropdown(),i._setupEventHandlers(),i}return _inherits(s,Component),_createClass(s,[{key:"destroy",value:function(){this._removeEventHandlers(),this._removeDropdown(),this.el.M_Autocomplete=void 0}},{key:"_setupEventHandlers",value:function(){this._handleInputBlurBound=this._handleInputBlur.bind(this),this._handleInputKeyupAndFocusBound=this._handleInputKeyupAndFocus.bind(this),this._handleInputKeydownBound=this._handleInputKeydown.bind(this),this._handleInputClickBound=this._handleInputClick.bind(this),this._handleContainerMousedownAndTouchstartBound=this._handleContainerMousedownAndTouchstart.bind(this),this._handleContainerMouseupAndTouchendBound=this._handleContainerMouseupAndTouchend.bind(this),this.el.addEventListener("blur",this._handleInputBlurBound),this.el.addEventListener("keyup",this._handleInputKeyupAndFocusBound),this.el.addEventListener("focus",this._handleInputKeyupAndFocusBound),this.el.addEventListener("keydown",this._handleInputKeydownBound),this.el.addEventListener("click",this._handleInputClickBound),this.container.addEventListener("mousedown",this._handleContainerMousedownAndTouchstartBound),this.container.addEventListener("mouseup",this._handleContainerMouseupAndTouchendBound),void 0!==window.ontouchstart&&(this.container.addEventListener("touchstart",this._handleContainerMousedownAndTouchstartBound),this.container.addEventListener("touchend",this._handleContainerMouseupAndTouchendBound))}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("blur",this._handleInputBlurBound),this.el.removeEventListener("keyup",this._handleInputKeyupAndFocusBound),this.el.removeEventListener("focus",this._handleInputKeyupAndFocusBound),this.el.removeEventListener("keydown",this._handleInputKeydownBound),this.el.removeEventListener("click",this._handleInputClickBound),this.container.removeEventListener("mousedown",this._handleContainerMousedownAndTouchstartBound),this.container.removeEventListener("mouseup",this._handleContainerMouseupAndTouchendBound),void 0!==window.ontouchstart&&(this.container.removeEventListener("touchstart",this._handleContainerMousedownAndTouchstartBound),this.container.removeEventListener("touchend",this._handleContainerMouseupAndTouchendBound))}},{key:"_setupDropdown",value:function(){var e=this;this.container=document.createElement("ul"),this.container.id="autocomplete-options-"+M.guid(),h(this.container).addClass("autocomplete-content dropdown-content"),this.$inputField.append(this.container),this.el.setAttribute("data-target",this.container.id),this.dropdown=M.Dropdown.init(this.el,{autoFocus:!1,closeOnClick:!1,coverTrigger:!1,onItemClick:function(t){e.selectOption(h(t))}}),this.el.removeEventListener("click",this.dropdown._handleClickBound)}},{key:"_removeDropdown",value:function(){this.container.parentNode.removeChild(this.container)}},{key:"_handleInputBlur",value:function(){this._mousedown||(this.close(),this._resetAutocomplete())}},{key:"_handleInputKeyupAndFocus",value:function(t){"keyup"===t.type&&(s._keydown=!1),this.count=0;var e=this.el.value.toLowerCase();13!==t.keyCode&&38!==t.keyCode&&40!==t.keyCode&&(this.oldVal===e||!M.tabPressed&&"focus"===t.type||this.open(),this.oldVal=e)}},{key:"_handleInputKeydown",value:function(t){s._keydown=!0;var e=t.keyCode,i=void 0,n=h(this.container).children("li").length;e===M.keys.ENTER&&0<=this.activeIndex?(i=h(this.container).children("li").eq(this.activeIndex)).length&&(this.selectOption(i),t.preventDefault()):e!==M.keys.ARROW_UP&&e!==M.keys.ARROW_DOWN||(t.preventDefault(),e===M.keys.ARROW_UP&&0<this.activeIndex&&this.activeIndex--,e===M.keys.ARROW_DOWN&&this.activeIndex<n-1&&this.activeIndex++,this.$active.removeClass("active"),0<=this.activeIndex&&(this.$active=h(this.container).children("li").eq(this.activeIndex),this.$active.addClass("active")))}},{key:"_handleInputClick",value:function(t){this.open()}},{key:"_handleContainerMousedownAndTouchstart",value:function(t){this._mousedown=!0}},{key:"_handleContainerMouseupAndTouchend",value:function(t){this._mousedown=!1}},{key:"_highlight",value:function(t,e){var i=e.find("img"),n=e.text().toLowerCase().indexOf(""+t.toLowerCase()),s=n+t.length-1,o=e.text().slice(0,n),a=e.text().slice(n,s+1),r=e.text().slice(s+1);e.html("<span>"+o+"<span class='highlight'>"+a+"</span>"+r+"</span>"),i.length&&e.prepend(i)}},{key:"_resetCurrentElement",value:function(){this.activeIndex=-1,this.$active.removeClass("active")}},{key:"_resetAutocomplete",value:function(){h(this.container).empty(),this._resetCurrentElement(),this.oldVal=null,this.isOpen=!1,this._mousedown=!1}},{key:"selectOption",value:function(t){var e=t.text().trim();this.el.value=e,this.$el.trigger("change"),this._resetAutocomplete(),this.close(),"function"==typeof this.options.onAutocomplete&&this.options.onAutocomplete.call(this,e)}},{key:"_renderDropdown",value:function(t,i){var n=this;this._resetAutocomplete();var e=[];for(var s in t)if(t.hasOwnProperty(s)&&-1!==s.toLowerCase().indexOf(i)){if(this.count>=this.options.limit)break;var o={data:t[s],key:s};e.push(o),this.count++}if(this.options.sortFunction){e.sort(function(t,e){return n.options.sortFunction(t.key.toLowerCase(),e.key.toLowerCase(),i.toLowerCase())})}for(var a=0;a<e.length;a++){var r=e[a],l=h("<li></li>");r.data?l.append('<img src="'+r.data+'" class="right circle"><span>'+r.key+"</span>"):l.append("<span>"+r.key+"</span>"),h(this.container).append(l),this._highlight(i,l)}}},{key:"open",value:function(){var t=this.el.value.toLowerCase();this._resetAutocomplete(),t.length>=this.options.minLength&&(this.isOpen=!0,this._renderDropdown(this.options.data,t)),this.dropdown.isOpen?this.dropdown.recalculateDimensions():this.dropdown.open()}},{key:"close",value:function(){this.dropdown.close()}},{key:"updateData",value:function(t){var e=this.el.value.toLowerCase();this.options.data=t,this.isOpen&&this._renderDropdown(t,e)}}],[{key:"init",value:function(t,e){return _get(s.__proto__||Object.getPrototypeOf(s),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Autocomplete}},{key:"defaults",get:function(){return e}}]),s}();t._keydown=!1,M.Autocomplete=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"autocomplete","M_Autocomplete")}(cash),function(d){M.updateTextFields=function(){d("input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea").each(function(t,e){var i=d(this);0<t.value.length||d(t).is(":focus")||t.autofocus||null!==i.attr("placeholder")?i.siblings("label").addClass("active"):t.validity?i.siblings("label").toggleClass("active",!0===t.validity.badInput):i.siblings("label").removeClass("active")})},M.validate_field=function(t){var e=null!==t.attr("data-length"),i=parseInt(t.attr("data-length")),n=t[0].value.length;0!==n||!1!==t[0].validity.badInput||t.is(":required")?t.hasClass("validate")&&(t.is(":valid")&&e&&n<=i||t.is(":valid")&&!e?(t.removeClass("invalid"),t.addClass("valid")):(t.removeClass("valid"),t.addClass("invalid"))):t.hasClass("validate")&&(t.removeClass("valid"),t.removeClass("invalid"))},M.textareaAutoResize=function(t){if(t instanceof Element&&(t=d(t)),t.length){var e=d(".hiddendiv").first();e.length||(e=d('<div class="hiddendiv common"></div>'),d("body").append(e));var i=t.css("font-family"),n=t.css("font-size"),s=t.css("line-height"),o=t.css("padding-top"),a=t.css("padding-right"),r=t.css("padding-bottom"),l=t.css("padding-left");n&&e.css("font-size",n),i&&e.css("font-family",i),s&&e.css("line-height",s),o&&e.css("padding-top",o),a&&e.css("padding-right",a),r&&e.css("padding-bottom",r),l&&e.css("padding-left",l),t.data("original-height")||t.data("original-height",t.height()),"off"===t.attr("wrap")&&e.css("overflow-wrap","normal").css("white-space","pre"),e.text(t[0].value+"\n");var h=e.html().replace(/\n/g,"<br>");e.html(h),0<t[0].offsetWidth&&0<t[0].offsetHeight?e.css("width",t.width()+"px"):e.css("width",window.innerWidth/2+"px"),t.data("original-height")<=e.innerHeight()?t.css("height",e.innerHeight()+"px"):t[0].value.length<t.data("previous-length")&&t.css("height",t.data("original-height")+"px"),t.data("previous-length",t[0].value.length)}else console.error("No textarea element found")},d(document).ready(function(){var n="input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea";d(document).on("change",n,function(){0===this.value.length&&null===d(this).attr("placeholder")||d(this).siblings("label").addClass("active"),M.validate_field(d(this))}),d(document).ready(function(){M.updateTextFields()}),d(document).on("reset",function(t){var e=d(t.target);e.is("form")&&(e.find(n).removeClass("valid").removeClass("invalid"),e.find(n).each(function(t){this.value.length&&d(this).siblings("label").removeClass("active")}),setTimeout(function(){e.find("select").each(function(){this.M_FormSelect&&d(this).trigger("change")})},0))}),document.addEventListener("focus",function(t){d(t.target).is(n)&&d(t.target).siblings("label, .prefix").addClass("active")},!0),document.addEventListener("blur",function(t){var e=d(t.target);if(e.is(n)){var i=".prefix";0===e[0].value.length&&!0!==e[0].validity.badInput&&null===e.attr("placeholder")&&(i+=", label"),e.siblings(i).removeClass("active"),M.validate_field(e)}},!0);d(document).on("keyup","input[type=radio], input[type=checkbox]",function(t){if(t.which===M.keys.TAB)return d(this).addClass("tabbed"),void d(this).one("blur",function(t){d(this).removeClass("tabbed")})});var t=".materialize-textarea";d(t).each(function(){var t=d(this);t.data("original-height",t.height()),t.data("previous-length",this.value.length),M.textareaAutoResize(t)}),d(document).on("keyup",t,function(){M.textareaAutoResize(d(this))}),d(document).on("keydown",t,function(){M.textareaAutoResize(d(this))}),d(document).on("change",'.file-field input[type="file"]',function(){for(var t=d(this).closest(".file-field").find("input.file-path"),e=d(this)[0].files,i=[],n=0;n<e.length;n++)i.push(e[n].name);t[0].value=i.join(", "),t.trigger("change")})})}(cash),function(s,o){"use strict";var e={indicators:!0,height:400,duration:500,interval:6e3},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Slider=i).options=s.extend({},n.defaults,e),i.$slider=i.$el.find(".slides"),i.$slides=i.$slider.children("li"),i.activeIndex=i.$slides.filter(function(t){return s(t).hasClass("active")}).first().index(),-1!=i.activeIndex&&(i.$active=i.$slides.eq(i.activeIndex)),i._setSliderHeight(),i.$slides.find(".caption").each(function(t){i._animateCaptionIn(t,0)}),i.$slides.find("img").each(function(t){var e="data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";s(t).attr("src")!==e&&(s(t).css("background-image",'url("'+s(t).attr("src")+'")'),s(t).attr("src",e))}),i._setupIndicators(),i.$active?i.$active.css("display","block"):(i.$slides.first().addClass("active"),o({targets:i.$slides.first()[0],opacity:1,duration:i.options.duration,easing:"easeOutQuad"}),i.activeIndex=0,i.$active=i.$slides.eq(i.activeIndex),i.options.indicators&&i.$indicators.eq(i.activeIndex).addClass("active")),i.$active.find("img").each(function(t){o({targets:i.$active.find(".caption")[0],opacity:1,translateX:0,translateY:0,duration:i.options.duration,easing:"easeOutQuad"})}),i._setupEventHandlers(),i.start(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this.pause(),this._removeIndicators(),this._removeEventHandlers(),this.el.M_Slider=void 0}},{key:"_setupEventHandlers",value:function(){var e=this;this._handleIntervalBound=this._handleInterval.bind(this),this._handleIndicatorClickBound=this._handleIndicatorClick.bind(this),this.options.indicators&&this.$indicators.each(function(t){t.addEventListener("click",e._handleIndicatorClickBound)})}},{key:"_removeEventHandlers",value:function(){var e=this;this.options.indicators&&this.$indicators.each(function(t){t.removeEventListener("click",e._handleIndicatorClickBound)})}},{key:"_handleIndicatorClick",value:function(t){var e=s(t.target).index();this.set(e)}},{key:"_handleInterval",value:function(){var t=this.$slider.find(".active").index();this.$slides.length===t+1?t=0:t+=1,this.set(t)}},{key:"_animateCaptionIn",value:function(t,e){var i={targets:t,opacity:0,duration:e,easing:"easeOutQuad"};s(t).hasClass("center-align")?i.translateY=-100:s(t).hasClass("right-align")?i.translateX=100:s(t).hasClass("left-align")&&(i.translateX=-100),o(i)}},{key:"_setSliderHeight",value:function(){this.$el.hasClass("fullscreen")||(this.options.indicators?this.$el.css("height",this.options.height+40+"px"):this.$el.css("height",this.options.height+"px"),this.$slider.css("height",this.options.height+"px"))}},{key:"_setupIndicators",value:function(){var n=this;this.options.indicators&&(this.$indicators=s('<ul class="indicators"></ul>'),this.$slides.each(function(t,e){var i=s('<li class="indicator-item"></li>');n.$indicators.append(i[0])}),this.$el.append(this.$indicators[0]),this.$indicators=this.$indicators.children("li.indicator-item"))}},{key:"_removeIndicators",value:function(){this.$el.find("ul.indicators").remove()}},{key:"set",value:function(t){var e=this;if(t>=this.$slides.length?t=0:t<0&&(t=this.$slides.length-1),this.activeIndex!=t){this.$active=this.$slides.eq(this.activeIndex);var i=this.$active.find(".caption");this.$active.removeClass("active"),o({targets:this.$active[0],opacity:0,duration:this.options.duration,easing:"easeOutQuad",complete:function(){e.$slides.not(".active").each(function(t){o({targets:t,opacity:0,translateX:0,translateY:0,duration:0,easing:"easeOutQuad"})})}}),this._animateCaptionIn(i[0],this.options.duration),this.options.indicators&&(this.$indicators.eq(this.activeIndex).removeClass("active"),this.$indicators.eq(t).addClass("active")),o({targets:this.$slides.eq(t)[0],opacity:1,duration:this.options.duration,easing:"easeOutQuad"}),o({targets:this.$slides.eq(t).find(".caption")[0],opacity:1,translateX:0,translateY:0,duration:this.options.duration,delay:this.options.duration,easing:"easeOutQuad"}),this.$slides.eq(t).addClass("active"),this.activeIndex=t,this.start()}}},{key:"pause",value:function(){clearInterval(this.interval)}},{key:"start",value:function(){clearInterval(this.interval),this.interval=setInterval(this._handleIntervalBound,this.options.duration+this.options.interval)}},{key:"next",value:function(){var t=this.activeIndex+1;t>=this.$slides.length?t=0:t<0&&(t=this.$slides.length-1),this.set(t)}},{key:"prev",value:function(){var t=this.activeIndex-1;t>=this.$slides.length?t=0:t<0&&(t=this.$slides.length-1),this.set(t)}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Slider}},{key:"defaults",get:function(){return e}}]),n}();M.Slider=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"slider","M_Slider")}(cash,M.anime),function(n,s){n(document).on("click",".card",function(t){if(n(this).children(".card-reveal").length){var i=n(t.target).closest(".card");void 0===i.data("initialOverflow")&&i.data("initialOverflow",void 0===i.css("overflow")?"":i.css("overflow"));var e=n(this).find(".card-reveal");n(t.target).is(n(".card-reveal .card-title"))||n(t.target).is(n(".card-reveal .card-title i"))?s({targets:e[0],translateY:0,duration:225,easing:"easeInOutQuad",complete:function(t){var e=t.animatables[0].target;n(e).css({display:"none"}),i.css("overflow",i.data("initialOverflow"))}}):(n(t.target).is(n(".card .activator"))||n(t.target).is(n(".card .activator i")))&&(i.css("overflow","hidden"),e.css({display:"block"}),s({targets:e[0],translateY:"-100%",duration:300,easing:"easeInOutQuad"}))}})}(cash,M.anime),function(h){"use strict";var e={data:[],placeholder:"",secondaryPlaceholder:"",autocompleteOptions:{},limit:1/0,onChipAdd:null,onChipSelect:null,onChipDelete:null},t=function(t){function l(t,e){_classCallCheck(this,l);var i=_possibleConstructorReturn(this,(l.__proto__||Object.getPrototypeOf(l)).call(this,l,t,e));return(i.el.M_Chips=i).options=h.extend({},l.defaults,e),i.$el.addClass("chips input-field"),i.chipsData=[],i.$chips=h(),i._setupInput(),i.hasAutocomplete=0<Object.keys(i.options.autocompleteOptions).length,i.$input.attr("id")||i.$input.attr("id",M.guid()),i.options.data.length&&(i.chipsData=i.options.data,i._renderChips(i.chipsData)),i.hasAutocomplete&&i._setupAutocomplete(),i._setPlaceholder(),i._setupLabel(),i._setupEventHandlers(),i}return _inherits(l,Component),_createClass(l,[{key:"getData",value:function(){return this.chipsData}},{key:"destroy",value:function(){this._removeEventHandlers(),this.$chips.remove(),this.el.M_Chips=void 0}},{key:"_setupEventHandlers",value:function(){this._handleChipClickBound=this._handleChipClick.bind(this),this._handleInputKeydownBound=this._handleInputKeydown.bind(this),this._handleInputFocusBound=this._handleInputFocus.bind(this),this._handleInputBlurBound=this._handleInputBlur.bind(this),this.el.addEventListener("click",this._handleChipClickBound),document.addEventListener("keydown",l._handleChipsKeydown),document.addEventListener("keyup",l._handleChipsKeyup),this.el.addEventListener("blur",l._handleChipsBlur,!0),this.$input[0].addEventListener("focus",this._handleInputFocusBound),this.$input[0].addEventListener("blur",this._handleInputBlurBound),this.$input[0].addEventListener("keydown",this._handleInputKeydownBound)}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("click",this._handleChipClickBound),document.removeEventListener("keydown",l._handleChipsKeydown),document.removeEventListener("keyup",l._handleChipsKeyup),this.el.removeEventListener("blur",l._handleChipsBlur,!0),this.$input[0].removeEventListener("focus",this._handleInputFocusBound),this.$input[0].removeEventListener("blur",this._handleInputBlurBound),this.$input[0].removeEventListener("keydown",this._handleInputKeydownBound)}},{key:"_handleChipClick",value:function(t){var e=h(t.target).closest(".chip"),i=h(t.target).is(".close");if(e.length){var n=e.index();i?(this.deleteChip(n),this.$input[0].focus()):this.selectChip(n)}else this.$input[0].focus()}},{key:"_handleInputFocus",value:function(){this.$el.addClass("focus")}},{key:"_handleInputBlur",value:function(){this.$el.removeClass("focus")}},{key:"_handleInputKeydown",value:function(t){if(l._keydown=!0,13===t.keyCode){if(this.hasAutocomplete&&this.autocomplete&&this.autocomplete.isOpen)return;t.preventDefault(),this.addChip({tag:this.$input[0].value}),this.$input[0].value=""}else 8!==t.keyCode&&37!==t.keyCode||""!==this.$input[0].value||!this.chipsData.length||(t.preventDefault(),this.selectChip(this.chipsData.length-1))}},{key:"_renderChip",value:function(t){if(t.tag){var e=document.createElement("div"),i=document.createElement("i");if(e.classList.add("chip"),e.textContent=t.tag,e.setAttribute("tabindex",0),h(i).addClass("material-icons close"),i.textContent="close",t.image){var n=document.createElement("img");n.setAttribute("src",t.image),e.insertBefore(n,e.firstChild)}return e.appendChild(i),e}}},{key:"_renderChips",value:function(){this.$chips.remove();for(var t=0;t<this.chipsData.length;t++){var e=this._renderChip(this.chipsData[t]);this.$el.append(e),this.$chips.add(e)}this.$el.append(this.$input[0])}},{key:"_setupAutocomplete",value:function(){var e=this;this.options.autocompleteOptions.onAutocomplete=function(t){e.addChip({tag:t}),e.$input[0].value="",e.$input[0].focus()},this.autocomplete=M.Autocomplete.init(this.$input[0],this.options.autocompleteOptions)}},{key:"_setupInput",value:function(){this.$input=this.$el.find("input"),this.$input.length||(this.$input=h("<input></input>"),this.$el.append(this.$input)),this.$input.addClass("input")}},{key:"_setupLabel",value:function(){this.$label=this.$el.find("label"),this.$label.length&&this.$label.setAttribute("for",this.$input.attr("id"))}},{key:"_setPlaceholder",value:function(){void 0!==this.chipsData&&!this.chipsData.length&&this.options.placeholder?h(this.$input).prop("placeholder",this.options.placeholder):(void 0===this.chipsData||this.chipsData.length)&&this.options.secondaryPlaceholder&&h(this.$input).prop("placeholder",this.options.secondaryPlaceholder)}},{key:"_isValid",value:function(t){if(t.hasOwnProperty("tag")&&""!==t.tag){for(var e=!1,i=0;i<this.chipsData.length;i++)if(this.chipsData[i].tag===t.tag){e=!0;break}return!e}return!1}},{key:"addChip",value:function(t){if(this._isValid(t)&&!(this.chipsData.length>=this.options.limit)){var e=this._renderChip(t);this.$chips.add(e),this.chipsData.push(t),h(this.$input).before(e),this._setPlaceholder(),"function"==typeof this.options.onChipAdd&&this.options.onChipAdd.call(this,this.$el,e)}}},{key:"deleteChip",value:function(t){var e=this.$chips.eq(t);this.$chips.eq(t).remove(),this.$chips=this.$chips.filter(function(t){return 0<=h(t).index()}),this.chipsData.splice(t,1),this._setPlaceholder(),"function"==typeof this.options.onChipDelete&&this.options.onChipDelete.call(this,this.$el,e[0])}},{key:"selectChip",value:function(t){var e=this.$chips.eq(t);(this._selectedChip=e)[0].focus(),"function"==typeof this.options.onChipSelect&&this.options.onChipSelect.call(this,this.$el,e[0])}}],[{key:"init",value:function(t,e){return _get(l.__proto__||Object.getPrototypeOf(l),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Chips}},{key:"_handleChipsKeydown",value:function(t){l._keydown=!0;var e=h(t.target).closest(".chips"),i=t.target&&e.length;if(!h(t.target).is("input, textarea")&&i){var n=e[0].M_Chips;if(8===t.keyCode||46===t.keyCode){t.preventDefault();var s=n.chipsData.length;if(n._selectedChip){var o=n._selectedChip.index();n.deleteChip(o),n._selectedChip=null,s=Math.max(o-1,0)}n.chipsData.length&&n.selectChip(s)}else if(37===t.keyCode){if(n._selectedChip){var a=n._selectedChip.index()-1;if(a<0)return;n.selectChip(a)}}else if(39===t.keyCode&&n._selectedChip){var r=n._selectedChip.index()+1;r>=n.chipsData.length?n.$input[0].focus():n.selectChip(r)}}}},{key:"_handleChipsKeyup",value:function(t){l._keydown=!1}},{key:"_handleChipsBlur",value:function(t){l._keydown||(h(t.target).closest(".chips")[0].M_Chips._selectedChip=null)}},{key:"defaults",get:function(){return e}}]),l}();t._keydown=!1,M.Chips=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"chips","M_Chips"),h(document).ready(function(){h(document.body).on("click",".chip .close",function(){var t=h(this).closest(".chips");t.length&&t[0].M_Chips||h(this).closest(".chip").remove()})})}(cash),function(s){"use strict";var e={top:0,bottom:1/0,offset:0,onPositionChange:null},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Pushpin=i).options=s.extend({},n.defaults,e),i.originalOffset=i.el.offsetTop,n._pushpins.push(i),i._setupEventHandlers(),i._updatePosition(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this.el.style.top=null,this._removePinClasses(),this._removeEventHandlers();var t=n._pushpins.indexOf(this);n._pushpins.splice(t,1)}},{key:"_setupEventHandlers",value:function(){document.addEventListener("scroll",n._updateElements)}},{key:"_removeEventHandlers",value:function(){document.removeEventListener("scroll",n._updateElements)}},{key:"_updatePosition",value:function(){var t=M.getDocumentScrollTop()+this.options.offset;this.options.top<=t&&this.options.bottom>=t&&!this.el.classList.contains("pinned")&&(this._removePinClasses(),this.el.style.top=this.options.offset+"px",this.el.classList.add("pinned"),"function"==typeof this.options.onPositionChange&&this.options.onPositionChange.call(this,"pinned")),t<this.options.top&&!this.el.classList.contains("pin-top")&&(this._removePinClasses(),this.el.style.top=0,this.el.classList.add("pin-top"),"function"==typeof this.options.onPositionChange&&this.options.onPositionChange.call(this,"pin-top")),t>this.options.bottom&&!this.el.classList.contains("pin-bottom")&&(this._removePinClasses(),this.el.classList.add("pin-bottom"),this.el.style.top=this.options.bottom-this.originalOffset+"px","function"==typeof this.options.onPositionChange&&this.options.onPositionChange.call(this,"pin-bottom"))}},{key:"_removePinClasses",value:function(){this.el.classList.remove("pin-top"),this.el.classList.remove("pinned"),this.el.classList.remove("pin-bottom")}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Pushpin}},{key:"_updateElements",value:function(){for(var t in n._pushpins){n._pushpins[t]._updatePosition()}}},{key:"defaults",get:function(){return e}}]),n}();t._pushpins=[],M.Pushpin=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"pushpin","M_Pushpin")}(cash),function(r,s){"use strict";var e={direction:"top",hoverEnabled:!0,toolbarEnabled:!1};r.fn.reverse=[].reverse;var t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_FloatingActionButton=i).options=r.extend({},n.defaults,e),i.isOpen=!1,i.$anchor=i.$el.children("a").first(),i.$menu=i.$el.children("ul").first(),i.$floatingBtns=i.$el.find("ul .btn-floating"),i.$floatingBtnsReverse=i.$el.find("ul .btn-floating").reverse(),i.offsetY=0,i.offsetX=0,i.$el.addClass("direction-"+i.options.direction),"top"===i.options.direction?i.offsetY=40:"right"===i.options.direction?i.offsetX=-40:"bottom"===i.options.direction?i.offsetY=-40:i.offsetX=40,i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this.el.M_FloatingActionButton=void 0}},{key:"_setupEventHandlers",value:function(){this._handleFABClickBound=this._handleFABClick.bind(this),this._handleOpenBound=this.open.bind(this),this._handleCloseBound=this.close.bind(this),this.options.hoverEnabled&&!this.options.toolbarEnabled?(this.el.addEventListener("mouseenter",this._handleOpenBound),this.el.addEventListener("mouseleave",this._handleCloseBound)):this.el.addEventListener("click",this._handleFABClickBound)}},{key:"_removeEventHandlers",value:function(){this.options.hoverEnabled&&!this.options.toolbarEnabled?(this.el.removeEventListener("mouseenter",this._handleOpenBound),this.el.removeEventListener("mouseleave",this._handleCloseBound)):this.el.removeEventListener("click",this._handleFABClickBound)}},{key:"_handleFABClick",value:function(){this.isOpen?this.close():this.open()}},{key:"_handleDocumentClick",value:function(t){r(t.target).closest(this.$menu).length||this.close()}},{key:"open",value:function(){this.isOpen||(this.options.toolbarEnabled?this._animateInToolbar():this._animateInFAB(),this.isOpen=!0)}},{key:"close",value:function(){this.isOpen&&(this.options.toolbarEnabled?(window.removeEventListener("scroll",this._handleCloseBound,!0),document.body.removeEventListener("click",this._handleDocumentClickBound,!0),this._animateOutToolbar()):this._animateOutFAB(),this.isOpen=!1)}},{key:"_animateInFAB",value:function(){var e=this;this.$el.addClass("active");var i=0;this.$floatingBtnsReverse.each(function(t){s({targets:t,opacity:1,scale:[.4,1],translateY:[e.offsetY,0],translateX:[e.offsetX,0],duration:275,delay:i,easing:"easeInOutQuad"}),i+=40})}},{key:"_animateOutFAB",value:function(){var e=this;this.$floatingBtnsReverse.each(function(t){s.remove(t),s({targets:t,opacity:0,scale:.4,translateY:e.offsetY,translateX:e.offsetX,duration:175,easing:"easeOutQuad",complete:function(){e.$el.removeClass("active")}})})}},{key:"_animateInToolbar",value:function(){var t,e=this,i=window.innerWidth,n=window.innerHeight,s=this.el.getBoundingClientRect(),o=r('<div class="fab-backdrop"></div>'),a=this.$anchor.css("background-color");this.$anchor.append(o),this.offsetX=s.left-i/2+s.width/2,this.offsetY=n-s.bottom,t=i/o[0].clientWidth,this.btnBottom=s.bottom,this.btnLeft=s.left,this.btnWidth=s.width,this.$el.addClass("active"),this.$el.css({"text-align":"center",width:"100%",bottom:0,left:0,transform:"translateX("+this.offsetX+"px)",transition:"none"}),this.$anchor.css({transform:"translateY("+-this.offsetY+"px)",transition:"none"}),o.css({"background-color":a}),setTimeout(function(){e.$el.css({transform:"",transition:"transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s"}),e.$anchor.css({overflow:"visible",transform:"",transition:"transform .2s"}),setTimeout(function(){e.$el.css({overflow:"hidden","background-color":a}),o.css({transform:"scale("+t+")",transition:"transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)"}),e.$menu.children("li").children("a").css({opacity:1}),e._handleDocumentClickBound=e._handleDocumentClick.bind(e),window.addEventListener("scroll",e._handleCloseBound,!0),document.body.addEventListener("click",e._handleDocumentClickBound,!0)},100)},0)}},{key:"_animateOutToolbar",value:function(){var t=this,e=window.innerWidth,i=window.innerHeight,n=this.$el.find(".fab-backdrop"),s=this.$anchor.css("background-color");this.offsetX=this.btnLeft-e/2+this.btnWidth/2,this.offsetY=i-this.btnBottom,this.$el.removeClass("active"),this.$el.css({"background-color":"transparent",transition:"none"}),this.$anchor.css({transition:"none"}),n.css({transform:"scale(0)","background-color":s}),this.$menu.children("li").children("a").css({opacity:""}),setTimeout(function(){n.remove(),t.$el.css({"text-align":"",width:"",bottom:"",left:"",overflow:"","background-color":"",transform:"translate3d("+-t.offsetX+"px,0,0)"}),t.$anchor.css({overflow:"",transform:"translate3d(0,"+t.offsetY+"px,0)"}),setTimeout(function(){t.$el.css({transform:"translate3d(0,0,0)",transition:"transform .2s"}),t.$anchor.css({transform:"translate3d(0,0,0)",transition:"transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)"})},20)},200)}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_FloatingActionButton}},{key:"defaults",get:function(){return e}}]),n}();M.FloatingActionButton=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"floatingActionButton","M_FloatingActionButton")}(cash,M.anime),function(g){"use strict";var e={autoClose:!1,format:"mmm dd, yyyy",parse:null,defaultDate:null,setDefaultDate:!1,disableWeekends:!1,disableDayFn:null,firstDay:0,minDate:null,maxDate:null,yearRange:10,minYear:0,maxYear:9999,minMonth:void 0,maxMonth:void 0,startRange:null,endRange:null,isRTL:!1,showMonthAfterYear:!1,showDaysInNextAndPreviousMonths:!1,container:null,showClearBtn:!1,i18n:{cancel:"Cancel",clear:"Clear",done:"Ok",previousMonth:"‹",nextMonth:"›",months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],weekdaysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],weekdaysAbbrev:["S","M","T","W","T","F","S"]},events:[],onSelect:null,onOpen:null,onClose:null,onDraw:null},t=function(t){function B(t,e){_classCallCheck(this,B);var i=_possibleConstructorReturn(this,(B.__proto__||Object.getPrototypeOf(B)).call(this,B,t,e));(i.el.M_Datepicker=i).options=g.extend({},B.defaults,e),e&&e.hasOwnProperty("i18n")&&"object"==typeof e.i18n&&(i.options.i18n=g.extend({},B.defaults.i18n,e.i18n)),i.options.minDate&&i.options.minDate.setHours(0,0,0,0),i.options.maxDate&&i.options.maxDate.setHours(0,0,0,0),i.id=M.guid(),i._setupVariables(),i._insertHTMLIntoDOM(),i._setupModal(),i._setupEventHandlers(),i.options.defaultDate||(i.options.defaultDate=new Date(Date.parse(i.el.value)));var n=i.options.defaultDate;return B._isDate(n)?i.options.setDefaultDate?(i.setDate(n,!0),i.setInputValue()):i.gotoDate(n):i.gotoDate(new Date),i.isOpen=!1,i}return _inherits(B,Component),_createClass(B,[{key:"destroy",value:function(){this._removeEventHandlers(),this.modal.destroy(),g(this.modalEl).remove(),this.destroySelects(),this.el.M_Datepicker=void 0}},{key:"destroySelects",value:function(){var t=this.calendarEl.querySelector(".orig-select-year");t&&M.FormSelect.getInstance(t).destroy();var e=this.calendarEl.querySelector(".orig-select-month");e&&M.FormSelect.getInstance(e).destroy()}},{key:"_insertHTMLIntoDOM",value:function(){this.options.showClearBtn&&(g(this.clearBtn).css({visibility:""}),this.clearBtn.innerHTML=this.options.i18n.clear),this.doneBtn.innerHTML=this.options.i18n.done,this.cancelBtn.innerHTML=this.options.i18n.cancel,this.options.container?this.$modalEl.appendTo(this.options.container):this.$modalEl.insertBefore(this.el)}},{key:"_setupModal",value:function(){var t=this;this.modalEl.id="modal-"+this.id,this.modal=M.Modal.init(this.modalEl,{onCloseEnd:function(){t.isOpen=!1}})}},{key:"toString",value:function(t){var e=this;return t=t||this.options.format,B._isDate(this.date)?t.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g).map(function(t){return e.formats[t]?e.formats[t]():t}).join(""):""}},{key:"setDate",value:function(t,e){if(!t)return this.date=null,this._renderDateDisplay(),this.draw();if("string"==typeof t&&(t=new Date(Date.parse(t))),B._isDate(t)){var i=this.options.minDate,n=this.options.maxDate;B._isDate(i)&&t<i?t=i:B._isDate(n)&&n<t&&(t=n),this.date=new Date(t.getTime()),this._renderDateDisplay(),B._setToStartOfDay(this.date),this.gotoDate(this.date),e||"function"!=typeof this.options.onSelect||this.options.onSelect.call(this,this.date)}}},{key:"setInputValue",value:function(){this.el.value=this.toString(),this.$el.trigger("change",{firedBy:this})}},{key:"_renderDateDisplay",value:function(){var t=B._isDate(this.date)?this.date:new Date,e=this.options.i18n,i=e.weekdaysShort[t.getDay()],n=e.monthsShort[t.getMonth()],s=t.getDate();this.yearTextEl.innerHTML=t.getFullYear(),this.dateTextEl.innerHTML=i+", "+n+" "+s}},{key:"gotoDate",value:function(t){var e=!0;if(B._isDate(t)){if(this.calendars){var i=new Date(this.calendars[0].year,this.calendars[0].month,1),n=new Date(this.calendars[this.calendars.length-1].year,this.calendars[this.calendars.length-1].month,1),s=t.getTime();n.setMonth(n.getMonth()+1),n.setDate(n.getDate()-1),e=s<i.getTime()||n.getTime()<s}e&&(this.calendars=[{month:t.getMonth(),year:t.getFullYear()}]),this.adjustCalendars()}}},{key:"adjustCalendars",value:function(){this.calendars[0]=this.adjustCalendar(this.calendars[0]),this.draw()}},{key:"adjustCalendar",value:function(t){return t.month<0&&(t.year-=Math.ceil(Math.abs(t.month)/12),t.month+=12),11<t.month&&(t.year+=Math.floor(Math.abs(t.month)/12),t.month-=12),t}},{key:"nextMonth",value:function(){this.calendars[0].month++,this.adjustCalendars()}},{key:"prevMonth",value:function(){this.calendars[0].month--,this.adjustCalendars()}},{key:"render",value:function(t,e,i){var n=this.options,s=new Date,o=B._getDaysInMonth(t,e),a=new Date(t,e,1).getDay(),r=[],l=[];B._setToStartOfDay(s),0<n.firstDay&&(a-=n.firstDay)<0&&(a+=7);for(var h=0===e?11:e-1,d=11===e?0:e+1,u=0===e?t-1:t,c=11===e?t+1:t,p=B._getDaysInMonth(u,h),v=o+a,f=v;7<f;)f-=7;v+=7-f;for(var m=!1,g=0,_=0;g<v;g++){var y=new Date(t,e,g-a+1),k=!!B._isDate(this.date)&&B._compareDates(y,this.date),b=B._compareDates(y,s),w=-1!==n.events.indexOf(y.toDateString()),C=g<a||o+a<=g,E=g-a+1,M=e,O=t,x=n.startRange&&B._compareDates(n.startRange,y),L=n.endRange&&B._compareDates(n.endRange,y),T=n.startRange&&n.endRange&&n.startRange<y&&y<n.endRange;C&&(g<a?(E=p+E,M=h,O=u):(E-=o,M=d,O=c));var $={day:E,month:M,year:O,hasEvent:w,isSelected:k,isToday:b,isDisabled:n.minDate&&y<n.minDate||n.maxDate&&y>n.maxDate||n.disableWeekends&&B._isWeekend(y)||n.disableDayFn&&n.disableDayFn(y),isEmpty:C,isStartRange:x,isEndRange:L,isInRange:T,showDaysInNextAndPreviousMonths:n.showDaysInNextAndPreviousMonths};l.push(this.renderDay($)),7==++_&&(r.push(this.renderRow(l,n.isRTL,m)),_=0,m=!(l=[]))}return this.renderTable(n,r,i)}},{key:"renderDay",value:function(t){var e=[],i="false";if(t.isEmpty){if(!t.showDaysInNextAndPreviousMonths)return'<td class="is-empty"></td>';e.push("is-outside-current-month"),e.push("is-selection-disabled")}return t.isDisabled&&e.push("is-disabled"),t.isToday&&e.push("is-today"),t.isSelected&&(e.push("is-selected"),i="true"),t.hasEvent&&e.push("has-event"),t.isInRange&&e.push("is-inrange"),t.isStartRange&&e.push("is-startrange"),t.isEndRange&&e.push("is-endrange"),'<td data-day="'+t.day+'" class="'+e.join(" ")+'" aria-selected="'+i+'"><button class="datepicker-day-button" type="button" data-year="'+t.year+'" data-month="'+t.month+'" data-day="'+t.day+'">'+t.day+"</button></td>"}},{key:"renderRow",value:function(t,e,i){return'<tr class="datepicker-row'+(i?" is-selected":"")+'">'+(e?t.reverse():t).join("")+"</tr>"}},{key:"renderTable",value:function(t,e,i){return'<div class="datepicker-table-wrapper"><table cellpadding="0" cellspacing="0" class="datepicker-table" role="grid" aria-labelledby="'+i+'">'+this.renderHead(t)+this.renderBody(e)+"</table></div>"}},{key:"renderHead",value:function(t){var e=void 0,i=[];for(e=0;e<7;e++)i.push('<th scope="col"><abbr title="'+this.renderDayName(t,e)+'">'+this.renderDayName(t,e,!0)+"</abbr></th>");return"<thead><tr>"+(t.isRTL?i.reverse():i).join("")+"</tr></thead>"}},{key:"renderBody",value:function(t){return"<tbody>"+t.join("")+"</tbody>"}},{key:"renderTitle",value:function(t,e,i,n,s,o){var a,r,l=void 0,h=void 0,d=void 0,u=this.options,c=i===u.minYear,p=i===u.maxYear,v='<div id="'+o+'" class="datepicker-controls" role="heading" aria-live="assertive">',f=!0,m=!0;for(d=[],l=0;l<12;l++)d.push('<option value="'+(i===s?l-e:12+l-e)+'"'+(l===n?' selected="selected"':"")+(c&&l<u.minMonth||p&&l>u.maxMonth?'disabled="disabled"':"")+">"+u.i18n.months[l]+"</option>");for(a='<select class="datepicker-select orig-select-month" tabindex="-1">'+d.join("")+"</select>",g.isArray(u.yearRange)?(l=u.yearRange[0],h=u.yearRange[1]+1):(l=i-u.yearRange,h=1+i+u.yearRange),d=[];l<h&&l<=u.maxYear;l++)l>=u.minYear&&d.push('<option value="'+l+'" '+(l===i?'selected="selected"':"")+">"+l+"</option>");r='<select class="datepicker-select orig-select-year" tabindex="-1">'+d.join("")+"</select>";v+='<button class="month-prev'+(f?"":" is-disabled")+'" type="button"><svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/><path d="M0-.5h24v24H0z" fill="none"/></svg></button>',v+='<div class="selects-container">',u.showMonthAfterYear?v+=r+a:v+=a+r,v+="</div>",c&&(0===n||u.minMonth>=n)&&(f=!1),p&&(11===n||u.maxMonth<=n)&&(m=!1);return(v+='<button class="month-next'+(m?"":" is-disabled")+'" type="button"><svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg></button>')+"</div>"}},{key:"draw",value:function(t){if(this.isOpen||t){var e,i=this.options,n=i.minYear,s=i.maxYear,o=i.minMonth,a=i.maxMonth,r="";this._y<=n&&(this._y=n,!isNaN(o)&&this._m<o&&(this._m=o)),this._y>=s&&(this._y=s,!isNaN(a)&&this._m>a&&(this._m=a)),e="datepicker-title-"+Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,2);for(var l=0;l<1;l++)this._renderDateDisplay(),r+=this.renderTitle(this,l,this.calendars[l].year,this.calendars[l].month,this.calendars[0].year,e)+this.render(this.calendars[l].year,this.calendars[l].month,e);this.destroySelects(),this.calendarEl.innerHTML=r;var h=this.calendarEl.querySelector(".orig-select-year"),d=this.calendarEl.querySelector(".orig-select-month");M.FormSelect.init(h,{classes:"select-year",dropdownOptions:{container:document.body,constrainWidth:!1}}),M.FormSelect.init(d,{classes:"select-month",dropdownOptions:{container:document.body,constrainWidth:!1}}),h.addEventListener("change",this._handleYearChange.bind(this)),d.addEventListener("change",this._handleMonthChange.bind(this)),"function"==typeof this.options.onDraw&&this.options.onDraw(this)}}},{key:"_setupEventHandlers",value:function(){this._handleInputKeydownBound=this._handleInputKeydown.bind(this),this._handleInputClickBound=this._handleInputClick.bind(this),this._handleInputChangeBound=this._handleInputChange.bind(this),this._handleCalendarClickBound=this._handleCalendarClick.bind(this),this._finishSelectionBound=this._finishSelection.bind(this),this._handleMonthChange=this._handleMonthChange.bind(this),this._closeBound=this.close.bind(this),this.el.addEventListener("click",this._handleInputClickBound),this.el.addEventListener("keydown",this._handleInputKeydownBound),this.el.addEventListener("change",this._handleInputChangeBound),this.calendarEl.addEventListener("click",this._handleCalendarClickBound),this.doneBtn.addEventListener("click",this._finishSelectionBound),this.cancelBtn.addEventListener("click",this._closeBound),this.options.showClearBtn&&(this._handleClearClickBound=this._handleClearClick.bind(this),this.clearBtn.addEventListener("click",this._handleClearClickBound))}},{key:"_setupVariables",value:function(){var e=this;this.$modalEl=g(B._template),this.modalEl=this.$modalEl[0],this.calendarEl=this.modalEl.querySelector(".datepicker-calendar"),this.yearTextEl=this.modalEl.querySelector(".year-text"),this.dateTextEl=this.modalEl.querySelector(".date-text"),this.options.showClearBtn&&(this.clearBtn=this.modalEl.querySelector(".datepicker-clear")),this.doneBtn=this.modalEl.querySelector(".datepicker-done"),this.cancelBtn=this.modalEl.querySelector(".datepicker-cancel"),this.formats={d:function(){return e.date.getDate()},dd:function(){var t=e.date.getDate();return(t<10?"0":"")+t},ddd:function(){return e.options.i18n.weekdaysShort[e.date.getDay()]},dddd:function(){return e.options.i18n.weekdays[e.date.getDay()]},m:function(){return e.date.getMonth()+1},mm:function(){var t=e.date.getMonth()+1;return(t<10?"0":"")+t},mmm:function(){return e.options.i18n.monthsShort[e.date.getMonth()]},mmmm:function(){return e.options.i18n.months[e.date.getMonth()]},yy:function(){return(""+e.date.getFullYear()).slice(2)},yyyy:function(){return e.date.getFullYear()}}}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("click",this._handleInputClickBound),this.el.removeEventListener("keydown",this._handleInputKeydownBound),this.el.removeEventListener("change",this._handleInputChangeBound),this.calendarEl.removeEventListener("click",this._handleCalendarClickBound)}},{key:"_handleInputClick",value:function(){this.open()}},{key:"_handleInputKeydown",value:function(t){t.which===M.keys.ENTER&&(t.preventDefault(),this.open())}},{key:"_handleCalendarClick",value:function(t){if(this.isOpen){var e=g(t.target);e.hasClass("is-disabled")||(!e.hasClass("datepicker-day-button")||e.hasClass("is-empty")||e.parent().hasClass("is-disabled")?e.closest(".month-prev").length?this.prevMonth():e.closest(".month-next").length&&this.nextMonth():(this.setDate(new Date(t.target.getAttribute("data-year"),t.target.getAttribute("data-month"),t.target.getAttribute("data-day"))),this.options.autoClose&&this._finishSelection()))}}},{key:"_handleClearClick",value:function(){this.date=null,this.setInputValue(),this.close()}},{key:"_handleMonthChange",value:function(t){this.gotoMonth(t.target.value)}},{key:"_handleYearChange",value:function(t){this.gotoYear(t.target.value)}},{key:"gotoMonth",value:function(t){isNaN(t)||(this.calendars[0].month=parseInt(t,10),this.adjustCalendars())}},{key:"gotoYear",value:function(t){isNaN(t)||(this.calendars[0].year=parseInt(t,10),this.adjustCalendars())}},{key:"_handleInputChange",value:function(t){var e=void 0;t.firedBy!==this&&(e=this.options.parse?this.options.parse(this.el.value,this.options.format):new Date(Date.parse(this.el.value)),B._isDate(e)&&this.setDate(e))}},{key:"renderDayName",value:function(t,e,i){for(e+=t.firstDay;7<=e;)e-=7;return i?t.i18n.weekdaysAbbrev[e]:t.i18n.weekdays[e]}},{key:"_finishSelection",value:function(){this.setInputValue(),this.close()}},{key:"open",value:function(){if(!this.isOpen)return this.isOpen=!0,"function"==typeof this.options.onOpen&&this.options.onOpen.call(this),this.draw(),this.modal.open(),this}},{key:"close",value:function(){if(this.isOpen)return this.isOpen=!1,"function"==typeof this.options.onClose&&this.options.onClose.call(this),this.modal.close(),this}}],[{key:"init",value:function(t,e){return _get(B.__proto__||Object.getPrototypeOf(B),"init",this).call(this,this,t,e)}},{key:"_isDate",value:function(t){return/Date/.test(Object.prototype.toString.call(t))&&!isNaN(t.getTime())}},{key:"_isWeekend",value:function(t){var e=t.getDay();return 0===e||6===e}},{key:"_setToStartOfDay",value:function(t){B._isDate(t)&&t.setHours(0,0,0,0)}},{key:"_getDaysInMonth",value:function(t,e){return[31,B._isLeapYear(t)?29:28,31,30,31,30,31,31,30,31,30,31][e]}},{key:"_isLeapYear",value:function(t){return t%4==0&&t%100!=0||t%400==0}},{key:"_compareDates",value:function(t,e){return t.getTime()===e.getTime()}},{key:"_setToStartOfDay",value:function(t){B._isDate(t)&&t.setHours(0,0,0,0)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Datepicker}},{key:"defaults",get:function(){return e}}]),B}();t._template=['<div class= "modal datepicker-modal">','<div class="modal-content datepicker-container">','<div class="datepicker-date-display">','<span class="year-text"></span>','<span class="date-text"></span>',"</div>",'<div class="datepicker-calendar-container">','<div class="datepicker-calendar"></div>','<div class="datepicker-footer">','<button class="btn-flat datepicker-clear waves-effect" style="visibility: hidden;" type="button"></button>','<div class="confirmation-btns">','<button class="btn-flat datepicker-cancel waves-effect" type="button"></button>','<button class="btn-flat datepicker-done waves-effect" type="button"></button>',"</div>","</div>","</div>","</div>","</div>"].join(""),M.Datepicker=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"datepicker","M_Datepicker")}(cash),function(h){"use strict";var e={dialRadius:135,outerRadius:105,innerRadius:70,tickRadius:20,duration:350,container:null,defaultTime:"now",fromNow:0,showClearBtn:!1,i18n:{cancel:"Cancel",clear:"Clear",done:"Ok"},autoClose:!1,twelveHour:!0,vibrate:!0,onOpenStart:null,onOpenEnd:null,onCloseStart:null,onCloseEnd:null,onSelect:null},t=function(t){function f(t,e){_classCallCheck(this,f);var i=_possibleConstructorReturn(this,(f.__proto__||Object.getPrototypeOf(f)).call(this,f,t,e));return(i.el.M_Timepicker=i).options=h.extend({},f.defaults,e),i.id=M.guid(),i._insertHTMLIntoDOM(),i._setupModal(),i._setupVariables(),i._setupEventHandlers(),i._clockSetup(),i._pickerSetup(),i}return _inherits(f,Component),_createClass(f,[{key:"destroy",value:function(){this._removeEventHandlers(),this.modal.destroy(),h(this.modalEl).remove(),this.el.M_Timepicker=void 0}},{key:"_setupEventHandlers",value:function(){this._handleInputKeydownBound=this._handleInputKeydown.bind(this),this._handleInputClickBound=this._handleInputClick.bind(this),this._handleClockClickStartBound=this._handleClockClickStart.bind(this),this._handleDocumentClickMoveBound=this._handleDocumentClickMove.bind(this),this._handleDocumentClickEndBound=this._handleDocumentClickEnd.bind(this),this.el.addEventListener("click",this._handleInputClickBound),this.el.addEventListener("keydown",this._handleInputKeydownBound),this.plate.addEventListener("mousedown",this._handleClockClickStartBound),this.plate.addEventListener("touchstart",this._handleClockClickStartBound),h(this.spanHours).on("click",this.showView.bind(this,"hours")),h(this.spanMinutes).on("click",this.showView.bind(this,"minutes"))}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("click",this._handleInputClickBound),this.el.removeEventListener("keydown",this._handleInputKeydownBound)}},{key:"_handleInputClick",value:function(){this.open()}},{key:"_handleInputKeydown",value:function(t){t.which===M.keys.ENTER&&(t.preventDefault(),this.open())}},{key:"_handleClockClickStart",value:function(t){t.preventDefault();var e=this.plate.getBoundingClientRect(),i=e.left,n=e.top;this.x0=i+this.options.dialRadius,this.y0=n+this.options.dialRadius,this.moved=!1;var s=f._Pos(t);this.dx=s.x-this.x0,this.dy=s.y-this.y0,this.setHand(this.dx,this.dy,!1),document.addEventListener("mousemove",this._handleDocumentClickMoveBound),document.addEventListener("touchmove",this._handleDocumentClickMoveBound),document.addEventListener("mouseup",this._handleDocumentClickEndBound),document.addEventListener("touchend",this._handleDocumentClickEndBound)}},{key:"_handleDocumentClickMove",value:function(t){t.preventDefault();var e=f._Pos(t),i=e.x-this.x0,n=e.y-this.y0;this.moved=!0,this.setHand(i,n,!1,!0)}},{key:"_handleDocumentClickEnd",value:function(t){var e=this;t.preventDefault(),document.removeEventListener("mouseup",this._handleDocumentClickEndBound),document.removeEventListener("touchend",this._handleDocumentClickEndBound);var i=f._Pos(t),n=i.x-this.x0,s=i.y-this.y0;this.moved&&n===this.dx&&s===this.dy&&this.setHand(n,s),"hours"===this.currentView?this.showView("minutes",this.options.duration/2):this.options.autoClose&&(h(this.minutesView).addClass("timepicker-dial-out"),setTimeout(function(){e.done()},this.options.duration/2)),"function"==typeof this.options.onSelect&&this.options.onSelect.call(this,this.hours,this.minutes),document.removeEventListener("mousemove",this._handleDocumentClickMoveBound),document.removeEventListener("touchmove",this._handleDocumentClickMoveBound)}},{key:"_insertHTMLIntoDOM",value:function(){this.$modalEl=h(f._template),this.modalEl=this.$modalEl[0],this.modalEl.id="modal-"+this.id;var t=document.querySelector(this.options.container);this.options.container&&t?this.$modalEl.appendTo(t):this.$modalEl.insertBefore(this.el)}},{key:"_setupModal",value:function(){var t=this;this.modal=M.Modal.init(this.modalEl,{onOpenStart:this.options.onOpenStart,onOpenEnd:this.options.onOpenEnd,onCloseStart:this.options.onCloseStart,onCloseEnd:function(){"function"==typeof t.options.onCloseEnd&&t.options.onCloseEnd.call(t),t.isOpen=!1}})}},{key:"_setupVariables",value:function(){this.currentView="hours",this.vibrate=navigator.vibrate?"vibrate":navigator.webkitVibrate?"webkitVibrate":null,this._canvas=this.modalEl.querySelector(".timepicker-canvas"),this.plate=this.modalEl.querySelector(".timepicker-plate"),this.hoursView=this.modalEl.querySelector(".timepicker-hours"),this.minutesView=this.modalEl.querySelector(".timepicker-minutes"),this.spanHours=this.modalEl.querySelector(".timepicker-span-hours"),this.spanMinutes=this.modalEl.querySelector(".timepicker-span-minutes"),this.spanAmPm=this.modalEl.querySelector(".timepicker-span-am-pm"),this.footer=this.modalEl.querySelector(".timepicker-footer"),this.amOrPm="PM"}},{key:"_pickerSetup",value:function(){var t=h('<button class="btn-flat timepicker-clear waves-effect" style="visibility: hidden;" type="button" tabindex="'+(this.options.twelveHour?"3":"1")+'">'+this.options.i18n.clear+"</button>").appendTo(this.footer).on("click",this.clear.bind(this));this.options.showClearBtn&&t.css({visibility:""});var e=h('<div class="confirmation-btns"></div>');h('<button class="btn-flat timepicker-close waves-effect" type="button" tabindex="'+(this.options.twelveHour?"3":"1")+'">'+this.options.i18n.cancel+"</button>").appendTo(e).on("click",this.close.bind(this)),h('<button class="btn-flat timepicker-close waves-effect" type="button" tabindex="'+(this.options.twelveHour?"3":"1")+'">'+this.options.i18n.done+"</button>").appendTo(e).on("click",this.done.bind(this)),e.appendTo(this.footer)}},{key:"_clockSetup",value:function(){this.options.twelveHour&&(this.$amBtn=h('<div class="am-btn">AM</div>'),this.$pmBtn=h('<div class="pm-btn">PM</div>'),this.$amBtn.on("click",this._handleAmPmClick.bind(this)).appendTo(this.spanAmPm),this.$pmBtn.on("click",this._handleAmPmClick.bind(this)).appendTo(this.spanAmPm)),this._buildHoursView(),this._buildMinutesView(),this._buildSVGClock()}},{key:"_buildSVGClock",value:function(){var t=this.options.dialRadius,e=this.options.tickRadius,i=2*t,n=f._createSVGEl("svg");n.setAttribute("class","timepicker-svg"),n.setAttribute("width",i),n.setAttribute("height",i);var s=f._createSVGEl("g");s.setAttribute("transform","translate("+t+","+t+")");var o=f._createSVGEl("circle");o.setAttribute("class","timepicker-canvas-bearing"),o.setAttribute("cx",0),o.setAttribute("cy",0),o.setAttribute("r",4);var a=f._createSVGEl("line");a.setAttribute("x1",0),a.setAttribute("y1",0);var r=f._createSVGEl("circle");r.setAttribute("class","timepicker-canvas-bg"),r.setAttribute("r",e),s.appendChild(a),s.appendChild(r),s.appendChild(o),n.appendChild(s),this._canvas.appendChild(n),this.hand=a,this.bg=r,this.bearing=o,this.g=s}},{key:"_buildHoursView",value:function(){var t=h('<div class="timepicker-tick"></div>');if(this.options.twelveHour)for(var e=1;e<13;e+=1){var i=t.clone(),n=e/6*Math.PI,s=this.options.outerRadius;i.css({left:this.options.dialRadius+Math.sin(n)*s-this.options.tickRadius+"px",top:this.options.dialRadius-Math.cos(n)*s-this.options.tickRadius+"px"}),i.html(0===e?"00":e),this.hoursView.appendChild(i[0])}else for(var o=0;o<24;o+=1){var a=t.clone(),r=o/6*Math.PI,l=0<o&&o<13?this.options.innerRadius:this.options.outerRadius;a.css({left:this.options.dialRadius+Math.sin(r)*l-this.options.tickRadius+"px",top:this.options.dialRadius-Math.cos(r)*l-this.options.tickRadius+"px"}),a.html(0===o?"00":o),this.hoursView.appendChild(a[0])}}},{key:"_buildMinutesView",value:function(){for(var t=h('<div class="timepicker-tick"></div>'),e=0;e<60;e+=5){var i=t.clone(),n=e/30*Math.PI;i.css({left:this.options.dialRadius+Math.sin(n)*this.options.outerRadius-this.options.tickRadius+"px",top:this.options.dialRadius-Math.cos(n)*this.options.outerRadius-this.options.tickRadius+"px"}),i.html(f._addLeadingZero(e)),this.minutesView.appendChild(i[0])}}},{key:"_handleAmPmClick",value:function(t){var e=h(t.target);this.amOrPm=e.hasClass("am-btn")?"AM":"PM",this._updateAmPmView()}},{key:"_updateAmPmView",value:function(){this.options.twelveHour&&(this.$amBtn.toggleClass("text-primary","AM"===this.amOrPm),this.$pmBtn.toggleClass("text-primary","PM"===this.amOrPm))}},{key:"_updateTimeFromInput",value:function(){var t=((this.el.value||this.options.defaultTime||"")+"").split(":");if(this.options.twelveHour&&void 0!==t[1]&&(0<t[1].toUpperCase().indexOf("AM")?this.amOrPm="AM":this.amOrPm="PM",t[1]=t[1].replace("AM","").replace("PM","")),"now"===t[0]){var e=new Date(+new Date+this.options.fromNow);t=[e.getHours(),e.getMinutes()],this.options.twelveHour&&(this.amOrPm=12<=t[0]&&t[0]<24?"PM":"AM")}this.hours=+t[0]||0,this.minutes=+t[1]||0,this.spanHours.innerHTML=this.hours,this.spanMinutes.innerHTML=f._addLeadingZero(this.minutes),this._updateAmPmView()}},{key:"showView",value:function(t,e){"minutes"===t&&h(this.hoursView).css("visibility");var i="hours"===t,n=i?this.hoursView:this.minutesView,s=i?this.minutesView:this.hoursView;this.currentView=t,h(this.spanHours).toggleClass("text-primary",i),h(this.spanMinutes).toggleClass("text-primary",!i),s.classList.add("timepicker-dial-out"),h(n).css("visibility","visible").removeClass("timepicker-dial-out"),this.resetClock(e),clearTimeout(this.toggleViewTimer),this.toggleViewTimer=setTimeout(function(){h(s).css("visibility","hidden")},this.options.duration)}},{key:"resetClock",value:function(t){var e=this.currentView,i=this[e],n="hours"===e,s=i*(Math.PI/(n?6:30)),o=n&&0<i&&i<13?this.options.innerRadius:this.options.outerRadius,a=Math.sin(s)*o,r=-Math.cos(s)*o,l=this;t?(h(this.canvas).addClass("timepicker-canvas-out"),setTimeout(function(){h(l.canvas).removeClass("timepicker-canvas-out"),l.setHand(a,r)},t)):this.setHand(a,r)}},{key:"setHand",value:function(t,e,i){var n=this,s=Math.atan2(t,-e),o="hours"===this.currentView,a=Math.PI/(o||i?6:30),r=Math.sqrt(t*t+e*e),l=o&&r<(this.options.outerRadius+this.options.innerRadius)/2,h=l?this.options.innerRadius:this.options.outerRadius;this.options.twelveHour&&(h=this.options.outerRadius),s<0&&(s=2*Math.PI+s);var d=Math.round(s/a);s=d*a,this.options.twelveHour?o?0===d&&(d=12):(i&&(d*=5),60===d&&(d=0)):o?(12===d&&(d=0),d=l?0===d?12:d:0===d?0:d+12):(i&&(d*=5),60===d&&(d=0)),this[this.currentView]!==d&&this.vibrate&&this.options.vibrate&&(this.vibrateTimer||(navigator[this.vibrate](10),this.vibrateTimer=setTimeout(function(){n.vibrateTimer=null},100))),this[this.currentView]=d,o?this.spanHours.innerHTML=d:this.spanMinutes.innerHTML=f._addLeadingZero(d);var u=Math.sin(s)*(h-this.options.tickRadius),c=-Math.cos(s)*(h-this.options.tickRadius),p=Math.sin(s)*h,v=-Math.cos(s)*h;this.hand.setAttribute("x2",u),this.hand.setAttribute("y2",c),this.bg.setAttribute("cx",p),this.bg.setAttribute("cy",v)}},{key:"open",value:function(){this.isOpen||(this.isOpen=!0,this._updateTimeFromInput(),this.showView("hours"),this.modal.open())}},{key:"close",value:function(){this.isOpen&&(this.isOpen=!1,this.modal.close())}},{key:"done",value:function(t,e){var i=this.el.value,n=e?"":f._addLeadingZero(this.hours)+":"+f._addLeadingZero(this.minutes);this.time=n,!e&&this.options.twelveHour&&(n=n+" "+this.amOrPm),(this.el.value=n)!==i&&this.$el.trigger("change"),this.close(),this.el.focus()}},{key:"clear",value:function(){this.done(null,!0)}}],[{key:"init",value:function(t,e){return _get(f.__proto__||Object.getPrototypeOf(f),"init",this).call(this,this,t,e)}},{key:"_addLeadingZero",value:function(t){return(t<10?"0":"")+t}},{key:"_createSVGEl",value:function(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}},{key:"_Pos",value:function(t){return t.targetTouches&&1<=t.targetTouches.length?{x:t.targetTouches[0].clientX,y:t.targetTouches[0].clientY}:{x:t.clientX,y:t.clientY}}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Timepicker}},{key:"defaults",get:function(){return e}}]),f}();t._template=['<div class= "modal timepicker-modal">','<div class="modal-content timepicker-container">','<div class="timepicker-digital-display">','<div class="timepicker-text-container">','<div class="timepicker-display-column">','<span class="timepicker-span-hours text-primary"></span>',":",'<span class="timepicker-span-minutes"></span>',"</div>",'<div class="timepicker-display-column timepicker-display-am-pm">','<div class="timepicker-span-am-pm"></div>',"</div>","</div>","</div>",'<div class="timepicker-analog-display">','<div class="timepicker-plate">','<div class="timepicker-canvas"></div>','<div class="timepicker-dial timepicker-hours"></div>','<div class="timepicker-dial timepicker-minutes timepicker-dial-out"></div>',"</div>",'<div class="timepicker-footer"></div>',"</div>","</div>","</div>"].join(""),M.Timepicker=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"timepicker","M_Timepicker")}(cash),function(s){"use strict";var e={},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_CharacterCounter=i).options=s.extend({},n.defaults,e),i.isInvalid=!1,i.isValidLength=!1,i._setupCounter(),i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this.el.CharacterCounter=void 0,this._removeCounter()}},{key:"_setupEventHandlers",value:function(){this._handleUpdateCounterBound=this.updateCounter.bind(this),this.el.addEventListener("focus",this._handleUpdateCounterBound,!0),this.el.addEventListener("input",this._handleUpdateCounterBound,!0)}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("focus",this._handleUpdateCounterBound,!0),this.el.removeEventListener("input",this._handleUpdateCounterBound,!0)}},{key:"_setupCounter",value:function(){this.counterEl=document.createElement("span"),s(this.counterEl).addClass("character-counter").css({float:"right","font-size":"12px",height:1}),this.$el.parent().append(this.counterEl)}},{key:"_removeCounter",value:function(){s(this.counterEl).remove()}},{key:"updateCounter",value:function(){var t=+this.$el.attr("data-length"),e=this.el.value.length;this.isValidLength=e<=t;var i=e;t&&(i+="/"+t,this._validateInput()),s(this.counterEl).html(i)}},{key:"_validateInput",value:function(){this.isValidLength&&this.isInvalid?(this.isInvalid=!1,this.$el.removeClass("invalid")):this.isValidLength||this.isInvalid||(this.isInvalid=!0,this.$el.removeClass("valid"),this.$el.addClass("invalid"))}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_CharacterCounter}},{key:"defaults",get:function(){return e}}]),n}();M.CharacterCounter=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"characterCounter","M_CharacterCounter")}(cash),function(b){"use strict";var e={duration:200,dist:-100,shift:0,padding:0,numVisible:5,fullWidth:!1,indicators:!1,noWrap:!1,onCycleTo:null},t=function(t){function i(t,e){_classCallCheck(this,i);var n=_possibleConstructorReturn(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,i,t,e));return(n.el.M_Carousel=n).options=b.extend({},i.defaults,e),n.hasMultipleSlides=1<n.$el.find(".carousel-item").length,n.showIndicators=n.options.indicators&&n.hasMultipleSlides,n.noWrap=n.options.noWrap||!n.hasMultipleSlides,n.pressed=!1,n.dragged=!1,n.offset=n.target=0,n.images=[],n.itemWidth=n.$el.find(".carousel-item").first().innerWidth(),n.itemHeight=n.$el.find(".carousel-item").first().innerHeight(),n.dim=2*n.itemWidth+n.options.padding||1,n._autoScrollBound=n._autoScroll.bind(n),n._trackBound=n._track.bind(n),n.options.fullWidth&&(n.options.dist=0,n._setCarouselHeight(),n.showIndicators&&n.$el.find(".carousel-fixed-item").addClass("with-indicators")),n.$indicators=b('<ul class="indicators"></ul>'),n.$el.find(".carousel-item").each(function(t,e){if(n.images.push(t),n.showIndicators){var i=b('<li class="indicator-item"></li>');0===e&&i[0].classList.add("active"),n.$indicators.append(i)}}),n.showIndicators&&n.$el.append(n.$indicators),n.count=n.images.length,n.options.numVisible=Math.min(n.count,n.options.numVisible),n.xform="transform",["webkit","Moz","O","ms"].every(function(t){var e=t+"Transform";return void 0===document.body.style[e]||(n.xform=e,!1)}),n._setupEventHandlers(),n._scroll(n.offset),n}return _inherits(i,Component),_createClass(i,[{key:"destroy",value:function(){this._removeEventHandlers(),this.el.M_Carousel=void 0}},{key:"_setupEventHandlers",value:function(){var i=this;this._handleCarouselTapBound=this._handleCarouselTap.bind(this),this._handleCarouselDragBound=this._handleCarouselDrag.bind(this),this._handleCarouselReleaseBound=this._handleCarouselRelease.bind(this),this._handleCarouselClickBound=this._handleCarouselClick.bind(this),void 0!==window.ontouchstart&&(this.el.addEventListener("touchstart",this._handleCarouselTapBound),this.el.addEventListener("touchmove",this._handleCarouselDragBound),this.el.addEventListener("touchend",this._handleCarouselReleaseBound)),this.el.addEventListener("mousedown",this._handleCarouselTapBound),this.el.addEventListener("mousemove",this._handleCarouselDragBound),this.el.addEventListener("mouseup",this._handleCarouselReleaseBound),this.el.addEventListener("mouseleave",this._handleCarouselReleaseBound),this.el.addEventListener("click",this._handleCarouselClickBound),this.showIndicators&&this.$indicators&&(this._handleIndicatorClickBound=this._handleIndicatorClick.bind(this),this.$indicators.find(".indicator-item").each(function(t,e){t.addEventListener("click",i._handleIndicatorClickBound)}));var t=M.throttle(this._handleResize,200);this._handleThrottledResizeBound=t.bind(this),window.addEventListener("resize",this._handleThrottledResizeBound)}},{key:"_removeEventHandlers",value:function(){var i=this;void 0!==window.ontouchstart&&(this.el.removeEventListener("touchstart",this._handleCarouselTapBound),this.el.removeEventListener("touchmove",this._handleCarouselDragBound),this.el.removeEventListener("touchend",this._handleCarouselReleaseBound)),this.el.removeEventListener("mousedown",this._handleCarouselTapBound),this.el.removeEventListener("mousemove",this._handleCarouselDragBound),this.el.removeEventListener("mouseup",this._handleCarouselReleaseBound),this.el.removeEventListener("mouseleave",this._handleCarouselReleaseBound),this.el.removeEventListener("click",this._handleCarouselClickBound),this.showIndicators&&this.$indicators&&this.$indicators.find(".indicator-item").each(function(t,e){t.removeEventListener("click",i._handleIndicatorClickBound)}),window.removeEventListener("resize",this._handleThrottledResizeBound)}},{key:"_handleCarouselTap",value:function(t){"mousedown"===t.type&&b(t.target).is("img")&&t.preventDefault(),this.pressed=!0,this.dragged=!1,this.verticalDragged=!1,this.reference=this._xpos(t),this.referenceY=this._ypos(t),this.velocity=this.amplitude=0,this.frame=this.offset,this.timestamp=Date.now(),clearInterval(this.ticker),this.ticker=setInterval(this._trackBound,100)}},{key:"_handleCarouselDrag",value:function(t){var e=void 0,i=void 0,n=void 0;if(this.pressed)if(e=this._xpos(t),i=this._ypos(t),n=this.reference-e,Math.abs(this.referenceY-i)<30&&!this.verticalDragged)(2<n||n<-2)&&(this.dragged=!0,this.reference=e,this._scroll(this.offset+n));else{if(this.dragged)return t.preventDefault(),t.stopPropagation(),!1;this.verticalDragged=!0}if(this.dragged)return t.preventDefault(),t.stopPropagation(),!1}},{key:"_handleCarouselRelease",value:function(t){if(this.pressed)return this.pressed=!1,clearInterval(this.ticker),this.target=this.offset,(10<this.velocity||this.velocity<-10)&&(this.amplitude=.9*this.velocity,this.target=this.offset+this.amplitude),this.target=Math.round(this.target/this.dim)*this.dim,this.noWrap&&(this.target>=this.dim*(this.count-1)?this.target=this.dim*(this.count-1):this.target<0&&(this.target=0)),this.amplitude=this.target-this.offset,this.timestamp=Date.now(),requestAnimationFrame(this._autoScrollBound),this.dragged&&(t.preventDefault(),t.stopPropagation()),!1}},{key:"_handleCarouselClick",value:function(t){if(this.dragged)return t.preventDefault(),t.stopPropagation(),!1;if(!this.options.fullWidth){var e=b(t.target).closest(".carousel-item").index();0!==this._wrap(this.center)-e&&(t.preventDefault(),t.stopPropagation()),this._cycleTo(e)}}},{key:"_handleIndicatorClick",value:function(t){t.stopPropagation();var e=b(t.target).closest(".indicator-item");e.length&&this._cycleTo(e.index())}},{key:"_handleResize",value:function(t){this.options.fullWidth?(this.itemWidth=this.$el.find(".carousel-item").first().innerWidth(),this.imageHeight=this.$el.find(".carousel-item.active").height(),this.dim=2*this.itemWidth+this.options.padding,this.offset=2*this.center*this.itemWidth,this.target=this.offset,this._setCarouselHeight(!0)):this._scroll()}},{key:"_setCarouselHeight",value:function(t){var i=this,e=this.$el.find(".carousel-item.active").length?this.$el.find(".carousel-item.active").first():this.$el.find(".carousel-item").first(),n=e.find("img").first();if(n.length)if(n[0].complete){var s=n.height();if(0<s)this.$el.css("height",s+"px");else{var o=n[0].naturalWidth,a=n[0].naturalHeight,r=this.$el.width()/o*a;this.$el.css("height",r+"px")}}else n.one("load",function(t,e){i.$el.css("height",t.offsetHeight+"px")});else if(!t){var l=e.height();this.$el.css("height",l+"px")}}},{key:"_xpos",value:function(t){return t.targetTouches&&1<=t.targetTouches.length?t.targetTouches[0].clientX:t.clientX}},{key:"_ypos",value:function(t){return t.targetTouches&&1<=t.targetTouches.length?t.targetTouches[0].clientY:t.clientY}},{key:"_wrap",value:function(t){return t>=this.count?t%this.count:t<0?this._wrap(this.count+t%this.count):t}},{key:"_track",value:function(){var t,e,i,n;e=(t=Date.now())-this.timestamp,this.timestamp=t,i=this.offset-this.frame,this.frame=this.offset,n=1e3*i/(1+e),this.velocity=.8*n+.2*this.velocity}},{key:"_autoScroll",value:function(){var t=void 0,e=void 0;this.amplitude&&(t=Date.now()-this.timestamp,2<(e=this.amplitude*Math.exp(-t/this.options.duration))||e<-2?(this._scroll(this.target-e),requestAnimationFrame(this._autoScrollBound)):this._scroll(this.target))}},{key:"_scroll",value:function(t){var e=this;this.$el.hasClass("scrolling")||this.el.classList.add("scrolling"),null!=this.scrollingTimeout&&window.clearTimeout(this.scrollingTimeout),this.scrollingTimeout=window.setTimeout(function(){e.$el.removeClass("scrolling")},this.options.duration);var i,n,s,o,a=void 0,r=void 0,l=void 0,h=void 0,d=void 0,u=void 0,c=this.center,p=1/this.options.numVisible;if(this.offset="number"==typeof t?t:this.offset,this.center=Math.floor((this.offset+this.dim/2)/this.dim),o=-(s=(n=this.offset-this.center*this.dim)<0?1:-1)*n*2/this.dim,i=this.count>>1,this.options.fullWidth?(l="translateX(0)",u=1):(l="translateX("+(this.el.clientWidth-this.itemWidth)/2+"px) ",l+="translateY("+(this.el.clientHeight-this.itemHeight)/2+"px)",u=1-p*o),this.showIndicators){var v=this.center%this.count,f=this.$indicators.find(".indicator-item.active");f.index()!==v&&(f.removeClass("active"),this.$indicators.find(".indicator-item").eq(v)[0].classList.add("active"))}if(!this.noWrap||0<=this.center&&this.center<this.count){r=this.images[this._wrap(this.center)],b(r).hasClass("active")||(this.$el.find(".carousel-item").removeClass("active"),r.classList.add("active"));var m=l+" translateX("+-n/2+"px) translateX("+s*this.options.shift*o*a+"px) translateZ("+this.options.dist*o+"px)";this._updateItemStyle(r,u,0,m)}for(a=1;a<=i;++a){if(this.options.fullWidth?(h=this.options.dist,d=a===i&&n<0?1-o:1):(h=this.options.dist*(2*a+o*s),d=1-p*(2*a+o*s)),!this.noWrap||this.center+a<this.count){r=this.images[this._wrap(this.center+a)];var g=l+" translateX("+(this.options.shift+(this.dim*a-n)/2)+"px) translateZ("+h+"px)";this._updateItemStyle(r,d,-a,g)}if(this.options.fullWidth?(h=this.options.dist,d=a===i&&0<n?1-o:1):(h=this.options.dist*(2*a-o*s),d=1-p*(2*a-o*s)),!this.noWrap||0<=this.center-a){r=this.images[this._wrap(this.center-a)];var _=l+" translateX("+(-this.options.shift+(-this.dim*a-n)/2)+"px) translateZ("+h+"px)";this._updateItemStyle(r,d,-a,_)}}if(!this.noWrap||0<=this.center&&this.center<this.count){r=this.images[this._wrap(this.center)];var y=l+" translateX("+-n/2+"px) translateX("+s*this.options.shift*o+"px) translateZ("+this.options.dist*o+"px)";this._updateItemStyle(r,u,0,y)}var k=this.$el.find(".carousel-item").eq(this._wrap(this.center));c!==this.center&&"function"==typeof this.options.onCycleTo&&this.options.onCycleTo.call(this,k[0],this.dragged),"function"==typeof this.oneTimeCallback&&(this.oneTimeCallback.call(this,k[0],this.dragged),this.oneTimeCallback=null)}},{key:"_updateItemStyle",value:function(t,e,i,n){t.style[this.xform]=n,t.style.zIndex=i,t.style.opacity=e,t.style.visibility="visible"}},{key:"_cycleTo",value:function(t,e){var i=this.center%this.count-t;this.noWrap||(i<0?Math.abs(i+this.count)<Math.abs(i)&&(i+=this.count):0<i&&Math.abs(i-this.count)<i&&(i-=this.count)),this.target=this.dim*Math.round(this.offset/this.dim),i<0?this.target+=this.dim*Math.abs(i):0<i&&(this.target-=this.dim*i),"function"==typeof e&&(this.oneTimeCallback=e),this.offset!==this.target&&(this.amplitude=this.target-this.offset,this.timestamp=Date.now(),requestAnimationFrame(this._autoScrollBound))}},{key:"next",value:function(t){(void 0===t||isNaN(t))&&(t=1);var e=this.center+t;if(e>=this.count||e<0){if(this.noWrap)return;e=this._wrap(e)}this._cycleTo(e)}},{key:"prev",value:function(t){(void 0===t||isNaN(t))&&(t=1);var e=this.center-t;if(e>=this.count||e<0){if(this.noWrap)return;e=this._wrap(e)}this._cycleTo(e)}},{key:"set",value:function(t,e){if((void 0===t||isNaN(t))&&(t=0),t>this.count||t<0){if(this.noWrap)return;t=this._wrap(t)}this._cycleTo(t,e)}}],[{key:"init",value:function(t,e){return _get(i.__proto__||Object.getPrototypeOf(i),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Carousel}},{key:"defaults",get:function(){return e}}]),i}();M.Carousel=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"carousel","M_Carousel")}(cash),function(S){"use strict";var e={onOpen:void 0,onClose:void 0},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_TapTarget=i).options=S.extend({},n.defaults,e),i.isOpen=!1,i.$origin=S("#"+i.$el.attr("data-target")),i._setup(),i._calculatePositioning(),i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this.el.TapTarget=void 0}},{key:"_setupEventHandlers",value:function(){this._handleDocumentClickBound=this._handleDocumentClick.bind(this),this._handleTargetClickBound=this._handleTargetClick.bind(this),this._handleOriginClickBound=this._handleOriginClick.bind(this),this.el.addEventListener("click",this._handleTargetClickBound),this.originEl.addEventListener("click",this._handleOriginClickBound);var t=M.throttle(this._handleResize,200);this._handleThrottledResizeBound=t.bind(this),window.addEventListener("resize",this._handleThrottledResizeBound)}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("click",this._handleTargetClickBound),this.originEl.removeEventListener("click",this._handleOriginClickBound),window.removeEventListener("resize",this._handleThrottledResizeBound)}},{key:"_handleTargetClick",value:function(t){this.open()}},{key:"_handleOriginClick",value:function(t){this.close()}},{key:"_handleResize",value:function(t){this._calculatePositioning()}},{key:"_handleDocumentClick",value:function(t){S(t.target).closest(".tap-target-wrapper").length||(this.close(),t.preventDefault(),t.stopPropagation())}},{key:"_setup",value:function(){this.wrapper=this.$el.parent()[0],this.waveEl=S(this.wrapper).find(".tap-target-wave")[0],this.originEl=S(this.wrapper).find(".tap-target-origin")[0],this.contentEl=this.$el.find(".tap-target-content")[0],S(this.wrapper).hasClass(".tap-target-wrapper")||(this.wrapper=document.createElement("div"),this.wrapper.classList.add("tap-target-wrapper"),this.$el.before(S(this.wrapper)),this.wrapper.append(this.el)),this.contentEl||(this.contentEl=document.createElement("div"),this.contentEl.classList.add("tap-target-content"),this.$el.append(this.contentEl)),this.waveEl||(this.waveEl=document.createElement("div"),this.waveEl.classList.add("tap-target-wave"),this.originEl||(this.originEl=this.$origin.clone(!0,!0),this.originEl.addClass("tap-target-origin"),this.originEl.removeAttr("id"),this.originEl.removeAttr("style"),this.originEl=this.originEl[0],this.waveEl.append(this.originEl)),this.wrapper.append(this.waveEl))}},{key:"_calculatePositioning",value:function(){var t="fixed"===this.$origin.css("position");if(!t)for(var e=this.$origin.parents(),i=0;i<e.length&&!(t="fixed"==S(e[i]).css("position"));i++);var n=this.$origin.outerWidth(),s=this.$origin.outerHeight(),o=t?this.$origin.offset().top-M.getDocumentScrollTop():this.$origin.offset().top,a=t?this.$origin.offset().left-M.getDocumentScrollLeft():this.$origin.offset().left,r=window.innerWidth,l=window.innerHeight,h=r/2,d=l/2,u=a<=h,c=h<a,p=o<=d,v=d<o,f=.25*r<=a&&a<=.75*r,m=this.$el.outerWidth(),g=this.$el.outerHeight(),_=o+s/2-g/2,y=a+n/2-m/2,k=t?"fixed":"absolute",b=f?m:m/2+n,w=g/2,C=p?g/2:0,E=u&&!f?m/2-n:0,O=n,x=v?"bottom":"top",L=2*n,T=L,$=g/2-T/2,B=m/2-L/2,D={};D.top=p?_+"px":"",D.right=c?r-y-m+"px":"",D.bottom=v?l-_-g+"px":"",D.left=u?y+"px":"",D.position=k,S(this.wrapper).css(D),S(this.contentEl).css({width:b+"px",height:w+"px",top:C+"px",right:"0px",bottom:"0px",left:E+"px",padding:O+"px",verticalAlign:x}),S(this.waveEl).css({top:$+"px",left:B+"px",width:L+"px",height:T+"px"})}},{key:"open",value:function(){this.isOpen||("function"==typeof this.options.onOpen&&this.options.onOpen.call(this,this.$origin[0]),this.isOpen=!0,this.wrapper.classList.add("open"),document.body.addEventListener("click",this._handleDocumentClickBound,!0),document.body.addEventListener("touchend",this._handleDocumentClickBound))}},{key:"close",value:function(){this.isOpen&&("function"==typeof this.options.onClose&&this.options.onClose.call(this,this.$origin[0]),this.isOpen=!1,this.wrapper.classList.remove("open"),document.body.removeEventListener("click",this._handleDocumentClickBound,!0),document.body.removeEventListener("touchend",this._handleDocumentClickBound))}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_TapTarget}},{key:"defaults",get:function(){return e}}]),n}();M.TapTarget=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"tapTarget","M_TapTarget")}(cash),function(d){"use strict";var e={classes:"",dropdownOptions:{}},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return i.$el.hasClass("browser-default")?_possibleConstructorReturn(i):((i.el.M_FormSelect=i).options=d.extend({},n.defaults,e),i.isMultiple=i.$el.prop("multiple"),i.el.tabIndex=-1,i._keysSelected={},i._valueDict={},i._setupDropdown(),i._setupEventHandlers(),i)}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this._removeDropdown(),this.el.M_FormSelect=void 0}},{key:"_setupEventHandlers",value:function(){var e=this;this._handleSelectChangeBound=this._handleSelectChange.bind(this),this._handleOptionClickBound=this._handleOptionClick.bind(this),this._handleInputClickBound=this._handleInputClick.bind(this),d(this.dropdownOptions).find("li:not(.optgroup)").each(function(t){t.addEventListener("click",e._handleOptionClickBound)}),this.el.addEventListener("change",this._handleSelectChangeBound),this.input.addEventListener("click",this._handleInputClickBound)}},{key:"_removeEventHandlers",value:function(){var e=this;d(this.dropdownOptions).find("li:not(.optgroup)").each(function(t){t.removeEventListener("click",e._handleOptionClickBound)}),this.el.removeEventListener("change",this._handleSelectChangeBound),this.input.removeEventListener("click",this._handleInputClickBound)}},{key:"_handleSelectChange",value:function(t){this._setValueToInput()}},{key:"_handleOptionClick",value:function(t){t.preventDefault();var e=d(t.target).closest("li")[0],i=e.id;if(!d(e).hasClass("disabled")&&!d(e).hasClass("optgroup")&&i.length){var n=!0;if(this.isMultiple){var s=d(this.dropdownOptions).find("li.disabled.selected");s.length&&(s.removeClass("selected"),s.find('input[type="checkbox"]').prop("checked",!1),this._toggleEntryFromArray(s[0].id)),n=this._toggleEntryFromArray(i)}else d(this.dropdownOptions).find("li").removeClass("selected"),d(e).toggleClass("selected",n);d(this._valueDict[i].el).prop("selected")!==n&&(d(this._valueDict[i].el).prop("selected",n),this.$el.trigger("change"))}t.stopPropagation()}},{key:"_handleInputClick",value:function(){this.dropdown&&this.dropdown.isOpen&&(this._setValueToInput(),this._setSelectedStates())}},{key:"_setupDropdown",value:function(){var n=this;this.wrapper=document.createElement("div"),d(this.wrapper).addClass("select-wrapper "+this.options.classes),this.$el.before(d(this.wrapper)),this.wrapper.appendChild(this.el),this.el.disabled&&this.wrapper.classList.add("disabled"),this.$selectOptions=this.$el.children("option, optgroup"),this.dropdownOptions=document.createElement("ul"),this.dropdownOptions.id="select-options-"+M.guid(),d(this.dropdownOptions).addClass("dropdown-content select-dropdown "+(this.isMultiple?"multiple-select-dropdown":"")),this.$selectOptions.length&&this.$selectOptions.each(function(t){if(d(t).is("option")){var e=void 0;e=n.isMultiple?n._appendOptionWithIcon(n.$el,t,"multiple"):n._appendOptionWithIcon(n.$el,t),n._addOptionToValueDict(t,e)}else if(d(t).is("optgroup")){var i=d(t).children("option");d(n.dropdownOptions).append(d('<li class="optgroup"><span>'+t.getAttribute("label")+"</span></li>")[0]),i.each(function(t){var e=n._appendOptionWithIcon(n.$el,t,"optgroup-option");n._addOptionToValueDict(t,e)})}}),this.$el.after(this.dropdownOptions),this.input=document.createElement("input"),d(this.input).addClass("select-dropdown dropdown-trigger"),this.input.setAttribute("type","text"),this.input.setAttribute("readonly","true"),this.input.setAttribute("data-target",this.dropdownOptions.id),this.el.disabled&&d(this.input).prop("disabled","true"),this.$el.before(this.input),this._setValueToInput();var t=d('<svg class="caret" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');if(this.$el.before(t[0]),!this.el.disabled){var e=d.extend({},this.options.dropdownOptions);e.onOpenEnd=function(t){var e=d(n.dropdownOptions).find(".selected").first();if(n.dropdown.isScrollable&&e.length){var i=e[0].getBoundingClientRect().top-n.dropdownOptions.getBoundingClientRect().top;i-=n.dropdownOptions.clientHeight/2,n.dropdownOptions.scrollTop=i}},this.isMultiple&&(e.closeOnClick=!1),this.dropdown=M.Dropdown.init(this.input,e)}this._setSelectedStates()}},{key:"_addOptionToValueDict",value:function(t,e){var i=Object.keys(this._valueDict).length,n=this.dropdownOptions.id+i,s={};e.id=n,s.el=t,s.optionEl=e,this._valueDict[n]=s}},{key:"_removeDropdown",value:function(){d(this.wrapper).find(".caret").remove(),d(this.input).remove(),d(this.dropdownOptions).remove(),d(this.wrapper).before(this.$el),d(this.wrapper).remove()}},{key:"_appendOptionWithIcon",value:function(t,e,i){var n=e.disabled?"disabled ":"",s="optgroup-option"===i?"optgroup-option ":"",o=this.isMultiple?'<label><input type="checkbox"'+n+'"/><span>'+e.innerHTML+"</span></label>":e.innerHTML,a=d("<li></li>"),r=d("<span></span>");r.html(o),a.addClass(n+" "+s),a.append(r);var l=e.getAttribute("data-icon");if(l){var h=d('<img alt="" src="'+l+'">');a.prepend(h)}return d(this.dropdownOptions).append(a[0]),a[0]}},{key:"_toggleEntryFromArray",value:function(t){var e=!this._keysSelected.hasOwnProperty(t),i=d(this._valueDict[t].optionEl);return e?this._keysSelected[t]=!0:delete this._keysSelected[t],i.toggleClass("selected",e),i.find('input[type="checkbox"]').prop("checked",e),i.prop("selected",e),e}},{key:"_setValueToInput",value:function(){var i=[];if(this.$el.find("option").each(function(t){if(d(t).prop("selected")){var e=d(t).text();i.push(e)}}),!i.length){var t=this.$el.find("option:disabled").eq(0);t.length&&""===t[0].value&&i.push(t.text())}this.input.value=i.join(", ")}},{key:"_setSelectedStates",value:function(){for(var t in this._keysSelected={},this._valueDict){var e=this._valueDict[t],i=d(e.el).prop("selected");d(e.optionEl).find('input[type="checkbox"]').prop("checked",i),i?(this._activateOption(d(this.dropdownOptions),d(e.optionEl)),this._keysSelected[t]=!0):d(e.optionEl).removeClass("selected")}}},{key:"_activateOption",value:function(t,e){e&&(this.isMultiple||t.find("li.selected").removeClass("selected"),d(e).addClass("selected"))}},{key:"getSelectedValues",value:function(){var t=[];for(var e in this._keysSelected)t.push(this._valueDict[e].el.value);return t}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_FormSelect}},{key:"defaults",get:function(){return e}}]),n}();M.FormSelect=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"formSelect","M_FormSelect")}(cash),function(s,e){"use strict";var i={},t=function(t){function n(t,e){_classCallCheck(this,n);var i=_possibleConstructorReturn(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,t,e));return(i.el.M_Range=i).options=s.extend({},n.defaults,e),i._mousedown=!1,i._setupThumb(),i._setupEventHandlers(),i}return _inherits(n,Component),_createClass(n,[{key:"destroy",value:function(){this._removeEventHandlers(),this._removeThumb(),this.el.M_Range=void 0}},{key:"_setupEventHandlers",value:function(){this._handleRangeChangeBound=this._handleRangeChange.bind(this),this._handleRangeMousedownTouchstartBound=this._handleRangeMousedownTouchstart.bind(this),this._handleRangeInputMousemoveTouchmoveBound=this._handleRangeInputMousemoveTouchmove.bind(this),this._handleRangeMouseupTouchendBound=this._handleRangeMouseupTouchend.bind(this),this._handleRangeBlurMouseoutTouchleaveBound=this._handleRangeBlurMouseoutTouchleave.bind(this),this.el.addEventListener("change",this._handleRangeChangeBound),this.el.addEventListener("mousedown",this._handleRangeMousedownTouchstartBound),this.el.addEventListener("touchstart",this._handleRangeMousedownTouchstartBound),this.el.addEventListener("input",this._handleRangeInputMousemoveTouchmoveBound),this.el.addEventListener("mousemove",this._handleRangeInputMousemoveTouchmoveBound),this.el.addEventListener("touchmove",this._handleRangeInputMousemoveTouchmoveBound),this.el.addEventListener("mouseup",this._handleRangeMouseupTouchendBound),this.el.addEventListener("touchend",this._handleRangeMouseupTouchendBound),this.el.addEventListener("blur",this._handleRangeBlurMouseoutTouchleaveBound),this.el.addEventListener("mouseout",this._handleRangeBlurMouseoutTouchleaveBound),this.el.addEventListener("touchleave",this._handleRangeBlurMouseoutTouchleaveBound)}},{key:"_removeEventHandlers",value:function(){this.el.removeEventListener("change",this._handleRangeChangeBound),this.el.removeEventListener("mousedown",this._handleRangeMousedownTouchstartBound),this.el.removeEventListener("touchstart",this._handleRangeMousedownTouchstartBound),this.el.removeEventListener("input",this._handleRangeInputMousemoveTouchmoveBound),this.el.removeEventListener("mousemove",this._handleRangeInputMousemoveTouchmoveBound),this.el.removeEventListener("touchmove",this._handleRangeInputMousemoveTouchmoveBound),this.el.removeEventListener("mouseup",this._handleRangeMouseupTouchendBound),this.el.removeEventListener("touchend",this._handleRangeMouseupTouchendBound),this.el.removeEventListener("blur",this._handleRangeBlurMouseoutTouchleaveBound),this.el.removeEventListener("mouseout",this._handleRangeBlurMouseoutTouchleaveBound),this.el.removeEventListener("touchleave",this._handleRangeBlurMouseoutTouchleaveBound)}},{key:"_handleRangeChange",value:function(){s(this.value).html(this.$el.val()),s(this.thumb).hasClass("active")||this._showRangeBubble();var t=this._calcRangeOffset();s(this.thumb).addClass("active").css("left",t+"px")}},{key:"_handleRangeMousedownTouchstart",value:function(t){if(s(this.value).html(this.$el.val()),this._mousedown=!0,this.$el.addClass("active"),s(this.thumb).hasClass("active")||this._showRangeBubble(),"input"!==t.type){var e=this._calcRangeOffset();s(this.thumb).addClass("active").css("left",e+"px")}}},{key:"_handleRangeInputMousemoveTouchmove",value:function(){if(this._mousedown){s(this.thumb).hasClass("active")||this._showRangeBubble();var t=this._calcRangeOffset();s(this.thumb).addClass("active").css("left",t+"px"),s(this.value).html(this.$el.val())}}},{key:"_handleRangeMouseupTouchend",value:function(){this._mousedown=!1,this.$el.removeClass("active")}},{key:"_handleRangeBlurMouseoutTouchleave",value:function(){if(!this._mousedown){var t=7+parseInt(this.$el.css("padding-left"))+"px";s(this.thumb).hasClass("active")&&(e.remove(this.thumb),e({targets:this.thumb,height:0,width:0,top:10,easing:"easeOutQuad",marginLeft:t,duration:100})),s(this.thumb).removeClass("active")}}},{key:"_setupThumb",value:function(){this.thumb=document.createElement("span"),this.value=document.createElement("span"),s(this.thumb).addClass("thumb"),s(this.value).addClass("value"),s(this.thumb).append(this.value),this.$el.after(this.thumb)}},{key:"_removeThumb",value:function(){s(this.thumb).remove()}},{key:"_showRangeBubble",value:function(){var t=-7+parseInt(s(this.thumb).parent().css("padding-left"))+"px";e.remove(this.thumb),e({targets:this.thumb,height:30,width:30,top:-30,marginLeft:t,duration:300,easing:"easeOutQuint"})}},{key:"_calcRangeOffset",value:function(){var t=this.$el.width()-15,e=parseFloat(this.$el.attr("max"))||100,i=parseFloat(this.$el.attr("min"))||0;return(parseFloat(this.$el.val())-i)/(e-i)*t}}],[{key:"init",value:function(t,e){return _get(n.__proto__||Object.getPrototypeOf(n),"init",this).call(this,this,t,e)}},{key:"getInstance",value:function(t){return(t.jquery?t[0]:t).M_Range}},{key:"defaults",get:function(){return i}}]),n}();M.Range=t,M.jQueryLoaded&&M.initializeJqueryWrapper(t,"range","M_Range"),t.init(s("input[type=range]"))}(cash,M.anime);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(27), __webpack_require__(27), __webpack_require__(68)))

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__(147);

__webpack_require__(344);

__webpack_require__(345);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(68)))

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(148);
__webpack_require__(151);
__webpack_require__(152);
__webpack_require__(153);
__webpack_require__(154);
__webpack_require__(155);
__webpack_require__(156);
__webpack_require__(157);
__webpack_require__(158);
__webpack_require__(159);
__webpack_require__(160);
__webpack_require__(161);
__webpack_require__(162);
__webpack_require__(163);
__webpack_require__(164);
__webpack_require__(165);
__webpack_require__(166);
__webpack_require__(167);
__webpack_require__(168);
__webpack_require__(169);
__webpack_require__(170);
__webpack_require__(171);
__webpack_require__(172);
__webpack_require__(173);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
__webpack_require__(177);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(180);
__webpack_require__(181);
__webpack_require__(182);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(185);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(191);
__webpack_require__(192);
__webpack_require__(193);
__webpack_require__(194);
__webpack_require__(195);
__webpack_require__(196);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(200);
__webpack_require__(201);
__webpack_require__(202);
__webpack_require__(203);
__webpack_require__(204);
__webpack_require__(205);
__webpack_require__(206);
__webpack_require__(207);
__webpack_require__(208);
__webpack_require__(209);
__webpack_require__(210);
__webpack_require__(211);
__webpack_require__(212);
__webpack_require__(213);
__webpack_require__(214);
__webpack_require__(215);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(220);
__webpack_require__(221);
__webpack_require__(222);
__webpack_require__(223);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(226);
__webpack_require__(228);
__webpack_require__(229);
__webpack_require__(231);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(236);
__webpack_require__(237);
__webpack_require__(239);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(243);
__webpack_require__(244);
__webpack_require__(245);
__webpack_require__(246);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(251);
__webpack_require__(89);
__webpack_require__(252);
__webpack_require__(121);
__webpack_require__(253);
__webpack_require__(122);
__webpack_require__(254);
__webpack_require__(255);
__webpack_require__(256);
__webpack_require__(257);
__webpack_require__(258);
__webpack_require__(125);
__webpack_require__(127);
__webpack_require__(128);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(261);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(264);
__webpack_require__(265);
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(268);
__webpack_require__(269);
__webpack_require__(270);
__webpack_require__(271);
__webpack_require__(272);
__webpack_require__(273);
__webpack_require__(274);
__webpack_require__(275);
__webpack_require__(276);
__webpack_require__(277);
__webpack_require__(278);
__webpack_require__(279);
__webpack_require__(280);
__webpack_require__(281);
__webpack_require__(282);
__webpack_require__(283);
__webpack_require__(284);
__webpack_require__(285);
__webpack_require__(286);
__webpack_require__(287);
__webpack_require__(288);
__webpack_require__(289);
__webpack_require__(290);
__webpack_require__(291);
__webpack_require__(292);
__webpack_require__(293);
__webpack_require__(294);
__webpack_require__(295);
__webpack_require__(296);
__webpack_require__(297);
__webpack_require__(298);
__webpack_require__(299);
__webpack_require__(300);
__webpack_require__(301);
__webpack_require__(302);
__webpack_require__(303);
__webpack_require__(304);
__webpack_require__(305);
__webpack_require__(306);
__webpack_require__(307);
__webpack_require__(308);
__webpack_require__(309);
__webpack_require__(310);
__webpack_require__(311);
__webpack_require__(312);
__webpack_require__(313);
__webpack_require__(314);
__webpack_require__(315);
__webpack_require__(316);
__webpack_require__(317);
__webpack_require__(318);
__webpack_require__(319);
__webpack_require__(320);
__webpack_require__(321);
__webpack_require__(322);
__webpack_require__(323);
__webpack_require__(324);
__webpack_require__(325);
__webpack_require__(326);
__webpack_require__(327);
__webpack_require__(328);
__webpack_require__(329);
__webpack_require__(330);
__webpack_require__(331);
__webpack_require__(332);
__webpack_require__(333);
__webpack_require__(334);
__webpack_require__(335);
__webpack_require__(336);
__webpack_require__(337);
__webpack_require__(338);
__webpack_require__(339);
__webpack_require__(340);
__webpack_require__(341);
__webpack_require__(342);
__webpack_require__(343);
module.exports = __webpack_require__(18);


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(2);
var has = __webpack_require__(14);
var DESCRIPTORS = __webpack_require__(7);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var META = __webpack_require__(31).KEY;
var $fails = __webpack_require__(3);
var shared = __webpack_require__(49);
var setToStringTag = __webpack_require__(45);
var uid = __webpack_require__(34);
var wks = __webpack_require__(5);
var wksExt = __webpack_require__(103);
var wksDefine = __webpack_require__(70);
var enumKeys = __webpack_require__(150);
var isArray = __webpack_require__(56);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(23);
var createDesc = __webpack_require__(33);
var _create = __webpack_require__(37);
var gOPNExt = __webpack_require__(106);
var $GOPD = __webpack_require__(16);
var $DP = __webpack_require__(8);
var $keys = __webpack_require__(35);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(38).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(51).f = $propertyIsEnumerable;
  __webpack_require__(55).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(30)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(49)('native-function-to-string', Function.toString);


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(35);
var gOPS = __webpack_require__(55);
var pIE = __webpack_require__(51);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(37) });


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', { defineProperty: __webpack_require__(8).f });


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', { defineProperties: __webpack_require__(105) });


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(15);
var $getOwnPropertyDescriptor = __webpack_require__(16).f;

__webpack_require__(25)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(9);
var $getPrototypeOf = __webpack_require__(17);

__webpack_require__(25)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(9);
var $keys = __webpack_require__(35);

__webpack_require__(25)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(25)('getOwnPropertyNames', function () {
  return __webpack_require__(106).f;
});


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(31).onFreeze;

__webpack_require__(25)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(31).onFreeze;

__webpack_require__(25)('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(31).onFreeze;

__webpack_require__(25)('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(25)('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(25)('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(25)('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(107) });


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { is: __webpack_require__(108) });


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(74).set });


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(46);
var test = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(12)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', { bind: __webpack_require__(109) });


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(7) && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(4);
var getPrototypeOf = __webpack_require__(17);
var HAS_INSTANCE = __webpack_require__(5)('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(8).f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(111);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(112);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var has = __webpack_require__(14);
var cof = __webpack_require__(20);
var inheritIfRequired = __webpack_require__(76);
var toPrimitive = __webpack_require__(23);
var fails = __webpack_require__(3);
var gOPN = __webpack_require__(38).f;
var gOPD = __webpack_require__(16).f;
var dP = __webpack_require__(8).f;
var $trim = __webpack_require__(47).trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__(37)(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__(7) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(12)(global, NUMBER, $Number);
}


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toInteger = __webpack_require__(21);
var aNumberValue = __webpack_require__(113);
var repeat = __webpack_require__(77);
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(3)(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $fails = __webpack_require__(3);
var aNumberValue = __webpack_require__(113);
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(0);
var _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', { isInteger: __webpack_require__(114) });


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(0);
var isInteger = __webpack_require__(114);
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(112);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(111);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0);
var log1p = __webpack_require__(115);
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0);
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0);
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0);
var sign = __webpack_require__(78);

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0);
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0);
var $expm1 = __webpack_require__(79);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { fround: __webpack_require__(116) });


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0);
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0);
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { log1p: __webpack_require__(115) });


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { sign: __webpack_require__(78) });


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(79);
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(79);
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toAbsoluteIndex = __webpack_require__(36);
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(6);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(47)('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(57)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(80)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $at = __webpack_require__(57)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(6);
var context = __webpack_require__(82);
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(83)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__(0);
var context = __webpack_require__(82);
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(83)(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(77)
});


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(6);
var context = __webpack_require__(82);
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(83)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(13)('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()
__webpack_require__(13)('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()
__webpack_require__(13)('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__(13)('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__(13)('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(13)('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(13)('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()
__webpack_require__(13)('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(13)('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()
__webpack_require__(13)('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__(13)('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()
__webpack_require__(13)('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()
__webpack_require__(13)('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(23);

$export($export.P + $export.F * __webpack_require__(3)(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0);
var toISOString = __webpack_require__(227);

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = __webpack_require__(3);
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(12)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) __webpack_require__(11)(proto, TO_PRIMITIVE, __webpack_require__(230));


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(23);
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(56) });


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(19);
var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var call = __webpack_require__(117);
var isArrayIter = __webpack_require__(84);
var toLength = __webpack_require__(6);
var createProperty = __webpack_require__(85);
var getIterFn = __webpack_require__(86);

$export($export.S + $export.F * !__webpack_require__(59)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var createProperty = __webpack_require__(85);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(3)(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(50) != Object || !__webpack_require__(22)(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var html = __webpack_require__(73);
var cof = __webpack_require__(20);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(6);
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(3)(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var toObject = __webpack_require__(9);
var fails = __webpack_require__(3);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(22)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $forEach = __webpack_require__(26)(0);
var STRICT = __webpack_require__(22)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var isArray = __webpack_require__(56);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $map = __webpack_require__(26)(1);

$export($export.P + $export.F * !__webpack_require__(22)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $filter = __webpack_require__(26)(2);

$export($export.P + $export.F * !__webpack_require__(22)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $some = __webpack_require__(26)(3);

$export($export.P + $export.F * !__webpack_require__(22)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $every = __webpack_require__(26)(4);

$export($export.P + $export.F * !__webpack_require__(22)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(118);

$export($export.P + $export.F * !__webpack_require__(22)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(118);

$export($export.P + $export.F * !__webpack_require__(22)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $indexOf = __webpack_require__(54)(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(22)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var toInteger = __webpack_require__(21);
var toLength = __webpack_require__(6);
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(22)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { copyWithin: __webpack_require__(119) });

__webpack_require__(32)('copyWithin');


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { fill: __webpack_require__(88) });

__webpack_require__(32)('fill');


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(26)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(32)(KEY);


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(26)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(32)(KEY);


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(39)('Array');


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var inheritIfRequired = __webpack_require__(76);
var dP = __webpack_require__(8).f;
var gOPN = __webpack_require__(38).f;
var isRegExp = __webpack_require__(58);
var $flags = __webpack_require__(52);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(7) && (!CORRECT_NEW || __webpack_require__(3)(function () {
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(12)(global, 'RegExp', $RegExp);
}

__webpack_require__(39)('RegExp');


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(122);
var anObject = __webpack_require__(1);
var $flags = __webpack_require__(52);
var DESCRIPTORS = __webpack_require__(7);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(12)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(3)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(1);
var toLength = __webpack_require__(6);
var advanceStringIndex = __webpack_require__(91);
var regExpExec = __webpack_require__(60);

// @@match logic
__webpack_require__(61)('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(1);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(6);
var toInteger = __webpack_require__(21);
var advanceStringIndex = __webpack_require__(91);
var regExpExec = __webpack_require__(60);
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__(61)('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(1);
var sameValue = __webpack_require__(108);
var regExpExec = __webpack_require__(60);

// @@search logic
__webpack_require__(61)('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__(58);
var anObject = __webpack_require__(1);
var speciesConstructor = __webpack_require__(53);
var advanceStringIndex = __webpack_require__(91);
var toLength = __webpack_require__(6);
var callRegExpExec = __webpack_require__(60);
var regexpExec = __webpack_require__(90);
var fails = __webpack_require__(3);
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__(61)('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(30);
var global = __webpack_require__(2);
var ctx = __webpack_require__(19);
var classof = __webpack_require__(46);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var aFunction = __webpack_require__(10);
var anInstance = __webpack_require__(40);
var forOf = __webpack_require__(41);
var speciesConstructor = __webpack_require__(53);
var task = __webpack_require__(92).set;
var microtask = __webpack_require__(93)();
var newPromiseCapabilityModule = __webpack_require__(94);
var perform = __webpack_require__(123);
var userAgent = __webpack_require__(62);
var promiseResolve = __webpack_require__(124);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(42)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(45)($Promise, PROMISE);
__webpack_require__(39)(PROMISE);
Wrapper = __webpack_require__(18)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(59)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var weak = __webpack_require__(129);
var validate = __webpack_require__(43);
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
__webpack_require__(63)(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $typed = __webpack_require__(64);
var buffer = __webpack_require__(95);
var anObject = __webpack_require__(1);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(6);
var isObject = __webpack_require__(4);
var ArrayBuffer = __webpack_require__(2).ArrayBuffer;
var speciesConstructor = __webpack_require__(53);
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(3)(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var fin = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < fin) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(39)(ARRAY_BUFFER);


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(64).ABV, {
  DataView: __webpack_require__(95).DataView
});


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var rApply = (__webpack_require__(2).Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(3)(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = __webpack_require__(0);
var create = __webpack_require__(37);
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var bind = __webpack_require__(109);
var rConstruct = (__webpack_require__(2).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = __webpack_require__(8);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(23);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(3)(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = __webpack_require__(0);
var gOPD = __webpack_require__(16).f;
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
__webpack_require__(81)(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = __webpack_require__(16);
var getPrototypeOf = __webpack_require__(17);
var has = __webpack_require__(14);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = __webpack_require__(16);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export = __webpack_require__(0);
var getProto = __webpack_require__(17);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', { ownKeys: __webpack_require__(131) });


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = __webpack_require__(8);
var gOPD = __webpack_require__(16);
var getPrototypeOf = __webpack_require__(17);
var has = __webpack_require__(14);
var $export = __webpack_require__(0);
var createDesc = __webpack_require__(33);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = __webpack_require__(0);
var setProto = __webpack_require__(74);

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__(0);
var $includes = __webpack_require__(54)(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(32)('includes');


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(132);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(6);
var aFunction = __webpack_require__(10);
var arraySpeciesCreate = __webpack_require__(87);

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

__webpack_require__(32)('flatMap');


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(132);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(6);
var toInteger = __webpack_require__(21);
var arraySpeciesCreate = __webpack_require__(87);

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

__webpack_require__(32)('flatten');


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/mathiasbynens/String.prototype.at
var $export = __webpack_require__(0);
var $at = __webpack_require__(57)(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(133);
var userAgent = __webpack_require__(62);

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(133);
var userAgent = __webpack_require__(62);

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(47)('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(47)('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/String.prototype.matchAll/
var $export = __webpack_require__(0);
var defined = __webpack_require__(24);
var toLength = __webpack_require__(6);
var isRegExp = __webpack_require__(58);
var getFlags = __webpack_require__(52);
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

__webpack_require__(81)($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70)('asyncIterator');


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70)('observable');


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(0);
var ownKeys = __webpack_require__(131);
var toIObject = __webpack_require__(15);
var gOPD = __webpack_require__(16);
var createProperty = __webpack_require__(85);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $values = __webpack_require__(134)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $entries = __webpack_require__(134)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var aFunction = __webpack_require__(10);
var $defineProperty = __webpack_require__(8);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(7) && $export($export.P + __webpack_require__(65), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var aFunction = __webpack_require__(10);
var $defineProperty = __webpack_require__(8);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(7) && $export($export.P + __webpack_require__(65), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(23);
var getPrototypeOf = __webpack_require__(17);
var getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(7) && $export($export.P + __webpack_require__(65), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(23);
var getPrototypeOf = __webpack_require__(17);
var getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(7) && $export($export.P + __webpack_require__(65), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(135)('Map') });


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(135)('Set') });


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(66)('Map');


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(66)('Set');


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
__webpack_require__(66)('WeakMap');


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
__webpack_require__(66)('WeakSet');


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(67)('Map');


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(67)('Set');


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
__webpack_require__(67)('WeakMap');


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
__webpack_require__(67)('WeakSet');


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.G, { global: __webpack_require__(2) });


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.S, 'System', { global: __webpack_require__(2) });


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(0);
var cof = __webpack_require__(20);

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var scale = __webpack_require__(137);
var fround = __webpack_require__(116);

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { scale: __webpack_require__(137) });


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

// http://jfbastien.github.io/papers/Math.signbit.html
var $export = __webpack_require__(0);

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(0);
var core = __webpack_require__(18);
var global = __webpack_require__(2);
var speciesConstructor = __webpack_require__(53);
var promiseResolve = __webpack_require__(124);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(0);
var newPromiseCapability = __webpack_require__(94);
var perform = __webpack_require__(123);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(17);
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

var Set = __webpack_require__(127);
var from = __webpack_require__(136);
var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(17);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(17);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

var $metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(10);
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = __webpack_require__(0);
var microtask = __webpack_require__(93)();
var process = __webpack_require__(2).process;
var isNode = __webpack_require__(20)(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zenparsing/es-observable
var $export = __webpack_require__(0);
var global = __webpack_require__(2);
var core = __webpack_require__(18);
var microtask = __webpack_require__(93)();
var OBSERVABLE = __webpack_require__(5)('observable');
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var anInstance = __webpack_require__(40);
var redefineAll = __webpack_require__(42);
var hide = __webpack_require__(11);
var forOf = __webpack_require__(41);
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = new Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

__webpack_require__(39)('Observable');


/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var userAgent = __webpack_require__(62);
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});


/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $task = __webpack_require__(92);
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(89);
var getKeys = __webpack_require__(35);
var redefine = __webpack_require__(12);
var global = __webpack_require__(2);
var hide = __webpack_require__(11);
var Iterators = __webpack_require__(48);
var wks = __webpack_require__(5);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(68)))

/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(346);
module.exports = __webpack_require__(18).RegExp.escape;


/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(0);
var $re = __webpack_require__(347)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });


/***/ }),
/* 347 */
/***/ (function(module, exports) {

module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};


/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var authEvents = __webpack_require__(349);
var gameEvents = __webpack_require__(356);
var store = __webpack_require__(44);

$(function () {
    // display html once loaded to avoid FOUC
    $('html').removeClass('unloaded');
    // run initialization functions
    authEvents.onLoad();
    $('.sidenav').sidenav(); // material.css init

    // add auth event handlers
    $('#sign-up-form').on('submit', authEvents.onSignUp);
    $('#sign-in-form').on('submit', authEvents.onSignIn);
    $('#change-password-form').on('submit', authEvents.onChangePassword);
    $('#sign-out-form').on('submit', authEvents.onSignOut);
    $('#sign-out-link').on('click', authEvents.onSignOut);

    // add click handlers to gameboard markers
    $('.gameboard--marker').on('click', function (e) {
        // only trigger click on gameboard marker, ignore descendents
        if (e.target !== this) return;
        gameEvents.onSelectSpace(e);
    });
    $('#reset').on('click', gameEvents.onReset);

    // AI SETTINGS LOGIC

    // add click listener for ai toggle
    $('#play-vs-ai').on('click', function () {
        // toggle ai in store
        store.settings.isVsAi = !store.settings.isVsAi;
        // manually set checkbox to current value (boolean)
        $('#ai-checkbox').prop('checked', store.settings.isVsAi);
        // reset gameboard
        gameEvents.onReset();
        // return false to avoid jQuery running this twice per click
        return false;
    });

    // handle ai difficulty switches
    $('#difficulty-0').on('click', function () {
        store.settings.difficulty = 0;
        $('input[name=\'difficulty-group\']').attr('checked', false);
        $('#difficulty-0-radio').attr('checked', 'checked');
        // reset gameboard
        gameEvents.onReset();
        return false;
    });

    $('#difficulty-1').on('click', function () {
        store.settings.difficulty = 1;
        $('input[name=\'difficulty-group\']').attr('checked', false);
        $('#difficulty-1-radio').attr('checked', 'checked');
        // reset gameboard
        gameEvents.onReset();
        return false;
    });

    $('#difficulty-2').on('click', function () {
        store.settings.difficulty = 2;
        $('input[name=\'difficulty-group\']').attr('checked', false);
        $('#difficulty-2-radio').attr('checked', 'checked');
        // reset gameboard
        gameEvents.onReset();
        return false;
    });

    // PAGE ROUTING LOGIC

    // hide pages
    $('#auth-page').hide();
    $('#history-page').hide();

    // to auth
    $('#open-auth').on('click', function () {
        $('#game-page').fadeOut('fast', function () {
            $('#auth-page').fadeIn('slow');
            $('.sidenav').sidenav('close');
        });
    });

    // back from auth
    $('#back-from-auth').on('click', function () {
        // reset gameboard
        gameEvents.onReset();
        $('#auth-page').fadeOut('fast', function () {
            $('#game-page').fadeIn('slow');
        });
    });

    // to history
    $('#open-history').on('click', function () {
        if (gameEvents.onGetGameHistory()) {
            // if user signed in, go to history page
            $('#auth-page').fadeOut('fast');
            $('#game-page').fadeOut('fast', function () {
                $('#history-page').fadeIn('slow');
                $('.sidenav').sidenav('close');
            });
        } else {
            // move user to auth page
            // to auth
            $('#game-page').fadeOut('fast', function () {
                $('#auth-page').fadeIn('slow');
                $('.sidenav').sidenav('close');
            });
        }
    });

    // back from history
    $('#back-from-history').on('click', function () {
        // reset board
        gameEvents.onReset();
        $('#history-page').fadeOut('fast', function () {
            $('#game-page').fadeIn('slow');
        });
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getFormFields = __webpack_require__(350);
var ui = __webpack_require__(352);
var api = __webpack_require__(353);
var game = __webpack_require__(139);
var gameUi = __webpack_require__(99);

var onSignUp = function onSignUp(event) {
    event.preventDefault();
    // get form data and create POST object for API
    var form = event.target;
    var formData = getFormFields(form);

    // override pw verification behavior of api, no one cares that much about these accts
    formData.credentials.password_confirmation = formData.credentials.password;

    // call sign up AJAX call, then pass result of promise data to ui functions
    api.signUp(formData).then(ui.signUpSuccess).catch(ui.signUpFailure);
};

var onSignIn = function onSignIn(event) {
    event.preventDefault();
    // get form data and create POST object for API
    var form = event.target;
    var formData = getFormFields(form);

    // call sign in AJAX call, then pass result of promise data to ui functions
    api.signIn(formData).then(function (responseData) {
        ui.signInSuccess(responseData);
        // reset the gameboard
        game.reset();
    }).catch(ui.signInFailure);
};

var onChangePassword = function onChangePassword(event) {
    event.preventDefault();

    // get form data and create PATCH object for API
    var form = event.target;
    var formData = getFormFields(form);

    // call PATCH request and pass payload to ui functions
    api.changePassword(formData).then(ui.changePasswordSuccess).catch(ui.changePasswordFailure);
};

var onSignOut = function onSignOut(event) {
    event.preventDefault();

    // call signout AJAX request, uses user token in store, no data body
    api.signOut().then(ui.signOutSuccess).catch(ui.signOutFailure);

    // clear game history
    gameUi.clearGameHistory();
};

var onLoad = function onLoad() {
    // initialize ui once page is loaded
    ui.init();
};

module.exports = {
    onSignUp: onSignUp,
    onSignIn: onSignIn,
    onChangePassword: onChangePassword,
    onSignOut: onSignOut,
    onLoad: onLoad
};

/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var addNestedValue = __webpack_require__(351);

var getFormFields = function getFormFields(form) {
    var target = {};

    var elements = form.elements || [];
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i];
        if (!e.hasAttribute('name')) {
            continue;
        }

        var type = 'TEXT';
        switch (e.nodeName.toUpperCase()) {
            case 'SELECT':
                type = e.hasAttribute('multiple') ? 'MULTIPLE' : type;
                break;
            case 'INPUT':
                type = e.getAttribute('type').toUpperCase();
                break;
        }

        var name = e.getAttribute('name');

        if (type === 'MULTIPLE') {
            for (var _i = 0; _i < e.length; _i++) {
                if (e[_i].selected) {
                    addNestedValue(target, name, e[_i].value);
                }
            }
        } else if (type !== 'RADIO' && type !== 'CHECKBOX' || e.checked) {
            addNestedValue(target, name, e.value);
        }
    }

    return target;
};

module.exports = getFormFields;

/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var addNestedValue = function addNestedValue(pojo, name, value) {
    var recurse = function recurse(pojo, keys, value) {
        var key = keys.shift();
        var next = keys[0];
        if (next === '') {
            // key is an array
            pojo[key] = pojo[key] || [];
            pojo[key].push(value);
        } else if (next) {
            // key is a parent key
            pojo[key] = pojo[key] || {};
            recurse(pojo[key], keys, value);
        } else {
            // key is the key for value
            pojo[key] = value;
        }

        return pojo;
    };

    var keys = name.split('[').map(function (k) {
        return k.replace(/]$/, '');
    });
    return recurse(pojo, keys, value);
};

module.exports = addNestedValue;

/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var store = __webpack_require__(44);
var messages = __webpack_require__(138);
var shuffleArr = __webpack_require__(96);

var signUpSuccess = function signUpSuccess() {
    // select random signUpSuccess message to display and clear forms
    $("#auth-message").text(shuffleArr(messages.signUpSuccess)[0]);
    $("form").trigger("reset");
};

var signUpFailure = function signUpFailure() {
    // select random signUpFailure message to display and clear forms
    $("#auth-message").text(shuffleArr(messages.signUpFailure)[0]);
    $("form").trigger("reset");
};

var signInSuccess = function signInSuccess(responseData) {
    // select random signInSuccess message to display and clear forms
    $("#auth-message").text(shuffleArr(messages.signInSuccess)[0]);
    $("form").trigger("reset");
    // write user data to the store
    store.user = responseData.user;
    // toggle which forms to display
    $("#sign-in-form").hide();
    $("#sign-up-form").hide();
    $("#change-password-form").show();
    $("#sign-out-form").show();
    // switch sidenav button text and show signout button
    $("#open-auth").text("Change Password");
    $("#sign-out-link").show();
    // add username to sidenav display and add user rank
    $("#username").text("" + store.user.email);
    $("#user-rank").text("Pledge");
};

var signInFailure = function signInFailure() {
    // select random signInFailure message to display and clear forms
    $("#auth-message").text(shuffleArr(messages.signInFailure)[0]);
    $("form").trigger("reset");
};

var changePasswordSuccess = function changePasswordSuccess() {
    // select random changePasswordSuccess message to display and clear forms
    $("#auth-message").text(shuffleArr(messages.changePwSuccess)[0]);
    $("form").trigger("reset");
};

var changePasswordFailure = function changePasswordFailure() {
    // select random changePasswordFailure message to display and clear forms
    $("#auth-message").text(shuffleArr(messages.changePwFailure)[0]);
    $("form").trigger("reset");
};

var signOutSuccess = function signOutSuccess() {
    // display message and reset forms
    $("#auth-message").text(shuffleArr(messages.signOutSuccess)[0]);
    $("form").trigger("reset");
    // clear user data
    store.user.token = "";
    // toggle which forms to display
    $("#change-password-form").hide();
    $("#sign-out-form").hide();
    $("#sign-in-form").show();
    $("#sign-up-form").show();
    // switch sidenav button text and hide signout button
    $("#open-auth").text("Sign In / Sign Up");
    $("#sign-out-link").hide();
    // clear username in sidenav display and change rank to not logged in
    $("#username").text("");
    $("#user-rank").text("Not Logged In");
};

var signOutFailure = function signOutFailure() {
    // display random signOutFailure message
    $("#auth-message").text(shuffleArr(messages.signOutFailure)[0]);
};

var init = function init() {
    // hide irrellevant forms
    $("#change-password-form").hide();
    $("#sign-out-form").hide();
    $("#sign-out-link").hide();
};

module.exports = {
    signUpSuccess: signUpSuccess,
    signUpFailure: signUpFailure,
    signInSuccess: signInSuccess,
    signInFailure: signInFailure,
    changePasswordSuccess: changePasswordSuccess,
    changePasswordFailure: changePasswordFailure,
    signOutFailure: signOutFailure,
    signOutSuccess: signOutSuccess,
    init: init
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var config = __webpack_require__(97);
var store = __webpack_require__(44);

var signUp = function signUp(formData) {
    return $.ajax({
        url: config.apiUrl + "sign-up",
        method: "POST",
        data: formData
    });
};

var signIn = function signIn(formData) {
    return $.ajax({
        url: config.apiUrl + "sign-in",
        method: "POST",
        data: formData
    });
};

var changePassword = function changePassword(formData) {
    return $.ajax({
        url: config.apiUrl + "change-password",
        method: "PATCH",
        headers: {
            Authorization: "Token token=" + store.user.token
        },
        data: formData
    });
};

var signOut = function signOut() {
    return $.ajax({
        url: config.apiUrl + "sign-out",
        method: "DELETE",
        headers: {
            Authorization: "Token token=" + store.user.token
        }
    });
};

module.exports = {
    signUp: signUp,
    signIn: signIn,
    changePassword: changePassword,
    signOut: signOut
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * vivus - JavaScript library to make drawing animation on SVG
 * @version v0.4.4
 * @link https://github.com/maxwellito/vivus
 * @license MIT
 */



(function () {

  'use strict';

/**
 * Pathformer
 * Beta version
 *
 * Take any SVG version 1.1 and transform
 * child elements to 'path' elements
 *
 * This code is purely forked from
 * https://github.com/Waest/SVGPathConverter
 */

/**
 * Class constructor
 *
 * @param {DOM|String} element Dom element of the SVG or id of it
 */
function Pathformer(element) {
  // Test params
  if (typeof element === 'undefined') {
    throw new Error('Pathformer [constructor]: "element" parameter is required');
  }

  // Set the element
  if (element.constructor === String) {
    element = document.getElementById(element);
    if (!element) {
      throw new Error('Pathformer [constructor]: "element" parameter is not related to an existing ID');
    }
  }
  if (element instanceof window.SVGElement || 
      element instanceof window.SVGGElement ||
      /^svg$/i.test(element.nodeName)) {
    this.el = element;
  } else {
    throw new Error('Pathformer [constructor]: "element" parameter must be a string or a SVGelement');
  }

  // Start
  this.scan(element);
}

/**
 * List of tags which can be transformed
 * to path elements
 *
 * @type {Array}
 */
Pathformer.prototype.TYPES = ['line', 'ellipse', 'circle', 'polygon', 'polyline', 'rect'];

/**
 * List of attribute names which contain
 * data. This array list them to check if
 * they contain bad values, like percentage.
 *
 * @type {Array}
 */
Pathformer.prototype.ATTR_WATCH = ['cx', 'cy', 'points', 'r', 'rx', 'ry', 'x', 'x1', 'x2', 'y', 'y1', 'y2'];

/**
 * Finds the elements compatible for transform
 * and apply the liked method
 *
 * @param  {object} options Object from the constructor
 */
Pathformer.prototype.scan = function (svg) {
  var fn, element, pathData, pathDom,
      elements = svg.querySelectorAll(this.TYPES.join(','));

  for (var i = 0; i < elements.length; i++) {
    element = elements[i];
    fn = this[element.tagName.toLowerCase() + 'ToPath'];
    pathData = fn(this.parseAttr(element.attributes));
    pathDom = this.pathMaker(element, pathData);
    element.parentNode.replaceChild(pathDom, element);
  }
};


/**
 * Read `line` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Line element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.lineToPath = function (element) {
  var newElement = {},
      x1 = element.x1 || 0,
      y1 = element.y1 || 0,
      x2 = element.x2 || 0,
      y2 = element.y2 || 0;

  newElement.d = 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2;
  return newElement;
};

/**
 * Read `rect` element to extract and transform
 * data, to make it ready for a `path` object.
 * The radius-border is not taken in charge yet.
 * (your help is more than welcomed)
 *
 * @param  {DOMelement} element Rect element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.rectToPath = function (element) {
  var newElement = {},
      x      = parseFloat(element.x)      || 0,
      y      = parseFloat(element.y)      || 0,
      width  = parseFloat(element.width)  || 0,
      height = parseFloat(element.height) || 0;

  if (element.rx || element.ry) {
    var rx = parseInt(element.rx, 10) || -1,
        ry = parseInt(element.ry, 10) || -1;
    rx = Math.min(Math.max(rx < 0 ? ry : rx, 0), width/2);
    ry = Math.min(Math.max(ry < 0 ? rx : ry, 0), height/2);

    newElement.d = 'M ' + (x + rx) + ',' + y + ' ' +
                   'L ' + (x + width - rx) + ',' + y + ' ' +
                   'A ' + rx + ',' + ry + ',0,0,1,' + (x + width) + ',' + (y + ry) + ' ' +
                   'L ' + (x + width) + ',' + (y + height - ry) + ' ' +
                   'A ' + rx + ',' + ry + ',0,0,1,' + (x + width - rx) + ',' + (y + height) + ' ' +
                   'L ' + (x + rx) + ',' + (y + height) + ' ' +
                   'A ' + rx + ',' + ry + ',0,0,1,' + x + ',' + (y + height - ry) + ' ' +
                   'L ' + x + ',' + (y + ry) + ' ' +
                   'A ' + rx + ',' + ry + ',0,0,1,' + (x + rx) + ',' + y;
  }
  else {
    newElement.d = 'M' + x + ' ' + y + ' ' +
                   'L' + (x + width) + ' ' + y + ' ' +
                   'L' + (x + width) + ' ' + (y + height) + ' ' +
                   'L' + x + ' ' + (y + height) + ' Z';
  }
  return newElement;
};

/**
 * Read `polyline` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Polyline element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.polylineToPath = function (element) {
  var newElement = {},
      points = element.points.trim().split(' '),
      i, path;

  // Reformatting if points are defined without commas
  if (element.points.indexOf(',') === -1) {
    var formattedPoints = [];
    for (i = 0; i < points.length; i+=2) {
      formattedPoints.push(points[i] + ',' + points[i+1]);
    }
    points = formattedPoints;
  }

  // Generate the path.d value
  path = 'M' + points[0];
  for(i = 1; i < points.length; i++) {
    if (points[i].indexOf(',') !== -1) {
      path += 'L' + points[i];
    }
  }
  newElement.d = path;
  return newElement;
};

/**
 * Read `polygon` element to extract and transform
 * data, to make it ready for a `path` object.
 * This method rely on polylineToPath, because the
 * logic is similar. The path created is just closed,
 * so it needs an 'Z' at the end.
 *
 * @param  {DOMelement} element Polygon element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.polygonToPath = function (element) {
  var newElement = Pathformer.prototype.polylineToPath(element);

  newElement.d += 'Z';
  return newElement;
};

/**
 * Read `ellipse` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element ellipse element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.ellipseToPath = function (element) {
  var newElement = {},
      rx = parseFloat(element.rx) || 0,
      ry = parseFloat(element.ry) || 0,
      cx = parseFloat(element.cx) || 0,
      cy = parseFloat(element.cy) || 0,
      startX = cx - rx,
      startY = cy,
      endX = parseFloat(cx) + parseFloat(rx),
      endY = cy;

  newElement.d = 'M' + startX + ',' + startY +
                 'A' + rx + ',' + ry + ' 0,1,1 ' + endX + ',' + endY +
                 'A' + rx + ',' + ry + ' 0,1,1 ' + startX + ',' + endY;
  return newElement;
};

/**
 * Read `circle` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Circle element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.circleToPath = function (element) {
  var newElement = {},
      r  = parseFloat(element.r)  || 0,
      cx = parseFloat(element.cx) || 0,
      cy = parseFloat(element.cy) || 0,
      startX = cx - r,
      startY = cy,
      endX = parseFloat(cx) + parseFloat(r),
      endY = cy;
      
  newElement.d =  'M' + startX + ',' + startY +
                  'A' + r + ',' + r + ' 0,1,1 ' + endX + ',' + endY +
                  'A' + r + ',' + r + ' 0,1,1 ' + startX + ',' + endY;
  return newElement;
};

/**
 * Create `path` elements form original element
 * and prepared objects
 *
 * @param  {DOMelement} element  Original element to transform
 * @param  {object} pathData     Path data (from `toPath` methods)
 * @return {DOMelement}          Path element
 */
Pathformer.prototype.pathMaker = function (element, pathData) {
  var i, attr, pathTag = document.createElementNS('http://www.w3.org/2000/svg','path');
  for(i = 0; i < element.attributes.length; i++) {
    attr = element.attributes[i];
    if (this.ATTR_WATCH.indexOf(attr.name) === -1) {
      pathTag.setAttribute(attr.name, attr.value);
    }
  }
  for(i in pathData) {
    pathTag.setAttribute(i, pathData[i]);
  }
  return pathTag;
};

/**
 * Parse attributes of a DOM element to
 * get an object of attribute => value
 *
 * @param  {NamedNodeMap} attributes Attributes object from DOM element to parse
 * @return {object}                  Object of attributes
 */
Pathformer.prototype.parseAttr = function (element) {
  var attr, output = {};
  for (var i = 0; i < element.length; i++) {
    attr = element[i];
    // Check if no data attribute contains '%', or the transformation is impossible
    if (this.ATTR_WATCH.indexOf(attr.name) !== -1 && attr.value.indexOf('%') !== -1) {
      throw new Error('Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into \'path\' tags. Please use \'viewBox\'.');
    }
    output[attr.name] = attr.value;
  }
  return output;
};

  'use strict';

var setupEnv, requestAnimFrame, cancelAnimFrame, parsePositiveInt;

/**
 * Vivus
 * Beta version
 *
 * Take any SVG and make the animation
 * to give give the impression of live drawing
 *
 * This in more than just inspired from codrops
 * At that point, it's a pure fork.
 */

/**
 * Class constructor
 * option structure
 *   type: 'delayed'|'sync'|'oneByOne'|'script' (to know if the items must be drawn synchronously or not, default: delayed)
 *   duration: <int> (in frames)
 *   start: 'inViewport'|'manual'|'autostart' (start automatically the animation, default: inViewport)
 *   delay: <int> (delay between the drawing of first and last path)
 *   dashGap <integer> whitespace extra margin between dashes
 *   pathTimingFunction <function> timing animation function for each path element of the SVG
 *   animTimingFunction <function> timing animation function for the complete SVG
 *   forceRender <boolean> force the browser to re-render all updated path items
 *   selfDestroy <boolean> removes all extra styling on the SVG, and leaves it as original
 *
 * The attribute 'type' is by default on 'delayed'.
 *  - 'delayed'
 *    all paths are draw at the same time but with a
 *    little delay between them before start
 *  - 'sync'
 *    all path are start and finish at the same time
 *  - 'oneByOne'
 *    only one path is draw at the time
 *    the end of the first one will trigger the draw
 *    of the next one
 *
 * All these values can be overwritten individually
 * for each path item in the SVG
 * The value of frames will always take the advantage of
 * the duration value.
 * If you fail somewhere, an error will be thrown.
 * Good luck.
 *
 * @constructor
 * @this {Vivus}
 * @param {DOM|String}   element  Dom element of the SVG or id of it
 * @param {Object}       options  Options about the animation
 * @param {Function}     callback Callback for the end of the animation
 */
function Vivus (element, options, callback) {

  setupEnv();

  // Setup
  this.isReady = false;
  this.setElement(element, options);
  this.setOptions(options);
  this.setCallback(callback);

  if (this.isReady) {
    this.init();
  }
}

/**
 * Timing functions
 **************************************
 *
 * Default functions to help developers.
 * It always take a number as parameter (between 0 to 1) then
 * return a number (between 0 and 1)
 */
Vivus.LINEAR          = function (x) {return x;};
Vivus.EASE            = function (x) {return -Math.cos(x * Math.PI) / 2 + 0.5;};
Vivus.EASE_OUT        = function (x) {return 1 - Math.pow(1-x, 3);};
Vivus.EASE_IN         = function (x) {return Math.pow(x, 3);};
Vivus.EASE_OUT_BOUNCE = function (x) {
  var base = -Math.cos(x * (0.5 * Math.PI)) + 1,
    rate = Math.pow(base,1.5),
    rateR = Math.pow(1 - x, 2),
    progress = -Math.abs(Math.cos(rate * (2.5 * Math.PI) )) + 1;
  return (1- rateR) + (progress * rateR);
};


/**
 * Setters
 **************************************
 */

/**
 * Check and set the element in the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param {DOM|String}   element  SVG Dom element or id of it
 */
Vivus.prototype.setElement = function (element, options) {
  var onLoad, self;

  // Basic check
  if (typeof element === 'undefined') {
    throw new Error('Vivus [constructor]: "element" parameter is required');
  }

  // Set the element
  if (element.constructor === String) {
    element = document.getElementById(element);
    if (!element) {
      throw new Error('Vivus [constructor]: "element" parameter is not related to an existing ID');
    }
  }
  this.parentEl = element;

  // Load the SVG with XMLHttpRequest and extract the SVG
  if (options && options.file) {
    var self = this;
    onLoad = function (e) {
      var domSandbox = document.createElement('div');
      domSandbox.innerHTML = this.responseText;

      var svgTag = domSandbox.querySelector('svg');
      if (!svgTag) {
        throw new Error('Vivus [load]: Cannot find the SVG in the loaded file : ' + options.file);
      }

      self.el = svgTag
      self.el.setAttribute('width', '100%');
      self.el.setAttribute('height', '100%');
      self.parentEl.appendChild(self.el)
      self.isReady = true;
      self.init();
      self = null;
    }
    
    var oReq = new window.XMLHttpRequest();
    oReq.addEventListener('load', onLoad);
    oReq.open('GET', options.file);
    oReq.send();
    return;
  }

  switch (element.constructor) {
  case window.SVGSVGElement:
  case window.SVGElement:
  case window.SVGGElement:
    this.el = element;
    this.isReady = true;
    break;

  case window.HTMLObjectElement:
    self = this;
    onLoad = function (e) {
      if (self.isReady) {
        return;
      }
      self.el = element.contentDocument && element.contentDocument.querySelector('svg');
      if (!self.el && e) {
        throw new Error('Vivus [constructor]: object loaded does not contain any SVG');
      }
      else if (self.el) {
        if (element.getAttribute('built-by-vivus')) {
          self.parentEl.insertBefore(self.el, element);
          self.parentEl.removeChild(element);
          self.el.setAttribute('width', '100%');
          self.el.setAttribute('height', '100%');
        }
        self.isReady = true;
        self.init();
        self = null;
      }
    };

    if (!onLoad()) {
      element.addEventListener('load', onLoad);
    }
    break;

  default:
    throw new Error('Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)');
  }
};

/**
 * Set up user option to the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {object} options Object from the constructor
 */
Vivus.prototype.setOptions = function (options) {
  var allowedTypes = ['delayed', 'sync', 'async', 'nsync', 'oneByOne', 'scenario', 'scenario-sync'];
  var allowedStarts =  ['inViewport', 'manual', 'autostart'];

  // Basic check
  if (options !== undefined && options.constructor !== Object) {
    throw new Error('Vivus [constructor]: "options" parameter must be an object');
  }
  else {
    options = options || {};
  }

  // Set the animation type
  if (options.type && allowedTypes.indexOf(options.type) === -1) {
    throw new Error('Vivus [constructor]: ' + options.type + ' is not an existing animation `type`');
  }
  else {
    this.type = options.type || allowedTypes[0];
  }

  // Set the start type
  if (options.start && allowedStarts.indexOf(options.start) === -1) {
    throw new Error('Vivus [constructor]: ' + options.start + ' is not an existing `start` option');
  }
  else {
    this.start = options.start || allowedStarts[0];
  }

  this.isIE         = (window.navigator.userAgent.indexOf('MSIE') !== -1 || window.navigator.userAgent.indexOf('Trident/') !== -1 || window.navigator.userAgent.indexOf('Edge/') !== -1 );
  this.duration     = parsePositiveInt(options.duration, 120);
  this.delay        = parsePositiveInt(options.delay, null);
  this.dashGap      = parsePositiveInt(options.dashGap, 1);
  this.forceRender  = options.hasOwnProperty('forceRender') ? !!options.forceRender : this.isIE;
  this.reverseStack = !!options.reverseStack;
  this.selfDestroy  = !!options.selfDestroy;
  this.onReady      = options.onReady;
  this.map          = [];
  this.frameLength  = this.currentFrame = this.delayUnit = this.speed = this.handle = null;

  this.ignoreInvisible = options.hasOwnProperty('ignoreInvisible') ? !!options.ignoreInvisible : false;

  this.animTimingFunction = options.animTimingFunction || Vivus.LINEAR;
  this.pathTimingFunction = options.pathTimingFunction || Vivus.LINEAR;

  if (this.delay >= this.duration) {
    throw new Error('Vivus [constructor]: delay must be shorter than duration');
  }
};

/**
 * Set up callback to the instance
 * The method will not return enything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {Function} callback Callback for the animation end
 */
Vivus.prototype.setCallback = function (callback) {
  // Basic check
  if (!!callback && callback.constructor !== Function) {
    throw new Error('Vivus [constructor]: "callback" parameter must be a function');
  }
  this.callback = callback || function () {};
};


/**
 * Core
 **************************************
 */

/**
 * Map the svg, path by path.
 * The method return nothing, it just fill the
 * `map` array. Each item in this array represent
 * a path element from the SVG, with informations for
 * the animation.
 *
 * ```
 * [
 *   {
 *     el: <DOMobj> the path element
 *     length: <number> length of the path line
 *     startAt: <number> time start of the path animation (in frames)
 *     duration: <number> path animation duration (in frames)
 *   },
 *   ...
 * ]
 * ```
 *
 */
Vivus.prototype.mapping = function () {
  var i, paths, path, pAttrs, pathObj, totalLength, lengthMeter, timePoint;
  timePoint = totalLength = lengthMeter = 0;
  paths = this.el.querySelectorAll('path');

  for (i = 0; i < paths.length; i++) {
    path = paths[i];
    if (this.isInvisible(path)) {
      continue;
    }
    pathObj = {
      el: path,
      length: Math.ceil(path.getTotalLength())
    };
    // Test if the path length is correct
    if (isNaN(pathObj.length)) {
      if (window.console && console.warn) {
        console.warn('Vivus [mapping]: cannot retrieve a path element length', path);
      }
      continue;
    }
    this.map.push(pathObj);
    path.style.strokeDasharray  = pathObj.length + ' ' + (pathObj.length + this.dashGap * 2);
    path.style.strokeDashoffset = pathObj.length + this.dashGap;
    pathObj.length += this.dashGap;
    totalLength += pathObj.length;

    this.renderPath(i);
  }

  totalLength = totalLength === 0 ? 1 : totalLength;
  this.delay = this.delay === null ? this.duration / 3 : this.delay;
  this.delayUnit = this.delay / (paths.length > 1 ? paths.length - 1 : 1);

  // Reverse stack if asked
  if (this.reverseStack) {
    this.map.reverse();
  }

  for (i = 0; i < this.map.length; i++) {
    pathObj = this.map[i];

    switch (this.type) {
    case 'delayed':
      pathObj.startAt = this.delayUnit * i;
      pathObj.duration = this.duration - this.delay;
      break;

    case 'oneByOne':
      pathObj.startAt = lengthMeter / totalLength * this.duration;
      pathObj.duration = pathObj.length / totalLength * this.duration;
      break;

    case 'sync':
    case 'async':
    case 'nsync':
      pathObj.startAt = 0;
      pathObj.duration = this.duration;
      break;

    case 'scenario-sync':
      path = pathObj.el;
      pAttrs = this.parseAttr(path);
      pathObj.startAt = timePoint + (parsePositiveInt(pAttrs['data-delay'], this.delayUnit) || 0);
      pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
      timePoint = pAttrs['data-async'] !== undefined ? pathObj.startAt : pathObj.startAt + pathObj.duration;
      this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
      break;

    case 'scenario':
      path = pathObj.el;
      pAttrs = this.parseAttr(path);
      pathObj.startAt = parsePositiveInt(pAttrs['data-start'], this.delayUnit) || 0;
      pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
      this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
      break;
    }
    lengthMeter += pathObj.length;
    this.frameLength = this.frameLength || this.duration;
  }
};

/**
 * Interval method to draw the SVG from current
 * position of the animation. It update the value of
 * `currentFrame` and re-trace the SVG.
 *
 * It use this.handle to store the requestAnimationFrame
 * and clear it one the animation is stopped. So this
 * attribute can be used to know if the animation is
 * playing.
 *
 * Once the animation at the end, this method will
 * trigger the Vivus callback.
 *
 */
Vivus.prototype.drawer = function () {
  var self = this;
  this.currentFrame += this.speed;

  if (this.currentFrame <= 0) {
    this.stop();
    this.reset();
  } else if (this.currentFrame >= this.frameLength) {
    this.stop();
    this.currentFrame = this.frameLength;
    this.trace();
    if (this.selfDestroy) {
      this.destroy();
    }
  } else {
    this.trace();
    this.handle = requestAnimFrame(function () {
      self.drawer();
    });
    return;
  }

  this.callback(this);
  if (this.instanceCallback) {
    this.instanceCallback(this);
    this.instanceCallback = null;
  }
};

/**
 * Draw the SVG at the current instant from the
 * `currentFrame` value. Here is where most of the magic is.
 * The trick is to use the `strokeDashoffset` style property.
 *
 * For optimisation reasons, a new property called `progress`
 * is added in each item of `map`. This one contain the current
 * progress of the path element. Only if the new value is different
 * the new value will be applied to the DOM element. This
 * method save a lot of resources to re-render the SVG. And could
 * be improved if the animation couldn't be played forward.
 *
 */
Vivus.prototype.trace = function () {
  var i, progress, path, currentFrame;
  currentFrame = this.animTimingFunction(this.currentFrame / this.frameLength) * this.frameLength;
  for (i = 0; i < this.map.length; i++) {
    path = this.map[i];
    progress = (currentFrame - path.startAt) / path.duration;
    progress = this.pathTimingFunction(Math.max(0, Math.min(1, progress)));
    if (path.progress !== progress) {
      path.progress = progress;
      path.el.style.strokeDashoffset = Math.floor(path.length * (1 - progress));
      this.renderPath(i);
    }
  }
};

/**
 * Method forcing the browser to re-render a path element
 * from it's index in the map. Depending on the `forceRender`
 * value.
 * The trick is to replace the path element by it's clone.
 * This practice is not recommended because it's asking more
 * ressources, too much DOM manupulation..
 * but it's the only way to let the magic happen on IE.
 * By default, this fallback is only applied on IE.
 *
 * @param  {Number} index Path index
 */
Vivus.prototype.renderPath = function (index) {
  if (this.forceRender && this.map && this.map[index]) {
    var pathObj = this.map[index],
        newPath = pathObj.el.cloneNode(true);
    pathObj.el.parentNode.replaceChild(newPath, pathObj.el);
    pathObj.el = newPath;
  }
};

/**
 * When the SVG object is loaded and ready,
 * this method will continue the initialisation.
 *
 * This this mainly due to the case of passing an
 * object tag in the constructor. It will wait
 * the end of the loading to initialise.
 *
 */
Vivus.prototype.init = function () {
  // Set object variables
  this.frameLength = 0;
  this.currentFrame = 0;
  this.map = [];

  // Start
  new Pathformer(this.el);
  this.mapping();
  this.starter();

  if (this.onReady) {
    this.onReady(this);
  }
};

/**
 * Trigger to start of the animation.
 * Depending on the `start` value, a different script
 * will be applied.
 *
 * If the `start` value is not valid, an error will be thrown.
 * Even if technically, this is impossible.
 *
 */
Vivus.prototype.starter = function () {
  switch (this.start) {
  case 'manual':
    return;

  case 'autostart':
    this.play();
    break;

  case 'inViewport':
    var self = this,
    listener = function () {
      if (self.isInViewport(self.parentEl, 1)) {
        self.play();
        window.removeEventListener('scroll', listener);
      }
    };
    window.addEventListener('scroll', listener);
    listener();
    break;
  }
};


/**
 * Controls
 **************************************
 */

/**
 * Get the current status of the animation between
 * three different states: 'start', 'progress', 'end'.
 * @return {string} Instance status
 */
Vivus.prototype.getStatus = function () {
  return this.currentFrame === 0 ? 'start' : this.currentFrame === this.frameLength ? 'end' : 'progress';
};

/**
 * Reset the instance to the initial state : undraw
 * Be careful, it just reset the animation, if you're
 * playing the animation, this won't stop it. But just
 * make it start from start.
 *
 */
Vivus.prototype.reset = function () {
  return this.setFrameProgress(0);
};

/**
 * Set the instance to the final state : drawn
 * Be careful, it just set the animation, if you're
 * playing the animation on rewind, this won't stop it.
 * But just make it start from the end.
 *
 */
Vivus.prototype.finish = function () {
  return this.setFrameProgress(1);
};

/**
 * Set the level of progress of the drawing.
 *
 * @param {number} progress Level of progress to set
 */
Vivus.prototype.setFrameProgress = function (progress) {
  progress = Math.min(1, Math.max(0, progress));
  this.currentFrame = Math.round(this.frameLength * progress);
  this.trace();
  return this;
};

/**
 * Play the animation at the desired speed.
 * Speed must be a valid number (no zero).
 * By default, the speed value is 1.
 * But a negative value is accepted to go forward.
 *
 * And works with float too.
 * But don't forget we are in JavaScript, se be nice
 * with him and give him a 1/2^x value.
 *
 * @param  {number} speed Animation speed [optional]
 */
Vivus.prototype.play = function (speed, callback) {
  this.instanceCallback = null;

  if (speed && typeof speed === 'function') {
    this.instanceCallback = speed; // first parameter is actually the callback function
    speed = null;
  }
  else if (speed && typeof speed !== 'number') {
    throw new Error('Vivus [play]: invalid speed');
  }
  // if the first parameter wasn't the callback, check if the seconds was
  if (callback && typeof(callback) === 'function' && !this.instanceCallback) {
    this.instanceCallback = callback;
  }


  this.speed = speed || 1;
  if (!this.handle) {
    this.drawer();
  }
  return this;
};

/**
 * Stop the current animation, if on progress.
 * Should not trigger any error.
 *
 */
Vivus.prototype.stop = function () {
  if (this.handle) {
    cancelAnimFrame(this.handle);
    this.handle = null;
  }
  return this;
};

/**
 * Destroy the instance.
 * Remove all bad styling attributes on all
 * path tags
 *
 */
Vivus.prototype.destroy = function () {
  this.stop();
  var i, path;
  for (i = 0; i < this.map.length; i++) {
    path = this.map[i];
    path.el.style.strokeDashoffset = null;
    path.el.style.strokeDasharray = null;
    this.renderPath(i);
  }
};


/**
 * Utils methods
 * include methods from Codrops
 **************************************
 */

/**
 * Method to best guess if a path should added into
 * the animation or not.
 *
 * 1. Use the `data-vivus-ignore` attribute if set
 * 2. Check if the instance must ignore invisible paths
 * 3. Check if the path is visible
 *
 * For now the visibility checking is unstable.
 * It will be used for a beta phase.
 *
 * Other improvments are planned. Like detecting
 * is the path got a stroke or a valid opacity.
 */
Vivus.prototype.isInvisible = function (el) {
  var rect,
    ignoreAttr = el.getAttribute('data-ignore');

  if (ignoreAttr !== null) {
    return ignoreAttr !== 'false';
  }

  if (this.ignoreInvisible) {
    rect = el.getBoundingClientRect();
    return !rect.width && !rect.height;
  }
  else {
    return false;
  }
};

/**
 * Parse attributes of a DOM element to
 * get an object of {attributeName => attributeValue}
 *
 * @param  {object} element DOM element to parse
 * @return {object}         Object of attributes
 */
Vivus.prototype.parseAttr = function (element) {
  var attr, output = {};
  if (element && element.attributes) {
    for (var i = 0; i < element.attributes.length; i++) {
      attr = element.attributes[i];
      output[attr.name] = attr.value;
    }
  }
  return output;
};

/**
 * Reply if an element is in the page viewport
 *
 * @param  {object} el Element to observe
 * @param  {number} h  Percentage of height
 * @return {boolean}
 */
Vivus.prototype.isInViewport = function (el, h) {
  var scrolled   = this.scrollY(),
    viewed       = scrolled + this.getViewportH(),
    elBCR        = el.getBoundingClientRect(),
    elHeight     = elBCR.height,
    elTop        = scrolled + elBCR.top,
    elBottom     = elTop + elHeight;

  // if 0, the element is considered in the viewport as soon as it enters.
  // if 1, the element is considered in the viewport only when it's fully inside
  // value in percentage (1 >= h >= 0)
  h = h || 0;

  return (elTop + elHeight * h) <= viewed && (elBottom) >= scrolled;
};


/**
 * Get the viewport height in pixels
 *
 * @return {integer} Viewport height
 */
Vivus.prototype.getViewportH = function () {
  var client = this.docElem.clientHeight,
    inner = window.innerHeight;

  if (client < inner) {
    return inner;
  }
  else {
    return client;
  }
};

/**
 * Get the page Y offset
 *
 * @return {integer} Page Y offset
 */
Vivus.prototype.scrollY = function () {
  return window.pageYOffset || this.docElem.scrollTop;
};

setupEnv = function () {

  if (Vivus.prototype.docElem) {
    return;
  }

  /**
   * Alias for document element
   *
   * @type {DOMelement}
   */
  Vivus.prototype.docElem = window.document.documentElement;

  /**
   * Alias for `requestAnimationFrame` or
   * `setTimeout` function for deprecated browsers.
   *
   */
  requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback){
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  /**
   * Alias for `cancelAnimationFrame` or
   * `cancelTimeout` function for deprecated browsers.
   *
   */
  cancelAnimFrame = (function () {
    return (
      window.cancelAnimationFrame       ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame    ||
      window.oCancelAnimationFrame      ||
      window.msCancelAnimationFrame     ||
      function(id){
        return window.clearTimeout(id);
      }
    );
  })();
};

/**
 * Parse string to integer.
 * If the number is not positive or null
 * the method will return the default value
 * or 0 if undefined
 *
 * @param {string} value String to parse
 * @param {*} defaultValue Value to return if the result parsed is invalid
 * @return {number}
 *
 */
parsePositiveInt = function (value, defaultValue) {
  var output = parseInt(value, 10);
  return (output >= 0) ? output : defaultValue;
};


  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return Vivus;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Vivus;
  } else {
    // Browser globals
    window.Vivus = Vivus;
  }

}());


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strokeColor = "rgba(255, 255, 255, .8)";

// 5 svgs of both letters, made in illustrator and slightly modified to remove unneeded junk

var Xs = ["\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M9.5,11c0,0,45.5,54.5,84,82.5S189,181,189,188\"\n            />\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M9.5,188c0,0,14-19,37-36.5s40.5-37,42.5-41\n                S128,73,138.5,62s43-34.5,50.5-53.5\"\n            />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M9.5,9.5c0,0,42.5,26.5,84.5,82s92,100,93.5,100\"\n            />\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M187.5,9.5c0,0-22,24.5-31.5,33.5s-38,33-42,37.5\n                s-22.5,23-24,26S72.5,132,55.5,148s-46,43.5-46,43.5\"\n            />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M10.5,8.5c0,0,21,30,41.5,50s63.5,51,70,59\n                s67,73,67,73\"\n            />\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M10.5,190.5c0,0,36-44,54.5-58.5s57-50,65.5-58\n                s46-41.5,58.5-65.5\"\n            />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M13,8c0,0,28,38,62,70s75.5,71,82.5,78\n                s30.5,33,30.5,33\"\n            />\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M9.5,189c0,0,16-22.5,40-39.5s49-56,64.5-67.5\n                s62.5-56.5,74-74\"\n            />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M9,12.5c0,0,46.5,36.5,55,45s31.5,35,39.5,42.5\n                s47.5,47,47.5,47s33.5,40,37,41.5s3.5,1.5,3.5,1.5\"\n            />\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M191.5,12.5c0,0-10.5,11.5-16,16S139,59,137,62.5\n                s-50,50.5-61,61s-46.5,46.5-51,52S9,193,9,193\"\n            />\n        </svg>\n    "];

var Os = ["\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n        <path\n            fill=\"none\"\n            stroke=\"" + strokeColor + "\"\n            stroke-width=\"6\"\n            stroke-miterlimit=\"10\"\n            d=\"M45,24c0,0-19,11.5-30,41.5S1,131,30,160\n        s45.5,35,75,33.5s54.5-17,69.5-40.5s23-48,17.5-70s-27-55.5-44-63.5S85,7,77,10S37,26,33,27\"\n        />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M84.5,10.5c0,0-38.5,5.5-53,31s-31,37-23.5,72\n            S32.5,172,59.5,185s66.5,15,94-4.5s43-52.5,41.5-77.5s-17-60-31-71s-27.5-17.5-42.5-21.5S103,5,96,6s-17,4-22.5,13.5\"\n            />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M11,101c0,0-0.5,33,10.5,49s36.5,37,55,42\n            s60.5-2,71-7s32-24.5,36.5-35.5S196,104,195,94s-4-39-21-53.5S128,4,97,7.5s-52.5,19-58.5,27S14.493,62,10.997,77.5\n            s-9.94,38.312-3.997,43S20.5,131,20.5,131\"\n            />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M37.5,36c0,0-28.5,15.5-28,59.5S23,158,37.5,171\n            S82,200.5,116,193.5s56.5-27,63-44.5s21.5-38,10-80s-50-55.5-61-59S91.5,0,73,7.5S35,27.5,32,32s-8.5,20.5-8.5,23.5\"\n            />\n        </svg>\n    ", "\n        <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            viewBox=\"0 0 200 200\"\n        >\n            <path\n                fill=\"none\"\n                stroke=\"" + strokeColor + "\"\n                stroke-width=\"6\"\n                stroke-miterlimit=\"10\"\n                d=\"M71.04,18.296c0,0-27.564,9.844-42.331,28.549\n            C13.943,65.549,2.622,104.435,16.896,138.89c14.274,34.455,39.377,50.698,48.729,52.175s33.471,8.367,57.589,0\n            c24.118-8.368,42.822-23.627,47.253-23.627c4.43,0,15.751-19.196,19.196-35.439s5.414-54.636-12.798-77.77\n            c-18.212-23.134-29.533-43.315-53.651-46.761C99.096,4.022,66.61,4.022,55.289,14.851S39.538,49.306,39.538,49.306\"\n            />\n        </svg>\n    "];

module.exports = { Os: Os, Xs: Xs };

/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var game = __webpack_require__(139);
var api = __webpack_require__(140);
var ui = __webpack_require__(99);
var store = __webpack_require__(44);
var ai = __webpack_require__(357);
var config = __webpack_require__(97);

var onSelectSpace = function onSelectSpace(event) {
    // ignore request if it is AI's turn still
    if (store.requestlimits.selectSpace) return;
    // try to select that space (selectSpace will return false if space invalid)
    if (game.selectSpace(event.target)) {
        // if space selection was successful, get board and winner (null if no winner)
        var board = game.getBoard();
        var winner = game.getBoardWinner();
        // if game isn't over and AI is set to on, trigger an AI move
        if (!winner && store.settings.isVsAi) {
            // get the index of AI pick and select the element of that marker
            var aiPick = ai.chooseCell(board.cells, board.turn, store.settings.difficulty);
            var target = document.querySelector(".gameboard--marker[data-marker='" + aiPick + "']");
            // block space selection while AI is taking turn
            store.requestlimits.selectSpace = true;
            setTimeout(function () {
                // select space after timeout, timeout needed to not overload the API
                game.selectSpace(target);
                // allow space selection after timeout finishes
                store.requestlimits.selectSpace = false;
            }, config.appSettings.aiDelay);
        }
    }
};

var onReset = function onReset() {
    // reset board
    game.reset();
    var board = game.getBoard();
    // if turn is "O", select space for AI (tic tac brO is always O)
    if (board.turn === "o" && store.settings.isVsAi) {
        var aiPick = ai.chooseCell(board.cells, board.turn, store.settings.difficulty);
        var target = document.querySelector(".gameboard--marker[data-marker='" + aiPick + "']");
        // block space selection while ai is taking turn
        store.requestlimits.selectSpace = true;
        setTimeout(function () {
            // select space after timeout, timeout needed to not overload the API
            game.selectSpace(target);
            // allow space selection after timeout finishes
            store.requestlimits.selectSpace = false;
        }, config.appSettings.aiDelay);
    }
};

var onGetGameHistory = function onGetGameHistory() {
    // if user is logged in, get the game history
    if (store.user.token) {
        // make sure user isn't spamming requests since it will overload API
        if (!store.requestlimits.getGameHistory) {
            // limit requests to one per second
            store.requestlimits.getGameHistory = true;
            setTimeout(function () {
                store.requestlimits.getGameHistory = false;
            }, 1000);
            // get history then pass payload to ui function
            api.getGameHistory().then(ui.displayGameHistory);
        }
        return true;
    } else {
        // if user not logged in ask them to sign in
        ui.askToSignIn();
        return false;
    }
};

module.exports = { onSelectSpace: onSelectSpace, onReset: onReset, onGetGameHistory: onGetGameHistory };

/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Gameboard = __webpack_require__(98);
var shuffleArr = __webpack_require__(96);
// shuffleArr algorithm taken from Fisher Yates algorithm

// helper functions

var countOpenCells = function countOpenCells(cells) {
    // counts remaining open cells, returns the count
    return cells.filter(function (cell) {
        return cell;
    }).length;
};

var isWinnable = function isWinnable(cells, gamepiece) {
    // checks if game is winnable by given gamepiece, returns the index of win or undefined
    for (var i = 0; i < 9; i++) {
        // loop through each space checking if it would win the game
        var testSpace = new Gameboard(gamepiece, [].concat(_toConsumableArray(cells)));
        testSpace.selectCell(i);
        if (testSpace.checkForWinner()) return i;
    }
    return undefined;
};

var rotateClockwise = function rotateClockwise(cells) {
    // rotates an array of cells clockwise, returns rotated array
    return [].concat(cells[6], cells[3], cells[0], cells[7], cells[4], cells[1], cells[8], cells[5], cells[2]);
};

var isForked = function isForked(cells, gamepiece) {
    // checks if game is forked by gamepiece, returns boolean
    var testCells = [].concat(_toConsumableArray(cells)); // copy cells
    for (var i = 0; i < 4; i++) {
        // loop through 4 sides of the gameboard, rotating it clockwise on each iteration
        if (gamepiece === testCells[0] && gamepiece === testCells[2] && gamepiece === testCells[4]) {
            // if first style of fork is set up, check if there are two open slots to win
            if ([testCells[1], testCells[6], testCells[8]].join().length < 4) {
                return true;
            }
        }
        if (gamepiece === testCells[0] && gamepiece === testCells[2] && gamepiece === testCells[8]) {
            // if second style of fork is set up, check if there are two open slots to win
            if ([testCells[1], testCells[4], testCells[5]].join().length < 4) {
                return true;
            }
        }
        // rotate test cells
        testCells = rotateClockwise(testCells);
    }
    // if no fork found, return false
    return false;
};

var isForkable = function isForkable(cells, gamepiece) {
    // takes cells and a gamepiece and returns index to fork if forkable, undefined if unforkable
    for (var i = 0; i < 9; i++) {
        // loop through cells, checking if placing gamepiece there creates a fork
        var test = new Gameboard(gamepiece, [].concat(_toConsumableArray(cells)));
        if (test.selectCell(i)) {
            // if cell is selectable and it causes a fork, return cell
            if (isForked(test.cells, gamepiece)) return i;
        }
    }
    return undefined;
};

var selectCorner = function selectCorner(cells, opponentGamepiece) {
    // selects a corner space if available, returns index or undefined if no corners open
    // check if there is an opposite corner available
    if (cells[0] === opponentGamepiece && cells[8] === "") return 8;
    if (cells[8] === opponentGamepiece && cells[0] === "") return 0;
    if (cells[2] === opponentGamepiece && cells[6] === "") return 6;
    if (cells[6] === opponentGamepiece && cells[2] === "") return 2;
    // check for empty corner, return random empty corner
    var corners = shuffleArr([0, 2, 6, 8]);
    for (var i = 0; i < 4; i++) {
        if (!cells[corners[i]]) return corners[i];
    }
    return undefined;
};

var selectSide = function selectSide(cells) {
    // selects a random open side, returns the index if available, undefined if not
    var sides = shuffleArr([1, 5, 7, 3]);
    for (var i = 0; i < 4; i++) {
        if (!cells[sides[i]]) return sides[i];
    }
    return undefined;
};

// eslint-disable-next-line
var print = function print(cells) {
    // arranges cells in a grid for logging to console
    var str = cells.map(function (cell) {
        return cell || " ";
    }).join("|");
    console.log("|" + str.slice(0, 6));
    console.log("|" + str.slice(6, 12));
    console.log("|" + str.slice(12, 17) + "|");
};

var rand1to100 = function rand1to100() {
    // selects a random number from 1 to 100
    return Math.floor(Math.random() * 100) + 1;
};

var chooseCell = function chooseCell(cells, gamepiece, difficulty) {
    // chooses a cell for ai to pick, based on a given difficulty level 0-2
    // returns the index of selection, undefined if gameboard is full

    var opponentGamepiece = gamepiece === "x" ? "o" : "x";

    // DIFFICULTY LOGIC
    // Based on difficulty, select % of the time to do correct move. Use random
    // number from 1 to 100 to set a boolean to true if rule should be ignored.
    // Array order [ easy, med, hard ], selected via index by difficulty param.
    var checkToBlockWin = [40, 80, 92][difficulty] > rand1to100();
    var checkToFork = [30, 70, 92][difficulty] > rand1to100();
    var checkToBlockFork = [20, 70, 85][difficulty] > rand1to100();

    // MAIN AI LOGIC
    // Follow steps from Newell and Simon's 1972 tic-tac-toe program

    // 1) if first move select a random corner or center space
    if (!countOpenCells(cells)) {
        // if all cells are open, return random corner or center
        return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];
    }

    // 2) check if winnable, if so return space to win; concat board squares to avoid mutation
    var winnable = isWinnable(cells, gamepiece);
    if (winnable !== undefined) return winnable;

    // 3) check if block needed
    if (checkToBlockWin) {
        var blockable = isWinnable(cells, opponentGamepiece);
        if (blockable !== undefined) return blockable;
    }

    // 4) check for fork opportunity
    if (checkToFork) {
        var forkable = isForkable(cells, gamepiece);
        if (forkable !== undefined) return forkable;
    }

    // 5) check for fork block
    if (checkToBlockFork) {
        var forkBlockable = isForkable(cells, opponentGamepiece);
        if (forkBlockable !== undefined) return forkBlockable;
    }

    // 6) check for center
    if (cells[4] === "") return 4;

    // 7) check for opposite corner to opponent or empty corner
    var selectCornerResult = selectCorner(cells, opponentGamepiece);
    if (selectCornerResult !== undefined) return selectCornerResult;

    // 8) check for empty side
    var selectSideResult = selectSide(cells);
    if (selectSideResult !== undefined) return selectSideResult;
};

module.exports = { chooseCell: chooseCell };

/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(359);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(101)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!../../node_modules/sass-loader/lib/loader.js??ref--2-3!./index.scss", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!../../node_modules/sass-loader/lib/loader.js??ref--2-3!./index.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(100)(false);
// imports


// module
exports.push([module.i, "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n/* Document\n   ========================================================================== */\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/* Sections\n     ========================================================================== */\n/**\n   * Remove the margin in all browsers.\n   */\nbody {\n  margin: 0; }\n\n/**\n   * Render the `main` element consistently in IE.\n   */\nmain {\n  display: block; }\n\n/**\n   * Correct the font size and margin on `h1` elements within `section` and\n   * `article` contexts in Chrome, Firefox, and Safari.\n   */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/* Grouping content\n     ========================================================================== */\n/**\n   * 1. Add the correct box sizing in Firefox.\n   * 2. Show the overflow in Edge and IE.\n   */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */ }\n\n/**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/* Text-level semantics\n     ========================================================================== */\n/**\n   * Remove the gray background on active links in IE 10.\n   */\na {\n  background-color: transparent; }\n\n/**\n   * 1. Remove the bottom border in Chrome 57-\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n   */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */ }\n\n/**\n   * Add the correct font weight in Chrome, Edge, and Safari.\n   */\nb,\nstrong {\n  font-weight: bolder; }\n\n/**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/**\n   * Add the correct font size in all browsers.\n   */\nsmall {\n  font-size: 80%; }\n\n/**\n   * Prevent `sub` and `sup` elements from affecting the line height in\n   * all browsers.\n   */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsub {\n  bottom: -0.25em; }\n\nsup {\n  top: -0.5em; }\n\n/* Embedded content\n     ========================================================================== */\n/**\n   * Remove the border on images inside links in IE 10.\n   */\nimg {\n  border-style: none; }\n\n/* Forms\n     ========================================================================== */\n/**\n   * 1. Change the font styles in all browsers.\n   * 2. Remove the margin in Firefox and Safari.\n   */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */ }\n\n/**\n   * Show the overflow in IE.\n   * 1. Show the overflow in Edge.\n   */\nbutton,\ninput {\n  /* 1 */\n  overflow: visible; }\n\n/**\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\n   * 1. Remove the inheritance of text transform in Firefox.\n   */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none; }\n\n/**\n   * Correct the inability to style clickable types in iOS and Safari.\n   */\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\n/**\n   * Remove the inner border and padding in Firefox.\n   */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0; }\n\n/**\n   * Restore the focus styles unset by the previous rule.\n   */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText; }\n\n/**\n   * Correct the padding in Firefox.\n   */\nfieldset {\n  padding: 0.35em 0.75em 0.625em; }\n\n/**\n   * 1. Correct the text wrapping in Edge and IE.\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\n   * 3. Remove the padding so developers are not caught out when they zero out\n   *    `fieldset` elements in all browsers.\n   */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */ }\n\n/**\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n   */\nprogress {\n  vertical-align: baseline; }\n\n/**\n   * Remove the default vertical scrollbar in IE 10+.\n   */\ntextarea {\n  overflow: auto; }\n\n/**\n   * 1. Add the correct box sizing in IE 10.\n   * 2. Remove the padding in IE 10.\n   */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n   * Correct the cursor style of increment and decrement buttons in Chrome.\n   */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n   * 1. Correct the odd appearance in Chrome and Safari.\n   * 2. Correct the outline style in Safari.\n   */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */ }\n\n/**\n   * Remove the inner padding in Chrome and Safari on macOS.\n   */\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n   * 1. Correct the inability to style clickable types in iOS and Safari.\n   * 2. Change font properties to `inherit` in Safari.\n   */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */ }\n\n/* Interactive\n     ========================================================================== */\n/*\n   * Add the correct display in Edge, IE 10+, and Firefox.\n   */\ndetails {\n  display: block; }\n\n/*\n   * Add the correct display in all browsers.\n   */\nsummary {\n  display: list-item; }\n\n/* Misc\n     ========================================================================== */\n/**\n   * Add the correct display in IE 10+.\n   */\ntemplate {\n  display: none; }\n\n/**\n   * Add the correct display in IE 10.\n   */\n[hidden] {\n  display: none; }\n\nform {\n  text-align: left; }\n\n.auth {\n  height: calc(100vh - 115px);\n  margin: 0 auto;\n  min-height: 100px;\n  overflow-y: scroll; }\n\n.nm-top-box {\n  display: -ms-grid;\n  display: grid;\n  -ms-grid-columns: 1fr 1fr;\n      grid-template-columns: 1fr 1fr;\n  height: 30vh;\n  margin-bottom: -10vh;\n  margin-top: 20px;\n  max-height: 400px;\n  min-height: 200px;\n  position: relative;\n  z-index: -1; }\n  .nm-top-box .nm-bro {\n    background: url(\"https://imagizer.imageshack.com/img921/6088/ZyPmRq.jpg\");\n    background-position: right;\n    background-repeat: no-repeat;\n    background-size: contain; }\n  .nm-top-box .nm-bro-chat .speech-bubble {\n    background: #81d4fa;\n    border-radius: .4em;\n    padding: 1em .5em;\n    position: relative; }\n    .nm-top-box .nm-bro-chat .speech-bubble::after {\n      border: 20px solid transparent;\n      border-bottom: 0;\n      border-left: 0;\n      border-right-color: #81d4fa;\n      content: '';\n      height: 0;\n      left: 0;\n      margin-left: -20px;\n      margin-top: -10px;\n      position: absolute;\n      top: 35%;\n      width: 0; }\n\n.gameboard {\n  background: #121212;\n  background: linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), url(\"https://imagizer.imageshack.com/img923/2593/gmqIsW.png\");\n  background-size: 200%;\n  border-radius: 5px;\n  display: -ms-grid;\n  display: grid;\n  -ms-grid-columns: (1fr)[3];\n      grid-template-columns: repeat(3, 1fr);\n  -ms-grid-rows: (1fr)[3];\n      grid-template-rows: repeat(3, 1fr);\n  height: 100%;\n  margin: auto;\n  padding: 10px;\n  transform: perspective(600px) rotateX(45deg);\n  width: 100%; }\n\n.gameboard--space {\n  border: 2px solid rgba(255, 255, 255, 0.8); }\n  .gameboard--space:nth-of-type(n+1):nth-of-type(-n+3) {\n    border-top: 0; }\n  .gameboard--space:nth-of-type(n+7):nth-of-type(-n+9) {\n    border-bottom: 0; }\n  .gameboard--space:nth-of-type(3n+1) {\n    border-left: 0; }\n  .gameboard--space:nth-of-type(3n+3) {\n    border-right: 0; }\n\n.nm-aspect-ratio-1x1 {\n  margin: 0 auto;\n  max-height: 50vh;\n  max-width: 50vh;\n  min-width: 280px;\n  position: relative;\n  width: 50%; }\n  .nm-aspect-ratio-1x1::after {\n    content: '';\n    display: block;\n    padding-top: 100%; }\n  .nm-aspect-ratio-1x1 .nm-aspect-ratio-1x1-content {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n\n.gameboard--marker {\n  background: none;\n  border: 0;\n  display: block;\n  font-size: 2em;\n  height: 100%;\n  margin: 0;\n  text-align: center;\n  width: 100%; }\n  .gameboard--marker svg {\n    height: 80%;\n    pointer-events: none;\n    width: 80%; }\n  .gameboard--marker:focus {\n    background: none; }\n\n.nm-footer {\n  bottom: 0;\n  position: fixed;\n  width: 100%; }\n  .nm-footer .container {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-pack: end;\n        justify-content: flex-end; }\n    .nm-footer .container a {\n      margin-bottom: 1em; }\n\np, th, td {\n  font-size: 1.4em; }\n\n.nm-history-table {\n  height: calc(100vh - 115px);\n  min-height: 100px;\n  overflow-y: scroll; }\n\n.nm-nav-flex-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n      justify-content: space-between; }\n\n.nm-logo {\n  font-size: 1.6em; }\n\nnav {\n  position: relative;\n  z-index: 10; }\n  nav .sidenav-trigger {\n    margin: 0; }\n\n.sidenav .nm-username {\n  font-size: 1.2em; }\n\n.sidenav .nm-user-rank {\n  display: block;\n  font-style: italic;\n  padding: 0 0 .5em; }\n\n.sidenav .subheader {\n  font-size: 1.4em;\n  font-weight: bold;\n  letter-spacing: 1.2px;\n  margin-top: .5em; }\n\n.nm-user-image {\n  opacity: .6; }\n\n.nm-user-image-bg {\n  background-color: #121212; }\n\n.nm-reset-warning {\n  color: #777;\n  font-size: .8em;\n  font-style: italic;\n  line-height: 1.5em;\n  padding: 1em 2em; }\n\nbody {\n  text-align: center; }\n  body::after {\n    content: url(\"https://imagizer.imageshack.com/v2/347x425q90/923/qQlR96.jpg\") url(\"https://imagizer.imageshack.com/img921/6088/ZyPmRq.jpg\");\n    height: 0;\n    overflow: hidden;\n    position: absolute;\n    width: 0;\n    z-index: -10; }\n\np {\n  font-size: 1em; }\n\na {\n  cursor: pointer; }\n\n.btn {\n  margin: .5em 0; }\n\n.nm-back {\n  margin: 0 auto; }\n\n.nm-back-wrapper {\n  bottom: 0;\n  left: 0;\n  padding-bottom: 1em;\n  position: absolute;\n  width: 100%; }\n", ""]);

// exports


/***/ })
],[141]);