const expect = require('expect');

let {isRealString} = require('./validation');

describe('isRealString', () => {

    it('should reject non-string values', () => {
       let value = 125;
       let result = isRealString(value);

       expect(result).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        let value = '           ';
        let result = isRealString(value);

        expect(result).toBeFalsy();
    });

    it('should allow string with non-space characters', () => {
        let value = '  Jack  ';
        let result = isRealString(value);

        expect(result).toBeTruthy();
    });
});