package com.example.backend.services.ServiceImpl;

import com.example.backend.dtos.CambialeDto;
import com.example.backend.dtos.CambialeDtoDetail;
import com.example.backend.dtos.CambialeSaveDto;
import com.example.backend.enums.TunisianGovernorate;
import com.example.backend.exceptions.*;
import com.example.backend.mappers.mapperImpl.DtoConverterImpl;
import com.example.backend.node.*;

import com.example.backend.repositories.BeneficiaryRepository;
import com.example.backend.repositories.CambialeRepository;
import com.example.backend.repositories.CompteRepository;
import com.example.backend.repositories.SubsidiaryBankRepository;
import com.example.backend.services.CambialeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CambialeServiceImpl implements CambialeService {

    private final CambialeRepository cambialeRepository;
    private final CompteRepository compteRepository;
    private final DtoConverterImpl dtoConverter;
    private final BeneficiaryRepository beneficiaryRepository;


    private CambialeDto entityToDto(Cambiale cambiale) {
        CambialeDto cambialeDto = dtoConverter.convertEntityToDto(cambiale, CambialeDto.class);
        cambialeDto.setCreationDateFr(formatDateToFrench(cambiale.getCreationDate()));
        cambialeDto.setOperationDateFr(formatDateToFrench(cambiale.getOperationDate()));
        return cambialeDto;
    }
    @Override
    public CambialeDto addCambiale(CambialeSaveDto dto) throws CompteNotFoundException, CambialeAlreadyUsedException, BeneficiaryNotFoundException {
        Beneficiary beneficiary = beneficiaryRepository.findById(dto.getBeneficiaryId())
                .orElseThrow(() -> new BeneficiaryNotFoundException("Beneficiary not found"));

        Compte donor = compteRepository.findById(dto.getDonorAccountId())
                .orElseThrow(() -> new CompteNotFoundException("Donor Compte not found"));

        if (cambialeRepository.existsByReferenceCode(dto.getReferenceCode())){

            throw new CambialeAlreadyUsedException(dto.getReferenceCode());

        }


        Cambiale cambiale = Cambiale.builder()
                .amount(dto.getAmount())
                .beneficiary(beneficiary)
                .donor(donor)
                .creationDate(LocalDate.now())
                .operationDate(dto.getOperationDate())
                .creationLocation(dto.getCreationLocation())
                .protestable(dto.isProtestable())
                .referenceCode(dto.getReferenceCode())
                .isPrinted(false)
                .build();

        cambiale = cambialeRepository.save(cambiale);
        return this.entityToDto(cambiale);
    }

    @Override
    public void markAsPrinted(Long id) throws CambialeNotFoundException {
        Cambiale cambiale = cambialeRepository.findById(id)
                .orElseThrow(() -> new CambialeNotFoundException("Cambiale not found"));

        cambiale.setIsPrinted(true);
        cambialeRepository.save(cambiale);
    }

    @Override
    public void deleteCambiale(Long id) throws CambialeNotFoundException, CambialeAlreadyPrintedException {
        Cambiale cambiale = cambialeRepository.findById(id)
                .orElseThrow(() -> new CambialeNotFoundException("Cambiale not found"));

        if (Boolean.TRUE.equals(cambiale.getIsPrinted())) {
            throw new CambialeAlreadyPrintedException("Cannot delete a printed cambiale.");
        }

        cambialeRepository.deleteById(id);
    }

    @Override
    public CambialeDtoDetail getCambialeById(Long id) throws CambialeNotFoundException {
        Cambiale cambiale = cambialeRepository.findById(id)
                .orElseThrow(() -> new CambialeNotFoundException("Cambiale not found"));
        return toDtoDetail(cambiale);
    }

    @Override
    public List<CambialeDto> getCambialesByCompteId(Long compteId) throws CompteNotFoundException {
        if (compteRepository.existsById(compteId)) {
            return cambialeRepository.findByDonorId(compteId).stream()
                    .map(this::entityToDto)
                    .collect(Collectors.toList());
        }
        else
        {
            throw new CompteNotFoundException("Compte not found");
        }
    }

    @Override
    public List<CambialeDto> getCambialesByBeneficiaryId(Long beneficiaryId) throws BeneficiaryNotFoundException {
        if (beneficiaryRepository.existsById(beneficiaryId)) {
            return cambialeRepository.findByBeneficiaryId(beneficiaryId).stream()
                    .map(this::entityToDto)
                    .collect(Collectors.toList());
        }
        else
        {
            throw new BeneficiaryNotFoundException("Beneficiary not found");
        }
    }

    @Override
    public List<CambialeDto> getCambiales(){
            return cambialeRepository.findAll().stream()
                    .map(this::entityToDto)
                    .collect(Collectors.toList());
    }

    private CambialeDtoDetail toDtoDetail(Cambiale cambiale) {
        Beneficiary beneficiary = cambiale.getBeneficiary();

        Compte donorAccount = cambiale.getDonor();
        SubsidiaryBank subsidiaryBank= donorAccount.getSubsidiaryBank();
        Bank bank = subsidiaryBank.getBank();
        return CambialeDtoDetail.builder()
                .id(cambiale.getId())
                .amount(cambiale.getAmount())
                .amountInLetters(this.convertAmountToFrench(cambiale.getAmount().intValue()))
                .creationDateFr(formatDateToFrench(cambiale.getCreationDate()))
                .operationDateFr(formatDateToFrench(cambiale.getOperationDate()))
                .creationLocation(cambiale.getCreationLocation())
                .protestable(cambiale.isProtestable())
                .referenceCode(cambiale.getReferenceCode())
                .isPrinted(cambiale.getIsPrinted())
                .nameBank(bank.getName())
                .abbreviationBank(bank.getAbbreviation())
                .codeBank(bank.getCodeBank())
                .imageBank(bank.getImage())
                .codeSubsidiary(subsidiaryBank.getCodeSubsidiary())
                .nameSubsidiary(subsidiaryBank.getName())
                .locationSubsidiary(subsidiaryBank.getLocation())
                .beneficiaryDrawer(beneficiary.getDrawer())
                .beneficiaryPayToOrderOf(beneficiary.getPayToOrderOf())
                .donorAccountRib(donorAccount.getRib())
                .donorAccountName(donorAccount.getName())
                .donorCin(donorAccount.getCin())
                .donorLocation(donorAccount.getLocation())
                .donorCodePostal(donorAccount.getCodePostal())
                .donorCity(donorAccount.getCity())
                .build();
    }




    private String formatDateToFrench(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.FRENCH);
        return date.format(formatter);
    }


    private String capitalizeFirst(String input) {
        if (input == null || input.isEmpty())
            return input;
        return input.substring(0,1).toUpperCase()+input.substring(1);

    }

    private String numberToFrenchText(int n) {
        if (n == 0) return "zéro";

        String[] units = {
                "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
                "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept",
                "dix-huit", "dix-neuf"
        };

        String[] tens = {
                "", "", "vingt", "trente", "quarante", "cinquante",
                "soixante", "soixante", "quatre-vingt", "quatre-vingt"
        };

        StringBuilder sb = new StringBuilder();

        // Millions
        if (n >= 1_000_000) {
            int millions = n / 1_000_000;
            sb.append(numberToFrenchText(millions)).append(" million");
            if (millions > 1) sb.append("s");
            n %= 1_000_000;
            if (n > 0) sb.append(" ");
        }

        // Thousands
        if (n >= 1000) {
            int thousands = n / 1000;
            if (thousands > 1) sb.append(numberToFrenchText(thousands)).append(" ");
            sb.append("mille");
            n %= 1000;
            if (n > 0) sb.append(" ");
        }

        // Hundreds
        if (n >= 100) {
            int hundreds = n / 100;
            if (hundreds > 1) sb.append(units[hundreds]).append(" ");
            sb.append("cent");
            n %= 100;
            if (hundreds > 1 && n == 0) sb.append("s");
            if (n > 0) sb.append(" ");
        }

        // Tens and Units
        if (n > 0) {
            if (n < 20) {
                sb.append(units[n]);
            } else {
                int t = n / 10;
                int u = n % 10;

                if (t == 7 || t == 9) {
                    sb.append(tens[t]).append("-").append(units[u + 10]);
                } else {
                    sb.append(tens[t]);
                    if (u == 1 && t != 8) sb.append("-et-un");
                    else if (u > 0) sb.append("-").append(units[u]);
                    if (t == 8 && u == 0) sb.append("s");
                }
            }
        }

        return sb.toString().trim();
    }

    public  String convertAmountToFrench(int amount) {

        StringBuilder result = new StringBuilder();


        if ( amount > 0)
        {
            result.append(numberToFrenchText(amount)).append(" dinar");
            if (amount > 1) result.append("s");
        }

        return capitalizeFirst(result.toString().trim());
    }

}
