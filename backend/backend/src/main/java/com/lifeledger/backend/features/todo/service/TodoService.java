package com.lifeledger.backend.features.todo.service;

import java.util.List;

import com.lifeledger.backend.features.todo.dto.CreateTodoRequest;
import com.lifeledger.backend.features.todo.dto.TodoResponse;
import com.lifeledger.backend.features.todo.dto.UpdateTodoRequest;

public interface TodoService {

    TodoResponse createTodo(
            CreateTodoRequest request,
            Long userId
    );

    List<TodoResponse> getAllTodos();

    List<TodoResponse> getTodosByUserId(Long userId);

    TodoResponse getTodoById(Long id);

    TodoResponse updateTodo(
            Long id,
            UpdateTodoRequest request
    );

    TodoResponse toggleTodoCompletion(Long id);

    void deleteTodo(Long id);
}