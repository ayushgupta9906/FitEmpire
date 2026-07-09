package com.fitempire.modules.gyms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.modules.gyms.entity.*;
import com.fitempire.modules.gyms.repository.*;
import com.fitempire.modules.memberships.entity.MembershipPlan;
import com.fitempire.modules.memberships.entity.MembershipType;
import com.fitempire.modules.memberships.repository.MembershipPlanRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.Wallet;
import com.fitempire.modules.users.entity.WalletType;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.modules.users.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GymOnboardingService {

    private final GymRegistrationDraftRepository draftRepository;
    private final GymRepository gymRepository;
    private final GymBranchRepository branchRepository;
    private final GymDocumentRepository documentRepository;
    private final MembershipPlanRepository planRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void submitRegistration(UUID ownerId) {
        GymRegistrationDraft draft = draftRepository.findByOwnerIdAndSubmittedFalse(ownerId)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", ownerId));

        try {
            JsonNode data = objectMapper.readTree(draft.getDraftData());
            
            // 1. Create Gym
            Gym gym = new Gym();
            gym.setOwner(owner);
            gym.setName(data.path("gymName").asText("Unnamed Gym"));
            // create a simple slug from name and random string
            gym.setSlug(gym.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + UUID.randomUUID().toString().substring(0, 5));
            gym.setGstNumber(data.path("gst").asText());
            gym.setPanNumber(data.path("pan").asText());
            gym.setStatus(GymStatus.PENDING_REVIEW);
            gym = gymRepository.save(gym);

            // 2. Create Branch (Address)
            GymBranch branch = new GymBranch();
            branch.setGym(gym);
            branch.setName("Main Branch");
            branch.setAddress(data.path("address").asText());
            branch.setCity(data.path("city").asText());
            branch.setZipCode(data.path("pincode").asText());
            branch.setCountry("India");
            // Set dummy coords for now
            branch.setLatitude(BigDecimal.valueOf(19.0760));
            branch.setLongitude(BigDecimal.valueOf(72.8777));
            branch = branchRepository.save(branch);

            // 3. Create Documents
            String tradeLicense = data.path("tradeLicense").asText("");
            if (!tradeLicense.isEmpty()) {
                GymDocument doc = new GymDocument();
                doc.setGym(gym);
                doc.setDocumentType(DocumentType.TRADE_LICENSE);
                doc.setFileUrl(tradeLicense);
                doc.setStatus(VerificationStatus.PENDING);
                documentRepository.save(doc);
            }
            String panDoc = data.path("panDoc").asText("");
            if (!panDoc.isEmpty()) {
                GymDocument doc2 = new GymDocument();
                doc2.setGym(gym);
                doc2.setDocumentType(DocumentType.OWNER_ID);
                doc2.setFileUrl(panDoc);
                doc2.setStatus(VerificationStatus.PENDING);
                documentRepository.save(doc2);
            }

            // 4. Create Membership Plans
            if (data.has("plans") && data.path("plans").isArray()) {
                for (JsonNode planNode : data.path("plans")) {
                    MembershipPlan plan = new MembershipPlan();
                    plan.setGym(gym);
                    plan.setBranch(branch);
                    plan.setName(planNode.path("name").asText("Standard Plan"));
                    plan.setDescription(planNode.path("description").asText(""));
                    plan.setType(MembershipType.GYM_ACCESS); // Default mapping
                    // Basic default saving since we are missing full pricing fields in the schema mapping
                    planRepository.save(plan);
                }
            }

            // 5. Provision Gym Wallet
            Wallet gymWallet = new Wallet();
            // User is nullable now, but we'll link owner just in case
            gymWallet.setUser(owner);
            gymWallet.setWalletType(WalletType.GYM);
            gymWallet.setGymId(gym.getId());
            gymWallet.setBalance(BigDecimal.ZERO);
            walletRepository.save(gymWallet);

            // 6. Mark Draft as Submitted
            draft.setSubmitted(true);
            draftRepository.save(draft);

            log.info("Successfully processed gym registration draft for owner {}", ownerId);

        } catch (Exception e) {
            log.error("Failed to parse and save draft for owner {}: {}", ownerId, e.getMessage());
            throw new RuntimeException("Failed to process registration submission: " + e.getMessage(), e);
        }
    }
}