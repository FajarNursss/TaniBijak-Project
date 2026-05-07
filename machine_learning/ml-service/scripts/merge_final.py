import pandas as pd

df = pd.read_csv('../data/regions_with_adm4.csv')

# final dataset yang dipakai system
final = df[['kode_kecamatan', 'kecamatan', 'adm4']]

final.to_csv('../data/regions_final.csv', index=False)

print("STEP 3 DONE: final dataset ready")