package com.fitempire.modules.classes.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.classes.entity.FitnessClass;
import com.fitempire.modules.classes.repository.FitnessClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class ClassController {

    private final FitnessClassRepository classRepository;

    @GetMapping("/gym/{gymId}")
    public ResponseEntity<ApiResponse<List<FitnessClass>>> getClassesByGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(ApiResponse.success("Success", classRepository.findByGymIdAndDeletedFalse(gymId)));
    }
}
