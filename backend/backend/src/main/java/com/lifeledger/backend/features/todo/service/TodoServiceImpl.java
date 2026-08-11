package com.lifeledger.backend.features.todo.service;

import com.lifeledger.backend.features.todo.dto.CreateTodoRequest;
import com.lifeledger.backend.features.todo.dto.TodoResponse;
import com.lifeledger.backend.features.todo.dto.UpdateTodoRequest;
import com.lifeledger.backend.features.todo.entity.Todo;
import com.lifeledger.backend.features.todo.repository.TodoRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    @Transactional
    public TodoResponse createTodo(
            CreateTodoRequest request,
            Long userId
    ) {

        Todo todo = new Todo();

        todo.setTodoTitle(
                request.getTodoTitle().trim()
        );

        if (request.getDescription() != null) {
            todo.setDescription(
                    request.getDescription().trim()
            );
        }

        todo.setType(request.getType());

        todo.setUserId(userId);

        // New Todo should always start as incomplete
        todo.setCompleted(false);

        Todo savedTodo = todoRepository.save(todo);

        return mapToResponse(savedTodo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodos() {

        return todoRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TodoResponse> getTodosByUserId(Long userId) {

        return todoRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // GET
    // GET /api/v1/todos/{id}   
    // =========================================================
    @Override
    @Transactional
    public TodoResponse getTodoById(Long id) {

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Todo not found with id: " + id
                        )
                );

        return mapToResponse(todo);
    }

    // =========================================================
    // UPDATE
    // PUT /api/v1/todos/{id}
    // =========================================================

    @Override
    @Transactional
    public TodoResponse updateTodo(
            Long id,
            UpdateTodoRequest request
    ) {

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Todo not found with id: " + id
                        )
                );

        todo.setTodoTitle(
                request.getTodoTitle().trim()
        );

        todo.setDescription(
                request.getDescription() != null
                        ? request.getDescription().trim()
                        : null
        );

        todo.setType(request.getType());

        Todo updatedTodo = todoRepository.save(todo);

        return mapToResponse(updatedTodo);
    }


    // =========================================================
    // COMPLETE
    // PATCH /api/v1/todos/{id}/complete
    // =========================================================

    @Override
    @Transactional
    public TodoResponse toggleTodoCompletion(Long id) {

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Todo not found with id: " + id
                        )
                );

        // Toggle completed status
        todo.setCompleted(!todo.isCompleted());

        Todo updatedTodo = todoRepository.save(todo);

        return mapToResponse(updatedTodo);
    }


    // =========================================================
    // DELETE
    // DELETE /api/v1/todos/{id}
    // =========================================================

    @Override
    @Transactional
    public void deleteTodo(Long id) {

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Todo not found with id: " + id
                        )
                );

        todoRepository.delete(todo);
    }

    private TodoResponse mapToResponse(Todo todo) {

        return TodoResponse.builder()
                .id(todo.getId())
                .todoTitle(todo.getTodoTitle())
                .description(todo.getDescription())
                .type(todo.getType())
                .completed(todo.isCompleted())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .userId(todo.getUserId())
                .build();
    }
}