export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2C2416] via-[#3D3224] to-[#4A3E2D] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Məxfilik Siyasəti</h1>
          <p className="text-lg text-[#E5DDD5]">
            Son yenilənmə: 30 İyun 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">1. Məlumat Toplama</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              BronEv platforması olaraq, sizin məxfiliyiniz bizim üçün çox vacibdir. Biz aşağıdakı məlumatları toplayırıq:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F]">
              <li>Ad, soyad və əlaqə məlumatları (telefon, email)</li>
              <li>Bron etmək istədiyiniz tarixlər və qonaq sayı</li>
              <li>IP ünvanı və brauzer məlumatları (təhlükəsizlik məqsədilə)</li>
              <li>Çerezler vasitəsilə sayt istifadəsi məlumatları</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">2. Məlumatların İstifadəsi</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              Topladığımız məlumatları aşağıdakı məqsədlər üçün istifadə edirik:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F]">
              <li>Bron sifarişlərinizi emal etmək və təsdiqləmək</li>
              <li>Sizinlə əlaqə saxlamaq və dəstək göstərmək</li>
              <li>Saytın performansını təkmilləşdirmək</li>
              <li>Qanuni öhdəliklərimizi yerinə yetirmək</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">3. Məlumat Təhlükəsizliyi</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              Şəxsi məlumatlarınızı qorumaq üçün müasir texnoloji və təşkilati tədbirlər görürük. 
              Məlumatlarınız SSL şifrələməsi ilə qorunur və yalnız səlahiyyətli işçilər tərəfindən əldə edilə bilər.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">4. Çerezlər (Cookies)</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              Saytımız çerezlərdən istifadə edir ki:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F]">
              <li>Sizin seçimlərinizi yadda saxlasın (dil, favoritlər)</li>
              <li>Sayt statistikasını toplayaq (Google Analytics)</li>
              <li>Reklamları fərdiləşdirək (Google AdSense)</li>
            </ul>
            <p className="text-[#6B5D4F] leading-relaxed mt-4">
              Brauzer ayarlarınızdan çerezləri söndürə bilərsiniz, lakin bu bəzi funksiyaların işləməməsinə səbəb ola bilər.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">5. Üçüncü Tərəf Xidmətləri</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              Saytımız aşağıdakı üçüncü tərəf xidmətlərindən istifadə edir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F]">
              <li><strong>Google Analytics</strong> — Sayt statistikası</li>
              <li><strong>Google AdSense</strong> — Reklam göstərilməsi</li>
              <li><strong>Cloudinary</strong> — Şəkil hostinqi</li>
              <li><strong>WhatsApp Business</strong> — Müraciətlərin idarə edilməsi</li>
            </ul>
            <p className="text-[#6B5D4F] leading-relaxed mt-4">
              Bu xidmətlərin öz məxfilik siyasətləri var və biz onların təhlükəsizliyinə görə məsuliyyət daşımırıq.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">6. Məlumat Paylaşımı</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              Biz şəxsi məlumatlarınızı üçüncü tərəflərə <strong>satmırıq</strong>. 
              Məlumatlar yalnız qanuni tələblər (məhkəmə qərarı) və ya xidmət təminatçıları 
              (hosting, ödəniş sistemləri) ilə məhdud şəkildə paylaşıla bilər.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">7. Sizin Hüquqlarınız</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              Siz istənilən vaxt:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F]">
              <li>Haqqınızda topladığımız məlumatları soruşa bilərsiniz</li>
              <li>Məlumatlarınızın düzəldilməsini və ya silinməsini tələb edə bilərsiniz</li>
              <li>Marketinq məktublarından imtina edə bilərsiniz</li>
            </ul>
            <p className="text-[#6B5D4F] leading-relaxed mt-4">
              Bu hüquqlardan istifadə etmək üçün bizimlə əlaqə saxlayın.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">8. Uşaqların Məxfiliyi</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              Xidmətlərimiz 18 yaşdan yuxarı şəxslər üçün nəzərdə tutulub. 
              Biz bilərəkdən 18 yaşdan aşağı şəxslərin məlumatlarını toplamırıq.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">9. Əlaqə</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              Məxfilik siyasəti ilə bağlı suallarınız varsa, bizimlə əlaqə saxlayın:
            </p>
            <ul className="space-y-2 text-[#6B5D4F]">
              <li><strong>Email:</strong> info@bron-ev.com</li>
              <li><strong>Telefon:</strong> +994 XX XXX XX XX</li>
              <li><strong>WhatsApp:</strong> +994 XX XXX XX XX</li>
            </ul>
          </section>

          <section className="border-t border-[#E5DDD5] pt-8">
            <p className="text-sm text-[#8B7355]">
              Bu məxfilik siyasətini vaxtaşırı yeniləyə bilərik. Əhəmiyyətli dəyişikliklər olduqda, 
              saytda bildiriş yerləşdirəcəyik. Saytdan istifadə etməyə davam etməklə, 
              yenilənmiş məxfilik siyasətini qəbul etmiş olursunuz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
