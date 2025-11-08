# Predict with SHAP Endpoint API Documentation

## Overview
The `/predict_with_shap` endpoint provides disease prediction functionality using a machine learning model trained on medical symptoms. It uses SHAP (SHapley Additive exPlanations) values to explain which symptoms contributed most to the prediction, providing transparency in the model's decision-making process.

## Endpoint Details

### URL
```
POST /predict_with_shap
```

### Content-Type
```
application/json
```

### Request Body
The request must include a JSON object with the following structure:

```json
{
  "symptoms": ["string", "string", ...]
}
```

#### Parameters
- `symptoms` (array of strings, required): A list of symptoms the patient is experiencing. Each symptom should be a string describing a medical symptom.

#### Example Request
```json
{
  "symptoms": ["fever", "cough", "fatigue", "headache"]
}
```

### Response

#### Success Response (200 OK)
When valid symptoms are provided, returns a JSON object with the following structure:

```json
{
  "prediction": "string",
  "symptom_importance": {
    "symptom1": number,
    "symptom2": number,
    ...
  }
}
```

#### Response Fields
- `prediction` (string): The predicted disease or condition based on the provided symptoms.
- `symptom_importance` (object): A dictionary where keys are the valid symptoms provided and values are their importance percentages (0-100) in contributing to the prediction. Higher percentages indicate symptoms that had more influence on the model's decision.

#### Example Success Response
```json
{
  "prediction": "Common Cold",
  "symptom_importance": {
    "fever": 25.5,
    "cough": 45.2,
    "fatigue": 15.3,
    "headache": 14.0
  }
}
```

#### Error Response (200 OK)
When no valid symptoms are provided (all symptoms are unrecognized), returns:

```json
{
  "error": "No valid symptoms provided. Please enter at least one symptom."
}
```

## Frontend Integration

### JavaScript/Fetch API Example
```javascript
const predictDisease = async (symptoms) => {
  try {
    const response = await fetch('/predict_with_shap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
};

// Usage
const symptoms = ["fever", "cough", "fatigue"];
predictDisease(symptoms)
  .then(data => {
    console.log('Predicted disease:', data.prediction);
    console.log('Symptom importance:', data.symptom_importance);
  })
  .catch(error => {
    console.error('Failed to predict disease:', error);
  });
```

### React Hook Example
```javascript
import { useState } from 'react';

const usePredictEndpoint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predictDisease = async (symptoms) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/predict_with_shap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { predictDisease, loading, error };
};

// Usage in component
const SymptomChecker = () => {
  const { predictDisease, loading, error } = usePredictEndpoint();
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [prediction, setPrediction] = useState(null);

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handlePredict = async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    try {
      const data = await predictDisease(symptoms);
      setPrediction(data);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div>
      <h2>Disease Prediction</h2>

      <div>
        <input
          type="text"
          value={currentSymptom}
          onChange={(e) => setCurrentSymptom(e.target.value)}
          placeholder="Enter a symptom..."
          onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
        />
        <button onClick={addSymptom}>Add Symptom</button>
      </div>

      <div>
        <h3>Current Symptoms:</h3>
        <ul>
          {symptoms.map((symptom, index) => (
            <li key={index}>
              {symptom}
              <button onClick={() => removeSymptom(symptom)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handlePredict} disabled={loading || symptoms.length === 0}>
        {loading ? 'Predicting...' : 'Predict Disease'}
      </button>

      {error && <p style={{color: 'red'}}>Error: {error}</p>}

      {prediction && (
        <div>
          <h3>Prediction Result:</h3>
          <p><strong>Predicted Disease:</strong> {prediction.prediction}</p>

          <h4>Symptom Importance:</h4>
          <ul>
            {Object.entries(prediction.symptom_importance)
              .sort(([,a], [,b]) => b - a)
              .map(([symptom, importance]) => (
                <li key={symptom}>
                  {symptom}: {importance.toFixed(1)}%
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

## Notes
- CORS is enabled for `http://localhost:3000` (React development server).
- The API uses FastAPI with Pydantic for request/response validation.
- Only symptoms that exist in the model's training data will be considered for prediction.
- SHAP values provide explainability by showing which symptoms influenced the prediction most.
- Symptom importance percentages are normalized to sum to 100%.
- The model is a Random Forest classifier trained on medical symptom data.
- Ensure the backend server is running on the appropriate port (default FastAPI port is 8000).