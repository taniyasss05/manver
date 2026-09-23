#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MANVER Camouflage Nets - Local HTTP & Admin API Server
Собственный автономный сервер на стандартной библиотеке Python 3.
Без внешних зависимостей (no pip required).
"""

import os
import sys
import json
import base64
import hashlib
import uuid
import datetime
import mimetypes
from urllib.parse import urlparse, parse_qs
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

# Ensure Windows terminal doesn't crash on UTF-8 output
if sys.platform == 'win32':
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
ASSETS_IMG_DIR = os.path.join(BASE_DIR, 'assets', 'images', 'products')
PORT = 8000

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ASSETS_IMG_DIR, exist_ok=True)

SESSIONS_FILE = os.path.join(DATA_DIR, 'sessions.json')

def load_json(filename, default=None):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return default if default is not None else {}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to load {filename}: {e}")
        return default if default is not None else {}

def save_json(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_sessions():
    return load_json('sessions.json', default={})

def save_session_token(token):
    sessions = get_sessions()
    sessions[token] = {
        'created': datetime.datetime.now().isoformat(),
        'expires': (datetime.datetime.now() + datetime.timedelta(days=30)).isoformat()
    }
    save_json('sessions.json', sessions)

def remove_session_token(token):
    sessions = get_sessions()
    if token in sessions:
        del sessions[token]
        save_json('sessions.json', sessions)

def is_valid_token(token):
    if not token:
        return False
    sessions = get_sessions()
    return token in sessions

def regenerate_products_js(products):
    js_path = os.path.join(BASE_DIR, 'js', 'products.js')
    root_path = os.path.join(BASE_DIR, 'products.js')
    header = (
        "/**\n"
        " * Каталог товаров и сетевых основ MANVER\n"
        " * Автоматически синхронизировано через панель управления MANVER Admin\n"
        " */\n\n"
    )
    code = header + "const PRODUCTS = " + json.dumps(products, ensure_ascii=False, indent=2) + ";\n\nwindow.MANVER_PRODUCTS = PRODUCTS;\n"
    for p in [js_path, root_path]:
        try:
            with open(p, 'w', encoding='utf-8') as f:
                f.write(code)
        except Exception as e:
            print(f"[WARN] Could not write to {p}: {e}")

def regenerate_content_js(content):
    js_path = os.path.join(BASE_DIR, 'js', 'content.js')
    root_path = os.path.join(BASE_DIR, 'content.js')
    header = (
        "/**\n"
        " * Контент и контактные данные сайта MANVER\n"
        " * Автоматически синхронизировано через панель управления MANVER Admin\n"
        " */\n\n"
    )
    code = header + "window.MANVER_CONTENT = " + json.dumps(content, ensure_ascii=False, indent=2) + ";\n"
    for p in [js_path, root_path]:
        try:
            with open(p, 'w', encoding='utf-8') as f:
                f.write(code)
        except Exception as e:
            pass

class ManverHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def extract_token(self):
        # 1. Check Header X-Admin-Token
        token = self.headers.get('X-Admin-Token')
        if token and is_valid_token(token):
            return token
        # 2. Check Authorization Bearer
        auth = self.headers.get('Authorization')
        if auth and auth.startswith('Bearer '):
            t = auth[7:].strip()
            if is_valid_token(t):
                return t
        # 3. Check Cookie
        cookies = self.headers.get('Cookie')
        if cookies:
            for part in cookies.split(';'):
                part = part.strip()
                if part.startswith('manver_token='):
                    t = part[len('manver_token='):]
                    if is_valid_token(t):
                        return t
        return None

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                return {}
            raw_bytes = self.rfile.read(content_length)
            try:
                raw_body = raw_bytes.decode('utf-8')
            except UnicodeDecodeError:
                try:
                    raw_body = raw_bytes.decode('cp1251')
                except Exception:
                    raw_body = raw_bytes.decode('latin-1', errors='replace')
            return json.loads(raw_body)
        except Exception as e:
            print(f"[ERROR] JSON parse error: {e}")
            return {}

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')

        # Root and Admin page routing
        if path == '' or path == '/':
            self.path = '/index.html'
            return super().do_GET()
        elif path == '/admin':
            self.path = '/admin.html'
            return super().do_GET()

        # API Routes
        if path == '/api/status':
            token = self.extract_token()
            config = load_json('config.json', {})
            return self.send_json({
                'authenticated': bool(token),
                'siteName': config.get('siteName', 'MANVER — Панель управления')
            })

        elif path == '/api/data':
            token = self.extract_token()
            products = load_json('products.json', [])
            content = load_json('content.json', {})
            leads = load_json('leads.json', []) if token else []
            config = load_json('config.json', {})
            return self.send_json({
                'authenticated': bool(token),
                'products': products,
                'content': content,
                'leads': leads,
                'siteName': config.get('siteName', 'MANVER')
            })

        elif path == '/api/leads':
            token = self.extract_token()
            if not token:
                return self.send_json({'error': 'Unauthorized'}, status=401)
            leads = load_json('leads.json', [])
            return self.send_json({'leads': leads})

        # Static files fallback
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')

        # 1. Login endpoint
        if path == '/api/login':
            body = self.read_json_body()
            password = body.get('password', '')
            config = load_json('config.json', {})
            expected_hash = config.get('passwordHash')

            # Default hash for "admin" if config is fresh
            if not expected_hash:
                expected_hash = hashlib.sha256('admin'.encode('utf-8')).hexdigest()
                config['passwordHash'] = expected_hash
                save_json('config.json', config)

            pass_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
            if pass_hash == expected_hash:
                token = uuid.uuid4().hex
                save_session_token(token)
                # Set cookie header in response
                response_data = {'ok': True, 'token': token}
                body_bytes = json.dumps(response_data).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body_bytes)))
                self.send_header('Set-Cookie', f'manver_token={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000')
                self.end_headers()
                self.wfile.write(body_bytes)
                return
            else:
                return self.send_json({'ok': False, 'error': 'Неверный пароль администратора'}, status=403)

        # 2. Logout endpoint
        elif path == '/api/logout':
            token = self.extract_token()
            if token:
                remove_session_token(token)
            return self.send_json({'ok': True})

        # 3. Submit lead (Public endpoint from index.html forms)
        elif path == '/api/leads':
            body = self.read_json_body()
            leads = load_json('leads.json', [])
            lead = {
                'id': 'lead_' + datetime.datetime.now().strftime('%Y%m%d%H%M%S') + '_' + uuid.uuid4().hex[:4],
                'date': datetime.datetime.now().strftime('%d.%m.%Y %H:%M'),
                'name': body.get('name', 'Гость'),
                'phone': body.get('phone', ''),
                'type': body.get('type') or body.get('source') or 'Заявка с сайта',
                'details': body.get('details') or body.get('task') or body.get('dimensions') or 'Заказ звонка / консультация',
                'status': 'Новая'
            }
            leads.insert(0, lead)
            save_json('leads.json', leads)
            print(f"[LEAD] New lead received: {lead['name']} ({lead['phone']}) - {lead['type']}")
            return self.send_json({'ok': True, 'lead': lead})

        # AUTHENTICATED ENDPOINTS BELOW
        token = self.extract_token()
        if not token:
            return self.send_json({'error': 'Unauthorized. Please log in.'}, status=401)

        # 4. Save Products
        if path == '/api/save-products':
            body = self.read_json_body()
            products = body.get('products', [])
            if not isinstance(products, list):
                return self.send_json({'error': 'Products must be an array'}, status=400)
            
            save_json('products.json', products)
            regenerate_products_js(products)
            print(f"[ADMIN] Saved {len(products)} products to products.json & js/products.js")
            return self.send_json({'ok': True, 'count': len(products)})

        # 5. Save Content (contacts, texts, calculator)
        elif path == '/api/save-content':
            body = self.read_json_body()
            content = body.get('content', {})
            save_json('content.json', content)
            regenerate_content_js(content)
            print("[ADMIN] Saved content.json & js/content.js")
            return self.send_json({'ok': True})

        # 6. Upload Image (Base64 data URI)
        elif path == '/api/upload':
            body = self.read_json_body()
            filename = body.get('filename', 'image.jpg')
            data_uri = body.get('data', '')

            # Extract base64 part
            if ',' in data_uri:
                header, base64_data = data_uri.split(',', 1)
            else:
                base64_data = data_uri

            # Clean filename
            ext = os.path.splitext(filename)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.svg']:
                ext = '.jpg'
            
            clean_name = f"upload_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}{ext}"
            file_path = os.path.join(ASSETS_IMG_DIR, clean_name)
            root_file_path = os.path.join(BASE_DIR, clean_name)

            try:
                img_bytes = base64.b64decode(base64_data)
                
                # Auto-optimize large images with Pillow
                try:
                    import io
                    from PIL import Image
                    image = Image.open(io.BytesIO(img_bytes))
                    if image.mode in ('RGBA', 'P') and ext in ['.jpg', '.jpeg']:
                        image = image.convert('RGB')
                    max_dim = 1600
                    if max(image.width, image.height) > max_dim:
                        image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                    out_buffer = io.BytesIO()
                    if ext in ['.jpg', '.jpeg']:
                        image.save(out_buffer, format='JPEG', quality=85, optimize=True)
                    elif ext == '.png':
                        image.save(out_buffer, format='PNG', optimize=True)
                    elif ext == '.webp':
                        image.save(out_buffer, format='WEBP', quality=85)
                    else:
                        out_buffer.write(img_bytes)
                    optimized_bytes = out_buffer.getvalue()
                except Exception as opt_err:
                    print(f"[WARN] Image optimization skipped: {opt_err}")
                    optimized_bytes = img_bytes

                with open(file_path, 'wb') as f:
                    f.write(optimized_bytes)
                with open(root_file_path, 'wb') as f:
                    f.write(optimized_bytes)

                rel_path = f"assets/images/products/{clean_name}"
                print(f"[ADMIN] Uploaded & optimized image: {rel_path} ({len(optimized_bytes)} bytes)")
                return self.send_json({'ok': True, 'path': rel_path})
            except Exception as e:
                print(f"[ERROR] Image upload failed: {e}")
                return self.send_json({'ok': False, 'error': str(e)}, status=500)

        # 7. Update Lead Status
        elif path == '/api/update-lead':
            body = self.read_json_body()
            lead_id = body.get('id')
            status = body.get('status')
            leads = load_json('leads.json', [])
            found = False
            for lead in leads:
                if lead.get('id') == lead_id:
                    lead['status'] = status
                    found = True
                    break
            if found:
                save_json('leads.json', leads)
                return self.send_json({'ok': True})
            return self.send_json({'ok': False, 'error': 'Lead not found'}, status=404)

        # 8. Delete Lead
        elif path == '/api/delete-lead':
            body = self.read_json_body()
            lead_id = body.get('id')
            leads = load_json('leads.json', [])
            leads = [l for l in leads if l.get('id') != lead_id]
            save_json('leads.json', leads)
            return self.send_json({'ok': True})

        # 9. Change Password
        elif path == '/api/change-password':
            body = self.read_json_body()
            curr_pass = body.get('currentPassword', '')
            new_pass = body.get('newPassword', '')
            if not new_pass or len(new_pass) < 4:
                return self.send_json({'ok': False, 'error': 'Пароль должен содержать минимум 4 символа'}, status=400)
            
            config = load_json('config.json', {})
            expected_hash = config.get('passwordHash')
            curr_hash = hashlib.sha256(curr_pass.encode('utf-8')).hexdigest()
            if curr_hash != expected_hash:
                return self.send_json({'ok': False, 'error': 'Текущий пароль указан неверно'}, status=403)
            
            config['passwordHash'] = hashlib.sha256(new_pass.encode('utf-8')).hexdigest()
            save_json('config.json', config)
            print("[ADMIN] Password successfully updated")
            return self.send_json({'ok': True})

        return self.send_json({'error': 'Endpoint not found'}, status=404)

def run():
    server = ThreadingHTTPServer(('0.0.0.0', PORT), ManverHandler)
    print("=" * 60)
    print(" [OK] СЕРВЕР И АДМИН-ПАНЕЛЬ MANVER УСПЕШНО ЗАПУЩЕНЫ")
    print("=" * 60)
    print(f" - Главная страница:     http://localhost:{PORT}/")
    print(f" - Панель управления:    http://localhost:{PORT}/admin")
    print(f" - Пароль по умолчанию:  admin")
    print(f" - Для смартфона (Wi-Fi): http://192.168.1.81:{PORT}/")
    print("=" * 60)
    print("Нажмите Ctrl+C для остановки сервера.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nСервер остановлен.")
        server.server_close()

if __name__ == '__main__':
    run()
