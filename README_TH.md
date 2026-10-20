# Supanut HR Manager — MySQL / PuTTY / FileZilla / port 3113
รหัสนิสิต 6730251514 | repository: Std0251514IPFinal2026

## การเชื่อมต่อ
React Native → HTTP API port 3113 → Express.js → MySQL port 3306 → ip_std6730251514
FileZilla อัปโหลดไฟล์ไปเซิร์ฟเวอร์ ส่วน PuTTY ใช้ SSH เข้าเซิร์ฟเวอร์เพื่อรัน Node.js ไม่ได้ดึงไฟล์จากโปรแกรม FileZilla โดยตรง
ชุดนี้แทนที่ชุด SQL Server เดิม ใช้ mysql2 และ MySQL/MariaDB ตาม phpMyAdmin ในภาพ

## 1. สร้างตารางใน phpMyAdmin
เลือกฐานข้อมูล ip_std6730251514 ทางซ้าย แล้วเลือกแท็บ SQL
1. วางโค้ดจาก backend/sql/01_create_employees_mysql.sql แล้วกด Go
2. วางโค้ดจาก backend/sql/02_seed_employees_mysql.sql แล้วกด Go เพื่อเพิ่มตัวอย่าง 5 คน
ตารางใหม่ชื่อ Supanut_6730251514_Employees และทุกคอลัมน์ขึ้นต้น Supanut_6730251514_
ไม่ต้องสร้างฐานข้อมูลใหม่ และไม่ต้องลบตาราง group_* / users ของงานเดิม
รันไฟล์ seed ซ้ำไม่เขียนทับข้อมูล ID เดิม แต่จะเพิ่ม ID ตัวอย่างที่หายไป จึงไม่ควรรันซ้ำหลังทดสอบลบถ้าไม่ต้องการคืนข้อมูล

## 2. FileZilla: อัปโหลดโค้ด
เชื่อมต่อเซิร์ฟเวอร์ด้วยบัญชีที่อาจารย์ให้ หากใช้ SFTP ปกติเป็น port 22 หรือ port ที่อาจารย์กำหนด ไม่ใช่ 3113
อัปโหลดโฟลเดอร์ Std0251514IPFinal2026 ไปในโฟลเดอร์ส่วนตัวที่ได้รับสิทธิ์บนเซิร์ฟเวอร์
ไม่ต้องอัปโหลด node_modules, dist หรือ .expo
backend ควรอยู่นอกโฟลเดอร์เว็บสาธารณะเพื่อไม่ให้ไฟล์ .env ถูกดาวน์โหลด

## 3. PuTTY: รัน Backend
SSH ไปยังเซิร์ฟเวอร์เดียวกับที่อัปโหลด แล้ว cd ไปโฟลเดอร์ backend โดยใช้ path ที่เห็นใน FileZilla
ตัวอย่าง ถ้าอัปโหลดไว้ใน home:
```bash
cd ~/Std0251514IPFinal2026/backend
node -v
npm install
cp .env.example .env
nano .env
```
แก้ .env ดังนี้:
```dotenv
PORT=3113
STORAGE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ip_std6730251514
DB_USER=std6730251514
DB_PASSWORD="YOUR_DATABASE_PASSWORD"
```
ใส่ชื่อผู้ใช้และรหัสผ่านฐานข้อมูลจริงใน .env เท่านั้น ไม่ต้องส่งรหัสผ่านในแชท
DB_USER ต้องใช้บัญชีฐานข้อมูลที่อาจารย์ให้ ไม่สามารถสรุปว่าเป็นชื่อเดียวกับฐานข้อมูลหรือบัญชี SSH จากภาพได้
DB_HOST=localhost ใช้เมื่อ Node และ MySQL อยู่เครื่องเดียวกัน ถ้าอาจารย์ให้ DB host แยกให้ใช้ค่านั้น
DB_PORT=3306 คือพอร์ต MySQL โดยทั่วไป ส่วน PORT=3113 คือพอร์ต Backend ตามที่กำหนด
nano: กด Ctrl+O, Enter เพื่อบันทึก และ Ctrl+X เพื่อออก
```bash
npm start
```
ต้องเห็น HR API ready on port 3113; storage=mysql
หากเชื่อม DB ผิด server จะหยุดและแจ้งข้อผิดพลาด ไม่สลับไป memory อัตโนมัติ

## 4. ทดสอบใน PuTTY อีก session
```bash
curl -i http://127.0.0.1:3113/api/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"password123"}'
curl -i http://127.0.0.1:3113/api/employees -H 'Authorization: Bearer mock-jwt-token'
curl -i http://127.0.0.1:3113/api/employees/salary-clusters -H 'Authorization: Bearer mock-jwt-token'
```
ข้อมูลเริ่มต้นควรได้ centroid 21500/45000/90000 และ count 2/1/2
เรียก /api/employees โดยไม่มี token ต้องได้ 401 ซึ่งหมายความว่า server รันและบล็อกคำขอได้ตามโจทย์

## 5. Frontend: รันบนคอมพิวเตอร์
เปิด Terminal ใน frontend:
```powershell
npm install
Copy-Item .env.example .env
```
แก้ frontend/.env ให้ชี้ไป hostname/IP ของเครื่องที่รัน Node จริง ตัวอย่างถ้าเป็น nindam.sytes.net:
```dotenv
EXPO_PUBLIC_API_URL=http://nindam.sytes.net:3113
```
ชื่อ nindam.sytes.net มาจาก URL phpMyAdmin ในภาพ แต่ยังไม่ได้ยืนยันว่า Node ใช้ host เดียวกัน ให้เทียบกับ Host ที่ใช้ใน PuTTY
```powershell
npm run web
```
หรือ `npm start` เพื่อเปิดบนมือถือที่รองรับ Expo SDK 54
หลังแก้ .env ให้ restart Expo ด้วย `npx expo start --clear`
ห้ามใส่ /nindamdb หรือ URL ของ phpMyAdmin ลงใน API URL
บัญชีเข้าแอป: admin / password123
หากเว็บ frontend เป็น HTTPS ต้องใช้ API HTTPS ผ่าน reverse proxy ที่เซิร์ฟเวอร์จัดให้ มิฉะนั้นเบราว์เซอร์อาจบล็อก mixed content

## 6. รันต่อเมื่อปิด PuTTY
ถ้าเซิร์ฟเวอร์มี PM2 ให้หยุด npm start ด้วย Ctrl+C ก่อน แล้วใช้:
```bash
pm2 start server.js --name supanut-hr-3113
pm2 logs supanut-hr-3113
pm2 save
```
ถ้าไม่มี PM2 ใช้ npm start ขณะเปิด PuTTY ค้างไว้เพื่อทดสอบก่อน หรือใช้วิธีจัดการ process ที่อาจารย์กำหนด
เมื่อแก้ .env/โค้ด ให้อัปโหลดผ่าน FileZilla แล้ว restart process ของงานนี้เท่านั้น:
```bash
pm2 restart supanut-hr-3113
```
อย่าใช้ pm2 delete all หรือ kill process อื่นในเซิร์ฟเวอร์ร่วมกัน

## 7. ตรวจปัญหา
- EADDRINUSE: port 3113 ถูกใช้อยู่ ตรวจว่ามี instance ของงานนี้รันซ้ำหรือไม่ อย่าปิด process คนอื่น
- Access denied: DB_USER/DB_PASSWORD หรือสิทธิ์ DB ไม่ถูกต้อง
- ECONNREFUSED ของ DB: DB_HOST/DB_PORT ไม่ตรงหรือ MySQL ไม่รับ connection
- Table doesn't exist: รัน SQL ใน ip_std6730251514 และตรวจตัวพิมพ์เล็กใหญ่ของชื่อตาราง
- curl ในเซิร์ฟเวอร์ได้ แต่คอมเข้าไม่ได้: ตรวจ host และขอให้อาจารย์ตรวจ firewall/การเปิด port 3113
- Cannot GET /: ใช้ /api/employees โดยต้องส่ง token; ไม่มีหน้าเว็บที่ root ของ Backend
- npm install ต้องทำใน backend และ frontend แยกกัน ไม่ใช่โฟลเดอร์หลัก

## 8. ฟังก์ชันและการทดสอบ
Login และ protected API, รายชื่อพนักงาน, เพิ่ม, toggle Active/On Leave, ยืนยันลบ, K-Means 3 tiers พร้อม loading
ตรวจข้อมูลช่องว่าง เงินเดือนติดลบ/ไม่ใช่เลข/เกินขอบเขต ทศนิยมไม่เกิน 2 ตำแหน่ง
salary=0 ใช้ได้ กลุ่มว่างมี count=0 centroid=null และแสดง No data
K-Means ใช้ทุกคนรวม On Leave; mutation จะ refresh รายชื่อและล้างผลวิเคราะห์เก่า
ใช้ npm test ใน backend สำหรับทดสอบ in-memory API และ K-Means
หากทดลองแบบไม่เชื่อม DB ให้ตั้ง STORAGE=memory แล้ว restart; ข้อมูลโหมดนี้หายเมื่อ restart
Authentication เป็น mock-jwt-token ตามโจทย์ ไม่ใช่ JWT สำหรับ production
เอกสาร driver: https://sidorares.github.io/node-mysql2/docs/examples/connections/create-pool

## 9. ส่ง GitHub
ใช้ public repository ชื่อ Std0251514IPFinal2026 ตามเลขท้าย 7 หลัก 0251514
```bash
git init
git add .
git commit -m "Complete MySQL HR Manager on port 3113"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Std0251514IPFinal2026.git
git push -u origin main
```
เปลี่ยน YOUR_USERNAME ให้ตรงบัญชี ส่ง URL ใน LMS เอง
.gitignore กัน .env/node_modules แล้ว ห้าม commit รหัส DB จริง
ยังไม่ได้เชื่อมต่อเซิร์ฟเวอร์จริง อัปโหลดผ่าน FileZilla หรือส่ง LMS แทนคุณ

## การตั้งค่าล่าสุด
ใช้ PORT=3113, DB_HOST=localhost, DB_USER=std6730251514, DB_NAME=ip_std6730251514, DB_PORT=3306 ตามที่แจ้ง รหัสผ่านให้ใส่ใน backend/.env บนเซิร์ฟเวอร์เอง
ไม่จำเป็นต้องมี STORAGE เพราะค่าเริ่มต้นเป็น mysql; ถ้ามี STORAGE=memory จากไฟล์เก่าให้ลบหรือเปลี่ยนเป็น mysql
DB_NAME เป็นค่าหลัก; DB_DATABASE รองรับเพื่อให้ไฟล์เก่าใช้ได้ แต่ควรใช้ DB_NAME ตามตัวอย่างใหม่
Frontend ต้องใช้ host จริงของ Backend และพอร์ต 3113 แล้ว restart Expo

## เพิ่มการแก้ไขพนักงาน
ปุ่ม Edit employee เปิดฟอร์มชื่อ ตำแหน่ง เงินเดือน พร้อม Save changes และ Cancel
PUT /api/employees/:id รับ name, position, salary และต้องส่ง Bearer token
ไม่เปลี่ยน ID หรือสถานะ (ใช้ Toggle Status เดิม) บันทึกสำเร็จ refresh รายชื่อและล้างผล K-Means เก่า
ไม่ต้องรัน SQL ใหม่ ใช้ตารางเดิม
อัปเดตเฉพาะ backend/app.js, backend/store.js บนเซิร์ฟเวอร์ แล้ว restart node server.js จาก PuTTY
อัปเดต frontend/App.js บนคอม แล้ว restart Expo ด้วย npx expo start --web --clear
เก็บ .env จริงทั้งสองฝั่งไว้ตามเดิม โดย API URL ต้องชี้ไป http://119.59.102.161:3113

## Corporate HR UI — Horizon HR
หน้าตาใหม่เป็น Horizon HR / Supanut workspace โทนครีมและเขียว มีเมนู Overview, Employees, Salary analytics
- Overview แสดงจำนวนพนักงาน Active/On Leave ผลรวมเงินเดือนฐานต่อเดือน ค่าเฉลี่ย ต่ำสุด สูงสุด จากข้อมูลจริงที่โหลด
- Employees ค้นหาชื่อ/ตำแหน่ง กรองสถานะ เรียงชื่อ/เงินเดือน และแบ่งหน้าละ 8 คน
- Add employee / Edit เปิดฟอร์มแยกพร้อม validation; Delete ต้องยืนยัน; Set leave / Activate เปลี่ยนสถานะ
- Salary analytics ใช้ API K-Means เดิม แสดง 3 tiers พร้อม loading และสัดส่วนจำนวนคน
- Responsive sidebar บน desktop และเมนูแนวนอนบนมือถือ
- Login มีปุ่มแสดง/ซ่อนรหัสผ่าน บัญชีทดสอบยังเป็น admin / password123
ใช้ frontend/App.js ใหม่แทนของเดิมบนคอมพิวเตอร์และเก็บ frontend/.env จริงไว้ ค่า URL คือ http://119.59.102.161:3113
ถ้าอัปเดต backend/app.js กับ backend/store.js ที่รองรับ Edit ไปแล้ว ไม่ต้องอัปโหลด Backend ใหม่สำหรับการเปลี่ยน UI นี้
ไม่ต้องแก้ schema หรือรัน SQL ใหม่
ข้อมูลเงินเดือนใน Dashboard เป็นเงินเดือนฐาน ไม่รวมภาษี OT โบนัสหรือเงินเดือนสุทธิ ระบบนี้ยังไม่รวมระบบ payroll, สิทธิ์หลายระดับ หรืออนุมัติการลาแบบ production


## การจัดการรหัสพนักงานอัตโนมัติ (ID)

- ระบบใช้ ID ตัวเลขเรียงต่อกันตั้งแต่ 1 เป็นต้นไป
- เมื่อเพิ่มพนักงานใหม่ ระบบกำหนดเลขถัดไปให้อัตโนมัติ
- เมื่อลบพนักงาน ระบบจะเรียง ID ของรายการที่เหลือใหม่ให้ต่อเนื่องโดยไม่มีช่องว่าง
- เมื่อเริ่ม Backend ระบบจะปรับ ID เดิมที่เป็น UUID หรือมีเลขขาด ให้เป็นเลขเรียงต่อกัน โดยรักษาลำดับ ID ตัวเลขเดิมก่อน แล้วตามด้วยรายการที่มี ID แบบอื่น
- เนื่องจาก ID อาจเปลี่ยนหลังลบพนักงาน จึงไม่ควรนำ ID นี้ไปใช้อ้างอิงจากตารางอื่นโดยตรง หากภายหลังมีตารางที่เชื่อมโยงกัน ควรใช้รหัสถาวรแยกต่างหาก

### การเชื่อมต่อ Frontend กับ Backend

ค่าเริ่มต้นของ Frontend คือ `http://localhost:3113` เพื่อให้ตรงกับพอร์ต Backend ที่กำหนดไว้ใน `backend/server.js` หาก Backend อยู่บนเครื่องหรือเซิร์ฟเวอร์อื่น ให้กำหนด `EXPO_PUBLIC_API_URL` ในไฟล์ `.env` ของ Frontend เป็น URL ที่เข้าถึงได้จริง แล้วเริ่ม Frontend ใหม่


## แก้ปัญหา Endpoint not found (อัปเดต 20 ต.ค. 2026)

- Backend มี `GET /api/health` สำหรับตรวจว่าเซิร์ฟเวอร์เป็นเวอร์ชันใหม่ โดยควรตอบ JSON ที่มี `version: 2026-10-20-edit-route-fix`
- การแก้ไขพนักงานรองรับ `PUT`, `PATCH` และ `POST` ที่ `/api/employees/:id` เพื่อความเข้ากันได้กับ proxy/Frontend เก่า
- ถ้ายังเห็น `Endpoint not found` ให้แทนที่โฟลเดอร์ `backend` บนเครื่อง/เซิร์ฟเวอร์ที่พอร์ต 3113 ด้วยโฟลเดอร์ `backend` จาก ZIP นี้ แล้ว restart backend จริง จากนั้นเปิด `http://localhost:3113/api/health` (หรือ host ที่ Frontend ใช้) ตรวจเวอร์ชัน
- การเปลี่ยนเฉพาะ Frontend ไม่สามารถเพิ่ม Route ให้ Backend ที่ยังรันโค้ดเก่าได้ ต้อง deploy/restart Backend ด้วย


## แก้ไขปุ่ม Set leave / Activate และ Edit

Frontend ตั้งค่า API เริ่มต้นไปที่ `http://119.59.102.161:3113` แล้ว เพื่อให้หน้าเว็บที่เปิดจากเครื่องผู้ใช้เรียก Backend บนเซิร์ฟเวอร์ได้ ไม่เรียก `localhost:3113` ของเครื่องผู้ใช้เอง

หาก Backend เปลี่ยน IP หรือโดเมน ให้กำหนด `EXPO_PUBLIC_API_URL` ในไฟล์ `.env` ของ frontend ให้ตรงกับ URL ของ Backend แล้ว build/เริ่ม Frontend ใหม่ ตัวอย่าง:
`EXPO_PUBLIC_API_URL=http://119.59.102.161:3113`

หลังอัปโหลด Frontend เวอร์ชันนี้แล้ว ให้รีสตาร์ต/rebuild Frontend และตรวจว่า Backend บนเซิร์ฟเวอร์ใช้ `backend/app.js` ที่มี route `PUT /api/employees/:id/status` และ `PUT /api/employees/:id` อยู่จริง
