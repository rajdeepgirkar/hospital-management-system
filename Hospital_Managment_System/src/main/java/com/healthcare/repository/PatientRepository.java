package com.healthcare.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healthcare.entities.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
 
	 Optional<Patient> findByUserDetailsId(
	            Long userId);
}
