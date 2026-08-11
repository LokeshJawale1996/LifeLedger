package com.lifeledger.backend.features.todo.repository;

import com.lifeledger.backend.features.todo.entity.Todo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
      List<Todo> findByUserIdOrderByCreatedAtDesc(Long userId);

}