from fastapi import APIRouter
from pydantic import BaseModel
import json
import os

router = APIRouter()

def _resolve_config_path() -> str:
    if "CONFIG_FILE" in os.environ:
        return os.environ["CONFIG_FILE"]
    
    current_dir = os.path.dirname(__file__)
    # Try 4 levels up (source repo), 2 levels up (/app in container), or cwd
    for candidate in [
        os.path.abspath(os.path.join(current_dir, "..", "..", "data")),
        os.path.abspath(os.path.join(current_dir, "..", "..", "..", "..", "data")),
        os.path.abspath(os.path.join(os.getcwd(), "data"))
    ]:
        if os.path.exists(candidate):
            return os.path.join(candidate, "config.json")
    
    # Default to data folder inside CWD / /app
    return os.path.join(os.getcwd(), "data", "config.json")

CONFIG_FILE = _resolve_config_path()

_memory_settings = {
    "platt_a": -0.8,
    "platt_b": 0.2,
    "adversarial_strictness": 0.8,
    "base_reliability": 0.85
}

class SettingsUpdate(BaseModel):
    platt_a: float
    platt_b: float
    adversarial_strictness: float
    base_reliability: float

def load_settings():
    global _memory_settings
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                data = json.load(f)
                _memory_settings.update(data)
                return _memory_settings
        else:
            try:
                os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
                with open(CONFIG_FILE, 'w') as f:
                    json.dump(_memory_settings, f)
            except Exception:
                pass
            return _memory_settings
    except Exception:
        return _memory_settings

@router.get("/")
def get_settings():
    """
    Retrieves the current ML engine settings.
    """
    return load_settings()

@router.post("/")
def update_settings(settings: SettingsUpdate):
    """
    Updates the ML engine configuration.
    """
    global _memory_settings
    _memory_settings = settings.dict()
    try:
        os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
        with open(CONFIG_FILE, 'w') as f:
            json.dump(_memory_settings, f)
    except Exception:
        # Fall back to in-memory persistence if filesystem is read-only
        pass
    return {"status": "success", "settings": _memory_settings}

