# 📝 Yeni Özellikler Test Rehberi

Projeye eklenen yeni özellikleri test etmek için bu rehberi takip edin.

## ✅ Kurulum Adımları

```bash
# 1. Proje dizinine geç
cd c:\Users\omer_\Desktop\movie-project-react-component-drilling

# 2. Bağımlılıkları yükle (ilk kez)
npm install

# 3. Geliştirme sunucusunu başlat
npm start

# Tarayıcı otomatik olarak http://localhost:3000 adresini açacaktır
```

## 🎬 Test Senaryoları

### 1. **Ana Sayfa - Film Listesi Görüntüleme**
- ✅ **Beklenti:** 5 film kartı görüntülenir
- ✅ **Kontrol Noktaları:**
  - Her kartta film adı, poster, özet görüntülenir
  - Puan rozetleri renkli (yeşil/turuncu/kırmızı)
  - Tür etiketi görüntülenir (🎬 Aksiyon, vb)
  - Yıl bilgisi gösterilir

**Test Adımları:**
1. Uygulamayı başlat
2. Ana sayfa yüklendiğinde film kartlarını görün
3. Tüm filmlerin detaylarının doğru görüntülendiğini kontrol edin

---

### 2. **Film Arama (Search)**
- ✅ **Beklenti:** Yazılan metne göre film filtreleme
- ✅ **Kontrol Noktaları:**
  - Arama çubuğuna "Inception" yazıldığında sadece o film gösterilir
  - Arama yapıldığında geçmiş arama kayıt edilir
  - Temizle (✕) butonu çalışır

**Test Adımları:**
1. Arama çubuğuna "Dark" yaz
2. Sadece "The Dark Knight" görünür olmalı
3. Temizle butonuna tıkla
4. Tüm filmler geri döner
5. Arama çubuğunu boşalt ve odağı kaldır
6. En son aramalar dropdown'da görünür

---

### 3. **Gelişmiş Filtreler (Advanced Filters)**
- ✅ **Beklenti:** Yıl, Tür ve Puan bazlı filtreleme
- ✅ **Kontrol Noktaları:**
  - "Gelişmiş Filtreler" linkine tıklandığında panel açılır
  - Yıl seçimi çalışır
  - Tür dropdown'ı çalışır
  - Min puan seçimi çalışır
  - Filtreler birlikte çalışır

**Test Adımları:**
1. "Gelişmiş Filtreler" linkine tıkla
2. Yıl: 2023 seç → Sadece 2023 yılı filmleri gösterilir
3. Yıl: Temizle
4. Tür: "Aksiyon" seç → Sadece aksiyon filmleri gösterilir
5. Min Puan: 8.0 gir → Puan 8.0+ olan filmleri gösterilir
6. Tür: "Drama" seç (Aksiyon seçerken) → Her iki filtrenin kesişimi gösterilir

---

### 4. **Sıralama (Sorting)**
- ✅ **Beklenti:** Film listesini farklı kriterlere göre sıralama
- ✅ **Kontrol Noktaları:**
  - İsim sıralaması A→Z ve Z→A
  - Puan sıralaması düşük→yüksek ve yüksek→düşük
  - Yıl sıralaması eski→yeni ve yeni→eski
  - Aktif düğme vurgulanır

**Test Adımları:**
1. "İsim ↑" butonuna tıkla → Filmler alfabetik sıralanır
2. "İsim ↓" butonuna tıkla → Ters alfabetik sırası
3. "Puan ↑" butonuna tıkla → En düşük puandan en yükseğe
4. "Puan ↓" butonuna tıkla → En yüksek puandan en düşüğe
5. "Yıl ↑" butonuna tıkla → Eski filmlerden yenilere
6. Aynı butona 2 kez tıkla → Sıra tersine döner

---

### 5. **Yeni Film Ekleme**
- ✅ **Beklenti:** Yeni film formu doldurulup kaydedilir
- ✅ **Kontrol Noktaları:**
  - "/add" sayfası açılır
  - Tüm alan zorunludur (validation)
  - Film başarıyla kaydedilir
  - Listede görüntülenir

**Test Adımları:**
1. "➕ Yeni Film" butonuna tıkla
2. Form sayfası açılmalı
3. Formu doldurmadan Submit'e tıkla → "Lütfen tüm alanları doldurunuz" uyarısı
4. Formu tamamen doldur:
   - Filmin Adı: "Test Film"
   - Puan: "7.5"
   - Yıl: "2024"
   - Tür: "Komedi"
   - Poster URL: "https://via.placeholder.com/300x400"
   - Özet: "Harika bir test filmi"
5. "Filmi Ekle" butonuna tıkla
6. "Film Başarıyla Eklendi" mesajı
7. Ana sayfaya dön
8. Yeni film listede görünür

---

### 6. **Film Detay Sayfası**
- ✅ **Beklenti:** Filme tıklandığında detay sayfası açılır
- ✅ **Kontrol Noktaları:**
  - Tüm film bilgileri görüntülenir
  - Büyük poster gösterilir
  - Puan renkli gösterilir
  - Düzenle butonu vardır
  - Sil butonu vardır

**Test Adımları:**
1. Herhangi bir film kartında "Detay" butonuna tıkla
2. Film detay sayfası açılmalı
3. Film adı, puan, yıl, tür, özet görüntülenir
4. Geri Dön butonuna tıkla → Ana sayfaya dön
5. Başka bir film için detay sayfasını kontrol et

---

### 7. **Film Düzenleme (Edit)**
- ✅ **Beklenti:** Film bilgileri düzenlenir ve güncellenir
- ✅ **Kontrol Noktaları:**
  - Düzenle sayfası açılır
  - Mevcut veriler form'da önceden doldurulmuştur
  - Poster ön izlemesi görüntülenir
  - Değişiklikler kaydedilir

**Test Adımları:**
1. Film kartında "Düzenle" butonuna tıkla
2. Düzenle sayfası açılmalı
3. Mevcut film verilerinin form'da olduğunu kontrol et
4. Filmin adını değiştir (örn: "Test Film - Güncellenmiş")
5. Puanı değiştir (örn: 8.0)
6. "Filmi Güncelle" butonuna tıkla
7. "Film Başarıyla Güncellendi" mesajı
8. Ana sayfada değişiklikleri kontrol et

---

### 8. **Film Silme**
- ✅ **Beklenti:** Film silinir ve listeden kaldırılır
- ✅ **Kontrol Noktaları:**
  - Silme öncesi onay diyaloğu
  - Onaylandığında film silinir
  - İptal edilebilir

**Test Adımları:**
1. Herhangi bir film kartında "Sil" butonuna tıkla
2. Onay diyaloğu: "Bu filmi silmek istediğinizden emin misiniz?"
3. "Tamam" düğmesine tıkla
4. "Film Silindi" mesajı
5. Film listeden kaldırılmalı
6. Başka bir filmi silmeyi dene fakat "İptal"i seç → Film silinmez

---

### 9. **Responsive Tasarım (Mobil)**
- ✅ **Beklenti:** Uygulama tüm ekran boyutlarında çalışır
- ✅ **Kontrol Noktaları:**
  - Mobil görünümde 1 sütun
  - Tablet görünümde 2-3 sütun
  - Desktop görünümde 3 sütun
  - Tüm butonlar tıklanabilir kalır

**Test Adımları:**
1. Tarayıcı geliştirici araçlarını aç (F12)
2. Cihaz simülasyonunu aç (mobil, tablet, desktop)
3. Düzeni kontrol et ve kes kütlüğü et
4. Tüm etkileşimlerin çalıştığını doğrula

---

### 10. **En Çok Aranan Filmler**
- ✅ **Beklenti:** Sık aranan filmler gösterilir
- ✅ **Kontrol Noktaları:**
  - İlk 5 arama kayıt edilir
  - Tekrar edilen aramalar sayılır
  - Butonlar tıklanabilir ve arama yapılır

**Test Adımları:**
1. Arama çubuğuna "Dark" yaz ve Enter'e bas
2. "Dark" arama geçmişine eklenir
3. "Dark" 5 kez daha ara
4. "En Çok Aranan" bölümünde "Dark (5)" görünür
5. Bu butona tıkla → Arama çubuğu "Dark" ile doldurulur

---

## 🔗 Quick Links

| Özellik | URL | Butonu |
|---------|-----|--------|
| Ana Sayfa | `/` | Geri Dön |
| Yeni Film | `/add` | ➕ Yeni Film |
| Film Detay | `/movie/:id` | Detay |
| Film Düzenle | `/edit/:id` | Düzenle |

---

## 🐛 Sorun Giderme

### Sayfada hiçbir dönem görüntülenmiyor?
- **Çözüm:** Tarayıcı konsolunda hata var mı kontrol et (F12)
- Backend'in çalıştığını doğrula
- http://localhost:3000/api/movies ulaşılabilir mi test et

### Form submit edilmiyor?
- **Çözüm:** Tüm zorunlu alanları doldur
- Puan 0-10 arasında mı kontrol et
- Konsolu kontrol et

### Filtreler çalışmıyor?
- **Çözüm:** "Gelişmiş Filtreler" açılmış mı kontrol et
- Sayfayı yenile (F5)
- LocalStorage temizle (DevTools > Application)

---

## 📊 Beklenen Sonuçlar Özeti

✅ **5 Test Yaptı** = Başarılı başlangıç
✅ **10 Test Yaptı** = Tüm özellikler çalışıyor
✅ **Tüm testler geçti** = Proje hazır!

---

**Son Güncelleme:** Şubat 2026
