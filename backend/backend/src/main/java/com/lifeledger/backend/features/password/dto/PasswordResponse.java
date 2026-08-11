package com.lifeledger.backend.features.password.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResponse {

    private Long id;

    private Long userId;

    private String appName;

    private String webAddress;

    private String loginUserId;

    private String password;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}