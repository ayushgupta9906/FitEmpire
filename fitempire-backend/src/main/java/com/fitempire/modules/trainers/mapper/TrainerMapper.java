package com.fitempire.modules.trainers.mapper;

import com.fitempire.modules.trainers.dto.TrainerDto;
import com.fitempire.modules.trainers.dto.TrainerScheduleDto;
import com.fitempire.modules.trainers.entity.Trainer;
import com.fitempire.modules.trainers.entity.TrainerSchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainerMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "gymId", source = "gym.id")
    @Mapping(target = "gymName", source = "gym.name")
    TrainerDto toDto(Trainer trainer);

    @Mapping(target = "trainerId", source = "trainer.id")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    TrainerScheduleDto toDto(TrainerSchedule schedule);
}
