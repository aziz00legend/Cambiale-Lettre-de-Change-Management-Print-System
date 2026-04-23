package com.example.backend.web;


import com.example.backend.dtos.*;
import com.example.backend.enums.CompteType;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.CompteNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.exceptions.SubsidiaryBankNotFoundException;
import com.example.backend.services.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CompteResolver {

    private final CompteService compteService;

    @QueryMapping
    public CompteDto getCompteById(@Argument Long id) throws CompteNotFoundException {
        return compteService.getCompteById(id);
    }

    @QueryMapping
    public  List<CompteDto> getAllComptes() {
        return compteService.getAllComptes();

    }
    @QueryMapping
    public List<CompteDto> getComptesBySubsidiaryBankId(@Argument Long subsidiaryBankId) throws SubsidiaryBankNotFoundException {
        return compteService.getComptesBySubsidiaryBankId(subsidiaryBankId);
    }




    @MutationMapping
    public CompteDto addCompte(@Argument Long subsidiaryBankId, @Argument("input") CompteSaveDto input) throws AlreadyExistsException, SubsidiaryBankNotFoundException {
        return compteService.addCompte(subsidiaryBankId, input);
    }

    @MutationMapping
    public Boolean updateCompte(@Argument Long compteId, @Argument("input") CompteUpdateDto input) throws CompteNotFoundException {
        compteService.updateCompte(compteId, input);
        return true;
    }

    @MutationMapping
    public Boolean deleteCompte(@Argument Long compteId) throws CompteNotFoundException, ParentEntityHasChildrenException {
        compteService.deleteCompte(compteId);
        return true;
    }
}

