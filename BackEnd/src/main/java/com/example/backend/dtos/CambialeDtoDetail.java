package com.example.backend.dtos;

import com.example.backend.enums.TunisianGovernorate;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CambialeDtoDetail {

    private Long id;
    private Double amount;
    private String amountInLetters;
    private String creationDateFr;
    private String operationDateFr;
    private boolean protestable;


    private TunisianGovernorate creationLocation;
    private String referenceCode;
    private Boolean isPrinted;

    // Bank details
    private String nameBank;
    private String imageBank;
    private String codeBank;
    private String abbreviationBank;

    // Subsidiary details
    private String codeSubsidiary;
    private String nameSubsidiary;
    private String locationSubsidiary;

    // Donor account details
    private String donorAccountRib;
    private String donorAccountName;
    private String donorCin;
    private String donorCity;
    private String donorLocation;
    private String donorCodePostal;

    // Beneficiary details
    private String beneficiaryDrawer;
    private String beneficiaryPayToOrderOf;



}