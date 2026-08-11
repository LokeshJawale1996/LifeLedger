package com.lifeledger.backend.features.todo.dto;

import com.lifeledger.backend.features.todo.entity.TodoType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTodoRequest {

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

    @NotNull(message = "Todo type is required")
    private TodoType type;

}