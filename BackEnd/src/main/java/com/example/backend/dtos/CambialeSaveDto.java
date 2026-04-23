package com.example.backend.dtos;

import com.example.backend.enums.TunisianGovernorate;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CambialeSaveDto {
    private Double amount;
    private LocalDate operationDate;
    private boolean protestable;
    private TunisianGovernorate creationLocation;
    private Long beneficiaryId;
    private Long donorAccountId;
    private String referenceCode;
}
