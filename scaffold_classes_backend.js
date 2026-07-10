const fs = require('fs');
const path = require('path');

// --- 1. Trainers ---
const trainerRepoDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'trainers', 'repository');
fs.mkdirSync(trainerRepoDir, { recursive: true });

const trainerRepoContent = `package com.fitempire.modules.trainers.repository;

import com.fitempire.modules.trainers.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, UUID> {
    List<Trainer> findByGymIdAndDeletedFalse(UUID gymId);
}
`;
fs.writeFileSync(path.join(trainerRepoDir, 'TrainerRepository.java'), trainerRepoContent);


const trainerControllerDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'trainers', 'controller');
fs.mkdirSync(trainerControllerDir, { recursive: true });

const trainerControllerContent = `package com.fitempire.modules.trainers.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.trainers.entity.Trainer;
import com.fitempire.modules.trainers.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerRepository trainerRepository;

    @GetMapping("/gym/{gymId}")
    public ResponseEntity<ApiResponse<List<Trainer>>> getTrainersByGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(ApiResponse.success("Success", trainerRepository.findByGymIdAndDeletedFalse(gymId)));
    }
}
`;
fs.writeFileSync(path.join(trainerControllerDir, 'TrainerController.java'), trainerControllerContent);


// --- 2. Classes ---
const classRepoDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'classes', 'repository');
fs.mkdirSync(classRepoDir, { recursive: true });

const classRepoContent = `package com.fitempire.modules.classes.repository;

import com.fitempire.modules.classes.entity.FitnessClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface FitnessClassRepository extends JpaRepository<FitnessClass, UUID> {
    List<FitnessClass> findByGymIdAndDeletedFalse(UUID gymId);
}
`;
fs.writeFileSync(path.join(classRepoDir, 'FitnessClassRepository.java'), classRepoContent);


const classControllerDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'classes', 'controller');
fs.mkdirSync(classControllerDir, { recursive: true });

const classControllerContent = `package com.fitempire.modules.classes.controller;

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
`;
fs.writeFileSync(path.join(classControllerDir, 'ClassController.java'), classControllerContent);

console.log("Scaffolded Trainer and Class Controllers/Repositories");
