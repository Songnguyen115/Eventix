package uth.edu.vn.Eventix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = {
    SecurityAutoConfiguration.class,
    ManagementWebSecurityAutoConfiguration.class
})
@EnableJpaRepositories(basePackages = "uth.edu.vn.Eventix.Payment.RepositoryP")
public class EventixApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventixApplication.class, args);
		System.out.println("🚀 Payment Service ready for real database demo!");
	}

}


