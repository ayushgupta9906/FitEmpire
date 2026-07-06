package com.fitempire.modules.trainers.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.DuplicateResourceException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.trainers.dto.*;
import com.fitempire.modules.trainers.entity.Trainer;
import com.fitempire.modules.trainers.entity.TrainerSchedule;
import com.fitempire.modules.trainers.mapper.TrainerMapper;
import com.fitempire.modules.trainers.repository.TrainerRepository;
import com.fitempire.modules.trainers.repository.TrainerScheduleRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepository trainerRepository;
    private final TrainerScheduleRepository trainerScheduleRepository;
    private final UserRepository userRepository;
    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final TrainerMapper trainerMapper;

    @Transactional
    public TrainerDto registerTrainer(CreateTrainerRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> ResourceNotFoundException.of("User", request.getUserId()));

        if (trainerRepository.findByUserIdAndDeletedFalse(request.getUserId()).isPresent()) {
            throw new DuplicateResourceException("User is already registered as a trainer.");
        }

        Gym gym = gymRepository.findById(request.getGymId())
                .orElseThrow(() -> ResourceNotFoundException.of("Gym", request.getGymId()));

        // Update user role to TRAINER
        user.setRole(UserRole.TRAINER);
        userRepository.save(user);

        Trainer trainer = new Trainer();
        trainer.setUser(user);
        trainer.setGym(gym);
        trainer.setBio(request.getBio());
        trainer.setExperienceYears(request.getExperienceYears());
        trainer.setCertifications(request.getCertifications());
        trainer.setSpecializations(request.getSpecializations());
        trainer.setProfilePictureUrl(request.getProfilePictureUrl());
        trainer.setCoverImageUrl(request.getCoverImageUrl());
        trainer.setHourlyRate(request.getHourlyRate());
        trainer.setAvailable(true);

        Trainer savedTrainer = trainerRepository.save(trainer);
        log.info("Trainer registered: {} associated with User: {}", savedTrainer.getId(), user.getId());
        return trainerMapper.toDto(savedTrainer);
    }

    @Transactional(readOnly = true)
    public TrainerDto getTrainerById(UUID id) {
        Trainer trainer = trainerRepository.findById(id)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("Trainer", id));
        return trainerMapper.toDto(trainer);
    }

    @Transactional(readOnly = true)
    public TrainerDto getTrainerByUserId(UUID userId) {
        Trainer trainer = trainerRepository.findByUserIdAndDeletedFalse(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("Trainer for User", userId));
        return trainerMapper.toDto(trainer);
    }

    @Transactional(readOnly = true)
    public PagedResponse<TrainerDto> searchTrainers(String query, String specialization, Pageable pageable) {
        Page<Trainer> page;
        if (specialization != null && !specialization.isBlank()) {
            page = trainerRepository.findBySpecialization(specialization.trim().toUpperCase(), pageable);
        } else if (query != null && !query.isBlank()) {
            page = trainerRepository.searchTrainers(query.trim(), pageable);
        } else {
            page = trainerRepository.findAllActive(pageable);
        }
        return PagedResponse.of(page.map(trainerMapper::toDto));
    }

    @Transactional(readOnly = true)
    public List<TrainerDto> getFeaturedTrainers() {
        return trainerRepository.findFeaturedActive().stream()
                .map(trainerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TrainerDto> getTrainersByGym(UUID gymId) {
        return trainerRepository.findByGymIdAndDeletedFalse(gymId).stream()
                .map(trainerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TrainerScheduleDto addSchedule(UUID trainerId, CreateTrainerScheduleRequest request) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("Trainer", trainerId));

        GymBranch branch = gymBranchRepository.findById(request.getBranchId())
                .orElseThrow(() -> ResourceNotFoundException.of("GymBranch", request.getBranchId()));

        if (!branch.getGym().getId().equals(trainer.getGym().getId())) {
            throw new BusinessException("Branch does not belong to the trainer's gym.", "INVALID_BRANCH", HttpStatus.BAD_REQUEST);
        }

        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new BusinessException("Start time must be before end time.", "INVALID_TIME_RANGE", HttpStatus.BAD_REQUEST);
        }

        TrainerSchedule schedule = new TrainerSchedule();
        schedule.setTrainer(trainer);
        schedule.setBranch(branch);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setAvailable(true);

        TrainerSchedule savedSchedule = trainerScheduleRepository.save(schedule);
        log.info("Schedule added for trainer: {} on day: {}", trainerId, request.getDayOfWeek());
        return trainerMapper.toDto(savedSchedule);
    }

    @Transactional(readOnly = true)
    public List<TrainerScheduleDto> getTrainerSchedules(UUID trainerId) {
        return trainerScheduleRepository.findByTrainerId(trainerId).stream()
                .map(trainerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSchedule(UUID trainerId, UUID scheduleId) {
        TrainerSchedule schedule = trainerScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> ResourceNotFoundException.of("Schedule", scheduleId));

        if (!schedule.getTrainer().getId().equals(trainerId)) {
            throw new BusinessException("Schedule does not belong to this trainer.", "ACCESS_DENIED", HttpStatus.FORBIDDEN);
        }

        trainerScheduleRepository.delete(schedule);
        log.info("Schedule {} deleted for trainer {}", scheduleId, trainerId);
    }

    @Transactional
    public void toggleTrainerAvailability(UUID trainerId, boolean available) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("Trainer", trainerId));

        trainer.setAvailable(available);
        trainerRepository.save(trainer);
        log.info("Trainer {} availability toggled to {}", trainerId, available);
    }
}
