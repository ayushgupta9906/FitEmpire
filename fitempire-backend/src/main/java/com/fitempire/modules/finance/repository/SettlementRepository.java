package com.fitempire.modules.finance.repository;

import com.fitempire.modules.finance.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {
    List<Settlement> findByGymId(UUID gymId);
}