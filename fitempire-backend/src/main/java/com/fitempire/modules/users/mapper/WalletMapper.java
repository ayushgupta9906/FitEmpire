package com.fitempire.modules.users.mapper;

import com.fitempire.modules.users.dto.WalletDto;
import com.fitempire.modules.users.dto.WalletTransactionDto;
import com.fitempire.modules.users.entity.Wallet;
import com.fitempire.modules.users.entity.WalletTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WalletMapper {

    @Mapping(target = "userId", source = "user.id")
    WalletDto toDto(Wallet wallet);

    @Mapping(target = "walletId", source = "wallet.id")
    @Mapping(target = "userId", source = "user.id")
    WalletTransactionDto toDto(WalletTransaction txn);
}
