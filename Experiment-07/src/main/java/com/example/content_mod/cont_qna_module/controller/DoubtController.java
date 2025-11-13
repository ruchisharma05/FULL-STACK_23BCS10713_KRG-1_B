package com.example.content_mod.cont_qna_module.controller;

import com.example.content_mod.cont_qna_module.model.Doubt;
import com.example.content_mod.cont_qna_module.services.DoubtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/doubts")
public class DoubtController {
    private final DoubtService doubtService;

    public DoubtController(DoubtService doubtService) {
        this.doubtService = doubtService;
    }

    @PostMapping
    public ResponseEntity<Doubt> createDoubt(@RequestBody @Valid DoubtRequest request) {
        Doubt doubt = new Doubt();
        doubt.setContent(request.getContent());
        doubt.setImageUrl(request.getImageUrl());
        doubt.setPostedBy(request.getPostedBy());
        Doubt saved = doubtService.createDoubt(doubt, request.getTags());
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Doubt>> getAllDoubts() {
        return ResponseEntity.ok(doubtService.getAllDoubts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doubt> getDoubt(@PathVariable Long id) {
        Doubt doubt = doubtService.getDoubtById(id);
        if (doubt == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(doubt);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoubt(@PathVariable Long id) {
        doubtService.deleteDoubt(id);
        return ResponseEntity.noContent().build();
    }

    public static class DoubtRequest {
        private String content;
        private String imageUrl;
        private String postedBy;
        private Set<String> tags;

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getPostedBy() { return postedBy; }
        public void setPostedBy(String postedBy) { this.postedBy = postedBy; }
        public Set<String> getTags() { return tags; }
        public void setTags(Set<String> tags) { this.tags = tags; }
    }
}
