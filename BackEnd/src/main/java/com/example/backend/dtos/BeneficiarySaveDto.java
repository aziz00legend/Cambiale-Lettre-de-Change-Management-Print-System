package com.example.backend.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeneficiarySaveDto {

    private String drawer;
    private String payToOrderOf;


}