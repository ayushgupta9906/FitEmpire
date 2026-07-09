package com.fitempire.modules.finance.service;

import com.fitempire.modules.finance.entity.Settlement;
import com.fitempire.modules.finance.entity.SettlementStatus;
import com.fitempire.modules.finance.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SettlementService {

    private final SettlementRepository settlementRepository;

    @Transactional(readOnly = true)
    public List<Settlement> getSettlementsByGym(UUID gymId) {
        return settlementRepository.findByGymId(gymId);
    }
    
    // In a real scenario, this would have a @Scheduled cron job
    // to batch all weekly transactions for the gym and create a Settlement entity.
}