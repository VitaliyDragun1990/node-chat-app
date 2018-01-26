const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {

    it('should generate correct location message', () => {
        let from = 'Jack';
        let latitude = 1;
        let longitude = 10;
        let expectUrl = 'https://www.google.com/maps?q=1,10';

        let message = generateLocationMessage(from, latitude, longitude);

        expect(message).toMatchObject({from, url: expectUrl});
        expect(message['createdAt']).toBeDefined();
        expect(typeof message['createdAt']).toBe('number');

    });
});