package com.newsmind.gateway.service;

public class QueryTimeoutException extends RuntimeException {
    public QueryTimeoutException(String message) {
        super(message);
    }
}
