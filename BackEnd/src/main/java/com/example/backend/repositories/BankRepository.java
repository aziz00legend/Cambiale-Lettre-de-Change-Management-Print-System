package com.example.backend.repositories;

import com.example.backend.node.Bank;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface BankRepository extends Neo4jRepository<Bank, Long> {
    Bank findByCodeBank(String codeBank);
}
