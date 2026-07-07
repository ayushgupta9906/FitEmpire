package com.fitempire.modules.memberships.service;

import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.memberships.dto.MembershipPlanDto;
import com.fitempire.modules.memberships.dto.UserMembershipDto;
import com.fitempire.modules.memberships.entity.MembershipPlan;
import com.fitempire.modules.memberships.entity.UserMembership;
import com.fitempire.modules.memberships.entity.MembershipStatus;
import com.fitempire.modules.memberships.mapper.MembershipMapper;
import com.fitempire.modules.memberships.repository.MembershipPlanRepository;
import com.fitempire.modules.memberships.repository.UserMembershipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipPlanRepository planRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final MembershipMapper mapper;

    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getActivePlans() {
        return planRepository.findAll().stream()
                .filter(MembershipPlan::isActive)
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MembershipPlanDto getPlanById(UUID planId) {
        MembershipPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> ResourceNotFoundException.of("MembershipPlan", planId));
        return mapper.toDto(plan);
    }

    @Transactional(readOnly = true)
    public List<UserMembershipDto> getActiveMemberships(UUID userId) {
        return userMembershipRepository.findActiveMemberships(userId, java.time.LocalDate.now()).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserMembershipDto> getMyMemberships(UUID userId, Pageable pageable) {
        Page<UserMembership> page = userMembershipRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.of(page.map(mapper::toDto));
    }
}
