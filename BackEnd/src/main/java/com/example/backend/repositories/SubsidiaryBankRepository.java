package com.example.backend.repositories;

import com.example.backend.node.SubsidiaryBank;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubsidiaryBankRepository extends Neo4jRepository<SubsidiaryBank, Long> {

    @Query("MATCH (b:Bank)-[:OWNS_SUBSIDIARY]->(s:SubsidiaryBank) WHERE id(b) = $bankId RETURN s")
    List<SubsidiaryBank> findSubsidiariesByBankId(@Param("bankId") Long bankId);

    @Query("MATCH (b:Bank)-[:OWNS_SUBSIDIARY]->(s:SubsidiaryBank) " +
            "WHERE id(b) = $bankId AND s.codeSubsidiary = $code RETURN COUNT(s) > 0")
    boolean existsByBankIdAndCodeSubsidiary(@Param("bankId") Long bankId, @Param("code") String codeSubsidiary);

}
