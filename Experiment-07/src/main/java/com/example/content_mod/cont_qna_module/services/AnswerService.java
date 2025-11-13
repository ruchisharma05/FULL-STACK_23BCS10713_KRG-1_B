package com.example.content_mod.cont_qna_module.services;

import com.example.content_mod.cont_qna_module.model.Answer;
import com.example.content_mod.cont_qna_module.repository.AnswerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AnswerService {
    private final AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public Answer addAnswer(Answer answer) {
        answer.setAnsweredAt(LocalDateTime.now());
        return answerRepository.save(answer);
    }

    public List<Answer> getAnswersByDoubt(Long doubtId) {
        return answerRepository.findByDoubtId(doubtId);
    }
}
