package com.example.backend.web;


import com.example.backend.dtos.UserDto;
import com.example.backend.dtos.UserInput;
import com.example.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class UserResolver {

    private final UserService userService;

    @QueryMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @QueryMapping
    public UserDto getUserById(@Argument Long userId) {
        return userService.getUserById(userId);
    }

    @MutationMapping
    public UserDto saveUser(@Argument UserInput userInput) {
        return userService.saveUser(userInput);
    }

    @MutationMapping
    public Boolean updateUser(@Argument Long userId,@Argument UserInput userInput) {
        userService.updateUser(userId,userInput);
        return true;
    }

    @MutationMapping
    public Boolean deleteUser(@Argument Long userId) {
        userService.deleteUser(userId);
        return true;
    }

}
