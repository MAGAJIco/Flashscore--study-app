# This file is deprecated - use api.py instead
# Kept for backward compatibility
from api import app

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("ML_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)