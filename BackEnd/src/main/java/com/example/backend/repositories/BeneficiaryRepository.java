package com.example.backend.repositories;

import com.example.backend.node.Beneficiary;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BeneficiaryRepository extends Neo4jRepository<Beneficiary, Long> {




    @Query("""
    MATCH (b:Beneficiary {drawer: $drawer, payToOrderOf: $orderOf})
    RETURN COUNT(b) > 0
    """)
    boolean existsBeneficiariesByDrawerAndPayToOrderOf(String drawer, String orderOf);

}
