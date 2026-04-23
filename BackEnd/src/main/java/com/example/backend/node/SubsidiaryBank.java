package com.example.backend.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;


@Node("SubsidiaryBank")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubsidiaryBank {
    @Id @GeneratedValue
    private Long id;
    private String codeSubsidiary;
    private String name;
    private String location;
    private String abbreviation;

    @Relationship(type = "SUBSIDIARY_OF", direction = Relationship.Direction.OUTGOING)
    private Bank bank;

    @Relationship(type = "OWNS_COMPTE", direction = Relationship.Direction.OUTGOING)
    private List<Compte> comptes;
}