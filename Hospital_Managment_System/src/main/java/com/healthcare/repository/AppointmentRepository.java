package com.healthcare.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healthcare.entities.Appointment;
import com.healthcare.entities.Status;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByMyPatientIdOrderByStartDateTimeDesc(Long patientId);

    List<Appointment> findByMyDoctorIdOrderByStartDateTimeDesc(Long doctorId);

    @Query("SELECT COUNT(a) > 0 FROM Appointment a " +
           "WHERE a.myDoctor.id = :doctorId " +
           "AND a.status = :status " +
           "AND a.startDateTime < :endDateTime " +
           "AND a.endDateTime > :startDateTime")
    boolean existsOverlappingAppointment(
            @Param("doctorId") Long doctorId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("status") Status status);
}
