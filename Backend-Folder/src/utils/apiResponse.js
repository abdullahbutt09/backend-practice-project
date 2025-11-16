class apiResponse {
    constructor(
        statusCode,
        data,
        message = "success"
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; //read about it server status codes overview
    }
}

export default apiResponse;