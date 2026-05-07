from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# agar src module bisa diimport
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from predict import predict_crop
from weather_service import get_forecast, get_weather
from cities_service import CityWeatherMapper

app = Flask(__name__)
CORS(app)  # izinkan request dari Laravel / frontend

city_mapper = CityWeatherMapper()


# =========================
# HEALTH CHECK
# =========================
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "ML Service is running"}), 200


# =========================
# PREDIKSI TANAMAN
# POST /api/predict
# Body: { "city": "Kota Bogor" }
# =========================
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        body = request.get_json()

        if not body or 'city' not in body:
            return jsonify({"error": "Field 'city' wajib diisi"}), 400

        city = body['city'].strip()

        if not city:
            return jsonify({"error": "Nama kota tidak boleh kosong"}), 400

        result = predict_crop(city)

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================
# INFO CUACA
# GET /api/weather?city=Kota Bogor
# =========================
@app.route('/api/weather', methods=['GET'])
def weather():
    try:
        city = request.args.get('city', '').strip()

        if not city:
            return jsonify({"error": "Query param 'city' wajib diisi"}), 400

        data = get_weather(city)

        if not data:
            return jsonify({
                "success": False,
                "error": f"Data cuaca untuk '{city}' tidak ditemukan"
            }), 404

        return jsonify({
            "success": True,
            "data": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/forecast', methods=['GET'])
def forecast():
    try:
        city = request.args.get('city', '').strip()
        days = int(request.args.get('days', 7))

        if not city:
            return jsonify({"error": "Query param 'city' wajib diisi"}), 400

        data = get_forecast(city, days)

        if not data:
            return jsonify({
                "success": False,
                "error": f"Data prakiraan untuk '{city}' tidak ditemukan"
            }), 404

        return jsonify({
            "success": True,
            "data": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================
# INFO KOTA
# GET /api/cities?city=Kota Bogor
# =========================
@app.route('/api/cities', methods=['GET'])
def cities():
    try:
        city = request.args.get('city', '').strip()

        if not city:
            return jsonify({"error": "Query param 'city' wajib diisi"}), 400

        adm4 = city_mapper.get_adm4(city)

        if not adm4:
            return jsonify({
                "success": False,
                "error": f"Kota '{city}' tidak ditemukan"
            }), 404

        return jsonify({
            "success": True,
            "data": {
                "city": city,
                "adm4": adm4
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================
# REKOMENDASI PUPUK
# POST /api/fertilizer
# Body: { "crop": "rice", "weather": {...} }
# =========================
@app.route('/api/fertilizer', methods=['POST'])
def fertilizer():
    try:
        body = request.get_json()

        if not body or 'crop' not in body:
            return jsonify({"error": "Field 'crop' wajib diisi"}), 400

        crop = body['crop']
        weather = body.get('weather', {})

        # Rekomendasi pupuk berdasarkan jenis tanaman
        recommendations = {
            "rice":    {"pupuk": "Urea + TSP + KCl", "dosis": "200kg/ha Urea, 100kg/ha TSP, 100kg/ha KCl"},
            "maize":   {"pupuk": "Urea + SP-36 + KCl", "dosis": "300kg/ha Urea, 150kg/ha SP-36, 100kg/ha KCl"},
            "wheat":   {"pupuk": "Urea + SP-36", "dosis": "150kg/ha Urea, 100kg/ha SP-36"},
            "cotton":  {"pupuk": "Urea + DAP + MOP", "dosis": "120kg/ha Urea, 80kg/ha DAP, 60kg/ha MOP"},
            "sugarcane": {"pupuk": "Urea + SSP + MOP", "dosis": "250kg/ha Urea, 200kg/ha SSP, 150kg/ha MOP"},
            "default": {"pupuk": "NPK Majemuk", "dosis": "200kg/ha NPK 16-16-16"},
        }

        rec = recommendations.get(crop.lower(), recommendations["default"])

        return jsonify({
            "success": True,
            "data": {
                "crop": crop,
                "recommendation": rec,
                "note": "Sesuaikan dosis dengan kondisi lahan dan hasil uji tanah"
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================
# RUN SERVER
# =========================
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
