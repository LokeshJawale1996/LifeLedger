package com.lifeledger.backend.features.borrowedlent.repository;

import com.lifeledger.backend.features.borrowedlent.entity.BorrowedLent;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowedLentRepository
        extends JpaRepository<BorrowedLent, Long> {

    List<BorrowedLent> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );
}