# Hệ thống ôn luyện và tổ chức các kỳ thi Toán THPT

## 1. Thiết lập và chạy hệ thống trên máy cá nhân (localhost)

### Yêu cầu hệ thống
Trước khi chạy hệ thống, đảm bảo máy tính cá nhân đã cài đặt:
- **Python 3** và Django (Backend)
- **Node.js** và ReactJS (Frontend)
- **MySQL** (hoặc hệ quản trị CSDL tương đương)

### Các bước khởi chạy hệ thống:

#### Bước 1: Khởi động backend
```bash
cd backend
python3 manage.py runserver
````

#### Bước 2: Khởi động frontend

Frontend có thể được truy cập tại:

```
http://localhost:3000
```

#### Bước 3: Giao tiếp với API nội bộ

Mặc định, React frontend sẽ gửi yêu cầu đến API backend tại:

```
http://localhost:8000
```

#### Bước 4: Cấu hình địa chỉ API cho frontend

Tập tin cấu hình địa chỉ API được sinh tự động tại:

```
frontend/src/config.js
```

**Nội dung mẫu của file `config.js`:**

```javascript
export const API_WIFI_URL = "http://127.0.0.1:8000";
```

---

## 2. Triển khai hệ thống trong mạng LAN

Để cho phép nhiều thiết bị trong cùng mạng LAN sử dụng hệ thống (ví dụ lớp học, phòng máy):

### Bước 1: Chạy backend Django lắng nghe toàn bộ IP

```bash
python3 manage.py runserver 0.0.0.0:8000
```

### Bước 2: Tự động cập nhật địa chỉ IP nội bộ trong `settings.py`

```python
import socket

hostname = socket.gethostname()
SERVER_LOCAL_IP = socket.gethostbyname(hostname)
BACKEND_API_BASE_URL = f"http://{SERVER_LOCAL_IP}:8000"
```

### Bước 3: Sinh file cấu hình frontend tương ứng

File:

```
frontend/src/config.js
```

**Ví dụ nội dung:**

```javascript
export const API_WIFI_URL = "http://192.168.1.15:8000";
```

*(Trong đó `192.168.1.15` là địa chỉ IP nội bộ của máy chủ.)*

### Bước 4: Gọi API từ frontend bằng biến cấu hình

```javascript
import { API_WIFI_URL } from './config';

fetch(`${API_WIFI_URL}/api/xxx`, {
  method: 'POST',
  // ...
});
```

### Bước 5: Truy cập frontend từ thiết bị khác

Trên các máy khác trong cùng mạng LAN, người dùng có thể truy cập hệ thống qua trình duyệt tại địa chỉ:
```
http://192.168.1.15:3000
```
---

## Ghi chú

* Thay đổi IP trong cấu hình nếu địa chỉ IP máy chủ thay đổi.
* Đảm bảo các thiết bị đều kết nối cùng một mạng nội bộ (WiFi hoặc Ethernet).
* Có thể cấu hình domain nội bộ hoặc hostname để tiện truy cập thay vì dùng địa chỉ IP.

---

## Liên hệ

> Tác giả: **Khổng Thị Hoài Phương**
> Email: [Phuong.KTH216871@sis.hust.edu.vn](mailto:Phuong.KTH216871@sis.hust.edu.vn)
> Github: [github.com/phuongkhong1706](https://github.com/phuongkhong1706)