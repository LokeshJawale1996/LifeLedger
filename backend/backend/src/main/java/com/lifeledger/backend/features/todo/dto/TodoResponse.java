package com.lifeledger.backend.features.todo.dto;

import com.lifeledger.backend.features.todo.entity.TodoType;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TodoResponse {

    private Long id;

    private String todoTitle;

    private String description;

    private TodoType type;

    private boolean completed;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long userId;

}
