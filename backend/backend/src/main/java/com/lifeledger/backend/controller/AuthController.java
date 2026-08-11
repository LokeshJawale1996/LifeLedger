package com.lifeledger.backend.controller;

import com.lifeledger.backend.dto.login.LoginRequest;
import com.lifeledger.backend.dto.login.LoginResponse;
import com.lifeledger.backend.dto.signup.SignupRequest;
import com.lifeledger.backend.dto.signup.SignupResponse;
import com.lifeledger.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(
            @Valid @RequestBody SignupRequest request){

        return new ResponseEntity<>(
                userService.register(request),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
        @Valid @RequestBody LoginRequest request) {

    LoginResponse response =
            userService.login(request);

    if (!response.isSuccess()) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    return ResponseEntity.ok(response);
}

}