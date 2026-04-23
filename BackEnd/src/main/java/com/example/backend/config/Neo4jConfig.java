package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.neo4j.cypherdsl.core.renderer.Dialect;

@Configuration
public class Neo4jConfig {

    /**
     * Provides a Cypher-DSL configuration with Neo4j 5 dialect.
     */
    @Bean
    org.neo4j.cypherdsl.core.renderer.Configuration cypherDslConfiguration() {
        return org.neo4j.cypherdsl.core.renderer.Configuration.newConfig()
                .withDialect(Dialect.NEO4J_5).build();
    }
}
