'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (client) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return function chaiWebdriverIO(chai, utils) {
        var methodsToAdd = [_there2.default, _displayed2.default, _count2.default, _text2.default, _immediately2.default, _value2.default, _focus2.default, _enabled2.default, _attribute2.default];

        methodsToAdd.forEach(function (methodToAdd) {
            methodToAdd(client, chai, utils, options);
        });
    };
};

var _there = require('./assertions/there');

var _there2 = _interopRequireDefault(_there);

var _displayed = require('./assertions/displayed');

var _displayed2 = _interopRequireDefault(_displayed);

var _count = require('./assertions/count');

var _count2 = _interopRequireDefault(_count);

var _text = require('./assertions/text');

var _text2 = _interopRequireDefault(_text);

var _value = require('./assertions/value');

var _value2 = _interopRequireDefault(_value);

var _focus = require('./assertions/focus');

var _focus2 = _interopRequireDefault(_focus);

var _enabled = require('./assertions/enabled');

var _enabled2 = _interopRequireDefault(_enabled);

var _attribute = require('./assertions/attribute');

var _attribute2 = _interopRequireDefault(_attribute);

var _immediately = require('./chains/immediately');

var _immediately2 = _interopRequireDefault(_immediately);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }