package com.fynd.task2.exception;

public class AdminUnauthorizedException extends RuntimeException {

    public AdminUnauthorizedException(String message) {
        super(message);
    }
}
