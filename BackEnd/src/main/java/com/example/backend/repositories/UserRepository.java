package com.example.backend.repositories;


import com.example.backend.node.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface UserRepository extends Neo4jRepository<User, Long> {
    User findByEmail(String email);
}
