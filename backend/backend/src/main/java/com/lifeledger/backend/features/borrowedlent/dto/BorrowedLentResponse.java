package com.lifeledger.backend.features.borrowedlent.dto;

import com.lifeledger.backend.features.borrowedlent.enums.BorrowedLentType;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowedLentResponse {

    private Long id;

    private Long userId;

    private String personName;

    private String personContact;

    private BorrowedLentType direction;

    private BigDecimal amount;

    private BigDecimal paidAmount;

    private BigDecimal remainingAmount;

    private String description;

    private LocalDate dueDate;

    private boolean settled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}