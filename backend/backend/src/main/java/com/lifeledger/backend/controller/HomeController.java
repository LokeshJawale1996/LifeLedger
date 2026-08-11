package com.lifeledger.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to LifeLedger Backend 🚀";
    }

    @GetMapping("/health")
    public String health() {
        return "Application Running";
    }
}