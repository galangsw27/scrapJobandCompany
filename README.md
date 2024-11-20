
```markdown
# Web Scraping Automation with Playwright 🚀

Proyek ini adalah automasi web scraping menggunakan [Playwright](https://playwright.dev). Proyek ini mendukung scraping data pekerjaan dan informasi perusahaan dengan eksekusi yang cepat dan akurat.

## 📋 Fitur
- **Scrap Job**: Mengambil data lowongan pekerjaan dari website tertentu.
- **Scrap Company**: Mengambil informasi perusahaan dari website tertentu.
- Mendukung **Chrome Debugging** untuk kemudahan pengembangan.

---

## 🛠️ Instalasi

1. **Clone repositori ini**:
   ```bash
   git clone https://github.com/username/repository-name.git
   cd repository-name
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Instal Playwright**:
   ```bash
   npm install playwright
   ```

4. **Konfigurasi Chrome Debugging**:
   Buka PowerShell dan jalankan perintah berikut:
   ```powershell
   "C:\[Your Chrome Path]\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\ChromeDevSession"
   ```
   **Catatan**: Ganti `[Your Chrome Path]` dengan lokasi Chrome di sistem Anda, contoh:
   `C:\Program Files\Google\Chrome\Application\`.

---

## 🚀 Menjalankan Script

1. **Scrap Job**: Untuk scraping data lowongan pekerjaan, jalankan:
   ```bash
   npx test tests\scrapJobSearch.spec.ts
   ```

2. **Scrap Company**: Untuk scraping data perusahaan, jalankan:
   ```bash
   npx test tests\scrapCompany.spec.ts
   ```

---

## 📂 Struktur Proyek

```plaintext
.
├── tests
│   ├── scrapJobSearch.spec.ts     # Script untuk scraping job
│   ├── scrapCompany.spec.ts       # Script untuk scraping company
├── package.json                   # Dependensi dan skrip npm
└── README.md                      # Dokumentasi proyek
```

---

## 📑 Catatan Penting
- Pastikan Anda memiliki **Google Chrome** versi terbaru.
- Simpan data debugging pada direktori yang tidak digunakan untuk profil browser utama Anda.

---

## 🤝 Kontribusi
Kami menyambut kontribusi untuk meningkatkan proyek ini! Silakan buat pull request atau buka issue untuk ide dan perbaikan.

---

## 📞 Kontak
Jika Anda memiliki pertanyaan atau butuh bantuan, silakan hubungi:
- Email: yourname@example.com
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourname)

---

## 📝 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

```

### Penyesuaian:
1. Ganti `username/repository-name` dengan nama repositori Anda.
2. Tambahkan email dan tautan LinkedIn Anda di bagian kontak.
3. Jika ada lisensi khusus, sesuaikan bagian lisensi.
