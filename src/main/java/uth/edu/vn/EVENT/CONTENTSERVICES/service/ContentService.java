package uth.edu.vn.EVENT.CONTENTSERVICES.service;

import uth.edu.vn.EVENT.CONTENTSERVICES.model.content.Content;
import uth.edu.vn.EVENT.CONTENTSERVICES.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {
    private final ContentRepository repository;

    public ContentService(ContentRepository repository) {
        this.repository = repository;
    }

    public List<Content> getAllContent() {
        return repository.findAll();
    }

    public Content createContent(Content content) {
        return repository.save(content);
    }
}