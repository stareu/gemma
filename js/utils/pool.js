/**
 * Pool instances of a certain class for reusing.
 */
class Pool {
    ctor
    list = [];

    constructor(ctor) {
        this.ctor = ctor;
    }

	get() {
		return this.list.pop() ?? new this.ctor();
    }

    giveBack(item) {
        if (this.list.includes(item)) return;
        this.list.push(item);
    }
}

class MultiPool {
    map = new Map();

    get(ctor) {
        let pool = this.map.get(ctor);
        if (!pool) {
            pool = new Pool(ctor);
            this.map.set(ctor, pool);
        }
        return pool.get();
    }

    giveBack(item) {
        const pool = this.map.get(item.constructor);
        if (pool) pool.giveBack(item);
    }
}

/**
 * Shared multi-class pool instance
 */
export const pool = new MultiPool();
