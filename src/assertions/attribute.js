import configWithDefaults from '../util/default-config';

const matches = (expected, actual) => (expected instanceof RegExp) ? !!actual.match(expected) : actual === expected;

const doesElementHaveAttribute = function(element, attribute, expected) {
    const value = element.getAttribute(attribute);
    return {
        result: value ? matches(expected, value) : false,
        values: [ value ]
    }
}

const doesOneElementHaveAttribute = function(client, selectorOrElement, attribute, expected) {
    let elements;
    switch (typeof selectorOrElement) {
        case 'string':
            elements = client.$$(selectorOrElement)
            break;
        case 'object':
            elements = [ element ];
            break;
        default:
            throw new Error(`${selectorOrElement} should be either String or Object`);
    }
    const values = elements.map(element => element.getAttribute(attribute));
    const filteredValues = values.filter(value => expected ? matches(expected, value) : true);

    return {
        result: filteredValues.length > 0,
        values
    };
}

export default function attribute(client, chai, utils, options) {
    const config = configWithDefaults(options);
    chai.Assertion.addMethod('attribute', function(attribute, expected) {
        const selectorOrElement =  utils.flag(this, 'object');
        const negate = utils.flag(this, 'negate');
        const immediately = utils.flag(this, 'immediately');

        if(!immediately) {
            try {
                client.waitUntil(() => {
                    return doesOneElementHaveAttribute(client, selectorOrElement, attribute, expected).result === !negate;
                }, config.defaultWait)
            } catch(e) {
                // actual assertion is handled below
            }
        }

        let elementContainsAttribute = doesOneElementHaveAttribute(client, selectorOrElement, attribute, expected);
        this.assert(
          elementContainsAttribute.result,
            `Expected an element matching <${selectorOrElement}> to contain attribute "${attribute}" with value "${expected}", but only found these values: ${elementContainsAttribute.values}`,
            `Expected an element matching <${selectorOrElement}> not to contain attribute "${attribute} with value "${expected}", but found these attributes: ${elementContainsAttribute.values}`
        );
    });
}
