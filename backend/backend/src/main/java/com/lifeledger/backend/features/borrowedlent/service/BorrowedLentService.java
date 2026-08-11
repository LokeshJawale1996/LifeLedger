package com.lifeledger.backend.features.borrowedlent.service;

import com.lifeledger.backend.features.borrowedlent.dto.*;

import java.util.List;

public interface BorrowedLentService {

    BorrowedLentResponse create(
            CreateBorrowedLentRequest request,
            Long userId
    );

    List<BorrowedLentResponse> getByUserId(
            Long userId
    );

    BorrowedLentResponse getById(
            Long id,
            Long userId
    );

    BorrowedLentResponse update(
            Long id,
            UpdateBorrowedLentRequest request,
            Long userId
    );

    BorrowedLentResponse recordPayment(
            Long id,
            PaymentRequest request,
            Long userId
    );

    BorrowedLentSummaryResponse getSummary(
        Long userId
);

    void delete(
            Long id,
            Long userId
    );
}