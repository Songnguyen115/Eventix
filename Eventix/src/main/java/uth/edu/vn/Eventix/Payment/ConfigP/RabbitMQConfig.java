package uth.edu.vn.Eventix.Payment.ConfigP;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
// Exchange for RPC communication
    @Bean
    public TopicExchange rpcExchange() {
        return new TopicExchange("eventix.rpc", true, false);
    }

    // Queue for payment summary requests
    @Bean
    public Queue paymentSummaryQueue() {
        return QueueBuilder.durable("payment.summary.rpc").build();
    }

    // Queue for payment verification requests
    @Bean
    public Queue paymentVerifyQueue() {
        return QueueBuilder.durable("payment.verify.rpc").build();
    }

    // Binding for payment summary
    @Bean
    public Binding paymentSummaryBinding() {
        return BindingBuilder.bind(paymentSummaryQueue())
                .to(rpcExchange())
                .with("payment.summary.request");
    }

    // Binding for payment verification
    @Bean
    public Binding paymentVerifyBinding() {
        return BindingBuilder.bind(paymentVerifyQueue())
                .to(rpcExchange())
                .with("payment.verify.request");
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setDefaultReceiveQueue("payment.summary.rpc");
        return template;
    }
}
