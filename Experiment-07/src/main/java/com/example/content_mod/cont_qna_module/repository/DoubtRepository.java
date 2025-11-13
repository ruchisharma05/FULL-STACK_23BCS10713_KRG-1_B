package com.example.content_mod.cont_qna_module.repository;

import com.example.content_mod.cont_qna_module.model.Doubt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoubtRepository extends JpaRepository<Doubt, Long> {
}
