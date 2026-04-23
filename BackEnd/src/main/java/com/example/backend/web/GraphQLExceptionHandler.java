package com.example.backend.web;

import com.example.backend.exceptions.*;
import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.GraphQlExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GraphQLExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GraphQLExceptionHandler.class);

    @GraphQlExceptionHandler
    public GraphQLError handleAlreadyExistsException(AlreadyExistsException ex, DataFetchingEnvironment env) {
        log.error("AlreadyExistsException caught in GraphQL: {}", ex.getMessage());
        return GraphqlErrorBuilder.newError()
                .message(ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.ValidationError)
                .build();
    }

    @GraphQlExceptionHandler
    public GraphQLError handleBankNotFoundException(BankNotFoundException ex, DataFetchingEnvironment env) {
        log.error("BankNotFoundException caught in GraphQL: {}", ex.getMessage());
        return GraphqlErrorBuilder.newError()
                .message(ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.DataFetchingException)
                .build();
    }

    @GraphQlExceptionHandler
    public GraphQLError handleCambialeAlreadyPrintedException(CambialeAlreadyPrintedException ex, DataFetchingEnvironment env) {
        log.error("CambialeAlreadyPrintedException caught in GraphQL: {}", ex.getMessage());
        return GraphqlErrorBuilder.newError()
                .message(ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.ValidationError)
                .build();
    }

    @GraphQlExceptionHandler
    public GraphQLError handleCambialeNotFoundException(CambialeNotFoundException ex, DataFetchingEnvironment env) {
        log.error("CambialeNotFoundException caught in GraphQL: {}", ex.getMessage());
        return GraphqlErrorBuilder.newError()
                .message(ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.DataFetchingException)
                .build();
    }

    @GraphQlExceptionHandler
    public GraphQLError handleCompteNotFoundException(CompteNotFoundException ex, DataFetchingEnvironment env) {
        log.error("CompteNotFoundException caught in GraphQL: {}", ex.getMessage());
        return GraphqlErrorBuilder.newError()
                .message(ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.DataFetchingException)
                .build();
    }

    @GraphQlExceptionHandler
    public GraphQLError handleSubsidiaryBankNotFoundException(SubsidiaryBankNotFoundException ex, DataFetchingEnvironment env) {
        log.error("SubsidiaryBankNotFoundException caught in GraphQL: {}", ex.getMessage());
        return GraphqlErrorBuilder.newError()
                .message(ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.DataFetchingException)
                .build();
    }


    @GraphQlExceptionHandler
    public GraphQLError handleParentEntityHasChildrenException(ParentEntityHasChildrenException ex, DataFetchingEnvironment env) {
        log.error("ParentEntityHasChildrenException caught in GraphQL: {}", ex.getMessage());
        return GraphqlErrorBuilder.newError()
                .message(ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.DataFetchingException)
                .build();
    }

    @GraphQlExceptionHandler
    public GraphQLError handleGenericExceptionForGraphQL(Exception ex, DataFetchingEnvironment env) {
        log.error("Unhandled exception caught in GraphQL: ", ex);
        return GraphqlErrorBuilder.newError()
                .message("An unexpected error occurred: " + ex.getMessage())
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .errorType(graphql.ErrorType.ExecutionAborted)
                .build();
    }
}