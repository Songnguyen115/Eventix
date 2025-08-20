package uth.edu.vn.EVENT.CONTENTSERVICES.model.content;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SEOData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keywords;
    private String metaDescription;
}