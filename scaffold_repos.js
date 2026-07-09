const fs = require('fs');
const path = require('path');

const repoDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'finance', 'repository');
const dtoDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'finance', 'dto');

fs.mkdirSync(repoDir, { recursive: true });
fs.mkdirSync(dtoDir, { recursive: true });

const repos = {
    'SettlementRepository.java': `package com.fitempire.modules.finance.repository;

import com.fitempire.modules.finance.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {
    List<Settlement> findByGymId(UUID gymId);
}`,
    'RefundRequestRepository.java': `package com.fitempire.modules.finance.repository;

import com.fitempire.modules.finance.entity.RefundRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, UUID> {
}`,
    'CommissionRuleRepository.java': `package com.fitempire.modules.finance.repository;

import com.fitempire.modules.finance.entity.CommissionRule;
import com.fitempire.modules.gyms.entity.GymCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionRule, UUID> {
    Optional<CommissionRule> findByApplicableCategoryAndActiveTrue(GymCategory category);
}`,
    'PlatformRevenueRepository.java': `package com.fitempire.modules.finance.repository;

import com.fitempire.modules.finance.entity.PlatformRevenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlatformRevenueRepository extends JpaRepository<PlatformRevenue, UUID> {
}`
};

const dtos = {
    'SettlementDto.java': `package com.fitempire.modules.finance.dto;

import com.fitempire.modules.finance.entity.SettlementStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
public class SettlementDto {
    private UUID id;
    private UUID gymId;
    private BigDecimal totalAmount;
    private BigDecimal commissionDeducted;
    private BigDecimal taxAmount;
    private BigDecimal netPayable;
    private SettlementStatus status;
    private Instant settlementDate;
    private String bankRefNumber;
}`
};

for (const [filename, content] of Object.entries(repos)) {
    fs.writeFileSync(path.join(repoDir, filename), content);
    console.log("Created repo: " + filename);
}

for (const [filename, content] of Object.entries(dtos)) {
    fs.writeFileSync(path.join(dtoDir, filename), content);
    console.log("Created dto: " + filename);
}
