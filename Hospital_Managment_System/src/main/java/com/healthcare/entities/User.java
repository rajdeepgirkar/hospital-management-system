package com.healthcare.entities;

import java.time.LocalDate;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity 
@Table(name="users") 
/*
 * To override inherited field name in the sub class
 * Use 
 *  @AttributeOverride
 *  name - field name
 *  column - for column name
 */
@AttributeOverride(name="id" , column = @Column(name="user_id"))
//Lombok annotations
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"password","imagePath"})
public class User extends BaseEntity{
	@Column(name="first_name",length = 30) //col name - first_name , varchar(30)
	private String firstName;
	@Column(name="last_name",length = 30)
	private String lastName;
	@Column(length = 60,unique = true) //adds unique constraint
	private String email;
	@Column(length = 300,nullable = false)//adds NOT NULL constraint
	private String password;
	@Column(length =14,unique = true)
	private String phone;
	@Column(name="reg_amount")
	private Integer regAmount;
	private LocalDate dob;
	@Column(name="image_path")	
	private String imagePath;
	@Enumerated(EnumType.STRING) // creates column in Mysql - enum | varchar
	private UserRole role;
	
	public User(String firstName, String lastName, String email, String password, String phone, Integer regAmount,
			LocalDate dob, UserRole role) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.regAmount = regAmount;
		this.dob = dob;
		this.role = role;
	}
	
}
