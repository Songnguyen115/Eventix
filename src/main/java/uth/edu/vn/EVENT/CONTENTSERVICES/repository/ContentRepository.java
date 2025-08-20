package uth.edu.vn.EVENT.CONTENTSERVICES.repository;

import uth.edu.vn.EVENT.CONTENTSERVICES.model.content.Content;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepository extends JpaRepository<Content, Long> {
}