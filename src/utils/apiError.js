class apiError extends Error {
    constructor(
    statusCode,
    message = "Internal Server Error",
    errors = [],
    stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null; // assignment to find out what this.data contains
        this.errors = errors;
        this.stack = stack;
        this.success = false;

        if(stack){
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default apiError;