package com.lifeledger.backend.features.todo.controller;


import com.lifeledger.backend.features.todo.dto.CreateTodoRequest;
import com.lifeledger.backend.features.todo.dto.TodoResponse;
import com.lifeledger.backend.features.todo.dto.UpdateTodoRequest;
import com.lifeledger.backend.features.todo.service.TodoService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping("/create")
    public ResponseEntity<TodoResponse> createTodo(
            @Valid @RequestBody CreateTodoRequest request
    ) {

        // Use the userId supplied in the request for now.
        // Later this should come from the authenticated JWT user.
        Long userId = request.getUserId();

        TodoResponse response = todoService.createTodo(request, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

     /**
     * Get all Todos
     *
     * GET /api/v1/todos
     */
    @GetMapping("/getAll")
    public ResponseEntity<List<TodoResponse>> getAllTodos() {

        return ResponseEntity.ok(
                todoService.getAllTodos()
        );
    }

    /**
     * Get Todos by User ID
     *
     * GET /api/v1/todos/{userId}
     */
    @GetMapping("getByUserId/{userId}")
    public ResponseEntity<List<TodoResponse>> getTodosByUserId(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                todoService.getTodosByUserId(userId)
        );
    }

    /**
     * Get a Todo by ID
     *
     * GET /api/v1/todos/{id}
     */
    @GetMapping("getById/{id}")
    public ResponseEntity<TodoResponse> getTodoById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                todoService.getTodoById(id)
        );
    }

    // =========================================================
    // UPDATE
    // PUT /api/v1/todos/{id}
    // =========================================================

    @PutMapping("updateById/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTodoRequest request
    ) {

        TodoResponse response =
                todoService.updateTodo(
                        id,
                        request
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // COMPLETE
    // PATCH /api/v1/todos/{id}/complete
    // =========================================================

    @PatchMapping("toggleCompletion/{id}")
    public ResponseEntity<TodoResponse> toggleTodoCompletion(
            @PathVariable Long id
    ) {

        TodoResponse response =
                todoService.toggleTodoCompletion(id);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // DELETE
    // DELETE /api/v1/todos/{id}
    // =========================================================

    @DeleteMapping("deleteById/{id}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable Long id
    ) {

        todoService.deleteTodo(id);

        return ResponseEntity.noContent().build();
    }
}