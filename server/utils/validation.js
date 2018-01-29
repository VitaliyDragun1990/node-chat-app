// check if given value is a real string
let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

module.exports = { isRealString };