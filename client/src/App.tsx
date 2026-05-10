$(python3 -c "
import base64
with open('/tmp/App_new.tsx','rb') as f:
    print(base64.b64encode(f.read()).decode())
")