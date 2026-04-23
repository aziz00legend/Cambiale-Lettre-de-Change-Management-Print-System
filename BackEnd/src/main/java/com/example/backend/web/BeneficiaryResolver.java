package com.example.backend.web;

import com.example.backend.dtos.*;
import com.example.backend.exceptions.*;
import com.example.backend.services.BankService;
import com.example.backend.services.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class BeneficiaryResolver {

    private final BeneficiaryService beneficiaryService;

    @QueryMapping
    public List<BeneficiaryDto> getAllBeneficiaries() {
        return beneficiaryService.getAllBeneficiaries();
    }

    @QueryMapping
    public BeneficiaryDto getBeneficiaryById(@Argument Long beneficiaryId) throws BeneficiaryNotFoundException {
        return beneficiaryService.getBeneficiaryById(beneficiaryId);
    }

    @MutationMapping
    public BeneficiaryDto saveBeneficiary(@Argument BeneficiarySaveDto beneficiarySaveDto) throws  BeneficiaryAlreadyExistsException {
        return beneficiaryService.saveBeneficiary(beneficiarySaveDto);
    }

    @MutationMapping
    public Boolean updateBeneficiary(@Argument BeneficiaryDto beneficiaryDto) throws BeneficiaryNotFoundException {
        beneficiaryService.updateBeneficiary(beneficiaryDto);
        return true;
    }

    @MutationMapping
    public Boolean deleteBeneficiary(@Argument Long beneficiaryId) throws ParentEntityHasChildrenException, BeneficiaryNotFoundException {
        beneficiaryService.deleteBeneficiary(beneficiaryId);
        return true;
    }
}
