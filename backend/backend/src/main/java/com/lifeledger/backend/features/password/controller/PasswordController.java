package com.lifeledger.backend.features.password.controller;

import com.lifeledger.backend.features.password.dto.CreatePasswordRequest;
import com.lifeledger.backend.features.password.dto.PasswordResponse;
import com.lifeledger.backend.features.password.dto.UpdatePasswordRequest;
import com.lifeledger.backend.features.password.service.PasswordService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/passwordManager")
@CrossOrigin
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(
            PasswordService passwordService
    ) {
        this.passwordService =
                passwordService;
    }

    // =========================================================
    // CREATE
    // POST /api/v1/passwords
    // =========================================================

    @PostMapping("/create")
    public ResponseEntity<PasswordResponse> createPassword(
            @Valid @RequestBody CreatePasswordRequest request,
            @RequestParam Long userId
    ) {

        PasswordResponse response =
                passwordService.createPassword(
                        request,
                        userId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // GET ALL USER PASSWORDS
    // GET /api/v1/passwords/user/{userId}
    // =========================================================

    @GetMapping("/getByUserId/{userId}")
    public ResponseEntity<List<PasswordResponse>>
    getPasswordsByUserId(
            @PathVariable Long userId
    ) {

        List<PasswordResponse> response =
                passwordService.getPasswordsByUserId(
                        userId
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET ONE
    // GET /api/v1/passwords/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<PasswordResponse>
    getPasswordById(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {

        PasswordResponse response =
                passwordService.getPasswordById(
                        id,
                        userId
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // UPDATE
    // PUT /api/v1/passwords/{id}
    // =========================================================

    @PutMapping("updateById/{id}")
    public ResponseEntity<PasswordResponse>
    updatePassword(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePasswordRequest request
    ) {

        PasswordResponse response =
                passwordService.updatePassword(
                        id,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // DELETE
    // DELETE /api/v1/passwords/{id}
    // =========================================================

    @DeleteMapping("deleteById/{id}")
    public ResponseEntity<Void> deletePassword(
            @PathVariable Long id
    ) {

        passwordService.deletePassword(
                id        );

        return ResponseEntity.noContent().build();
    }
}