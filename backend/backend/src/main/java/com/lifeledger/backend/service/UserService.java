package com.lifeledger.backend.service;

import com.lifeledger.backend.dto.login.LoginRequest;
import com.lifeledger.backend.dto.login.LoginResponse;
import com.lifeledger.backend.dto.signup.SignupRequest;
import com.lifeledger.backend.dto.signup.SignupResponse;

public interface UserService {

    SignupResponse register(SignupRequest request);
    LoginResponse login(LoginRequest request);


}