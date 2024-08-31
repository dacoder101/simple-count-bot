class Count {
    constructor(count, type) {
        this.count = count;
        this.type = type;
        this.lastUser = null;
    }

    increment() {
        this.count++;
    }

    loadFromSQL() {
        // Load count from SQL
    }
}

module.exports = { Count };
