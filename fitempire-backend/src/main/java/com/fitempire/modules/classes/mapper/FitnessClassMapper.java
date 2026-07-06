package com.fitempire.modules.classes.mapper;

import com.fitempire.modules.classes.dto.ClassScheduleDto;
import com.fitempire.modules.classes.dto.FitnessClassDto;
import com.fitempire.modules.classes.entity.ClassSchedule;
import com.fitempire.modules.classes.entity.FitnessClass;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FitnessClassMapper {

    @Mapping(target = "gymId", source = "gym.id")
    @Mapping(target = "gymName", source = "gym.name")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "trainerId", source = "trainer.id")
    @Mapping(target = "trainerName", source = "trainer.user.firstName")
    FitnessClassDto toDto(FitnessClass fitnessClass);

    @Mapping(target = "fitnessClassId", source = "fitnessClass.id")
    @Mapping(target = "className", source = "fitnessClass.name")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "trainerId", source = "trainer.id")
    @Mapping(target = "trainerName", source = "trainer.user.firstName")
    ClassScheduleDto toDto(ClassSchedule schedule);
}
