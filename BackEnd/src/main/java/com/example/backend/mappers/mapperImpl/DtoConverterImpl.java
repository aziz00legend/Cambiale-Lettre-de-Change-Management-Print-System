package com.example.backend.mappers.mapperImpl;

import com.example.backend.mappers.DtoConverter;
import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class DtoConverterImpl implements DtoConverter {
    private final ModelMapper modelMapper = new ModelMapper();

    @PostConstruct
    public void init() {
        // Convert LocalDate -> String (for DTO)
        modelMapper.addConverter(new AbstractConverter<LocalDate, String>() {
            @Override
            protected String convert(LocalDate source) {
                return (source == null) ? null : source.format(DateTimeFormatter.ISO_LOCAL_DATE);
            }
        });

        // Convert String -> LocalDate (for Entity)
        modelMapper.addConverter(new AbstractConverter<String, LocalDate>() {
            @Override
            protected LocalDate convert(String source) {
                return (source == null || source.isEmpty()) ? null : LocalDate.parse(source, DateTimeFormatter.ISO_LOCAL_DATE);
            }
        });
    }

    @Override
    public <D, E> D convertEntityToDto(E entity, Class<D> dtoClass) {

        return modelMapper.map(entity, dtoClass);
    }

    @Override
    public <D, E> E convertDtoToEntity(D dto, Class<E> entityClass) {
        return modelMapper.map(dto, entityClass);
    }
}
