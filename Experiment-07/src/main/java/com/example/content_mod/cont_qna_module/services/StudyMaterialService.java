package com.example.content_mod.cont_qna_module.services;

import com.example.content_mod.cont_qna_module.model.StudyMaterial;
import com.example.content_mod.cont_qna_module.repository.StudyMaterialRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class StudyMaterialService {
    private final StudyMaterialRepository studyMaterialRepository;

    public StudyMaterialService(StudyMaterialRepository studyMaterialRepository) {
        this.studyMaterialRepository = studyMaterialRepository;
    }

    public StudyMaterial uploadMaterial(StudyMaterial material) {
        material.setUploadedAt(LocalDateTime.now());
        return studyMaterialRepository.save(material);
    }

    public List<StudyMaterial> getAllMaterials() {
        return studyMaterialRepository.findAll();
    }
}