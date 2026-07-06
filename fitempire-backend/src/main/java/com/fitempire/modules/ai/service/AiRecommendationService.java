package com.fitempire.modules.ai.service;

import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.modules.ai.dto.AiRecommendationDto;
import com.fitempire.modules.ai.entity.AiRecommendation;
import com.fitempire.modules.ai.repository.AiRecommendationRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserProfile;
import com.fitempire.modules.users.repository.UserProfileRepository;
import com.fitempire.modules.users.repository.UserRepository;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiRecommendationService {

    private final AiRecommendationRepository aiRecommendationRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Value("${app.openai.api-key:}")
    private String apiKey;

    @Value("${app.openai.model:gpt-4o}")
    private String modelName;

    private OpenAiService openAiService;

    @PostConstruct
    public void init() {
        if (apiKey != null && !apiKey.isBlank()) {
            openAiService = new OpenAiService(apiKey, Duration.ofSeconds(30));
            log.info("OpenAI service initialized with model {}", modelName);
        } else {
            log.warn("OpenAI API key is missing. Falling back to rule-based recommendations.");
        }
    }

    @Transactional
    public AiRecommendationDto generateWorkoutRecommendation(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found for user: " + userId));

        String content;
        if (openAiService != null) {
            content = fetchGptWorkoutRecommendation(profile);
        } else {
            content = generateRuleBasedWorkoutRecommendation(profile);
        }

        AiRecommendation rec = new AiRecommendation();
        rec.setUser(user);
        rec.setType("WORKOUT");
        rec.setContent(content);
        rec.setModelVersion(openAiService != null ? modelName : "rule-engine-1.0");
        rec.setDismissed(false);

        AiRecommendation saved = aiRecommendationRepository.save(rec);
        return mapToDto(saved);
    }

    @Transactional
    public AiRecommendationDto generateNutritionRecommendation(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found for user: " + userId));

        String content;
        if (openAiService != null) {
            content = fetchGptNutritionRecommendation(profile);
        } else {
            content = generateRuleBasedNutritionRecommendation(profile);
        }

        AiRecommendation rec = new AiRecommendation();
        rec.setUser(user);
        rec.setType("NUTRITION");
        rec.setContent(content);
        rec.setModelVersion(openAiService != null ? modelName : "rule-engine-1.0");
        rec.setDismissed(false);

        AiRecommendation saved = aiRecommendationRepository.save(rec);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<AiRecommendationDto> getActiveRecommendations(UUID userId) {
        return aiRecommendationRepository.findActiveRecommendations(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void submitFeedback(UUID recId, String feedback) {
        AiRecommendation rec = aiRecommendationRepository.findById(recId)
                .orElseThrow(() -> ResourceNotFoundException.of("AiRecommendation", recId));
        rec.setFeedback(feedback);
        aiRecommendationRepository.save(rec);
    }

    @Transactional
    public void dismissRecommendation(UUID recId) {
        AiRecommendation rec = aiRecommendationRepository.findById(recId)
                .orElseThrow(() -> ResourceNotFoundException.of("AiRecommendation", recId));
        rec.setDismissed(true);
        aiRecommendationRepository.save(rec);
    }

    // ── GPT Prompts ──────────────────────────────────────────────────────────

    private String fetchGptWorkoutRecommendation(UserProfile profile) {
        try {
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage("system", "You are an elite fitness coach. Return a JSON object with: { \"title\": \"...\", \"plan\": [\"...\"] } containing a structured workout plan. Do not wrap in markdown or any other tags."));
            messages.add(new ChatMessage("user", String.format(
                    "Create a workout plan for a user. Goal: %s, Height: %s cm, Weight: %s kg, State: %s",
                    profile.getFitnessGoal(), profile.getHeightCm(), profile.getWeightKg(), profile.getFitnessLevel()
            )));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(modelName)
                    .messages(messages)
                    .maxTokens(400)
                    .temperature(0.7)
                    .build();

            return openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent().trim();
        } catch (Exception e) {
            log.error("Failed to fetch GPT workout recommendation: {}", e.getMessage());
            return generateRuleBasedWorkoutRecommendation(profile);
        }
    }

    private String fetchGptNutritionRecommendation(UserProfile profile) {
        try {
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage("system", "You are a clinical nutritionist. Return a JSON object with: { \"title\": \"...\", \"plan\": [\"...\"] } containing a structured diet plan. Do not wrap in markdown."));
            messages.add(new ChatMessage("user", String.format(
                    "Create a daily nutrition plan for a user. Goal: %s, Weight: %s kg, BMI: %s",
                    profile.getFitnessGoal(), profile.getWeightKg(), profile.getBmi()
            )));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(modelName)
                    .messages(messages)
                    .maxTokens(400)
                    .temperature(0.6)
                    .build();

            return openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent().trim();
        } catch (Exception e) {
            log.error("Failed to fetch GPT nutrition recommendation: {}", e.getMessage());
            return generateRuleBasedNutritionRecommendation(profile);
        }
    }

    // ── Rule-Based fallback generators ────────────────────────────────────────

    private String generateRuleBasedWorkoutRecommendation(UserProfile profile) {
        String goal = profile.getFitnessGoal() != null ? profile.getFitnessGoal().toString() : "GENERAL_FITNESS";
        if (goal.equals("WEIGHT_LOSS")) {
            return "{ \"title\": \"High-Intensity Cardio Circuit\", \"plan\": [\"10 mins treadmill warm-up\", \"4 rounds: 15 Kettlebell swings, 12 burpees, 20 lunges\", \"15 mins HIIT cycling\", \"5 mins cool-down stretch\"] }";
        } else if (goal.equals("MUSCLE_GAIN")) {
            return "{ \"title\": \"Hypertrophy Push Workout\", \"plan\": [\"Flat Bench Press: 4 sets x 8-10 reps\", \"Incline Dumbbell Fly: 3 sets x 12 reps\", \"Overhead Press: 4 sets x 8 reps\", \"Tricep Dips: 3 sets x 12 reps\"] }";
        } else {
            return "{ \"title\": \"Full Body Functional Fitness\", \"plan\": [\"5 mins jump rope\", \"3 rounds: 10 goblet squats, 10 push-ups, 12 DB rows\", \"Plank hold: 3 sets x 60 seconds\"] }";
        }
    }

    private String generateRuleBasedNutritionRecommendation(UserProfile profile) {
        String goal = profile.getFitnessGoal() != null ? profile.getFitnessGoal().toString() : "GENERAL_FITNESS";
        if (goal.equals("WEIGHT_LOSS")) {
            return "{ \"title\": \"Calorie Deficit Plan\", \"plan\": [\"Breakfast: Oatmeal with berries and chia seeds\", \"Lunch: Grilled chicken breast with mixed greens\", \"Snack: Greek yogurt with sliced almonds\", \"Dinner: Baked salmon with broccoli\"] }";
        } else if (goal.equals("MUSCLE_GAIN")) {
            return "{ \"title\": \"High-Protein Muscle Builder\", \"plan\": [\"Breakfast: 4 scrambled egg whites + 1 whole egg + whole wheat toast\", \"Lunch: Lean beef stir-fry with brown rice\", \"Snack: Whey protein shake with banana\", \"Dinner: Grilled chicken with sweet potato\"] }";
        } else {
            return "{ \"title\": \"Balanced Healthy Diet\", \"plan\": [\"Breakfast: Fruit smoothie with protein powder\", \"Lunch: Quinoa bowl with roasted veggies\", \"Snack: Carrot sticks with hummus\", \"Dinner: Grilled paneer or tofu salad\"] }";
        }
    }

    private AiRecommendationDto mapToDto(AiRecommendation rec) {
        return AiRecommendationDto.builder()
                .id(rec.getId())
                .userId(rec.getUser().getId())
                .type(rec.getType())
                .content(rec.getContent())
                .modelVersion(rec.getModelVersion())
                .feedback(rec.getFeedback())
                .dismissed(rec.isDismissed())
                .createdAt(rec.getCreatedAt())
                .build();
    }
}
