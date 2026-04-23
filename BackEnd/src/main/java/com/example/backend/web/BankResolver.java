package com.example.backend.web;

import com.example.backend.dtos.BankDto;
import com.example.backend.dtos.BankSaveInput;
import com.example.backend.dtos.BankUpdateInput;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.BankNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.services.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class BankResolver {

    private final BankService bankService;

    @QueryMapping
    public List<BankDto> getAllBanks() {
        return bankService.getAllBanks();
    }

    @QueryMapping
    public BankDto getBankById(@Argument Long bankId) throws BankNotFoundException {
        return bankService.getBankById(bankId);
    }

    @MutationMapping
    public BankDto saveBank(@Argument BankSaveInput bankSaveInput) throws AlreadyExistsException {
        return bankService.saveBank(bankSaveInput);
    }

    @MutationMapping
    public Boolean updateBank(@Argument BankUpdateInput bankUpdateInput) throws BankNotFoundException {
        bankService.updateBank(bankUpdateInput);
        return true;
    }

    @MutationMapping
    public Boolean deleteBank(@Argument Long bankId) throws BankNotFoundException, ParentEntityHasChildrenException {
        bankService.deleteBank(bankId);
        return true;
    }
}
