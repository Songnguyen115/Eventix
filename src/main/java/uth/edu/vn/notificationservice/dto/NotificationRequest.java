package uth.edu.vn.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private String channel; // EMAIL, SMS, PUSH
    private String email; // dùng khi gửi email
    private String phone; // dùng khi gửi SMS
    private String deviceToken; // dùng khi gửi push
    private String message; // nội dung thông báo
}
