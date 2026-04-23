package com.example.backend.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;

@Node("Bank")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bank {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String image;
    private String codeBank;
    private String abbreviation;

    @Relationship(type = "OWNS_SUBSIDIARY", direction = Relationship.Direction.OUTGOING)
    private List<SubsidiaryBank> subsidiaries;
}
