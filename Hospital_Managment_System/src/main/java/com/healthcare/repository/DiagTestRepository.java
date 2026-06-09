package com.healthcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healthcare.entities.DiagTest;

@Repository
public interface DiagTestRepository extends JpaRepository<DiagTest, Long> {
}
