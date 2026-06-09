package com.healthcare.entities;
/*
 * appointments 
Table columns - appointment_id , creation date , last updated ,doctor id , patient id , appointment start datetime , end time , status

 */
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
//JPA
@Entity
@Table(name="appointments")
@AttributeOverride(name="id",column = @Column(name="appointment_id"))
//Lombok
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"myPatient","myDoctor","diagTests"},callSuper = true)
public class Appointment extends BaseEntity {
	@Column(name="start_time")
	private LocalDateTime startDateTime;
	@Column(name="end_time")
	private LocalDateTime endDateTime;
	@Enumerated(EnumType.STRING)
	private Status status;
	//Appointment *------>1 Doctor
	@ManyToOne
	@JoinColumn(name="doctor_id",nullable = false)
	private Doctor myDoctor;
	//Appointment *------>1 Patient
	@ManyToOne
	@JoinColumn(name="patient_id",nullable = false)
	private Patient myPatient;
	//Appointment *----->* DiagTest
	/*
	 * Recommendation
	 *  - In many-many association , use Collection type as Set instead of  a List
	 *  Since Set doesn't allow any dups , it offers better performance while removing the elements from the association table
	 *  - Always initialize the collection , to avoid NullPointerException , while adding or removing the elements.
	 */
	@ManyToMany //mandatory otherwise MappingException
	/*
	 * To customize association table name & col names
	 *  - add optional annotation
	 */
	@JoinTable(name="appointment_tests",
	joinColumns = @JoinColumn(name="appointment_id"),
	inverseJoinColumns = @JoinColumn(name="test_id"))
	private Set<DiagTest> diagTests=new HashSet<>();
	public Appointment(LocalDateTime startDateTime) {
		super();
		this.startDateTime = startDateTime;
		this.status=Status.SCHEDULED;
	}
	

}
