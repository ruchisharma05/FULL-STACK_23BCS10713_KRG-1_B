package com.example.content_mod.cont_qna_module.services;

import com.example.content_mod.cont_qna_module.model.Tag;
import com.example.content_mod.cont_qna_module.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
}
