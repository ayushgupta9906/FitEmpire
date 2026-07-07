package com.fitempire.modules.memberships.mapper;

import com.fitempire.modules.memberships.dto.MembershipPlanDto;
import com.fitempire.modules.memberships.dto.UserMembershipDto;
import com.fitempire.modules.memberships.entity.MembershipPlan;
import com.fitempire.modules.memberships.entity.UserMembership;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MembershipMapper {

    @Mapping(target = "gymId", source = "gym.id")
    @Mapping(target = "gymName", source = "gym.name")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    MembershipPlanDto toDto(MembershipPlan plan);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.fullName")
    @Mapping(target = "planId", source = "plan.id")
    @Mapping(target = "planName", source = "plan.name")
    @Mapping(target = "gymId", source = "gym.id")
    @Mapping(target = "gymName", source = "gym.name")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "active", expression = "java(userMembership.isActive())")
    UserMembershipDto toDto(UserMembership userMembership);
}
