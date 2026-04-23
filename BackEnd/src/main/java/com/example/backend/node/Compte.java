package com.example.backend.node;

import com.example.backend.enums.CompteType;
import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node("Compte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Compte {
    @Id
    @GeneratedValue
    private Long id;
    private String rib;
    private String name;

    private String location;
    private String city;
    private String codePostal;
    private String cin;



    @Relationship(type = "BELONGS_TO", direction = Relationship.Direction.OUTGOING)
    private SubsidiaryBank subsidiaryBank;
}