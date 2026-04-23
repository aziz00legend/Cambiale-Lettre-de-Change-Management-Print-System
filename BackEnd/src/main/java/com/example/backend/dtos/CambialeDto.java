package com.example.backend.dtos;

import com.example.backend.enums.TunisianGovernorate;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CambialeDto {

    private Long id;
    private Double amount;
    private String creationDateFr;
    private String operationDateFr;
    private boolean protestable;
    private TunisianGovernorate creationLocation;
    private String referenceCode;
    private Boolean isPrinted ;


}
