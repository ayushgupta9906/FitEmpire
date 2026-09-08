package com.fitempire.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String GYM_SEARCH_CACHE = "gymSearchCache";
    public static final String MEMBERSHIP_PLANS_CACHE = "membershipPlansCache";
    public static final String AMENITIES_CACHE = "amenitiesCache";

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(List.of(
                GYM_SEARCH_CACHE,
                MEMBERSHIP_PLANS_CACHE,
                AMENITIES_CACHE
        ));
        return cacheManager;
    }
}
