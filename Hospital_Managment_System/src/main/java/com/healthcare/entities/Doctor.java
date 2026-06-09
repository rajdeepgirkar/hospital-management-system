package com.healthcare.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

//JPA
@Entity
@Table(name="doctors")
//Lombok
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true,exclude ={"userDetails","appointments"})
public class Doctor extends BaseEntity {
	private String qualifications;
	private String speciality;
	@Column(name="experience_in_years")
	private int experienceInYears;
	@Column(name="appointment_time")
	private int appointmentTime;
	private int fees;
	/*establish one to one association between Doctor & UserDetails
	 * Doctor 1---->1 UserDetails
	 */
	//cascades ALL (save , update , delete) operations from src entity -> target entity
	@OneToOne(cascade = CascadeType.ALL)
	//mandatory annotation - otherwise : Hibernate throws MappingException
	//to specify name of FK column & to add NOT NULL constraint
	@JoinColumn(name="doctor_id",nullable = false)
	@MapsId //shared PK with users table (doctor_id : PK , FK)
	private User userDetails;//association field
	
	/*
	 * Doctor 1---->* Appointment
	 * Owning side - containing FK (many side) - Appointment
	 * Inverse side - not containing FK - Doctor
	 * when is mappedBy necessary 
	 *  - in case of a bi dir association only
	 *  where should it appear ?
	 *   - inverse side (Doctor)
	 *   What should be the value of mappedBy
	 *    - name of the association field , as it appears in owning side.
	 */
	@OneToMany(mappedBy = "myDoctor", cascade = CascadeType.ALL/* ,fetch = FetchType.EAGER */)
	private List<Appointment> appointments=new ArrayList<>();
	
	public Doctor(String qualifications, String speciality, int experienceInYears, int appointmentTime, int fees) {
		super();
		this.qualifications = qualifications;
		this.speciality = speciality;
		this.experienceInYears = experienceInYears;
		this.appointmentTime = appointmentTime;
		this.fees = fees;
	}
	
}
