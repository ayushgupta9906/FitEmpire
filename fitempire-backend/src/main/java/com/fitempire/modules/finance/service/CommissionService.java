package com.fitempire.modules.finance.service;

import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.modules.finance.entity.CommissionRule;
import com.fitempire.modules.finance.repository.CommissionRuleRepository;
import com.fitempire.modules.gyms.entity.GymCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRuleRepository commissionRuleRepository;

    @Transactional(readOnly = true)
    public BigDecimal calculateCommission(BigDecimal totalAmount, GymCategory category) {
        Optional<CommissionRule> ruleOpt = commissionRuleRepository.findByApplicableCategoryAndActiveTrue(category);
        
        BigDecimal percentage = BigDecimal.valueOf(15.0); // Default to 15% if no rule found
        if (ruleOpt.isPresent()) {
            percentage = ruleOpt.get().getPercentage();
        }

        BigDecimal commission = totalAmount.multiply(percentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        log.info("Calculated commission for category {} -> {}%", category, percentage);
        return commission;
    }
}