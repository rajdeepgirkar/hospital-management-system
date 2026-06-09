package com.healthcare.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

//JPA annotations
@Entity
@Table(name = "patients")
//Lombok annotations
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true,exclude = "userDetails")
public class Patient extends BaseEntity {
	@Enumerated(EnumType.STRING)
	@Column(name="blood_group")
	private BloodGroup bloodGroup;
	@Enumerated(EnumType.STRING)
	private Gender gender;
	@Column(name = "family_history", length = 300)
	private String familyHistory;
	//Patient 1--->1 UserDetails (one to one association)
	@OneToOne //mandatory 
	@JoinColumn(name="patient_id",nullable = false)
	@MapsId //shared PK , col name - patients_id - unique , PK ,FK , not null
	private User userDetails;
	
	public Patient(BloodGroup bloodGroup, Gender gender, String familyHistory) {
		super();
		this.bloodGroup = bloodGroup;
		this.gender = gender;
		this.familyHistory = familyHistory;
	}
	
	
}
