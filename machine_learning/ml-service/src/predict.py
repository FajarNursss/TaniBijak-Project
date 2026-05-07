from weather_service import get_weather
from openai_service import get_crop_recommendations
from joblib import load

import argparse
import os
import pandas as pd
import numpy as np

# ====================================
# LOAD MODEL
# ====================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    '..',
    'model',
    'crop_model.pkl'
)

model, encoder = load(MODEL_PATH)

# ====================================
# MAIN FUNCTION
# ====================================

def predict_crop(city: str):

    city = city.strip() if city else ""

    if not city:
        raise ValueError("Nama kota wajib diisi")

    # ====================================
    # GET WEATHER
    # ====================================

    weather = get_weather(city)

    if not weather:
        raise Exception("Weather tidak tersedia")

    # ====================================
    # PREPARE INPUT DATA
    # ====================================

    input_data = pd.DataFrame([[
        weather['temperature'],
        weather['humidity'],
        6.5,
        weather['rainfall']
    ]], columns=[
        'temperature',
        'humidity',
        'ph',
        'rainfall'
    ])

    # ====================================
    # PREDICT ALL PROBABILITIES
    # ====================================

    probabilities = model.predict_proba(input_data)[0]

    # ====================================
    # GET TOP 3 RECOMMENDATIONS
    # ====================================

    ranked_indexes = np.argsort(
        probabilities
    )[-3:][::-1]

    recommendations = []

    for index in ranked_indexes:

        crop_name = encoder.inverse_transform(
            [index]
        )[0]

        confidence = round(
            float(probabilities[index] * 100),
            1
        )

        recommendations.append({
            "crop": crop_name,
            "confidence": confidence
        })

    # ====================================
    # BEST CROP
    # ====================================

    best_crop = recommendations[0]["crop"]

    # ====================================
    # AGRONOMY EXPLANATION
    # ====================================

    explanation = get_crop_recommendations(
        recommendations,
        weather
    )

    # ====================================
    # RETURN RESULT
    # ====================================

    return {
        "crop": best_crop,
        "recommendations": recommendations,
        "weather": weather,
        "explanation": explanation
    }

# ====================================
# CLI ENTRY POINT
# ====================================

if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Prediksi rekomendasi tanaman berdasarkan kota."
    )

    parser.add_argument(
        "city",
        nargs="?",
        help='Nama kota, contoh: "Jakarta Timur"'
    )

    parser.add_argument(
        "--city",
        dest="city_option",
        help="Nama kota alternatif."
    )

    args = parser.parse_args()

    city = (
        args.city_option
        or args.city
        or os.getenv("PREDICT_CITY")
    )

    if not city:
        parser.error(
            "nama kota wajib diisi lewat argumen atau env PREDICT_CITY"
        )

    result = predict_crop(city)

    # ====================================
    # OUTPUT
    # ====================================

    print("\nTOP CROP:")
    print(result["crop"])

    print("\nRECOMMENDATIONS:")

    for number, item in enumerate(
        result["recommendations"],
        start=1
    ):

        print(
            f"{number}. "
            f"{item['crop']} "
            f"({item['confidence']}%)"
        )

    print("\nWEATHER:")
    print(result["weather"])

    print("\nEXPLANATION:")
    print(result["explanation"])
