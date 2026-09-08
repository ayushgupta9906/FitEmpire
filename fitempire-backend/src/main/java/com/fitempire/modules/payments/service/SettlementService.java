package com.fitempire.modules.payments.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Slf4j
@Service
public class SettlementService {

    private static final BigDecimal PLATFORM_COMMISSION_RATE = new BigDecimal("0.15"); // 15%
    private static final BigDecimal GST_RATE = new BigDecimal("0.18"); // 18% on commission

    public BigDecimal calculatePartnerNetPayout(UUID gymId, BigDecimal grossRevenue) {
        if (grossRevenue == null || grossRevenue.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal platformFee = grossRevenue.multiply(PLATFORM_COMMISSION_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal gstOnFee = platformFee.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalDeductions = platformFee.add(gstOnFee);

        BigDecimal netPayout = grossRevenue.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);
        log.info("Settlement calculated for gym {}: Gross ₹{}, Net Payout ₹{}", gymId, grossRevenue, netPayout);
        return netPayout;
    }
}
