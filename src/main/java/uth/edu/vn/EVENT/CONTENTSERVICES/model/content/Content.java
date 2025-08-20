package uth.edu.vn.EVENT.CONTENTSERVICES.model.content;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String body;

    @OneToOne(cascade = CascadeType.ALL)
    private SEOData seo;
}