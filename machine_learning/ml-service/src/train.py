from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from joblib import dump

from preprocessing import load_data

# Load dataset
X, y, encoder = load_data()

# Bagi data training dan testing
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Buat model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Training model
model.fit(X_train, y_train)

# Testing model
y_pred = model.predict(X_test)

# Hitung akurasi
accuracy = accuracy_score(y_test, y_pred)

print(f"Akurasi Model: {accuracy * 100:.2f}%")

# Simpan model + encoder
dump((model, encoder), '../model/crop_model.pkl')

print("Model berhasil disimpan!")