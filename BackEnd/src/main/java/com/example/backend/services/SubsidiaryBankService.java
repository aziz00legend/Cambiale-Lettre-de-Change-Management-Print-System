package com.example.backend.services;

import com.example.backend.dtos.SubsidiaryBankDto;
import com.example.backend.dtos.SubsidiaryBankSaveDTO;
import com.example.backend.dtos.SubsidiaryBankUpdateDTO;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.BankNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.exceptions.SubsidiaryBankNotFoundException;

import java.util.List;

public interface SubsidiaryBankService {

    SubsidiaryBankDto addSubsidiaryBank(Long bankId, SubsidiaryBankSaveDTO saveDTO) throws BankNotFoundException, AlreadyExistsException;

    void updateSubsidiaryBank(Long subsidiaryBankId, SubsidiaryBankUpdateDTO updateDTO) throws SubsidiaryBankNotFoundException;

    List<SubsidiaryBankDto> getSubsidiaryBanksByBankId(Long bankId);

    SubsidiaryBankDto getSubsidiaryBankById(Long subsidiaryBankId) throws SubsidiaryBankNotFoundException;

    void deleteSubsidiaryBank(Long subsidiaryBankId) throws SubsidiaryBankNotFoundException, ParentEntityHasChildrenException;
}
