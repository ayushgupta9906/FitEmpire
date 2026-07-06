package com.fitempire.modules.gyms.mapper;

import com.fitempire.modules.gyms.dto.*;
import com.fitempire.modules.gyms.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface GymMapper {

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerName", expression = "java(gym.getOwner().getFullName())")
    GymDto toDto(Gym gym);

    GymBranchDto toDto(GymBranch branch);

    GymPhotoDto toDto(GymPhoto photo);
}
