'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = attribute;

var _defaultConfig = require('../util/default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doesOneElementHaveAttribute = function doesOneElementHaveAttribute(client, selectorOrElement, attribute, expected) {
    var selector = selectorOrElement.constructor.name === 'Element' ? selectorOrElement.selector : selectorOrElement;
    var elements = client.$$(selector);

    var values = [];
    var filteredList = elements.filter(function (element) {
        var value = element.getAttribute(attribute);
        values.push(value);
        var elementHasExpectedValue = expected instanceof RegExp ? value.match(expected) : value === expected;

        return elementHasExpectedValue;
    });

    return {
        result: filteredList.length > 0,
        values: values
    };
};

function attribute(client, chai, utils, options) {
    var config = (0, _defaultConfig2.default)(options);
    chai.Assertion.addMethod('attribute', function (attribute, expected) {
        var selector = utils.flag(this, 'object');
        var immediately = utils.flag(this, 'immediately');

        if (!immediately) {
            try {
                client.waitUntil(function () {
                    return doesOneElementHaveAttribute(client, selector, attribute, expected).result;
                }, config.defaultWait);
            } catch (e) {
                // actual assertion is handled below
            }
        }

        var elementContainsAttribute = doesOneElementHaveAttribute(client, selector, attribute, expected);
        this.assert(elementContainsAttribute.result, 'Expected an element matching <' + selector + '> to contain attribute "' + attribute + '" with value "' + expected + '", but only found these values: ' + elementContainsAttribute.values, 'Expected an element matching <' + selector + '> not to contain attribute "' + attribute + ' with value "' + expected + '", but found these attributes: ' + elementContainsAttribute.values);
    });
}