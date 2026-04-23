package com.example.backend.services;

import com.example.backend.dtos.*;
import com.example.backend.exceptions.*;

import java.util.List;

public interface BeneficiaryService {


    BeneficiaryDto saveBeneficiary(BeneficiarySaveDto beneficiarySaveDto) throws BeneficiaryAlreadyExistsException;
    void updateBeneficiary(BeneficiaryDto beneficiaryDto) throws BeneficiaryNotFoundException;
    List<BeneficiaryDto> getAllBeneficiaries();
    BeneficiaryDto getBeneficiaryById(Long beneficiaryId) throws BeneficiaryNotFoundException;
    void deleteBeneficiary(Long beneficiaryId) throws BeneficiaryNotFoundException, ParentEntityHasChildrenException;
}