package com.lifeledger.backend.features.borrowedlent.controller;

import com.lifeledger.backend.features.borrowedlent.dto.*;
import com.lifeledger.backend.features.borrowedlent.service.BorrowedLentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/borrowed-lent")
public class BorrowedLentController {

  private final BorrowedLentService service;

  public BorrowedLentController(
      BorrowedLentService service) {
    this.service = service;
  }

  // =========================================================
  // CREATE
  // =========================================================

  @PostMapping
  public ResponseEntity<BorrowedLentResponse> create(
      @RequestParam Long userId,
      @Valid @RequestBody CreateBorrowedLentRequest request) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(
            service.create(
                request,
                userId));
  }

  // =========================================================
  // GET ALL
  // =========================================================

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<BorrowedLentResponse>> getByUserId(
      @PathVariable Long userId) {

    return ResponseEntity.ok(
        service.getByUserId(userId));
  }

  // =========================================================
  // GET ONE
  // =========================================================

  @GetMapping("/{id}")
  public ResponseEntity<BorrowedLentResponse> getById(
      @PathVariable Long id,
      @RequestParam Long userId) {

    return ResponseEntity.ok(
        service.getById(
            id,
            userId));
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @PutMapping("/{id}")
  public ResponseEntity<BorrowedLentResponse> update(
      @PathVariable Long id,
      @RequestParam Long userId,
      @Valid @RequestBody UpdateBorrowedLentRequest request) {

    return ResponseEntity.ok(
        service.update(
            id,
            request,
            userId));
  }

  // =========================================================
  // PAYMENT
  // =========================================================

  @PatchMapping("/{id}/payment")
  public ResponseEntity<BorrowedLentResponse> recordPayment(
      @PathVariable Long id,
      @RequestParam Long userId,
      @Valid @RequestBody PaymentRequest request) {

    return ResponseEntity.ok(
        service.recordPayment(
            id,
            request,
            userId));
  }

  // =========================================================
  // DELETE
  // =========================================================

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @PathVariable Long id,
      @RequestParam Long userId) {

    service.delete(
        id,
        userId);

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/user/{userId}/summary")
  public ResponseEntity<BorrowedLentSummaryResponse> getSummary(
      @PathVariable Long userId) {

    return ResponseEntity.ok(
        service.getSummary(userId));
  }
}