class ApiResponse {
    constructor() {
      this.response = {
        ErrorMessage: null,
        Result: null,
        StatusCode: 200,
        TotalRecords: 0,
        IsSuccess: true,
      };
    }
  
    success(data, totalRecords = 1, statusCode = 200) {
      this.response.Result = data;
      this.response.StatusCode = statusCode;
      this.response.TotalRecords = totalRecords;
      this.response.IsSuccess = true;
      return this.response;
    }
  
    error(message, statusCode = 400) {
      this.response.ErrorMessage = message;
      this.response.StatusCode = statusCode;
      this.response.IsSuccess = false;
      this.response.TotalRecords = 0;
      return this.response;
    }
  }
  
  module.exports = new ApiResponse();
  