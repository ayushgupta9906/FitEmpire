package com.fitempire.modules.classes.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.classes.dto.*;
import com.fitempire.modules.classes.entity.ClassSchedule;
import com.fitempire.modules.classes.entity.FitnessClass;
import com.fitempire.modules.classes.mapper.FitnessClassMapper;
import com.fitempire.modules.classes.repository.ClassScheduleRepository;
import com.fitempire.modules.classes.repository.FitnessClassRepository;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.trainers.entity.Trainer;
import com.fitempire.modules.trainers.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FitnessClassService {

    private final FitnessClassRepository fitnessClassRepository;
    private final ClassScheduleRepository classScheduleRepository;
    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final TrainerRepository trainerRepository;
    private final FitnessClassMapper fitnessClassMapper;

    @Transactional
    public FitnessClassDto createClass(CreateClassRequest request) {
        Gym gym = gymRepository.findById(request.getGymId())
                .orElseThrow(() -> ResourceNotFoundException.of("Gym", request.getGymId()));

        GymBranch branch = null;
        if (request.getBranchId() != null) {
            branch = gymBranchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> ResourceNotFoundException.of("GymBranch", request.getBranchId()));
        }

        Trainer trainer = null;
        if (request.getTrainerId() != null) {
            trainer = trainerRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Trainer", request.getTrainerId()));
        }

        FitnessClass fitnessClass = new FitnessClass();
        fitnessClass.setGym(gym);
        fitnessClass.setBranch(branch);
        fitnessClass.setTrainer(trainer);
        fitnessClass.setName(request.getName());
        fitnessClass.setDescription(request.getDescription());
        fitnessClass.setThumbnailUrl(request.getThumbnailUrl());
        fitnessClass.setDurationMins(request.getDurationMins());
        fitnessClass.setMaxCapacity(request.getMaxCapacity());
        fitnessClass.setDifficulty(request.getDifficulty());
        fitnessClass.setCategory(request.getCategory());
        fitnessClass.setTags(request.getTags());
        fitnessClass.setActive(true);

        FitnessClass saved = fitnessClassRepository.save(fitnessClass);
        log.info("FitnessClass created: {}", saved.getId());
        return fitnessClassMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public FitnessClassDto getClassById(UUID id) {
        FitnessClass fitnessClass = fitnessClassRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("FitnessClass", id));
        return fitnessClassMapper.toDto(fitnessClass);
    }

    @Transactional(readOnly = true)
    public PagedResponse<FitnessClassDto> getClasses(String search, Pageable pageable) {
        Page<FitnessClass> page;
        if (search != null && !search.isBlank()) {
            page = fitnessClassRepository.searchClasses(search.trim(), pageable);
        } else {
            page = fitnessClassRepository.findAllActive(pageable);
        }
        return PagedResponse.of(page.map(fitnessClassMapper::toDto));
    }

    @Transactional(readOnly = true)
    public List<FitnessClassDto> getClassesByGym(UUID gymId) {
        return fitnessClassRepository.findByGymIdAndDeletedFalse(gymId).stream()
                .map(fitnessClassMapper::toDto)
                .collect(Collectors.toList());
    }

    // ── Class Schedule Service Methods ───────────────────────────────────────

    @Transactional
    public ClassScheduleDto createSchedule(CreateClassScheduleRequest request) {
        FitnessClass fitnessClass = fitnessClassRepository.findById(request.getFitnessClassId())
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("FitnessClass", request.getFitnessClassId()));

        GymBranch branch = gymBranchRepository.findById(request.getBranchId())
                .orElseThrow(() -> ResourceNotFoundException.of("GymBranch", request.getBranchId()));

        Trainer trainer = null;
        if (request.getTrainerId() != null) {
            trainer = trainerRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Trainer", request.getTrainerId()));
        } else {
            trainer = fitnessClass.getTrainer();
        }

        // Calculate end time
        int duration = fitnessClass.getDurationMins();
        var endTime = request.getStartTime().plusMinutes(duration);

        ClassSchedule schedule = new ClassSchedule();
        schedule.setFitnessClass(fitnessClass);
        schedule.setBranch(branch);
        schedule.setTrainer(trainer);
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(endTime);
        schedule.setMaxCapacity(request.getMaxCapacity() > 0 ? request.getMaxCapacity() : fitnessClass.getMaxCapacity());
        schedule.setBookedCount(0);
        schedule.setWaitlistCount(0);
        schedule.setCancelled(false);

        ClassSchedule saved = classScheduleRepository.save(schedule);
        log.info("ClassSchedule created: {} for date: {}", saved.getId(), saved.getScheduledDate());
        return fitnessClassMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ClassScheduleDto> getSchedulesByBranchAndDate(UUID branchId, LocalDate date) {
        return classScheduleRepository.findActiveByBranchAndDate(branchId, date).stream()
                .map(fitnessClassMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClassScheduleDto> getSchedulesByBranchAndDateRange(UUID branchId, LocalDate start, LocalDate end) {
        return classScheduleRepository.findActiveByBranchAndDateRange(branchId, start, end).stream()
                .map(fitnessClassMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelSchedule(UUID scheduleId, String reason) {
        ClassSchedule schedule = classScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> ResourceNotFoundException.of("ClassSchedule", scheduleId));

        if (schedule.isCancelled()) {
            throw new BusinessException("Schedule is already cancelled.", "ALREADY_CANCELLED", HttpStatus.BAD_REQUEST);
        }

        schedule.setCancelled(true);
        schedule.setCancellationReason(reason);
        classScheduleRepository.save(schedule);
        log.info("ClassSchedule {} cancelled. Reason: {}", scheduleId, reason);
    }
}
