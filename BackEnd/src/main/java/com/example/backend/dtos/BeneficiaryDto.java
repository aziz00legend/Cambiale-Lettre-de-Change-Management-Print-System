package com.example.backend.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeneficiaryDto {

    private Long id;
    private String drawer;
    private String payToOrderOf;


}