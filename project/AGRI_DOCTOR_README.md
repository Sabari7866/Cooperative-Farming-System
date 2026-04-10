# 🩺 உழவன் X: AI Disease Detection System

This project implements a professional **Computer Vision (CV)** system for detecting diseases in Rice, Tomato, and Curry Leaves within the **உழவன் X** platform. It combines state-of-the-art Deep Learning with practical agricultural utility (Fertilizer & Water Mixing Calculations).

## 🚀 How It Works

The Agri Doctor operates through a seamless 4-step pipeline:

1.  **Image Capture & Preprocessing**: 
    - The user selects a crop (Rice, Tomato, or Curry Leaf) and uploads a leaf photo.
    - The image is resized to **224x224** pixels and normalized to ensure compatibility with the neural network.
2.  **AI Inference**: 
    - The system uses a **MobileNetV3-Large** architecture (via Transfer Learning) to analyze the leaf patterns.
    - It identifies the specific disease and provides a **Confidence Score** (Accuracy %).
3.  **Diagnosis & Severity Assessment**: 
    - Based on the AI prediction, the system retrieves scientific data, biological spread information, and a severity rating (Severe, High, Moderate).
4.  **Actionable Recommendation**: 
    - The system calculates the **Total Fertilizer** and **Water Mixture** required based on the user's specific **Land Area**.
    - It provides bilingual (Tamil/English) instructions and a voice-enabled remedy read-out.

---

## 🧠 Technical Specifications

### 1. Deep Learning Architecture
The recommended architecture is **MobileNetV3-Large** or **EfficientNet-B0**.
- **MobileNetV3**: Extremely efficient for mobile-first web applications.
- **EfficientNet**: Achieves high accuracy by balancing network depth and resolution.

### 2. Dataset Strategy
- **Rice & Tomato**: Sourced from the **PlantVillage Dataset** (50,000+ images).
- **Curry Leaves**: Collected via field scanning and expanded using **Data Augmentation** (Rotation, Flip, Brightness adjust).

### 3. Training & Optimization
- **Transfer Learning**: Pre-trained on ImageNet, then fine-tuned on agricultural data.
- **Quantization**: Weights converted from float32 to int8 to reduce model size by 4x for fast mobile prediction.
- **Overfitting Prevention**: Utilizes Dropout (0.3) and L2 Regularization.

---

## 🛠️ Implementation & Deployment

### Backend (Python/FastAPI)
- Acts as the ML inference engine.
- Supports TensorFlow Serving for high-speed predictions.

### Frontend (React/TF.js)
- Runs the UI and can optionally run the model locally using `tfjs` for offline support.

---

## 📈 Example Result

**Crop**: Rice | **Area**: 2 Acres | **Disease Detected**: Bacterial Leaf Blight
- **Accuracy**: 94.5%
- **Fertilizer**: 10 KG of Streptocycline
- **Water**: 100 Liters
- **Instruction**: Mix and spray across the 2-acre field during early morning.

---

*“Transforming rule-based simulators into production-grade diagnostic tools for modern agriculture.”*
