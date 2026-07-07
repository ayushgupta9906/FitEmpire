package com.fitempire.modules.users.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.users.dto.UserDto;
import com.fitempire.modules.users.dto.UpdateProfileRequest;
import com.fitempire.modules.users.service.UserService;
import com.fitempire.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/v1/users/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "User profile retrieval, modification, and avatar uploads")
public class UserProfileController {

    private final UserService userService;
    private final StorageService storageService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user's profile details")
    public ResponseEntity<ApiResponse<UserDto>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(userId)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user's profile details")
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userService.updateProfile(userId, request)));
    }

    @PostMapping("/avatar")
    @Operation(summary = "Upload profile picture")
    public ResponseEntity<ApiResponse<UserDto>> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        var user = userRepository.findById(userId).orElseThrow();
        String url = storageService.uploadFile("avatars/" + userId, file);
        user.setProfilePictureUrl(url);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", userService.getUserById(userId)));
    }
}
