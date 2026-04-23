package com.example.backend.repositories;

import com.example.backend.node.Beneficiary;
import com.example.backend.node.Cambiale;
import com.example.backend.node.Compte;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CambialeRepository extends Neo4jRepository<Cambiale, Long> {

    Boolean existsByReferenceCode(String referenceCode);



    @Query("""
        MATCH (c:Cambiale)-[:GIVEN_BY]->(comp:Compte)
        WHERE id(comp) = $compteId
        RETURN DISTINCT c
    """)
    List<Cambiale> findByDonorId(@Param("compteId")  Long compteId);


    @Query("""
        MATCH (c:Cambiale)-[:ACCEPTED_BY]->(b:Beneficiary)
        WHERE id(b) = $beneficiaryId
        RETURN DISTINCT c
    """)
    List<Cambiale> findByBeneficiaryId(@Param("beneficiaryId") Long beneficiaryId);



}


