package com.example.backend.services.ServiceImpl;

import com.example.backend.dtos.CompteDto;
import com.example.backend.dtos.CompteSaveDto;
import com.example.backend.dtos.CompteUpdateDto;
import com.example.backend.enums.CompteType;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.CompteNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.exceptions.SubsidiaryBankNotFoundException;
import com.example.backend.mappers.mapperImpl.DtoConverterImpl;
import com.example.backend.node.Compte;
import com.example.backend.node.SubsidiaryBank;
import com.example.backend.repositories.CambialeRepository;
import com.example.backend.repositories.CompteRepository;
import com.example.backend.repositories.SubsidiaryBankRepository;
import com.example.backend.services.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompteServiceImpl implements CompteService {

    private final CompteRepository compteRepository;
    private final SubsidiaryBankRepository subsidiaryBankRepository;
    private final DtoConverterImpl dtoConverter;
    private final CambialeRepository cambialeRepository;

    @Override
    public CompteDto addCompte(Long subsidiaryBankId, CompteSaveDto dto) throws AlreadyExistsException, SubsidiaryBankNotFoundException {
        if (compteRepository.findByRib(dto.getRib()).isPresent()) {
            throw new AlreadyExistsException("RIB must be unique");
        }

        SubsidiaryBank subsidiaryBank = subsidiaryBankRepository.findById(subsidiaryBankId)
                .orElseThrow(() -> new SubsidiaryBankNotFoundException("Subsidiary bank not found"));


        Compte compte = dtoConverter.convertDtoToEntity(dto, Compte.class);
        compte.setSubsidiaryBank(subsidiaryBank);
        compte.setId(null);

        Compte saved = compteRepository.save(compte);

        // Ensure bidirectional relation
        subsidiaryBank.getComptes().add(saved);
        subsidiaryBankRepository.save(subsidiaryBank);

        return this.dtoConverter.convertEntityToDto(saved,CompteDto.class);
    }

    @Override
    public void updateCompte(Long compteId, CompteUpdateDto dto) throws CompteNotFoundException {
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new CompteNotFoundException("Compte not found"));

        compte.setName(dto.getName());
        compte.setCity(dto.getCity());
        compte.setCin(dto.getCin());
        compte.setLocation(dto.getLocation());
        compte.setCodePostal(dto.getCodePostal());


        compteRepository.save(compte);
    }

    @Override
    public void deleteCompte(Long compteId) throws CompteNotFoundException, ParentEntityHasChildrenException {

        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new CompteNotFoundException("Compte not found"));
        if (!cambialeRepository.findByDonorId(compteId).isEmpty())
            throw  new ParentEntityHasChildrenException("Compte","Cambiale");

        SubsidiaryBank bank = compte.getSubsidiaryBank();
        if (bank != null) {
            bank.getComptes().remove(compte);
            subsidiaryBankRepository.save(bank);
        }

        compteRepository.delete(compte);
    }

    @Override
    public CompteDto getCompteById(Long id) throws CompteNotFoundException {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new CompteNotFoundException("Compte not found"));
        return dtoConverter.convertDtoToEntity(compte, CompteDto.class);
    }

    @Override
    public  List<CompteDto> getAllComptes()
    {
        return compteRepository.findAll().stream().map(compte -> dtoConverter.convertEntityToDto(compte,CompteDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<CompteDto> getComptesBySubsidiaryBankId(Long subsidiaryBankId) throws SubsidiaryBankNotFoundException {
        if (!subsidiaryBankRepository.existsById(subsidiaryBankId))
        {
            throw new SubsidiaryBankNotFoundException("Subsidiary bank not found");
        }
        return compteRepository.findBySubsidiaryBankId(subsidiaryBankId)
                .stream().map(compte -> dtoConverter.convertDtoToEntity(compte, CompteDto.class)).collect(Collectors.toList());
    }




}
