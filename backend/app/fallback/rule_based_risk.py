from backend.app.schemas.risk import RiskAssessmentOutput, RiskBreakdown, Recommendation

def calculate_rule_based_risk(crop_type: str, crop_profile: dict, weather_data: dict, growth_stage: str, growth_stage_day: int) -> RiskAssessmentOutput:
    """
    Fallback method to calculate risk scores using hard-coded rules and thresholds
    when the AI service is unavailable.
    """
    
    # 1. Extract weather data (safely handling potential missing keys)
    daily = weather_data.get("daily", {})
    max_temps = daily.get("temperature_2m_max", [])
    precipitations = daily.get("precipitation_sum", [])
    wind_speeds = daily.get("wind_speed_10m_max", [])
    
    # Defaults if weather data is empty
    highest_temp = max(max_temps) if max_temps else 25
    highest_precip = max(precipitations) if precipitations else 0
    highest_wind = max(wind_speeds) if wind_speeds else 10
    total_precip = sum(precipitations) if precipitations else 0

    # 2. Extract crop thresholds
    heat_threshold = crop_profile.get("heat_stress_threshold", 35)
    rain_tolerance = crop_profile.get("max_rainfall_tolerance", 50)
    drought_sensitivity = crop_profile.get("drought_sensitivity", "moderate")
    
    # 3. Calculate breakdown scores (0-100)
    
    # Heat Stress
    heat_score = 0
    if highest_temp > heat_threshold:
        # 10 points for every degree over threshold, capped at 100
        heat_score = min(100, int((highest_temp - heat_threshold) * 10))
    
    # Flooding
    flood_score = 0
    if highest_precip > rain_tolerance:
        flood_score = min(100, int((highest_precip - rain_tolerance) * 2))
        
    # Drought
    drought_score = 0
    if total_precip < 5:  # Less than 5mm rain in a week
        if drought_sensitivity == "high":
            drought_score = 80
        elif drought_sensitivity == "moderate":
            drought_score = 50
        else:
            drought_score = 20
            
    # Wind Damage
    wind_score = 0
    if highest_wind > 40: # > 40 km/h
        wind_score = min(100, int((highest_wind - 40) * 1.5))
        
    # 4. Calculate overall score (weighted average or max)
    # We take the maximum individual risk as the overall driver, plus a little extra for compounding
    overall_score = min(100, int(max(heat_score, flood_score, drought_score, wind_score) * 1.1))
    
    # Determine risk level string
    if overall_score < 30:
        risk_level = "low"
    elif overall_score < 60:
        risk_level = "moderate"
    elif overall_score < 80:
        risk_level = "high"
    else:
        risk_level = "critical"
        
    # 5. Generate fallback recommendations
    recommendations = []
    
    if heat_score > 50:
        recommendations.append(Recommendation(
            priority=1,
            title="Immediate Irrigation Required",
            detail=f"Temperatures are forecasted to hit {highest_temp}°C, exceeding the crop's threshold of {heat_threshold}°C. Irrigate immediately to cool the canopy.",
            urgency="immediate"
        ))
        
    if flood_score > 50:
        recommendations.append(Recommendation(
            priority=1 if not recommendations else 2,
            title="Ensure Field Drainage",
            detail=f"Heavy rainfall of {highest_precip}mm expected. Clear drainage channels to prevent waterlogging.",
            urgency="within-48-hours"
        ))
        
    if not recommendations:
        recommendations.append(Recommendation(
            priority=1,
            title="Continue Standard Care",
            detail="No severe weather threats detected. Continue with standard crop maintenance schedule.",
            urgency="low"
        ))
        
    summary = f"Rule-based assessment indicates a {risk_level} risk level. "
    if overall_score > 50:
        summary += "Significant weather threats identified based on crop thresholds."
    else:
        summary += "Weather conditions are generally favorable."

    return RiskAssessmentOutput(
        risk_score=overall_score,
        risk_level=risk_level,
        risk_breakdown=RiskBreakdown(
            heat_stress=heat_score,
            drought=drought_score,
            flooding=flood_score,
            wind_damage=wind_score
        ),
        growth_stage=growth_stage,
        growth_stage_day=growth_stage_day,
        summary=summary,
        recommendations=recommendations
    )
