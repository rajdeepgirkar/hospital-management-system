package com.healthcare.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//name(unique) , description , cost

@Entity
@Table(name="diag_tests")
@AttributeOverride(name="id",column = @Column(name="test_id"))
//Lombok
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode(of="name",callSuper = false)
public class DiagTest extends BaseEntity {
	@Column(unique = true)
	private String name;
	private String description;
	private int cost;	

}
