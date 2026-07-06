package com.fitempire.modules.memberships.repository;

import com.fitempire.modules.memberships.entity.MembershipPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, UUID> {
    List<MembershipPlan> findByGymIdAndActiveTrueAndDeletedFalseOrderBySortOrder(UUID gymId);
}
