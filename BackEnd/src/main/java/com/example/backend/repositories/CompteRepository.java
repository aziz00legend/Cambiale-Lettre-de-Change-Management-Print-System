package com.example.backend.repositories;

import com.example.backend.enums.CompteType;
import com.example.backend.node.Compte;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteRepository extends Neo4jRepository<Compte, Long> {
    Optional<Compte> findByRib(String rib);


    @Query("""
    MATCH (s:SubsidiaryBank)-[:OWNS_COMPTE]->(c:Compte)
    WHERE id(s) = $subsidiaryBankId
    RETURN c
""")
    List<Compte> findBySubsidiaryBankId(@Param("subsidiaryBankId") Long subsidiaryBankId);





}
