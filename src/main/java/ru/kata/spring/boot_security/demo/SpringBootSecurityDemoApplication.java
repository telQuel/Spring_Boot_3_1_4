package ru.kata.spring.boot_security.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.Arrays;
import java.util.HashSet;
import java.util.logging.Level;
import java.util.logging.Logger;

@SpringBootApplication
public class SpringBootSecurityDemoApplication {

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	public static void main(String[] args) {
		SpringApplication.run(SpringBootSecurityDemoApplication.class, args);
//		User user1 = new User();
//		user1.setName("User1");
//		user1.setPassword("abc");
//		Role userRole = new Role();
//		userRole.setName("ROLE_USER");
//		user1.setRoles(new HashSet<>(Arrays.asList(userRole)));

		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String password = "abc";
		String encodedPassword = passwordEncoder.encode(password);
		Logger logger = Logger.getLogger("ru.kata.spring.boot_security.demo.SpringBootSecurityDemoApplication");
		logger.setLevel(Level.WARNING);
		logger.log(Level.WARNING, "Password is         : " + password);


		System.out.println();
		System.out.println("Password is         : " + password);
		System.out.println("Encoded Password is : " + encodedPassword);
		System.out.println();


		boolean isPasswordMatch = passwordEncoder.matches(password, encodedPassword);
		System.out.println("Password : " + password + "   isPasswordMatch    : " + isPasswordMatch);

	}

}
