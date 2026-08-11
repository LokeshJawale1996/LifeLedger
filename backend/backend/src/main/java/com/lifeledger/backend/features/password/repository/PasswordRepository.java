package com.lifeledger.backend.features.password.repository;

import com.lifeledger.backend.features.password.entity.PasswordCredential;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PasswordRepository
        extends JpaRepository<PasswordCredential, Long> {

    List<PasswordCredential> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );
}