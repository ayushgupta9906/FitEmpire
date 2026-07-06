package com.fitempire.modules.users.service;

import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.users.dto.*;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserProfile;
import com.fitempire.modules.users.mapper.UserMapper;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.modules.users.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserMapper userMapper;

    @Cacheable(value = "users", key = "#userId")
    @Transactional(readOnly = true)
    public UserDto getUserById(UUID userId) {
        User user = findUserOrThrow(userId);
        return userMapper.toDto(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> ResourceNotFoundException.of("User", "email", email));
        return userMapper.toDto(user);
    }

    @CacheEvict(value = "users", key = "#userId")
    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = findUserOrThrow(userId);
        UserProfile profile = user.getProfile();

        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }

        userMapper.updateProfile(request, profile);
        profile.calculateBmi();

        // Mark profile as complete if key fields filled
        if (profile.getCity() != null && profile.getHeightCm() != null && profile.getWeightKg() != null) {
            user.setProfileComplete(true);
            userRepository.save(user);
        }

        userProfileRepository.save(profile);
        log.info("Profile updated for user: {}", userId);
        return userMapper.toDto(user);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDto> getAllUsers(Pageable pageable, String search) {
        Page<User> page;
        if (search != null && !search.isBlank()) {
            page = userRepository.searchUsers(search.trim(), pageable);
        } else {
            page = userRepository.findAllActive(pageable);
        }
        return PagedResponse.of(page.map(userMapper::toDto));
    }

    @CacheEvict(value = "users", key = "#userId")
    @Transactional
    public void deactivateUser(UUID userId, UUID adminId) {
        User user = findUserOrThrow(userId);
        user.setActive(false);
        userRepository.save(user);
        log.info("User {} deactivated by admin {}", userId, adminId);
    }

    @CacheEvict(value = "users", key = "#userId")
    @Transactional
    public void reactivateUser(UUID userId, UUID adminId) {
        User user = findUserOrThrow(userId);
        user.setActive(true);
        user.resetFailedLogin();
        userRepository.save(user);
        log.info("User {} reactivated by admin {}", userId, adminId);
    }

    @Transactional
    public void updateFcmToken(UUID userId, String fcmToken) {
        userRepository.updateFcmToken(userId, fcmToken);
    }

    private User findUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
    }
}
