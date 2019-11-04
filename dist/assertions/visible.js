'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = visible;

var _defaultConfig = require('../util/default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function visible(client, chai, utils, options) {
    var config = (0, _defaultConfig2.default)(options);

    chai.Assertion.addMethod('visible', function () {
        var negate = utils.flag(this, 'negate');
        var selector = utils.flag(this, 'object');
        var immediately = utils.flag(this, 'immediately');

        if (!immediately) {
            client.waitForVisible(selector, config.defaultWait, negate);
        }

        var isVisible = client.isVisible(selector);
        var visibleArray = Array.isArray(isVisible) ? isVisible : [isVisible];
        var anyVisible = visibleArray.includes(true);

        this.assert(anyVisible, 'Expected ' + selector + ' to be visible but it is not', 'Expected ' + selector + ' to not be visible but it is');
    });
}