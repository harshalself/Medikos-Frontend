# Healthcare API: Disease Prediction and RAG Chatbot

This project implements a healthcare API that combines two powerful features:
1. Infectious Disease Prediction with SHAP Explanations
2. RAG (Retrieval-Augmented Generation) Chatbot for medical queries

## Disease Prediction Feature

### API Endpoints

#### Disease Prediction Endpoint
- **URL**: `/api/predict_with_shap`
- **Method**: `POST`
- **Request Format**:
```json
{
    "symptoms": ["symptom1", "symptom2", "symptom3"]
}
```
- **Response Format**:
```json
{
    "prediction": "disease_name",
    "symptom_importance": {
        "symptom1": 45.5,
        "symptom2": 30.2,
        "symptom3": 24.3
    }
}
```

### Frontend Integration Guide

To integrate the disease prediction feature in your frontend:

1. **Making API Calls**:
```javascript
// Using fetch
const predictDisease = async (symptoms) => {
    try {
        const response = await fetch('http://your-api-url/predict_with_shap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms: symptoms })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
const symptoms = ['fever', 'cough', 'fatigue'];
const prediction = await predictDisease(symptoms);
```

2. **Handling Responses**:
- The API returns both the predicted disease and the importance of each symptom
- Use the symptom importance values to create visualizations (e.g., bar charts)
- Display the confidence levels for each symptom's contribution

3. **Error Handling**:
- Check for empty symptom lists
- Handle invalid symptoms
- Manage API connection errors

### Setup Instructions

1. **Prerequisites**:
- Python 3.8+
- FastAPI
- scikit-learn
- SHAP
- joblib

2. **Installation**:
```bash
pip install -r requirements.txt
```

3. **Running the API**:
```bash
uvicorn app:app --reload
```

4. **Testing the API**:
- The API will be available at `http://localhost:8000`
- Swagger documentation available at `http://localhost:8000/docs`
- ReDoc documentation available at `http://localhost:8000/redoc`

### Model Information
- Uses Random Forest Classifier for disease prediction
- Implements SHAP (SHapley Additive exPlanations) for explainable AI
- Pre-trained model stored in `rf_disease_model.joblib`
- Features list stored in `X_test_columns.joblib`

## Security Considerations
- Implement CORS policies for production
- Add authentication for API endpoints
- Sanitize input data
- Use HTTPS in production

## Development
- Built with FastAPI
- Uses Pydantic for request validation
- Implements async endpoints for better performance

---
Note: The RAG Chatbot integration guide will be provided in a separate section.