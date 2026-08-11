package com.lifeledger.backend.features.password.service;

import com.lifeledger.backend.features.password.dto.CreatePasswordRequest;
import com.lifeledger.backend.features.password.dto.PasswordResponse;
import com.lifeledger.backend.features.password.dto.UpdatePasswordRequest;

import java.util.List;

public interface PasswordService {

    PasswordResponse createPassword(
            CreatePasswordRequest request,
            Long userId
    );

    List<PasswordResponse> getPasswordsByUserId(
            Long userId
    );

    PasswordResponse getPasswordById(
            Long id,
            Long userId
    );

    PasswordResponse updatePassword(
            Long id,
            UpdatePasswordRequest request
    );

    void deletePassword(
            Long id    );
}