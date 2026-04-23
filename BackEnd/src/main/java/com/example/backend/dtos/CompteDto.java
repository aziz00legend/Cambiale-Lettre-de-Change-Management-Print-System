package com.example.backend.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteDto {

    private Long id;
    private String name;
    private String rib;

    private String cin;
    private String city;
    private String location;
    private String codePostal;





}