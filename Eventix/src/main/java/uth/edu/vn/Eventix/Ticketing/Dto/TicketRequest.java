package uth.edu.vn.Eventix.Ticketing.Dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TicketRequest {
    private String eventName;
    private String studentName;
    private int capacity;
}

