import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'cities.csv')

class CityWeatherMapper:
    def __init__(self):
        self.df = self._load_data()

    def _load_data(self):
        if not os.path.exists(DATA_PATH):
            print(f"DEBUG: File tidak ditemukan -> {os.path.abspath(DATA_PATH)}")
            return pd.DataFrame()

        df = pd.read_csv(DATA_PATH)
        df.columns = df.columns.str.strip().str.lower()
        return df

    def get_adm4(self, city: str):
        if self.df.empty or not city:
            return None

        city = city.strip().lower()

        if 'nama_kota' not in self.df.columns:
            print("ERROR: Kolom 'nama_kota' tidak ditemukan")
            return None

        row = self.df[self.df['nama_kota'].str.strip().str.lower() == city]

        if row.empty:
            print(f"WARNING: Kota '{city}' tidak ditemukan")
            return None

        return row.iloc[0].get('adm4', None)