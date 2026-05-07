import pandas as pd

# RAW kamu (sesuaikan file)
df = pd.read_csv('../data/raw_district.csv', header=None)

# ambil kolom penting saja
# 0 = kode besar, 1 = kode kecamatan, 2 = nama
df = df[[0, 1, 2]]

df.columns = ['kode_kab', 'kode_kecamatan', 'kecamatan']

df.to_csv('../data/regions_clean.csv', index=False)

print("STEP 1 DONE: clean data")