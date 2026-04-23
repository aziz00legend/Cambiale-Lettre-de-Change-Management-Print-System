package com.example.backend.exceptions;


public class CambialeAlreadyUsedException extends Exception {

        public CambialeAlreadyUsedException(String referenceCode) {
            super("Cambiale " + referenceCode + " is already used");
        }

    }

