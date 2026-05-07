import logging
import os

import pandas as pd
import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'cities.csv')


def load_cities():
    if not os.path.exists(DATA_PATH):
        logger.error(f"CSV tidak ditemukan: {DATA_PATH}")
        return pd.DataFrame()

    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.strip().str.lower()
    return df


df_city = load_cities()


def get_adm4_by_city(city: str):
    if df_city.empty or not city:
        return None

    city = city.strip().lower()

    if 'nama_kota' not in df_city.columns:
        logger.error("Kolom nama_kota tidak ada")
        return None

    row = df_city[df_city['nama_kota'].str.strip().str.lower() == city]

    if row.empty:
        logger.warning(f"Kota tidak ditemukan: {city}")
        return None

    return row.iloc[0].get('adm4', None)


def adm4_candidates(adm4):
    adm4 = str(adm4).strip()
    candidates = [adm4]

    if adm4.endswith(".1001"):
        candidates.append(adm4[:-4] + "2001")

    return candidates


def estimate_rainfall(weather_desc: str):
    weather = str(weather_desc).lower()

    if "hujan lebat" in weather:
        return 300
    if "hujan sedang" in weather:
        return 200
    if "hujan ringan" in weather:
        return 100
    if "hujan" in weather:
        return 50
    if "berawan" in weather:
        return 30

    return 0


def fetch_bmkg(city: str):
    adm4 = get_adm4_by_city(city)

    if not adm4:
        logger.error(f"ADM4 tidak ditemukan untuk {city}")
        return None

    for adm4_candidate in adm4_candidates(adm4):
        url = f"https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={adm4_candidate}"
        logger.info(f"Request BMKG: {url}")
        res = requests.get(url, timeout=15)

        if res.status_code == 200:
            return res.json()

        logger.warning(f"BMKG status error: {res.status_code} untuk adm4={adm4_candidate}")

    return None


def weather_rows(data):
    data_list = data.get("data", [])

    if not data_list:
        return []

    cuaca_group = data_list[0].get("cuaca", [])
    rows = []

    for group in cuaca_group:
        entries = group if isinstance(group, list) else [group]

        for item in entries:
            weather_desc = item.get("weather_desc", "Unknown")
            rows.append({
                "date": str(item.get("local_datetime") or item.get("datetime") or "")[:10],
                "temperature": float(item.get("t", 0)),
                "humidity": float(item.get("hu", 0)),
                "weather": weather_desc,
                "wind_speed": float(item.get("ws", 0)),
                "rainfall": estimate_rainfall(weather_desc),
                "visibility": item.get("vs_text", "N/A"),
            })

    return rows


def get_weather(city: str):
    try:
        data = fetch_bmkg(city)

        if not data:
            return None

        rows = weather_rows(data)

        if not rows:
            logger.error("Parsing BMKG gagal")
            return None

        current = rows[0]

        return {
            "city": city,
            "temperature": current["temperature"],
            "humidity": current["humidity"],
            "weather": current["weather"],
            "wind_speed": current["wind_speed"],
            "rainfall": current["rainfall"],
            "visibility": current["visibility"],
        }

    except Exception as e:
        logger.error(f"Weather error: {e}")
        return None


def get_forecast(city: str, days=7):
    try:
        data = fetch_bmkg(city)

        if not data:
            return []

        daily = {}

        for row in weather_rows(data):
            if not row["date"]:
                continue

            key = row["date"]

            if key not in daily:
                daily[key] = {
                    "date": key,
                    "temp_min": row["temperature"],
                    "temp_max": row["temperature"],
                    "humidity": row["humidity"],
                    "condition": row["weather"],
                    "rainfall": row["rainfall"],
                    "rain_chance": 80 if row["rainfall"] >= 100 else 50 if row["rainfall"] > 0 else 10,
                }
                continue

            daily[key]["temp_min"] = min(daily[key]["temp_min"], row["temperature"])
            daily[key]["temp_max"] = max(daily[key]["temp_max"], row["temperature"])

            if row["rainfall"] >= daily[key]["rainfall"]:
                daily[key]["condition"] = row["weather"]
                daily[key]["rainfall"] = row["rainfall"]
                daily[key]["rain_chance"] = 80 if row["rainfall"] >= 100 else 50 if row["rainfall"] > 0 else 10

        return list(daily.values())[: int(days)]

    except Exception as e:
        logger.error(f"Forecast error: {e}")
        return []
