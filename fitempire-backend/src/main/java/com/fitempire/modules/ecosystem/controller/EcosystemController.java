package com.fitempire.modules.ecosystem.controller;

import com.fitempire.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/v1/ecosystem")
@RequiredArgsConstructor
@Tag(name = "Ecosystem", description = "FitEmpire ecosystem modules: Activities, Nutrition, Store, Care, TV, Corporate")
public class EcosystemController {

    // ── 1. Activities Catalog ──────────────────────────────────────────────
    @GetMapping("/activities")
    @Operation(summary = "Get all 15+ fitness & sports activities")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActivities() {
        List<Map<String, Object>> list = Arrays.asList(
                Map.of("id", "1", "name", "Gym Workouts", "category", "STRENGTH", "color", "#E75A5D", "duration", "60-90 min", "image", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500"),
                Map.of("id", "2", "name", "Badminton", "category", "SPORTS", "color", "#0D9488", "duration", "45-60 min", "image", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500"),
                Map.of("id", "3", "name", "Swimming", "category", "AQUATICS", "color", "#3B82F6", "duration", "45-60 min", "image", "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500"),
                Map.of("id", "4", "name", "MMA & Combat", "category", "MARTIAL_ARTS", "color", "#DC2626", "duration", "60 min", "image", "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500"),
                Map.of("id", "5", "name", "Yoga & Meditation", "category", "WELLNESS", "color", "#7C3AED", "duration", "45-60 min", "image", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"),
                Map.of("id", "6", "name", "CrossFit Rig", "category", "STRENGTH", "color", "#D97706", "duration", "45 min", "image", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500"),
                Map.of("id", "7", "name", "Football Turf", "category", "SPORTS", "color", "#10B981", "duration", "60-90 min", "image", "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500"),
                Map.of("id", "8", "name", "Boxing & Sparring", "category", "MARTIAL_ARTS", "color", "#EF4444", "duration", "60 min", "image", "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500"),
                Map.of("id", "9", "name", "Zumba & Dance", "category", "CARDIO", "color", "#DB2777", "duration", "45 min", "image", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500"),
                Map.of("id", "10", "name", "Pickleball", "category", "SPORTS", "color", "#F59E0B", "duration", "45-60 min", "image", "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500"),
                Map.of("id", "11", "name", "Table Tennis", "category", "SPORTS", "color", "#06B6D4", "duration", "30-60 min", "image", "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=500"),
                Map.of("id", "12", "name", "Snooker & Pool", "category", "SPORTS", "color", "#8B5CF6", "duration", "60-120 min", "image", "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500")
        );
        return ResponseEntity.ok(ApiResponse.success("Activities retrieved successfully", list));
    }

    // ── 2. Nutrition / Food Library ─────────────────────────────────────────
    @GetMapping("/foods")
    @Operation(summary = "Get nutrition and food library with macros")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFoods() {
        List<Map<String, Object>> foods = Arrays.asList(
                Map.of("id", "1", "name", "Chicken Breast (Grilled)", "calories", 165, "protein", 31.0, "carbs", 0.0, "fats", 3.6, "serving", "100g cooked"),
                Map.of("id", "2", "name", "Boiled Eggs (Whole)", "calories", 155, "protein", 13.0, "carbs", 1.1, "fats", 11.0, "serving", "2 large eggs (100g)"),
                Map.of("id", "3", "name", "Whey Protein Isolate", "calories", 120, "protein", 25.0, "carbs", 2.0, "fats", 1.0, "serving", "1 scoop (30g)"),
                Map.of("id", "4", "name", "Paneer / Cottage Cheese", "calories", 265, "protein", 18.0, "carbs", 3.0, "fats", 20.0, "serving", "100g"),
                Map.of("id", "5", "name", "Tofu (Firm / Organic)", "calories", 144, "protein", 17.0, "carbs", 3.0, "fats", 8.0, "serving", "100g"),
                Map.of("id", "6", "name", "Rolled Oats (Dry)", "calories", 389, "protein", 16.9, "carbs", 66.3, "fats", 6.9, "serving", "1 cup (100g)"),
                Map.of("id", "7", "name", "Brown Rice (Cooked)", "calories", 218, "protein", 4.5, "carbs", 45.8, "fats", 1.6, "serving", "1 cup (195g)"),
                Map.of("id", "8", "name", "Greek Yogurt (Plain 0%)", "calories", 97, "protein", 10.0, "carbs", 3.6, "fats", 0.4, "serving", "1 cup (170g)"),
                Map.of("id", "9", "name", "Peanut Butter (Natural)", "calories", 190, "protein", 8.0, "carbs", 7.0, "fats", 16.0, "serving", "2 tbsp (32g)"),
                Map.of("id", "10", "name", "Atlantic Salmon (Fillet)", "calories", 208, "protein", 22.0, "carbs", 0.0, "fats", 13.0, "serving", "100g fillet")
        );
        return ResponseEntity.ok(ApiResponse.success("Food database retrieved successfully", foods));
    }

    // ── 3. Store Products ───────────────────────────────────────────────────
    @GetMapping("/store/products")
    @Operation(summary = "Get fitness equipment & supplements store items")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStoreProducts() {
        List<Map<String, Object>> products = Arrays.asList(
                Map.of("id", "p1", "name", "QuickShift Pro Adjustable Dumbbell (2.5kg - 24kg)", "category", "EQUIPMENT", "price", 8999, "oldPrice", 14999, "rating", 4.9, "reviews", 142, "image", "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500"),
                Map.of("id", "p2", "name", "Origami Foldable Anti-Tear Yoga Mat (6mm)", "category", "GEAR", "price", 2199, "oldPrice", 3499, "rating", 4.8, "reviews", 89, "image", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"),
                Map.of("id", "p3", "name", "Empire Pro 100% Whey Isolate (2kg Double Chocolate)", "category", "NUTRITION", "price", 4499, "oldPrice", 6299, "rating", 4.9, "reviews", 320, "image", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"),
                Map.of("id", "p4", "name", "Heavy Duty Lever Lifting Belt (10mm Genuine Leather)", "category", "GEAR", "price", 3499, "oldPrice", 5999, "rating", 4.9, "reviews", 76, "image", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500"),
                Map.of("id", "p5", "name", "Micronized Creatine Monohydrate (250g / 83 Servings)", "category", "NUTRITION", "price", 899, "oldPrice", 1499, "rating", 4.8, "reviews", 215, "image", "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500")
        );
        return ResponseEntity.ok(ApiResponse.success("Store products retrieved successfully", products));
    }

    // ── 4. Doctor Consultations & Care ──────────────────────────────────────
    @GetMapping("/care/doctors")
    @Operation(summary = "Get available telehealth doctors and dietitians")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDoctors() {
        List<Map<String, Object>> doctors = Arrays.asList(
                Map.of("id", "d1", "name", "Dr. Ananya Sen", "specialty", "Chief Sports Nutritionist & Dietitian", "experience", "9+ Years Exp", "rating", 4.9, "image", "https://images.unsplash.com/photo-1594824813576-06835260195e?w=400", "nextSlot", "Today, 04:30 PM", "fee", "FREE with FitEmpire Pro"),
                Map.of("id", "d2", "name", "Dr. Rajesh Nair", "specialty", "Sports Physiotherapist & Rehab", "experience", "12+ Years Exp", "rating", 4.9, "image", "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400", "nextSlot", "Tomorrow, 11:00 AM", "fee", "FREE with FitEmpire Pro"),
                Map.of("id", "d3", "name", "Dr. Meera Kapoor", "specialty", "General Physician & Wellness", "experience", "8+ Years Exp", "rating", 4.8, "image", "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400", "nextSlot", "Today, 06:00 PM", "fee", "FREE with FitEmpire Pro")
        );
        return ResponseEntity.ok(ApiResponse.success("Care doctors retrieved successfully", doctors));
    }

    // ── 5. Video Workouts (TV) ──────────────────────────────────────────────
    @GetMapping("/tv/videos")
    @Operation(summary = "Get on-demand HD video workout classes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getVideos() {
        List<Map<String, Object>> videos = Arrays.asList(
                Map.of("id", "tv1", "title", "30-Min High-Intensity FightCamp & Combat HIIT", "trainer", "Coach Vikram (MMA Fighter)", "duration", "30 Mins", "calories", "420 kcal", "level", "Advanced", "image", "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600", "viewers", "2.4k Active"),
                Map.of("id", "tv2", "title", "25-Min Fat Burning Cardio & Core Shred", "trainer", "Sarah Chen (Pro Athlete)", "duration", "25 Mins", "calories", "310 kcal", "level", "Intermediate", "image", "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600", "viewers", "1.8k Active"),
                Map.of("id", "tv3", "title", "Power Vinyasa Flow & Deep Mobility Release", "trainer", "Aanya Sharma (Yoga Master)", "duration", "40 Mins", "calories", "220 kcal", "level", "All Levels", "image", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600", "viewers", "3.1k Active")
        );
        return ResponseEntity.ok(ApiResponse.success("Video classes retrieved successfully", videos));
    }

    // ── 6. Corporate Email Verification ─────────────────────────────────────
    @PostMapping("/corporate/verify")
    @Operation(summary = "Verify corporate employee email for company pass subsidy")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyCorporate(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        boolean valid = email.contains("@") && email.contains(".");
        int subsidy = email.contains("tcs") ? 60 : email.contains("google") ? 100 : email.contains("infosys") ? 50 : 40;

        Map<String, Object> response = Map.of(
                "email", email,
                "verified", valid,
                "subsidyPercentage", subsidy,
                "message", valid ? "Corporate benefits unlocked! Up to " + subsidy + "% subsidy applied." : "Invalid email"
        );
        return ResponseEntity.ok(ApiResponse.success("Corporate verification status", response));
    }
}
