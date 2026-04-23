package com.example.backend.services;

import com.example.backend.dtos.UserDto;
import com.example.backend.dtos.UserInput;

import java.util.List;

public interface UserService {
    UserDto saveUser(UserInput userInput);
    void updateUser(Long userId,UserInput userInput);
    List<UserDto> getAllUsers();
    UserDto getUserById(Long userId);
    void deleteUser(Long userId);
}
