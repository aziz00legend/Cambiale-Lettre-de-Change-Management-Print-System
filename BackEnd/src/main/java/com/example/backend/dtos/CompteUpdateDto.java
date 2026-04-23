package com.example.backend.dtos;

import com.example.backend.enums.CompteType;
import com.example.backend.node.SubsidiaryBank;
import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteUpdateDto {
    private String name;
    private String cin;
    private String city;
    private String location;
    private String codePostal;
}