package com.example.backend.web;

import com.example.backend.dtos.SubsidiaryBankDto;
import com.example.backend.dtos.SubsidiaryBankSaveDTO;
import com.example.backend.dtos.SubsidiaryBankUpdateDTO;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.BankNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.exceptions.SubsidiaryBankNotFoundException;
import com.example.backend.services.SubsidiaryBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class SubsidiaryBankResolver {

    private final SubsidiaryBankService subsidiaryBankService;

    @QueryMapping
    public List<SubsidiaryBankDto> getSubsidiaryBanksByBankId(@Argument Long bankId) {
        return subsidiaryBankService.getSubsidiaryBanksByBankId(bankId);
    }

    @QueryMapping
    public SubsidiaryBankDto getSubsidiaryBankById(@Argument Long subsidiaryBankId) throws SubsidiaryBankNotFoundException {
        return subsidiaryBankService.getSubsidiaryBankById(subsidiaryBankId);
    }

    @MutationMapping
    public SubsidiaryBankDto addSubsidiaryBank(@Argument Long bankId, @Argument SubsidiaryBankSaveDTO saveDTO) throws AlreadyExistsException, BankNotFoundException {
        return subsidiaryBankService.addSubsidiaryBank(bankId, saveDTO);
    }

    @MutationMapping
    public Boolean updateSubsidiaryBank(@Argument Long subsidiaryBankId, @Argument SubsidiaryBankUpdateDTO updateDTO) throws SubsidiaryBankNotFoundException {
        subsidiaryBankService.updateSubsidiaryBank(subsidiaryBankId, updateDTO);
        return true;
    }

    @MutationMapping
    public Boolean deleteSubsidiaryBank(@Argument Long subsidiaryBankId) throws SubsidiaryBankNotFoundException, ParentEntityHasChildrenException {
        subsidiaryBankService.deleteSubsidiaryBank(subsidiaryBankId);
        return true;
    }
}
