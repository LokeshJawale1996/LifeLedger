package com.lifeledger.backend.dto.signup;

import java.time.LocalDate;

import com.lifeledger.backend.entity.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Gender gender;

    @NotNull
    private LocalDate dateOfBirth;

    @NotBlank
    private String phoneNumber;


}