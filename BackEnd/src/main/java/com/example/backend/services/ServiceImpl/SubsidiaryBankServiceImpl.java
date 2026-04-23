package com.example.backend.services.ServiceImpl;

import com.example.backend.dtos.SubsidiaryBankDto;
import com.example.backend.dtos.SubsidiaryBankSaveDTO;
import com.example.backend.dtos.SubsidiaryBankUpdateDTO;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.BankNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.exceptions.SubsidiaryBankNotFoundException;
import com.example.backend.mappers.mapperImpl.DtoConverterImpl;
import com.example.backend.node.Bank;
import com.example.backend.node.SubsidiaryBank;
import com.example.backend.repositories.BankRepository;
import com.example.backend.repositories.SubsidiaryBankRepository;
import com.example.backend.services.SubsidiaryBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SubsidiaryBankServiceImpl implements SubsidiaryBankService {

    private final SubsidiaryBankRepository subsidiaryBankRepository;
    private final BankRepository bankRepository;
    private final DtoConverterImpl dtoConverter;

    @Override
    public SubsidiaryBankDto addSubsidiaryBank(Long bankId, SubsidiaryBankSaveDTO saveDTO) throws BankNotFoundException, AlreadyExistsException {
        Bank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new BankNotFoundException("Bank not found with ID: " + bankId));

        if (subsidiaryBankRepository.existsByBankIdAndCodeSubsidiary(bankId, saveDTO.getCodeSubsidiary())) {
            throw new AlreadyExistsException("A subsidiary with the same code already exists under this bank");
        }


        SubsidiaryBank subsidiaryBank = dtoConverter.convertDtoToEntity(saveDTO, SubsidiaryBank.class);
        subsidiaryBank.setId(null);
        subsidiaryBank.setBank(bank);

        // Add subsidiaryBank to bank's subsidiaries list for two-way relation
        if (bank.getSubsidiaries() == null) {
            bank.setSubsidiaries(List.of(subsidiaryBank));
        } else {
            bank.getSubsidiaries().add(subsidiaryBank);
        }

        // Save bank will cascade save subsidiaryBank if cascade is enabled, else save explicitly
        bankRepository.save(bank);

        return dtoConverter.convertEntityToDto(subsidiaryBank, SubsidiaryBankDto.class);
    }

    @Override
    public void updateSubsidiaryBank(Long subsidiaryBankId, SubsidiaryBankUpdateDTO updateDTO) throws SubsidiaryBankNotFoundException {
        SubsidiaryBank subsidiaryBank = subsidiaryBankRepository.findById(subsidiaryBankId)
                .orElseThrow(() -> new SubsidiaryBankNotFoundException("SubsidiaryBank not found with ID: " + subsidiaryBankId));


        subsidiaryBank.setName(updateDTO.getName());
        subsidiaryBank.setLocation(updateDTO.getLocation());
        subsidiaryBankRepository.save(subsidiaryBank);
    }

    @Override
    public List<SubsidiaryBankDto> getSubsidiaryBanksByBankId(Long bankId) {
        List<SubsidiaryBank> subsidiaries = subsidiaryBankRepository.findSubsidiariesByBankId(bankId);
        return subsidiaries.stream()
                .map(sb -> dtoConverter.convertEntityToDto(sb, SubsidiaryBankDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public SubsidiaryBankDto getSubsidiaryBankById(Long subsidiaryBankId) throws SubsidiaryBankNotFoundException {
        SubsidiaryBank subsidiaryBank = subsidiaryBankRepository.findById(subsidiaryBankId)
                .orElseThrow(() -> new SubsidiaryBankNotFoundException("SubsidiaryBank not found with ID: " + subsidiaryBankId));
        return dtoConverter.convertEntityToDto(subsidiaryBank, SubsidiaryBankDto.class);
    }

    @Override
    public void deleteSubsidiaryBank(Long subsidiaryBankId) throws SubsidiaryBankNotFoundException, ParentEntityHasChildrenException {
        SubsidiaryBank subsidiaryBank = subsidiaryBankRepository.findById(subsidiaryBankId)
                .orElseThrow(() -> new SubsidiaryBankNotFoundException("SubsidiaryBank not found with ID: " + subsidiaryBankId));
        if(!subsidiaryBank.getComptes().isEmpty())
            throw new ParentEntityHasChildrenException("Subsidiary Bank","Compte");

        subsidiaryBankRepository.deleteById(subsidiaryBankId);

    }
}
