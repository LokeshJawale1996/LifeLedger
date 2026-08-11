package com.lifeledger.backend.features.borrowedlent.dto;

import com.lifeledger.backend.features.borrowedlent.enums.BorrowedLentType;

import jakarta.validation.constraints.*;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBorrowedLentRequest {

    @NotBlank(message = "Person name is required")
    @Size(max = 150)
    private String personName;

    @Size(max = 30)
    private String personContact;

    @NotNull(message = "Direction is required")
    private BorrowedLentType direction;

    @NotNull(message = "Amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Amount must be greater than zero"
    )
    private BigDecimal amount;

    private String description;

    private LocalDate dueDate;
}