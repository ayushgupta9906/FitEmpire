package com.fitempire.modules.finance.repository;

import com.fitempire.modules.finance.entity.CommissionRule;
import com.fitempire.modules.gyms.entity.GymCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionRule, UUID> {
    Optional<CommissionRule> findByApplicableCategoryAndActiveTrue(GymCategory category);
}