import pandas as pd
import json
import sys

try:
    xl = pd.ExcelFile('Assisting Files/TENDER TRACKER 2024-2025-2026.xlsx')
    results = {}
    for sheet in xl.sheet_names:
        df = pd.read_excel(xl, sheet_name=sheet, nrows=5)
        results[sheet] = df.columns.tolist()
    print(json.dumps(results, indent=2))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
