package com.example.content_mod.cont_qna_module.repository;

import com.example.content_mod.cont_qna_module.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByDoubtId(Long doubtId);
}
