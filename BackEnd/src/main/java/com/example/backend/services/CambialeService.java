package com.example.backend.services;

import com.example.backend.dtos.CambialeDto;
import com.example.backend.dtos.CambialeDtoDetail;
import com.example.backend.dtos.CambialeSaveDto;
import com.example.backend.exceptions.*;

import java.util.List;

public interface CambialeService {
    CambialeDto addCambiale(CambialeSaveDto dto) throws CompteNotFoundException, CambialeAlreadyUsedException, BeneficiaryNotFoundException;
    void markAsPrinted(Long id) throws CambialeNotFoundException;
    void deleteCambiale(Long id) throws CambialeNotFoundException, CambialeAlreadyPrintedException;
    CambialeDtoDetail getCambialeById(Long id) throws CambialeNotFoundException;
    List<CambialeDto> getCambialesByCompteId(Long compteId) throws CompteNotFoundException;
    List<CambialeDto> getCambialesByBeneficiaryId(Long beneficiaryId) throws BeneficiaryNotFoundException;
    List<CambialeDto> getCambiales();
}
