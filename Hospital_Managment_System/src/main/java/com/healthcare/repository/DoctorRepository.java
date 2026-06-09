package com.healthcare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healthcare.entities.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

	Optional<Doctor> findByUserDetailsId(
            Long userId);

	List<Doctor> findBySpeciality(String speciality);

	@org.springframework.data.jpa.repository.Query("SELECT DISTINCT d.speciality FROM Doctor d")
	List<String> findDistinctSpecialities();
}
