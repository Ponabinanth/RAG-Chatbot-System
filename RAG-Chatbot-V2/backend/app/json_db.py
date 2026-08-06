import json
import os
from typing import List, Dict, Optional

import datetime

USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "users.json")

def _get_lock_file():
    return USERS_FILE + ".lock"

def load_users() -> List[Dict]:
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_users(users: List[Dict]):
    # Note: On Windows, fcntl is not available. We will use a simpler approach without fcntl 
    # since it's a basic implementation, or we can use portalocker if needed.
    # Actually, python's fcntl is unix only. So I'll remove it.
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def get_user_by_email(email: str) -> Optional[Dict]:
    users = load_users()
    for u in users:
        if u.get("email") == email:
            return u
    return None

def create_user(email: str, hashed_password: str) -> Dict:
    users = load_users()
    if any(u.get("email") == email for u in users):
        raise ValueError("Email already registered")
    
    new_id = 1 if not users else max(u.get("id", 0) for u in users) + 1
    new_user = {
        "id": new_id,
        "email": email,
        "hashed_password": hashed_password,
        "created_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    users.append(new_user)
    save_users(users)
    return new_user
