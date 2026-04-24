# 🚀 YKS Mikro Analiz & Yapay Zeka Koçluk Platformu

Bu proje, Yükseköğretim Kurumları Sınavı'na (YKS) hazırlanan öğrenciler için geliştirilmiş, **Yerel Yapay Zeka (Ollama - Llama 3)** tarafından desteklenen, tamamen çevrimdışı ve gizlilik odaklı bir gelişim takip ve analiz platformudur.

## 🎯 Özellikler

- **Çoklu Profil Yönetimi:** Farklı öğrencilerin oturum açıp kendi gelişimlerini takip edebilmesi (`localStorage` tabanlı, veritabanı gerektirmez).
- **Detaylı Net Girişi:** TYT ve AYT (Sayısal, Eşit Ağırlık, Sözel) için ondalıklı (ör. 22.75) ve negatif (eksi) net destekli mikro veri girişi.
- **Akıllı Prompting Sistemi:** Öğrenci bir dersi fullediğinde (örn: Kimya 13/13) AI'ın gereksiz çalışma tavsiyesi vermesini engelleyen, sadece eksiklere odaklanan zeki algoritma.
- **Hedef ve Üniversite Simülasyonu:** Öğrencinin netlerine ve seçtiği alana göre gerçekçi üniversite/bölüm tavsiyeleri ve geçmiş yıl taban netleri.
- **Görsel Gelişim Grafikleri:** `Recharts` kütüphanesi ile zaman içindeki TYT ve AYT net artış/azalışlarını gösteren interaktif grafikler.
- **Tarihsel Analiz:** Yapay zekanın sadece son denemeyi değil, öğrencinin tüm geçmiş denemelerini hafızasında tutarak zaman eksenli analiz yapabilmesi.

---

## 📁 Proje Yapısı

Proje, yeni nesil Next.js 14 (App Router) mimarisi ile tek parça halinde inşa edilmiştir.

```text
yks-yapay-zeka-kocu/
├── app/
│   ├── page.tsx       # Ana uygulama mantığı, UI, Grafik ve AI entegrasyonu
│   ├── globals.css    # Tailwind CSS global stilleri
│   └── layout.tsx     # Next.js kök düzeni
├── public/            # Statik dosyalar
├── package.json       # Proje paketler (Recharts vb.)
└── README.md          # Proje dokümantasyonu




KURULUM
Sistemin "Beyni" yerel bilgisayarınızda çalıştığı için hem projenin hem de Ollama'nın kurulu olması gerekmektedir.

1. Yapay Zeka (Ollama) Kurulumu
Ollama.com adresinden uygulamayı indirin ve kurun.

Terminali açın ve dil modelini indirmek için şu komutu çalıştırın:

Bash
ollama run llama3
(Not: Bu işlem model bilgisayarınıza inene kadar arka planda çalışmalıdır.)

2. Proje (Frontend) Kurulumu
VS Code veya tercih ettiğiniz bir IDE'de projenin ana dizininde terminali açın:

Bash
# Paketleri yükleyin (Recharts ve Next.js paketleri)
npm install

# Geliştirme sunucusunu başlatın
npm run dev
Uygulama http://localhost:3000 adresinde çalışmaya başlayacaktır.




KULLANIM
Sisteme Giriş: Ana sayfadan yeni bir isim girerek kayıt olun veya mevcut bir profili seçin.

Deneme Girişi: TYT ve AYT (alan seçerek) netlerinizi ondalıklı veya eksi puanlar dahil olacak şekilde detaylıca girin.

Analiz İsteme: "Kaydet ve Analiz İste" butonuna tıklayarak Ollama Llama-3 modeline verilerinizi gönderin.

Sonuçları İnceleme: - Sağ altta yer alan yapay zeka tavsiyelerini okuyun.

Ekrandaki interaktif grafik (Line Chart) üzerinden geçmiş gelişiminizi inceleyin.







Ollama AI Entegrasyonu
Projede harici bir API key (Google, OpenAI vb.) yerine güvenlik ve sürdürülebilirlik amacıyla Local LLM kullanılmıştır. Uygulama, app/page.tsx içinden doğrudan bilgisayarın yerel portuna istek atar:

// Localhost üzerinden Ollama API'sine doğrudan bağlantı
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    model: "llama3", 
    prompt: prompt, // Özel yapılandırılmış koçluk komutu
    stream: false 
  }),
});




GÜVENLİK VE VERİ SAKLAMA
%100 Gizlilik: Yapay zeka sorguları tamamen bilgisayarınızın içinde (offline) gerçekleşir. Öğrenci verileri hiçbir harici bulut sunucusuna gönderilmez.

Local Storage Yapısı: Kullanıcı profilleri ve deneme geçmişleri tarayıcının localStorage alanında JSON formatında tutulur. Veritabanı sızıntısı riski yoktur.



PAKETLER
next: React framework'ü (v14+)

react / react-dom: Kullanıcı arayüzü kütüphanesi

tailwindcss: Hızlı ve modern CSS iskeleti

recharts: Gelişim grafikleri için veri görselleştirme kütüphanesi.

