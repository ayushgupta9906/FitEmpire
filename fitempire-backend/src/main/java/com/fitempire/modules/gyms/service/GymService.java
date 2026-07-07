package com.fitempire.modules.gyms.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.DuplicateResourceException;
import com.fitempire.common.exception.ForbiddenException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.gyms.dto.*;
import com.fitempire.modules.gyms.entity.*;
import com.fitempire.modules.gyms.mapper.GymMapper;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GymService {

    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final UserRepository userRepository;
    private final GymMapper gymMapper;

    @Cacheable(value = "gym", key = "#gymId")
    @Transactional(readOnly = true)
    public GymDto getGymById(UUID gymId) {
        Gym gym = findGymOrThrow(gymId);
        return gymMapper.toDto(gym);
    }

    @Cacheable(value = "gym", key = "'slug:' + #slug")
    @Transactional(readOnly = true)
    public GymDto getGymBySlug(String slug) {
        Gym gym = gymRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> ResourceNotFoundException.of("Gym", "slug", slug));
        return gymMapper.toDto(gym);
    }

    @Transactional(readOnly = true)
    public PagedResponse<GymDto> getActiveGyms(Pageable pageable) {
        Page<Gym> page = gymRepository.findByStatus(GymStatus.ACTIVE, pageable);
        return PagedResponse.of(page.map(gymMapper::toDto));
    }

    @Transactional(readOnly = true)
    public PagedResponse<GymDto> searchGyms(String query, String city, Pageable pageable) {
        Page<Gym> page;
        if (city != null && !city.isBlank()) {
            page = gymRepository.findByCity(city.trim(), pageable);
        } else if (query != null && !query.isBlank()) {
            page = gymRepository.searchGyms(query.trim(), pageable);
        } else {
            page = gymRepository.findByStatus(GymStatus.ACTIVE, pageable);
        }
        return PagedResponse.of(page.map(gymMapper::toDto));
    }

    @Transactional(readOnly = true)
    public List<GymDto> getNearbyGyms(double latitude, double longitude, double radiusKm, int limit) {
        List<Gym> gyms = gymRepository.findNearby(latitude, longitude, radiusKm,
                PageRequest.of(0, limit));
        return gyms.stream().map(gymMapper::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GymDto> getFeaturedGyms() {
        return gymRepository.findFeatured(PageRequest.of(0, 10))
                .stream().map(gymMapper::toDto).collect(Collectors.toList());
    }

    @CacheEvict(value = {"gym", "gyms"}, allEntries = true)
    @Transactional
    public GymDto createGym(CreateGymRequest request, UUID ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", ownerId));

        // Promote to GYM_PARTNER
        if (owner.getRole() == UserRole.CUSTOMER) {
            owner.setRole(UserRole.GYM_PARTNER);
            userRepository.save(owner);
        }

        Gym gym = new Gym();
        gym.setOwner(owner);
        gym.setName(request.getName().trim());
        gym.setSlug(generateSlug(request.getName()));
        gym.setDescription(request.getDescription());
        gym.setEmail(request.getEmail());
        gym.setPhone(request.getPhone());
        gym.setGstNumber(request.getGstNumber());
        gym.setPanNumber(request.getPanNumber());
        gym.setWebsiteUrl(request.getWebsiteUrl());
        gym.setStatus(GymStatus.PENDING_REVIEW);
        gym.setCategory(request.getCategory());

        Gym savedGym = gymRepository.save(gym);

        // Create primary branch
        GymBranch branch = new GymBranch();
        branch.setGym(savedGym);
        branch.setName(request.getBranchName() != null ? request.getBranchName() : request.getName() + " - Main");
        branch.setAddressLine1(request.getAddressLine1());
        branch.setAddressLine2(request.getAddressLine2());
        branch.setCity(request.getCity());
        branch.setState(request.getState());
        branch.setPincode(request.getPincode());
        branch.setLatitude(request.getLatitude());
        branch.setLongitude(request.getLongitude());
        branch.setCapacity(request.getCapacity());
        branch.setPrimary(true);
        gymBranchRepository.save(branch);

        log.info("Gym created: {} [{}] by owner: {}", gym.getName(), savedGym.getId(), ownerId);
        return gymMapper.toDto(savedGym);
    }

    @CacheEvict(value = "gym", key = "#gymId")
    @Transactional
    public GymDto approveGym(UUID gymId, UUID adminId) {
        Gym gym = findGymOrThrow(gymId);
        if (gym.getStatus() != GymStatus.PENDING_REVIEW) {
            throw new BusinessException("Gym is not in PENDING_REVIEW status.", "INVALID_GYM_STATUS");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", adminId));

        gym.setStatus(GymStatus.ACTIVE);
        gym.setApprovedAt(Instant.now());
        gym.setApprovedBy(admin);
        gymRepository.save(gym);

        log.info("Gym approved: {} by admin: {}", gymId, adminId);
        return gymMapper.toDto(gym);
    }

    @CacheEvict(value = "gym", key = "#gymId")
    @Transactional
    public GymDto rejectGym(UUID gymId, String reason, UUID adminId) {
        Gym gym = findGymOrThrow(gymId);
        gym.setStatus(GymStatus.REJECTED);
        gym.setRejectionReason(reason);
        gymRepository.save(gym);
        log.info("Gym rejected: {} reason: {}", gymId, reason);
        return gymMapper.toDto(gym);
    }

    @Transactional(readOnly = true)
    public List<GymDto> getGymsByOwner(UUID ownerId) {
        return gymRepository.findByOwnerId(ownerId)
                .stream().map(gymMapper::toDto).collect(Collectors.toList());
    }

    private Gym findGymOrThrow(UUID gymId) {
        return gymRepository.findById(gymId)
                .filter(g -> !g.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("Gym", gymId));
    }

    private String generateSlug(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("[^\\p{ASCII}]");
        String slug = pattern.matcher(normalized).replaceAll("")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
        // Ensure uniqueness
        String uniqueSlug = slug;
        int counter = 1;
        while (gymRepository.findBySlugAndDeletedFalse(uniqueSlug).isPresent()) {
            uniqueSlug = slug + "-" + counter++;
        }
        return uniqueSlug;
    }
}
