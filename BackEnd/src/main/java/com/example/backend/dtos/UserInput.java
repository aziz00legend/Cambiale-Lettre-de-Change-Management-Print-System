package com.example.backend.dtos;

import com.example.backend.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInput {
    private String name;
    private String email;
    private String password;
    private Role role;
}