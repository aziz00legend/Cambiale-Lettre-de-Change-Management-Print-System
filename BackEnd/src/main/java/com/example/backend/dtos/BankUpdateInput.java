package com.example.backend.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankUpdateInput {
    private Long id;
    private String name;
    private String image;
    private String abbreviation;



}