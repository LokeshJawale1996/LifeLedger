package com.lifeledger.backend.dto.login;

import com.lifeledger.backend.entity.Gender;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private boolean success;
    private String message;

    // private String token;

    private String username;
    private String fullName;

    private Gender gender;
    private Long userId;

}