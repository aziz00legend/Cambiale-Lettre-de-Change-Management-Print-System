package com.example.backend.services.ServiceImpl;

import com.example.backend.dtos.*;
import com.example.backend.exceptions.*;
import com.example.backend.mappers.mapperImpl.DtoConverterImpl;
import com.example.backend.node.Bank;
import com.example.backend.node.Beneficiary;
import com.example.backend.repositories.BeneficiaryRepository;
import com.example.backend.repositories.CambialeRepository;
import com.example.backend.services.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final DtoConverterImpl dtoConverter;
    private final CambialeRepository cambialeRepository;


    @Override
    public BeneficiaryDto saveBeneficiary(BeneficiarySaveDto beneficiarySaveDto) throws BeneficiaryAlreadyExistsException {
        if (beneficiaryRepository.existsBeneficiariesByDrawerAndPayToOrderOf(beneficiarySaveDto.getDrawer(),beneficiarySaveDto.getPayToOrderOf())){
            throw new BeneficiaryAlreadyExistsException(beneficiarySaveDto.getDrawer(), beneficiarySaveDto.getPayToOrderOf());
        }
        Beneficiary beneficiary = dtoConverter.convertDtoToEntity(beneficiarySaveDto, Beneficiary.class);
        beneficiary.setId(null);
        return dtoConverter.convertEntityToDto(beneficiaryRepository.save(beneficiary), BeneficiaryDto.class);

    }


    @Override
    public void updateBeneficiary(BeneficiaryDto beneficiaryDto) throws BeneficiaryNotFoundException
    {
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryDto.getId())
                .orElseThrow(() -> new BeneficiaryNotFoundException(
                        "Beneficiary not found with ID: " + beneficiaryDto.getId()
                ));

        beneficiary.setDrawer(beneficiaryDto.getDrawer());
        beneficiary.setPayToOrderOf(beneficiaryDto.getPayToOrderOf());

        beneficiaryRepository.save(beneficiary);
    }

    @Override
    public List<BeneficiaryDto> getAllBeneficiaries()
    {
        return beneficiaryRepository.findAll().stream()
                .map(beneficiary -> dtoConverter.convertEntityToDto(beneficiary,BeneficiaryDto.class) )
                .collect(Collectors.toList());
    }


    @Override
    public BeneficiaryDto getBeneficiaryById(Long beneficiaryId) throws BeneficiaryNotFoundException {
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new BeneficiaryNotFoundException(
                        "Beneficiary not found with ID: " + beneficiaryId
                ));
        return dtoConverter.convertEntityToDto(beneficiary, BeneficiaryDto.class);
    }


    @Override
    public void deleteBeneficiary(Long beneficiaryId) throws BeneficiaryNotFoundException, ParentEntityHasChildrenException {
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new BeneficiaryNotFoundException("Beneficiary not found with ID: " + beneficiaryId));
        if (!cambialeRepository.findByBeneficiaryId(beneficiaryId).isEmpty())
            throw new ParentEntityHasChildrenException("Cambiale","Beneficiary");
        beneficiaryRepository.delete(beneficiary);
    }


}
