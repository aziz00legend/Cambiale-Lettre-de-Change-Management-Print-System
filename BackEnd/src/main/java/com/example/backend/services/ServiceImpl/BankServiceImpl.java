package com.example.backend.services.ServiceImpl;

import com.example.backend.dtos.BankDto;
import com.example.backend.dtos.BankSaveInput;
import com.example.backend.dtos.BankUpdateInput;
import com.example.backend.exceptions.AlreadyExistsException;
import com.example.backend.exceptions.BankNotFoundException;
import com.example.backend.exceptions.ParentEntityHasChildrenException;
import com.example.backend.mappers.mapperImpl.DtoConverterImpl;
import com.example.backend.node.Bank;
import com.example.backend.repositories.BankRepository;
import com.example.backend.services.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BankServiceImpl implements BankService {

    private final BankRepository bankRepository;
    private final DtoConverterImpl dtoConverter;

    @Override
    public BankDto saveBank(BankSaveInput bankSaveInput) throws AlreadyExistsException {
        if (bankRepository.findByCodeBank(bankSaveInput.getCodeBank ()) != null) {
            throw new AlreadyExistsException("Bank with this code already exists");
        }

        Bank bank = dtoConverter.convertDtoToEntity(bankSaveInput, Bank.class);
        bank.setId(null);
        return dtoConverter.convertEntityToDto(bankRepository.save(bank), BankDto.class);
    }

    @Override
    public void updateBank(BankUpdateInput bankUpdateInput) throws BankNotFoundException {
        Bank bank = bankRepository.findById(bankUpdateInput.getId())
                .orElseThrow(() -> new BankNotFoundException("Bank not found with ID: " + bankUpdateInput.getId()));

        bank.setName(bankUpdateInput.getName());
        bank.setImage(bankUpdateInput.getImage());
        bank.setAbbreviation(bankUpdateInput.getAbbreviation());

        bankRepository.save(bank);
    }

    @Override
    public List<BankDto> getAllBanks() {
        return bankRepository.findAll().stream()
                .map(bank -> dtoConverter.convertEntityToDto(bank, BankDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public BankDto getBankById(Long bankId) throws BankNotFoundException {
        Bank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new BankNotFoundException("Bank not found with ID: " + bankId));
        return dtoConverter.convertEntityToDto(bank, BankDto.class);
    }

    @Override
    public void deleteBank(Long bankId) throws BankNotFoundException, ParentEntityHasChildrenException {
        Bank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new BankNotFoundException("Bank not found with ID: " + bankId));
        if (!bank.getSubsidiaries().isEmpty())
            throw new ParentEntityHasChildrenException("Bank","Subsidiaries Bank");


        bankRepository.deleteById(bankId);

    }
}
