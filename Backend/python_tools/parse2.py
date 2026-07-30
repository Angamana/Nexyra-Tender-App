import pandas as pd
try:
    df = pd.read_excel('Assisting Files/TENDER TRACKER 2024-2025-2026.xlsx', sheet_name='JULY 2024', skiprows=2)
    print(df.columns.tolist()[:15])
except Exception as e:
    print(e)
