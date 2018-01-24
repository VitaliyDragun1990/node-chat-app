const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {

    it('should generate correct object message', () => {
        let from = 'Jack';
        let text = 'Hello';
        let message = generateMessage(from, text);

        expect(message).toMatchObject({from, text});
        expect(message['createdAt']).toBeDefined();
        expect(typeof message['createdAt']).toBe('number');
    });
});