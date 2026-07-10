package com.fitempire.modules.users.mapper;

import com.fitempire.modules.users.dto.UserDto;
import com.fitempire.modules.users.dto.UserProfileDto;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserProfile;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "profile", source = "profile")
    @Mapping(target = "gymId", ignore = true)
    UserDto toDto(User user);

    UserProfileDto toDto(UserProfile profile);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "bmi", ignore = true)
    @Mapping(target = "fitnessScore", ignore = true)
    @Mapping(target = "totalCheckins", ignore = true)
    @Mapping(target = "totalClasses", ignore = true)
    @Mapping(target = "country", ignore = true)
    void updateProfile(
            com.fitempire.modules.users.dto.UpdateProfileRequest request,
            @MappingTarget UserProfile profile
    );
}
