import pandas as pd

df = pd.read_csv('../data/regions_clean.csv')

# mapping dummy (nanti bisa auto dari BMKG)
adm4_map = {}

counter = 1001

for i, row in df.iterrows():
    key = row['kecamatan']
    
    if key not in adm4_map:
        adm4_map[key] = f"11.01.01.{counter}"
        counter += 1

df['adm4'] = df['kecamatan'].map(adm4_map)

df.to_csv('../data/regions_with_adm4.csv', index=False)

print("STEP 2 DONE: adm4 generated")