const fs = require('fs');
const path = require('path');

// 1. Update PaymentRepository to find unsettled payments
const repoPath = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'payments', 'repository', 'PaymentRepository.java');

const repoContent = `package com.fitempire.modules.payments.repository;

import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByStatusAndIsSettledFalse(PaymentStatus status);
}
`;
fs.writeFileSync(repoPath, repoContent);
console.log("Updated PaymentRepository.java");

// 2. Create SettlementCronJob
const cronDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'finance', 'job');
fs.mkdirSync(cronDir, { recursive: true });

const cronJobContent = `package com.fitempire.modules.finance.job;

import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.bookings.repository.BookingRepository;
import com.fitempire.modules.finance.entity.Settlement;
import com.fitempire.modules.finance.entity.SettlementStatus;
import com.fitempire.modules.finance.repository.SettlementRepository;
import com.fitempire.modules.finance.service.CommissionService;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.entity.PaymentStatus;
import com.fitempire.modules.payments.repository.PaymentRepository;
import com.fitempire.modules.users.entity.Wallet;
import com.fitempire.modules.users.entity.WalletType;
import com.fitempire.modules.users.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RestController
@RequestMapping("/api/v1/finance/cron")
@RequiredArgsConstructor
public class SettlementCronJob {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final CommissionService commissionService;
    private final SettlementRepository settlementRepository;
    private final WalletRepository walletRepository;

    // Runs every Sunday at Midnight, or manually via API
    @Scheduled(cron = "0 0 0 * * SUN")
    @PostMapping("/trigger-settlements")
    @Transactional
    public void runWeeklySettlements() {
        log.info("Starting weekly automated settlements cron job...");
        
        List<Payment> unsettledPayments = paymentRepository.findByStatusAndIsSettledFalse(PaymentStatus.SUCCESS);
        if (unsettledPayments.isEmpty()) {
            log.info("No unsettled payments found. Exiting cron job.");
            return;
        }

        // Map Gym ID -> List of Payments
        Map<UUID, List<Payment>> gymPaymentsMap = new HashMap<>();

        for (Payment p : unsettledPayments) {
            if (p.getBookingId() != null) {
                Booking booking = bookingRepository.findById(p.getBookingId()).orElse(null);
                if (booking != null && booking.getGym() != null) {
                    gymPaymentsMap.computeIfAbsent(booking.getGym().getId(), k -> new ArrayList<>()).add(p);
                }
            }
        }

        for (Map.Entry<UUID, List<Payment>> entry : gymPaymentsMap.entrySet()) {
            UUID gymId = entry.getKey();
            List<Payment> payments = entry.getValue();
            
            BigDecimal grossAmount = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate Commission dynamically (e.g. 15%)
            BigDecimal commissionAmount = commissionService.calculateCommission(gymId, grossAmount);
            BigDecimal netAmount = grossAmount.subtract(commissionAmount);

            // Create Settlement Invoice
            Settlement settlement = new Settlement();
            settlement.setGymId(gymId);
            settlement.setPeriodStart(Instant.now().minus(java.time.Duration.ofDays(7)));
            settlement.setPeriodEnd(Instant.now());
            settlement.setGrossAmount(grossAmount);
            settlement.setCommissionAmount(commissionAmount);
            settlement.setTaxAmount(BigDecimal.ZERO); // simplify for now
            settlement.setNetAmount(netAmount);
            settlement.setStatus(SettlementStatus.PROCESSING);
            settlementRepository.save(settlement);

            // Transfer to Gym Wallet
            Wallet gymWallet = walletRepository.findByGymIdAndWalletType(gymId, WalletType.GYM)
                .orElse(null);
            
            if (gymWallet != null) {
                gymWallet.setBalance(gymWallet.getBalance().add(netAmount));
                walletRepository.save(gymWallet);
                settlement.setStatus(SettlementStatus.COMPLETED);
                settlementRepository.save(settlement);
            }

            // Mark payments as settled
            payments.forEach(p -> {
                p.setSettled(true);
                paymentRepository.save(p);
            });

            log.info("Processed settlement for Gym {}: Gross {}, Net {}", gymId, grossAmount, netAmount);
        }

        log.info("Weekly automated settlements completed successfully.");
    }
}
`;
fs.writeFileSync(path.join(cronDir, 'SettlementCronJob.java'), cronJobContent);
console.log("Created SettlementCronJob.java");

// Enable scheduling in main Application class
const appClassPath = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'FitempireBackendApplication.java');
let appContent = fs.readFileSync(appClassPath, 'utf8');
if (!appContent.includes('@EnableScheduling')) {
    appContent = appContent.replace(
        'import org.springframework.boot.autoconfigure.SpringBootApplication;',
        'import org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.scheduling.annotation.EnableScheduling;'
    ).replace(
        '@SpringBootApplication',
        '@SpringBootApplication\n@EnableScheduling'
    );
    fs.writeFileSync(appClassPath, appContent);
    console.log("Enabled @EnableScheduling in main application class");
}
