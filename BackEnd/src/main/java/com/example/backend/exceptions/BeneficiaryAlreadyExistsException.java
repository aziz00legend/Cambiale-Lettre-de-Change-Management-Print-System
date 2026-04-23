package com.example.backend.exceptions;


public class BeneficiaryAlreadyExistsException extends Exception {
    public BeneficiaryAlreadyExistsException(String message) {
        super(message);
    }

    public BeneficiaryAlreadyExistsException(String drawer, String payToOrderOf) {
        super("Beneficiary already exists with drawer: '" + drawer +
                "' and payToOrderOf: '" + payToOrderOf + "'");
    }
}
