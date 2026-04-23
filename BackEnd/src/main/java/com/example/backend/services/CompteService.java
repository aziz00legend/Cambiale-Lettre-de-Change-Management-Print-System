package com.example.backend.services;

import com.example.backend.dtos.CompteDto;
import com.example.backend.dtos.CompteSaveDto;
import com.example.backend.dtos.CompteUpdateDto;
import com.example.backend.enums.CompteType;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.CompteNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.exceptions.SubsidiaryBankNotFoundException;

import java.util.List;

public interface CompteService {
    CompteDto addCompte(Long subsidiaryBankId, CompteSaveDto compteSaveDto) throws AlreadyExistsException, SubsidiaryBankNotFoundException;
    void updateCompte(Long compteId, CompteUpdateDto compteUpdateDto) throws CompteNotFoundException;
    void deleteCompte(Long compteId) throws CompteNotFoundException, ParentEntityHasChildrenException;
    CompteDto getCompteById(Long compteId) throws CompteNotFoundException;
    List<CompteDto> getAllComptes();
    List<CompteDto> getComptesBySubsidiaryBankId(Long subsidiaryBankId) throws SubsidiaryBankNotFoundException;
}
