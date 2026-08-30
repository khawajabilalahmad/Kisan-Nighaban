from datetime import date

CROP_PROFILES = {
    "wheat": {
        "optimal_temp_range": [15, 25],
        "heat_stress_threshold": 35,
        "max_rainfall_tolerance": 50,
        "drought_sensitivity": "moderate",
        "growth_stages": ["germination", "tillering", "stem-extension", "heading", "flowering", "grain-filling", "maturity"],
        "stage_durations_days": [7, 21, 20, 15, 10, 25, 15],
    },
    "rice": {
        "optimal_temp_range": [20, 35],
        "heat_stress_threshold": 40,
        "max_rainfall_tolerance": 150,
        "drought_sensitivity": "high",
        "growth_stages": ["germination", "tillering", "panicle-initiation", "heading", "flowering", "ripening"],
        "stage_durations_days": [10, 30, 20, 15, 15, 30],
    },
    "cotton": {
        "optimal_temp_range": [21, 37],
        "heat_stress_threshold": 42,
        "max_rainfall_tolerance": 40,
        "drought_sensitivity": "low",
        "growth_stages": ["germination", "seedling", "squaring", "flowering", "boll-development", "maturity"],
        "stage_durations_days": [10, 20, 30, 30, 40, 20],
    },
    "maize": {
        "optimal_temp_range": [18, 30],
        "heat_stress_threshold": 38,
        "max_rainfall_tolerance": 60,
        "drought_sensitivity": "high",
        "growth_stages": ["germination", "vegetative", "tasseling", "silking", "grain-filling", "maturity"],
        "stage_durations_days": [7, 45, 15, 10, 30, 20],
    }
}

def compute_growth_stage(crop_type: str, sowing_date: date) -> str:
    """
    Computes the current growth stage of a crop based on its sowing date.
    """
    crop = crop_type.lower()
    if crop not in CROP_PROFILES:
        return "unknown"
        
    profile = CROP_PROFILES[crop]
    days_since_sowing = (date.today() - sowing_date).days
    
    if days_since_sowing < 0:
        return "not-sown-yet"
        
    accumulated_days = 0
    for stage, duration in zip(profile["growth_stages"], profile["stage_durations_days"]):
        accumulated_days += duration
        if days_since_sowing <= accumulated_days:
            return stage
            
    return "harvested"
