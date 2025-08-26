package uth.edu.vn.Eventix.Payment.ConfigP;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "momo")
@Getter
@Setter
public class PaymentConfig {
    private String partnerCode;
    private String accessKey;
    private String secretKey;
    private String endpoint;
    private String returnUrl;
    private String notifyUrl;
}
