package br.edu.utfpr.pb.pw44s.server.error;

import java.util.Date;
import java.util.Map;

public class ApiError {
    private long timestamp = new Date().getTime();
    private int status;
    private String message;
    private String url;
    private Map<String, String> validationErrors;

    public ApiError() {
    }

    public ApiError(String message, String url, int status) {
        this.status = status;
        this.message = message;
        this.url = url;
    }

    public ApiError(int status, String message, String url,
                    Map<String, String> validationErrors) {
        this.status = status;
        this.message = message;
        this.url = url;
        this.validationErrors = validationErrors;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getUrl() {
        return url;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }
}