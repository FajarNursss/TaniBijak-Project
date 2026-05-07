import pandas as pd
from sklearn.preprocessing import LabelEncoder

def load_data():

    # baca dataset
    df = pd.read_csv('../data/crops.csv')

    # fitur input
    X = df[['temperature', 'humidity', 'ph', 'rainfall']]

    # label output
    encoder = LabelEncoder()
    y = encoder.fit_transform(df['crop'])

    return X, y, encoder