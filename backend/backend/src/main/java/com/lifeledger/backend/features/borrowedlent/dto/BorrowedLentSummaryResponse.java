package com.lifeledger.backend.features.borrowedlent.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowedLentSummaryResponse {

    // ==============================
    // LENT
    // ==============================

    private BigDecimal totalLent;

    private BigDecimal totalReceived;

    private BigDecimal totalToReceive;


    // ==============================
    // BORROWED
    // ==============================

    private BigDecimal totalBorrowed;

    private BigDecimal totalPaid;

    private BigDecimal totalToPay;


    // ==============================
    // OVERALL
    // ==============================

    private BigDecimal totalOutstanding;
}