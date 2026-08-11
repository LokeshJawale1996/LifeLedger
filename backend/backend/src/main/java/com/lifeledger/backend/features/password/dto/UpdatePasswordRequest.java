package com.lifeledger.backend.features.password.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePasswordRequest {

    @NotBlank(message = "App name is required")
    @Size(max = 150, message = "App name cannot exceed 150 characters")
    private String appName;

    @Size(max = 500, message = "Web address cannot exceed 500 characters")
    private String webAddress;

    @NotBlank(message = "User ID is required")
    @Size(max = 255, message = "User ID cannot exceed 255 characters")
    private String loginUserId;

    @NotBlank(message = "Password is required")
    private String password;

    private String note;
}