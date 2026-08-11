package com.lifeledger.backend.features.todo.dto;


import com.lifeledger.backend.features.todo.entity.TodoType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTodoRequest {

    @NotBlank(message = "Todo title is required")
    @Size(
        max = 200,
        message = "Todo title cannot exceed 200 characters"
    )
    private String todoTitle;

    @Size(
        max = 1000,
        message = "Description cannot exceed 1000 characters"
    )
    private String description;
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Todo type is required")
    private TodoType type;

    
}