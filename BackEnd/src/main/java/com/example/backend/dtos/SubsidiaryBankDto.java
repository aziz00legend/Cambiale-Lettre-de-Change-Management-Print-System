package com.example.backend.dtos;


import lombok.*;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubsidiaryBankDto {
    private Long id;
    private String name;
    private String codeSubsidiary;
    private String location;

}