import configWithDefaults from '../util/default-config';

const matches = (expected, actual) => (expected instanceof RegExp) ? !!(actual.match(expected)) : actual === expected;

const doesOneElementHaveAttribute = function(client, selectorOrElement, attribute, expected) {
    let elements;
    let query;
    switch (typeof selectorOrElement) {
        case 'string':
            elements = client.$$(selectorOrElement)
            query = `matching <${selectorOrElement}>`
            break;
        case 'object':
            elements = [ selectorOrElement ];
            query = `with <${selectorOrElement.selector}>`
            break;
        default:
            throw new Error(`${selectorOrElement} should be either String or Object`);
    }
    const values = elements.map(element => element.getAttribute(attribute));
    const filteredValues = values.filter(value => expected ? matches(expected, value) : true);

    return {
        result: filteredValues.length > 0,
        values,
        query
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
            `Expected an element ${elementContainsAttribute.query} to contain attribute "${attribute}" with value "${expected}", but only found these values: ${elementContainsAttribute.values}`,
            `Expected an element ${elementContainsAttribute.query} not to contain attribute "${attribute} with value "${expected}", but found these attributes: ${elementContainsAttribute.values}`
        );
    });
}
