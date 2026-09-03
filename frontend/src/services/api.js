// Dummy API Service
// This file centralizes all backend calls.
// Since the backend is off, it returns hardcoded dummy data wrapped in Promises to simulate network latency.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authAPI = {
  login: async (email, password) => {
    await delay(800);
    if (email === "ali@example.com" && password === "1234") {
      return { access_token: "dummy_token_123", token_type: "bearer" };
    }
    throw new Error("Invalid credentials");
  },
  
  getUser: async () => {
    await delay(500);
    return {
      id: "user_123",
      email: "ali@example.com",
      full_name: "Ali bhai",
      mobile_number: "03001234567"
    };
  }
};

export const farmsAPI = {
  getFarms: async () => {
    await delay(600);
    return [
      {
        id: "farm_001",
        name: "North Field",
        crop_type: "wheat",
        soil_type: "loamy",
        water_source: "canal",
        sowing_date: "2026-06-10"
      },
      {
        id: "farm_002",
        name: "South Cotton",
        crop_type: "cotton",
        soil_type: "sandy",
        water_source: "tubewell",
        sowing_date: "2026-07-01"
      }
    ];
  }
};

export const analysisAPI = {
  getAnalysis: async (farmId) => {
    await delay(1200);
    return {
      health_score: 85,
      health_status: "good",
      growth_stage: "vegetative",
      recommendations: [
        { title: "Irrigation Needed", detail: "Apply water within 48 hours", priority: 1 }
      ],
      mascot_daily_tip: {
        ur: "Ali bhai, mausam theek hai, lekin parso paani lagana zaroori hai.",
        en: "Weather is good, but irrigation is needed in 2 days."
      }
    };
  }
};

export const chatAPI = {
  getHistory: async (farmId) => {
    await delay(500);
    return {
      messages: [
        { id: "msg_1", role: "user", content: "Khet ki halat kaisi hai?" },
        { id: "msg_2", role: "model", content: "Sab theek hai! Gandum bilkul healthy hai." }
      ]
    };
  },
  
  sendMessage: async (farmId, text, imageFile) => {
    await delay(1500);
    // Simulate AI markdown response
    return {
      id: `msg_${Date.now()}`,
      role: "model",
      content: `### Masla Samajh Aa Gaya!\n\nAapne jo pucha: "${text}". \n\n**Mera Mashwara:**\n- Abhi urea **mat** dalen.\n- Kal baarish ka imkan hai.\n\nFikar ki koi baat nahi! 🌱`
    };
  }
};
