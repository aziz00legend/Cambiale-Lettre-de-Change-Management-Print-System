package com.example.backend.mappers;


import org.springframework.stereotype.Service;

@Service
public interface DtoConverter {


    public <D, E> D convertEntityToDto(E entity, Class<D> dtoClass) ;

    public <D, E> E convertDtoToEntity(D dto, Class<E> entityClass) ;
}