package com.example.backend.web;


import com.example.backend.dtos.CambialeDto;
import com.example.backend.dtos.CambialeDtoDetail;
import com.example.backend.dtos.CambialeSaveDto;
import com.example.backend.exceptions.*;
import com.example.backend.services.CambialeService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CambialeResolver {

    private final CambialeService cambialeService;

    @MutationMapping
    public CambialeDto addCambiale(@Argument CambialeSaveDto dto) throws CompteNotFoundException, BeneficiaryNotFoundException, CambialeAlreadyUsedException {
        return cambialeService.addCambiale(dto);
    }

    @MutationMapping
    public String markAsPrinted(@Argument Long id) throws CambialeNotFoundException {
        cambialeService.markAsPrinted(id);
        return "Cambiale marked as printed";
    }

    @MutationMapping
    public String deleteCambiale(@Argument Long id) throws CambialeAlreadyPrintedException, CambialeNotFoundException {
        cambialeService.deleteCambiale(id);
        return "Cambiale deleted successfully";
    }

    @QueryMapping
    public CambialeDtoDetail getCambialeById(@Argument Long id) throws CambialeNotFoundException {
        return cambialeService.getCambialeById(id);
    }

    @QueryMapping
    public List<CambialeDto> getCambialesByCompteId(@Argument Long compteId) throws CompteNotFoundException {
        return cambialeService.getCambialesByCompteId(compteId);
    }

    @QueryMapping
    public List<CambialeDto> getCambialesByBeneficiaryId(@Argument Long beneficiaryId) throws BeneficiaryNotFoundException {
        return cambialeService.getCambialesByBeneficiaryId(beneficiaryId);
    }

    @QueryMapping
    public List<CambialeDto> getCambiales()  {
        return cambialeService.getCambiales();
    }
}
