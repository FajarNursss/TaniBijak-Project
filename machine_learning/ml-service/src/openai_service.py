from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# =========================================
# MULTI CROP RECOMMENDATION
# =========================================

def get_crop_recommendations(recommendations, weather):

    crops_info = "\n".join([
        f"{index + 1}. {rec['crop']} ({rec['confidence']}%)"
        for index, rec in enumerate(recommendations)
    ])

    prompt = f"""
Kamu adalah konsultan agronomi untuk sistem smart farming.

Data cuaca:
Kota: {weather['city']}
Suhu: {weather['temperature']} C
Kelembaban: {weather['humidity']}%
Curah hujan: {weather['rainfall']} mm
Kondisi cuaca: {weather['weather']}

Top rekomendasi tanaman:
{crops_info}

Berikan penjelasan dengan format berikut:

1. Alasan Kecocokan
Jelaskan kenapa tanaman-tanaman ini cocok.

2. Perbandingan Tanaman
Bandingkan kesesuaian tiap tanaman berdasarkan suhu dan kelembaban.

3. Risiko dan Tantangan
Jelaskan risiko utama untuk tiap tanaman.

4. Tips Penanaman
Berikan tips praktis singkat untuk petani.

Aturan:
- Gunakan bahasa Indonesia
- Gunakan penomoran
- Jangan gunakan simbol bullet
- Jangan gunakan tanda *
- Jawaban harus rapi dan singkat
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Kamu adalah ahli agronomi dan smart farming "
                        "yang memberikan rekomendasi praktis."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.4,
            max_tokens=500
        )

        return response.choices[0].message.content

    except Exception as e:

        print("GROQ ERROR:", e)

        crops_list = ", ".join([
            rec['crop']
            for rec in recommendations
        ])

        return (
            f"1. Alasan Kecocokan\n"
            f"Tanaman {crops_list} cocok untuk "
            f"kota {weather['city']}.\n\n"

            f"2. Kondisi Cuaca\n"
            f"Suhu {weather['temperature']} C dan "
            f"kelembaban {weather['humidity']}% "
            f"cukup mendukung pertanian.\n\n"

            f"3. Risiko\n"
            f"Perhatikan curah hujan dan serangan hama.\n\n"

            f"4. Tips\n"
            f"Gunakan benih berkualitas dan "
            f"pantau kondisi tanah secara rutin."
        )


# =========================================
# SINGLE CROP EXPLANATION
# =========================================

def explain_crop(crop, weather):

    prompt = f"""
Kamu adalah konsultan agronomi untuk sistem smart farming.

Data cuaca:
Kota: {weather['city']}
Suhu: {weather['temperature']} C
Kelembaban: {weather['humidity']}%
Curah hujan: {weather['rainfall']} mm
Kondisi cuaca: {weather['weather']}

Hasil prediksi tanaman:
{crop}

Berikan penjelasan dengan format berikut:

1. Alasan Kecocokan
2. Risiko
3. Tips Penanaman

Aturan:
- Gunakan bahasa Indonesia
- Gunakan penomoran
- Jangan gunakan bullet point
- Jangan gunakan tanda *
- Jawaban singkat dan jelas
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Kamu adalah ahli agronomi dan smart farming."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.4,
            max_tokens=300
        )

        return response.choices[0].message.content

    except Exception as e:

        print("GROQ ERROR:", e)

        return (
            f"1. Alasan Kecocokan\n"
            f"Tanaman {crop} cocok karena suhu "
            f"{weather['temperature']} C dan "
            f"kelembaban {weather['humidity']}%.\n\n"

            f"2. Risiko\n"
            f"Perhatikan perubahan cuaca dan hama.\n\n"

            f"3. Tips Penanaman\n"
            f"Lakukan penyiraman dan pemupukan rutin."
        )
