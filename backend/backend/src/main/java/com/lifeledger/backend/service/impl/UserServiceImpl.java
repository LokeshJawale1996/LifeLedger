package com.lifeledger.backend.service.impl;

import com.lifeledger.backend.dto.login.LoginRequest;
import com.lifeledger.backend.dto.login.LoginResponse;
import com.lifeledger.backend.dto.signup.SignupRequest;
import com.lifeledger.backend.dto.signup.SignupResponse;
import com.lifeledger.backend.entity.User;
import com.lifeledger.backend.repository.UserRepository;
import com.lifeledger.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public SignupResponse register(SignupRequest request) {

        User user = User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .fullName(request.getFirstName() + " " + request.getLastName())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .gender(request.getGender())
        .dateOfBirth(request.getDateOfBirth())
        .phoneNumber(request.getPhoneNumber())
        .build();

 if (repository.existsByEmail(request.getEmail())) {
    throw new RuntimeException("Email already registered");
}

if (repository.existsByPhoneNumber(request.getPhoneNumber())) {
    throw new RuntimeException("Phone number already registered");
}
repository.save(user);


return SignupResponse.builder()
        .message("User Registered Successfully")
        .build();
    }

@Override
public LoginResponse login(LoginRequest request) {

    Optional<User> optionalUser =
            repository.findByEmailOrPhoneNumber(
                    request.getUsername(),
                    request.getUsername());

    if (optionalUser.isEmpty()) {

        return LoginResponse.builder()
                .success(false)
                .message("Invalid credentials")
                .build();
    }

    User user = optionalUser.get();

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword())) {

        return LoginResponse.builder()
                .success(false)
                .message("Invalid credentials")
                .build();
    }

    return LoginResponse.builder()
            .success(true)
            .message("Login Successful")
            .username(user.getEmail() != null ? user.getEmail() : user.getPhoneNumber())
            .fullName(user.getFullName())
            .gender(user.getGender())
            .userId(user.getId())
            // .token(null)
            .build();
}
}