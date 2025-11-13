package com.example.content_mod.cont_qna_module.controller;

import com.example.content_mod.cont_qna_module.model.StudyMaterial;
import com.example.content_mod.cont_qna_module.services.StudyMaterialService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class StudyMaterialController {
    private final StudyMaterialService studyMaterialService;

    public StudyMaterialController(StudyMaterialService studyMaterialService) {
        this.studyMaterialService = studyMaterialService;
    }

    @PostMapping
    public ResponseEntity<StudyMaterial> uploadMaterial(@RequestBody @Valid StudyMaterial material) {
        StudyMaterial saved = studyMaterialService.uploadMaterial(material);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<StudyMaterial>> getAllMaterials() {
        return ResponseEntity.ok(studyMaterialService.getAllMaterials());
    }
}
