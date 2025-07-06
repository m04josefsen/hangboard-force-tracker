import time
import random
import requests

SERVER_URL = 'http://localhost:5012/data'

def simulate_force_data():
    while True:
        force_value = round(random.uniform(0, 100), 1)  # Simulate 0–100 kg force, 1 decimal point
        payload = {'value': force_value}
        try:
            response = requests.post(SERVER_URL, json=payload)
            if response.status_code == 200:
                print(f"Sent force: {force_value} kg")
            else:
                print(f"Server error: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to send data: {e}")
        
        # Sends data every 0.25s
        time.sleep(0.25)

if __name__ == "__main__":
    simulate_force_data()

# python3 /Users/mjosefsen/Developer/C#/hangboard-force-tracker/hangboard-force-tracker/ESP32/data_simulation.py