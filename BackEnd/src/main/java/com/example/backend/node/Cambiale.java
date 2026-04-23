package com.example.backend.node;

import com.example.backend.enums.TunisianGovernorate;
import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDate;

@Node("Cambiale")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cambiale {

    @Id
    @GeneratedValue
    private Long id;

    private Double amount;

    private LocalDate creationDate;

    private LocalDate operationDate;

    private TunisianGovernorate creationLocation;
    private boolean protestable;


    private String referenceCode;

    private Boolean isPrinted = false;







    @Relationship(type = "ACCEPTED_BY", direction = Relationship.Direction.OUTGOING)
    private Beneficiary beneficiary;

    @Relationship(type = "GIVEN_BY", direction = Relationship.Direction.OUTGOING)
    private Compte donor;

    /*
    @PostConstruct
    public void initializeDefaults() {
        if (referenceCode == null) {
            this.referenceCode = System.currentTimeMillis();
        }
        if (creationDate == null) {
            this.creationDate = LocalDate.now();
        }
    }*/
}
