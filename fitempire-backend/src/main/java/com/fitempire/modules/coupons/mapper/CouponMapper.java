package com.fitempire.modules.coupons.mapper;

import com.fitempire.modules.coupons.dto.CouponDto;
import com.fitempire.modules.coupons.entity.Coupon;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CouponMapper {
    CouponDto toDto(Coupon coupon);
}
