package com.lifeledger.backend.features.borrowedlent.service;

import com.lifeledger.backend.features.borrowedlent.dto.*;
import com.lifeledger.backend.features.borrowedlent.entity.BorrowedLent;
import com.lifeledger.backend.features.borrowedlent.enums.BorrowedLentType;
import com.lifeledger.backend.features.borrowedlent.repository.BorrowedLentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BorrowedLentServiceImpl
        implements BorrowedLentService {

    private final BorrowedLentRepository repository;

    public BorrowedLentServiceImpl(
            BorrowedLentRepository repository
    ) {
        this.repository = repository;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    @Transactional
    public BorrowedLentResponse create(
            CreateBorrowedLentRequest request,
            Long userId
    ) {

        BorrowedLent record =
                BorrowedLent.builder()
                        .userId(userId)
                        .personName(
                                request.getPersonName().trim()
                        )
                        .personContact(
                                request.getPersonContact() != null
                                        ? request.getPersonContact().trim()
                                        : null
                        )
                        .direction(
                                request.getDirection()
                        )
                        .amount(
                                request.getAmount()
                        )
                        .paidAmount(
                                BigDecimal.ZERO
                        )
                        .description(
                                request.getDescription() != null
                                        ? request.getDescription().trim()
                                        : null
                        )
                        .dueDate(
                                request.getDueDate()
                        )
                        .build();

        BorrowedLent saved =
                repository.save(record);

        return mapToResponse(saved);
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<BorrowedLentResponse> getByUserId(
            Long userId
    ) {

        return repository
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
    public BorrowedLentResponse getById(
            Long id,
            Long userId
    ) {

        BorrowedLent record =
                findRecord(id);

        validateOwnership(
                record,
                userId
        );

        return mapToResponse(record);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    @Transactional
    public BorrowedLentResponse update(
            Long id,
            UpdateBorrowedLentRequest request,
            Long userId
    ) {

        BorrowedLent record =
                findRecord(id);

        validateOwnership(
                record,
                userId
        );

        record.setPersonName(
                request.getPersonName().trim()
        );

        record.setPersonContact(
                request.getPersonContact() != null
                        ? request.getPersonContact().trim()
                        : null
        );

        record.setDirection(
                request.getDirection()
        );

        record.setAmount(
                request.getAmount()
        );

        record.setDescription(
                request.getDescription() != null
                        ? request.getDescription().trim()
                        : null
        );

        record.setDueDate(
                request.getDueDate()
        );

        if (record.getPaidAmount()
                .compareTo(record.getAmount()) > 0) {

            throw new IllegalArgumentException(
                    "Amount cannot be less than already paid amount"
            );
        }

        BorrowedLent updated =
                repository.save(record);

        return mapToResponse(updated);
    }

    // =========================================================
    // RECORD PAYMENT
    // =========================================================

    @Override
    @Transactional
    public BorrowedLentResponse recordPayment(
            Long id,
            PaymentRequest request,
            Long userId
    ) {

        BorrowedLent record =
                findRecord(id);

        validateOwnership(
                record,
                userId
        );

        BigDecimal newPaidAmount =
                record.getPaidAmount()
                        .add(request.getAmount());

        if (newPaidAmount.compareTo(
                record.getAmount()
        ) > 0) {

            throw new IllegalArgumentException(
                    "Payment cannot exceed remaining amount"
            );
        }

        record.setPaidAmount(
                newPaidAmount
        );

        BorrowedLent updated =
                repository.save(record);

        return mapToResponse(updated);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    @Transactional
    public void delete(
            Long id,
            Long userId
    ) {

        BorrowedLent record =
                findRecord(id);

        validateOwnership(
                record,
                userId
        );

        repository.delete(record);
    }

    // =========================================================
    // FIND
    // =========================================================

    private BorrowedLent findRecord(
            Long id
    ) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Borrowed/Lent record not found with id: "
                                        + id
                        )
                );
    }

    // =========================================================
    // OWNERSHIP
    // =========================================================

    private void validateOwnership(
            BorrowedLent record,
            Long userId
    ) {

        if (!record.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "You are not authorized to access this record"
            );
        }
    }

    // =========================================================
    // MAPPER
    // =========================================================

    private BorrowedLentResponse mapToResponse(
            BorrowedLent record
    ) {

        BigDecimal remaining =
                record.getAmount()
                        .subtract(
                                record.getPaidAmount()
                        );

        boolean settled =
                remaining.compareTo(
                        BigDecimal.ZERO
                ) == 0;

        return BorrowedLentResponse.builder()
                .id(record.getId())
                .userId(record.getUserId())
                .personName(record.getPersonName())
                .personContact(record.getPersonContact())
                .direction(record.getDirection())
                .amount(record.getAmount())
                .paidAmount(record.getPaidAmount())
                .remainingAmount(remaining)
                .description(record.getDescription())
                .dueDate(record.getDueDate())
                .settled(settled)
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
    @Override
@Transactional(readOnly = true)
public BorrowedLentSummaryResponse getSummary(
        Long userId
) {

    List<BorrowedLent> records =
            repository.findByUserIdOrderByCreatedAtDesc(
                    userId
            );

    BigDecimal totalLent =
            records.stream()
                    .filter(record ->
                            record.getDirection()
                                    == BorrowedLentType.LENT
                    )
                    .map(BorrowedLent::getAmount)
                    .reduce(
                            BigDecimal.ZERO,
                            BigDecimal::add
                    );

    BigDecimal totalReceived =
            records.stream()
                    .filter(record ->
                            record.getDirection()
                                    == BorrowedLentType.LENT
                    )
                    .map(BorrowedLent::getPaidAmount)
                    .reduce(
                            BigDecimal.ZERO,
                            BigDecimal::add
                    );

    BigDecimal totalToReceive =
            totalLent.subtract(
                    totalReceived
            );


    BigDecimal totalBorrowed =
            records.stream()
                    .filter(record ->
                            record.getDirection()
                                    == BorrowedLentType.BORROWED
                    )
                    .map(BorrowedLent::getAmount)
                    .reduce(
                            BigDecimal.ZERO,
                            BigDecimal::add
                    );

    BigDecimal totalPaid =
            records.stream()
                    .filter(record ->
                            record.getDirection()
                                    == BorrowedLentType.BORROWED
                    )
                    .map(BorrowedLent::getPaidAmount)
                    .reduce(
                            BigDecimal.ZERO,
                            BigDecimal::add
                    );

    BigDecimal totalToPay =
            totalBorrowed.subtract(
                    totalPaid
            );


    BigDecimal totalOutstanding =
            totalToReceive.add(
                    totalToPay
            );


    return BorrowedLentSummaryResponse.builder()
            .totalLent(totalLent)
            .totalReceived(totalReceived)
            .totalToReceive(totalToReceive)
            .totalBorrowed(totalBorrowed)
            .totalPaid(totalPaid)
            .totalToPay(totalToPay)
            .totalOutstanding(totalOutstanding)
            .build();
}
}