package com.example.backend.services.ServiceImpl;


import com.example.backend.dtos.UserDto;
import com.example.backend.dtos.UserInput;
import com.example.backend.mappers.mapperImpl.DtoConverterImpl;
import com.example.backend.node.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final DtoConverterImpl dtoConverter;


    @Override
    public UserDto saveUser(UserInput userInput) {
        if (userRepository.findByEmail(userInput.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = dtoConverter.convertDtoToEntity(userInput, User.class);
        user.setId(null);
        return dtoConverter.convertDtoToEntity(userRepository.save(user), UserDto.class) ;
    }


    @Override
    public void updateUser(Long userId, UserInput userInput) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (!user.getEmail().equals(userInput.getEmail())) {
            if (userRepository.findByEmail(userInput.getEmail()) != null) {
                throw new IllegalArgumentException("Email already exists");
            }
        }


        user.setName(userInput.getName());
        user.setEmail(userInput.getEmail());
        user.setPassword(userInput.getPassword());
        user.setRole(userInput.getRole());

        userRepository.save(user);
    }


    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> dtoConverter.convertDtoToEntity(user, UserDto.class)).collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return dtoConverter.convertEntityToDto(user, UserDto.class);
    }

    @Override
    public void deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        } else {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
    }
}
