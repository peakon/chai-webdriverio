'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = attribute;

var _defaultConfig = require('../util/default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var matches = function matches(expected, actual) {
    return expected instanceof RegExp ? !!actual.match(expected) : actual === expected;
};

var doesOneElementHaveAttribute = function doesOneElementHaveAttribute(client, selectorOrElement, attribute, expected) {
    var elements = void 0;
    var query = void 0;
    switch (typeof selectorOrElement === 'undefined' ? 'undefined' : _typeof(selectorOrElement)) {
        case 'string':
            elements = client.$$(selectorOrElement);
            query = 'matching <' + selectorOrElement + '>';
            break;
        case 'object':
            elements = [selectorOrElement];
            query = 'with <' + selectorOrElement.selector + '>';
            break;
        default:
            throw new Error(selectorOrElement + ' should be either String or Object');
    }
    var values = elements.map(function (element) {
        return element.getAttribute(attribute);
    });
    var filteredValues = values.filter(function (value) {
        return expected ? matches(expected, value) : true;
    });

    return {
        result: filteredValues.length > 0,
        values: values,
        query: query
    };
};

function attribute(client, chai, utils, options) {
    var config = (0, _defaultConfig2.default)(options);
    chai.Assertion.addMethod('attribute', function (attribute, expected) {
        var selectorOrElement = utils.flag(this, 'object');
        var negate = utils.flag(this, 'negate');
        var immediately = utils.flag(this, 'immediately');

        if (!immediately) {
            try {
                client.waitUntil(function () {
                    return doesOneElementHaveAttribute(client, selectorOrElement, attribute, expected).result === !negate;
                }, config.defaultWait);
            } catch (e) {
                // actual assertion is handled below
            }
        }

        var elementContainsAttribute = doesOneElementHaveAttribute(client, selectorOrElement, attribute, expected);
        this.assert(elementContainsAttribute.result, 'Expected an element ' + elementContainsAttribute.query + ' to contain attribute "' + attribute + '" with value "' + expected + '", but only found these values: ' + elementContainsAttribute.values, 'Expected an element ' + elementContainsAttribute.query + ' not to contain attribute "' + attribute + ' with value "' + expected + '", but found these attributes: ' + elementContainsAttribute.values);
    });
}