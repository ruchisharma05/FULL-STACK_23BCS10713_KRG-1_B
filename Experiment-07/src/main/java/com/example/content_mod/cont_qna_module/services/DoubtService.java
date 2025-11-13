package com.example.content_mod.cont_qna_module.services;

import com.example.content_mod.cont_qna_module.model.Doubt;
import com.example.content_mod.cont_qna_module.model.Tag;
import com.example.content_mod.cont_qna_module.repository.DoubtRepository;
import com.example.content_mod.cont_qna_module.repository.TagRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class DoubtService {
    private final DoubtRepository doubtRepository;
    private final TagRepository tagRepository;

    public DoubtService(DoubtRepository doubtRepository, TagRepository tagRepository) {
        this.doubtRepository = doubtRepository;
        this.tagRepository = tagRepository;
    }

    public Doubt createDoubt(Doubt doubt, Set<String> tagNames) {
        doubt.setPostedAt(LocalDateTime.now());
        Set<Tag> tags = new HashSet<>();
        for (String name : tagNames) {
            Tag tag = tagRepository.findByName(name).orElseGet(() -> {
                Tag t = new Tag();
                t.setName(name);
                return tagRepository.save(t);
            });
            tags.add(tag);
        }
        doubt.setTags(tags);
        return doubtRepository.save(doubt);
    }

    public List<Doubt> getAllDoubts() {
        return doubtRepository.findAll();
    }

    public Doubt getDoubtById(Long id) {
        return doubtRepository.findById(id).orElse(null);
    }

    public void deleteDoubt(Long id) {
        doubtRepository.deleteById(id);
    }
}
