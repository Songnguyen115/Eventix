package uth.edu.vn.Eventix.Payment.RabbitMQ;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Component
public class PaymentRpcServer {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private ObjectMapper objectMapper = new ObjectMapper();

    @RabbitListener(queues = "payment.summary.rpc")
    public void handlePaymentSummaryRequest(String message, Message msg) {
        String correlationId = msg.getMessageProperties().getCorrelationId();
        String replyTo = msg.getMessageProperties().getReplyTo();

        System.out.println("📥 [Payment RPC] Received: " + message + " | CorrelationId: " + correlationId);

        try {
            // Parse request
            JsonNode request = objectMapper.readTree(message);

            // Get all payments
            List<Payment> payments = paymentService.getAllPayments();

            // Calculate summary
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalPayments", payments.size());
            summary.put("totalAmount", payments.stream()
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount().doubleValue() : 0.0)
                .sum());

            // Group by status
            Map<String, Long> byStatus = new HashMap<>();
            payments.forEach(p -> {
                String status = p.getStatus() != null ? p.getStatus().toString() : "UNKNOWN";
                byStatus.put(status, byStatus.getOrDefault(status, 0L) + 1);
            });
            summary.put("byStatus", byStatus);

            // Success response
            Map<String, Object> response = new HashMap<>();
            response.put("ok", true);
            response.put("data", summary);

            sendResponse(replyTo, correlationId, response);

        } catch (Exception e) {
            System.err.println("❌ [Payment RPC] Error: " + e.getMessage());

            // Error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("ok", false);
            errorResponse.put("error", "SERVER_ERROR");
            errorResponse.put("message", e.getMessage());

            sendResponse(replyTo, correlationId, errorResponse);
        }
    }

    @RabbitListener(queues = "payment.verify.rpc")
    public void handlePaymentVerifyRequest(String message, Message msg) {
        String correlationId = msg.getMessageProperties().getCorrelationId();
        String replyTo = msg.getMessageProperties().getReplyTo();

        System.out.println("📥 [Payment RPC] Verify request: " + message + " | CorrelationId: " + correlationId);

        try {
            JsonNode request = objectMapper.readTree(message);
            Long paymentId = request.get("paymentId").asLong();

            // Verify payment exists
            Optional<Payment> paymentOpt = paymentService.getPaymentById(paymentId);

            Map<String, Object> response = new HashMap<>();
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                response.put("ok", true);
                response.put("id", payment.getPaymentId());
                response.put("amount", payment.getAmount());
                response.put("status", payment.getStatus());
            } else {
                response.put("ok", false);
                response.put("error", "NOT_FOUND");
                response.put("message", "Payment not found with id: " + paymentId);
            }

            sendResponse(replyTo, correlationId, response);

        } catch (Exception e) {
            System.err.println("❌ [Payment RPC] Verify error: " + e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("ok", false);
            errorResponse.put("error", "SERVER_ERROR");
            errorResponse.put("message", e.getMessage());

            sendResponse(replyTo, correlationId, errorResponse);
        }
    }

    private void sendResponse(String replyTo, String correlationId, Map<String, Object> response) {
        try {
            String responseJson = objectMapper.writeValueAsString(response);

            MessageProperties props = new MessageProperties();
            props.setCorrelationId(correlationId);
            props.setContentType("application/json");

            Message responseMessage = new Message(responseJson.getBytes(), props);

            rabbitTemplate.convertAndSend("", replyTo, responseMessage);
            System.out.println("📤 [Payment RPC] Response sent to: " + replyTo + " | CorrelationId: " + correlationId);

        } catch (Exception e) {
            System.err.println("❌ [Payment RPC] Failed to send response: " + e.getMessage());
        }
    }
}
