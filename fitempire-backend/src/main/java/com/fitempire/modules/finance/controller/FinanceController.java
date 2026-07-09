package com.fitempire.modules.finance.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.finance.entity.Settlement;
import com.fitempire.modules.finance.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final SettlementService settlementService;

    @GetMapping("/settlements/gym/{gymId}")
    public ResponseEntity<ApiResponse<List<Settlement>>> getGymSettlements(@PathVariable UUID gymId) {
        List<Settlement> settlements = settlementService.getSettlementsByGym(gymId);
        return ResponseEntity.ok(ApiResponse.success("Fetched gym settlements", settlements));
    }
}
