package com.example.content_mod.cont_qna_module.repository;

import com.example.content_mod.cont_qna_module.model.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    
}
