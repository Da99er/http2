/* eslint-disable */

class Middleware {

    constructor() {

        this.args = {};

    }

    use(fn) {

        this._fnAccumulator = ((args, stack) => (args, next) => {

            const middleFunction = next;

            stack(this.args, (args) => {

                fn(this.args, middleFunction);

            });

        })(this.args, this._fnAccumulator);

    }

    init(args, next) {

        this.args = args;
        this._fnAccumulator(this.args, next);

    }

    _fnAccumulator(args, next) {

        return next(args, next);

    }

}

module.exports = Middleware;

// ({req, res},callback)
