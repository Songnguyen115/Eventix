package uth.edu.vn.EVENT.CONTENTSERVICES.controller;

import uth.edu.vn.EVENT.CONTENTSERVICES.model.content.Content;
import uth.edu.vn.EVENT.CONTENTSERVICES.service.ContentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {
    private final ContentService service;

    public ContentController(ContentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Content> getAll() {
        return service.getAllContent();
    }

    @PostMapping
    public Content create(@RequestBody Content content) {
        return service.createContent(content);
    }
}