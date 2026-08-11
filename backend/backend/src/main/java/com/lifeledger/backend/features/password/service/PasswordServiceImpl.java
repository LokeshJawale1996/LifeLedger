package com.lifeledger.backend.features.password.service;

import com.lifeledger.backend.features.password.dto.CreatePasswordRequest;
import com.lifeledger.backend.features.password.dto.PasswordResponse;
import com.lifeledger.backend.features.password.dto.UpdatePasswordRequest;
import com.lifeledger.backend.features.password.entity.PasswordCredential;
import com.lifeledger.backend.features.password.repository.PasswordRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PasswordServiceImpl
        implements PasswordService {

    private final PasswordRepository passwordRepository;


    public PasswordServiceImpl(
            PasswordRepository passwordRepository) {
        this.passwordRepository =
                passwordRepository;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    @Transactional
    public PasswordResponse createPassword(
            CreatePasswordRequest request,
            Long userId
    ) {

        PasswordCredential credential =
                PasswordCredential.builder()
                        .userId(userId)
                        .appName(
                                request.getAppName().trim()
                        )
                        .webAddress(
                                request.getWebAddress() != null
                                        ? request.getWebAddress().trim()
                                        : null
                        )
                        .loginUserId(
                                request.getLoginUserId().trim()
                        )
                        .encryptedPassword(request.getPassword())
                        .note(
                                request.getNote() != null
                                        ? request.getNote().trim()
                                        : null
                        )
                        .build();

        PasswordCredential saved =
                passwordRepository.save(credential);

        return mapToResponse(saved);
    }

    // =========================================================
    // GET ALL BY USER
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PasswordResponse> getPasswordsByUserId(
            Long userId
    ) {

        return passwordRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // GET ONE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PasswordResponse getPasswordById(
            Long id,
            Long userId
    ) {

        PasswordCredential credential =
                passwordRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Password credential not found with id: "
                                                + id
                                )
                        );


        return mapToResponse(credential);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    @Transactional
    public PasswordResponse updatePassword(
            Long id,
            UpdatePasswordRequest request    ) {

        PasswordCredential credential =
                passwordRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Password credential not found with id: "
                                                + id
                                )
                        );
        credential.setAppName(
                request.getAppName().trim()
        );

        credential.setWebAddress(
                request.getWebAddress() != null
                        ? request.getWebAddress().trim()
                        : null
        );

        credential.setLoginUserId(
                request.getLoginUserId().trim()
        );

        credential.setEncryptedPassword(request.getPassword());

        credential.setNote(
                request.getNote() != null
                        ? request.getNote().trim()
                        : null
        );

        PasswordCredential updated =
                passwordRepository.save(credential);

        return mapToResponse(updated);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    @Transactional
    public void deletePassword(
            Long id    ) {

        PasswordCredential credential =
                passwordRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Password credential not found with id: "
                                                + id
                                )
                        );

        passwordRepository.delete(credential);
    }

    // =========================================================


    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private PasswordResponse mapToResponse(
            PasswordCredential credential
    ) {

        return PasswordResponse.builder()
                .id(credential.getId())
                .userId(credential.getUserId())
                .appName(credential.getAppName())
                .webAddress(credential.getWebAddress())
                .loginUserId(
                        credential.getLoginUserId()
                )
                .password(credential.getEncryptedPassword())
                .note(credential.getNote())
                .createdAt(
                        credential.getCreatedAt()
                )
                .updatedAt(
                        credential.getUpdatedAt()
                )
                .build();
    }
}