package com.example.backend.exceptions;

public class BankNotFoundException extends Exception {
    public BankNotFoundException(String message) {
        super(message);
    }
}

