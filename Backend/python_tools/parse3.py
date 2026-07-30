import pandas as pd
try:
    df = pd.read_excel('Assisting Files/TENDER TRACKER 2024-2025-2026.xlsx', sheet_name='JULY 2024')
    for i in range(10):
        print(df.iloc[i].values)
except Exception as e:
    print(e)
