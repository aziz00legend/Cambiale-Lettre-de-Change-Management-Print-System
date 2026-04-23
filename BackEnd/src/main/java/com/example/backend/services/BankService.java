package com.example.backend.services;

import com.example.backend.dtos.BankDto;
import com.example.backend.dtos.BankSaveInput;
import com.example.backend.dtos.BankUpdateInput;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.BankNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;

import java.util.List;

public interface BankService {
    BankDto saveBank(BankSaveInput bankSaveInput) throws AlreadyExistsException;
    void updateBank(BankUpdateInput bankUpdateInput) throws BankNotFoundException;
    List<BankDto> getAllBanks();
    BankDto getBankById(Long bankId) throws BankNotFoundException;
    void deleteBank(Long bankId) throws BankNotFoundException, ParentEntityHasChildrenException;
}