package com.fitempire.modules.users.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.users.dto.WalletDto;
import com.fitempire.modules.users.dto.WalletTransactionDto;
import com.fitempire.modules.users.entity.*;
import com.fitempire.modules.users.mapper.WalletMapper;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.modules.users.repository.WalletRepository;
import com.fitempire.modules.users.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final UserRepository userRepository;
    private final WalletMapper walletMapper;

    @Transactional
    public WalletDto createWallet(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));

        if (walletRepository.findByUserId(userId).isPresent()) {
            throw new BusinessException("Wallet already exists for user.", "WALLET_EXISTS", HttpStatus.BAD_REQUEST);
        }

        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setCurrency("INR");
        wallet.setActive(true);

        Wallet saved = walletRepository.save(wallet);
        log.info("Wallet created for User: {}", userId);
        return walletMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public WalletDto getWalletByUserId(UUID userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Auto-create wallet if missing for a valid user
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
                    Wallet w = new Wallet();
                    w.setUser(user);
                    w.setBalance(BigDecimal.ZERO);
                    w.setCurrency("INR");
                    w.setActive(true);
                    return walletRepository.save(w);
                });
        return walletMapper.toDto(wallet);
    }

    @Transactional
    public WalletTransactionDto creditWallet(UUID userId, BigDecimal amount, WalletTxnType txnType, String description, UUID refId, String refType) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Credit amount must be greater than zero.", "INVALID_AMOUNT", HttpStatus.BAD_REQUEST);
        }

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));

        if (!wallet.isActive()) {
            throw new BusinessException("Wallet is inactive.", "WALLET_INACTIVE", HttpStatus.BAD_REQUEST);
        }

        BigDecimal before = wallet.getBalance();
        BigDecimal after = before.add(amount);

        wallet.setBalance(after);
        walletRepository.save(wallet);

        WalletTransaction txn = new WalletTransaction();
        txn.setWallet(wallet);
        txn.setUser(wallet.getUser());
        txn.setType(TransactionType.CREDIT);
        txn.setTxnType(txnType);
        txn.setAmount(amount);
        txn.setBalanceBefore(before);
        txn.setBalanceAfter(after);
        txn.setDescription(description);
        txn.setReferenceId(refId);
        txn.setReferenceType(refType);

        WalletTransaction savedTxn = walletTransactionRepository.save(txn);
        log.info("Credited ₹{} to User: {} wallet [Type: {}]", amount, userId, txnType);
        return walletMapper.toDto(savedTxn);
    }

    @Transactional
    public WalletTransactionDto debitWallet(UUID userId, BigDecimal amount, WalletTxnType txnType, String description, UUID refId, String refType) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Debit amount must be greater than zero.", "INVALID_AMOUNT", HttpStatus.BAD_REQUEST);
        }

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));

        if (!wallet.isActive()) {
            throw new BusinessException("Wallet is inactive.", "WALLET_INACTIVE", HttpStatus.BAD_REQUEST);
        }

        BigDecimal before = wallet.getBalance();
        if (before.compareTo(amount) < 0) {
            throw new BusinessException("Insufficient wallet balance.", "INSUFFICIENT_FUNDS", HttpStatus.BAD_REQUEST);
        }

        BigDecimal after = before.subtract(amount);
        wallet.setBalance(after);
        walletRepository.save(wallet);

        WalletTransaction txn = new WalletTransaction();
        txn.setWallet(wallet);
        txn.setUser(wallet.getUser());
        txn.setType(TransactionType.DEBIT);
        txn.setTxnType(txnType);
        txn.setAmount(amount);
        txn.setBalanceBefore(before);
        txn.setBalanceAfter(after);
        txn.setDescription(description);
        txn.setReferenceId(refId);
        txn.setReferenceType(refType);

        WalletTransaction savedTxn = walletTransactionRepository.save(txn);
        log.info("Debited ₹{} from User: {} wallet [Type: {}]", amount, userId, txnType);
        return walletMapper.toDto(savedTxn);
    }

    @Transactional(readOnly = true)
    public PagedResponse<WalletTransactionDto> getTransactionHistory(UUID userId, Pageable pageable) {
        Page<WalletTransaction> page = walletTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.of(page.map(walletMapper::toDto));
    }
}
