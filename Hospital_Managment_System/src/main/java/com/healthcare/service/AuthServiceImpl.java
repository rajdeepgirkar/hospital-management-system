package com.healthcare.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthcare.dto.request.DoctorRegisterDto;
import com.healthcare.dto.request.LoginRequestDto;
import com.healthcare.dto.request.PatientRegisterDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.LoginResponseDto;
import com.healthcare.entities.Doctor;
import com.healthcare.entities.Patient;
import com.healthcare.entities.User;
import com.healthcare.entities.UserRole;
import com.healthcare.exception.DuplicateResourceException;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.PatientRepository;
import com.healthcare.repository.UserRepository;
import com.healthcare.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;

	private final DoctorRepository doctorRepository;

	private final PatientRepository patientRepository;

	private final PasswordEncoder passwordEncoder;

	private final ModelMapper modelMapper;

	private final JwtService jwtService;

	@Override
	public ApiResponse registerDoctor(DoctorRegisterDto dto) {

		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new DuplicateResourceException("Email already registered");
		}

		User user = new User();

		user.setFirstName(dto.getFirstName());
		user.setLastName(dto.getLastName());
		user.setEmail(dto.getEmail());
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setPhone(dto.getPhone());
		user.setDob(dto.getDob());
		user.setRole(UserRole.ROLE_DOCTOR);

		User savedUser = userRepository.save(user);

		Doctor doctor = modelMapper.map(dto, Doctor.class);

		doctor.setUserDetails(savedUser);

		doctorRepository.save(doctor);

		return new ApiResponse(true, "Doctor Registered Successfully");
	}

	@Override
	public ApiResponse registerPatient(PatientRegisterDto dto) {

		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new DuplicateResourceException("Email already registered");
		}

		User user = new User();

		user.setFirstName(dto.getFirstName());
		user.setLastName(dto.getLastName());
		user.setEmail(dto.getEmail());
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setPhone(dto.getPhone());
		user.setDob(dto.getDob());
		user.setRole(UserRole.ROLE_PATIENT);

		User savedUser = userRepository.save(user);

		Patient patient = modelMapper.map(dto, Patient.class);

		patient.setUserDetails(savedUser);

		patientRepository.save(patient);

		return new ApiResponse(true, "Patient Registered Successfully");
	}

	@Override
	public LoginResponseDto login(LoginRequestDto dto) {

		User user = userRepository.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("Invalid Email"));

		boolean match = passwordEncoder.matches(dto.getPassword(), user.getPassword());

		if (!match) {
			throw new ResourceNotFoundException("Invalid Password");
		}

		String token = jwtService.generateToken(user);

		return new LoginResponseDto(token, user.getRole().name(), user.getEmail(),
				user.getFirstName() + " " + user.getLastName());
	}
}