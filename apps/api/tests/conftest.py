import sys
import os

# Get path to apps/api and root PRISM directory
api_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

# Insert api directory first so `from main import app` and `from core...` work
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

# Insert root directory and services
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
services_dir = os.path.join(root_dir, 'services')
if os.path.exists(services_dir) and services_dir not in sys.path:
    sys.path.insert(0, services_dir)


