function checkChars(string) {
    const nums = "0123456789";

    for (let i = 0; i < string.length; i++) {
        if (!nums.includes(string[i])) {
            return false;
        }
    }

    return true;
}

module.exports = { checkChars };
