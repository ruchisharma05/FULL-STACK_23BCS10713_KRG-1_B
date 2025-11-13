package com.example.content_mod.cont_qna_module.controller;

import com.example.content_mod.cont_qna_module.model.*;
import com.example.content_mod.cont_qna_module.services.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {
    private final AnswerService answerService;
    private final DoubtService doubtService;

    public AnswerController(AnswerService answerService, DoubtService doubtService) {
        this.answerService = answerService;
        this.doubtService = doubtService;
    }

    @PostMapping
    public ResponseEntity<Answer> postAnswer(@RequestBody @Valid AnswerRequest request) {
        Doubt doubt = doubtService.getDoubtById(request.getDoubtId());
        if (doubt == null) {
            return ResponseEntity.badRequest().build();
        }
        Answer answer = new Answer();
        answer.setContent(request.getContent());
        answer.setAnsweredBy(request.getAnsweredBy());
        answer.setDoubt(doubt);
        Answer saved = answerService.addAnswer(answer);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{doubtId}")
    public ResponseEntity<List<Answer>> getAnswers(@PathVariable Long doubtId) {
        return ResponseEntity.ok(answerService.getAnswersByDoubt(doubtId));
    }

    public static class AnswerRequest {
        private Long doubtId;
        private String content;
        private String answeredBy;

        public Long getDoubtId() { return doubtId; }
        public void setDoubtId(Long doubtId) { this.doubtId = doubtId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getAnsweredBy() { return answeredBy; }
        public void setAnsweredBy(String answeredBy) { this.answeredBy = answeredBy; }
    }
}
