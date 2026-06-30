export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2C2416] via-[#3D3224] to-[#4A3E2D] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">İstifadə Şərtləri</h1>
          <p className="text-lg text-[#E5DDD5]">
            Son yenilənmə: 30 İyun 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">1. Xidmətə Dair Ümumi Məlumat</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              BronEv platforması Azərbaycanda günlük kirayə evlərin (villa, mənzil, kottec və s.) 
              axtarışını və bronunu asanlaşdıran onlayn xidmətdir. Saytdan istifadə etməklə, 
              bu istifadə şərtlərini qəbul etmiş olursunuz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">2. Hesab və İstifadəçi Məsuliyyəti</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              Saytdan istifadə edən zaman siz öhdəsinə götürürsünüz ki:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F]">
              <li>Verdiyiniz məlumatlar düzgün və aktualdır</li>
              <li>18 yaşınız tamam olub və qanuni əməliyyə imza atmaq səlahiyyətiniz var</li>
              <li>Platformadan yalnız qanuni məqsədlər üçün istifadə edəcəksiniz</li>
              <li>Başqasının hesabından icazəsiz istifadə etməyəcəksiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">3. Bron Prosesi</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>3.1. Bron Sorğusu:</strong> Saytda əmlak seçərək bron tələbi göndərdikdə, 
              bu yalnız sorğu deməkdir. Bron mülk sahibi tərəfindən təsdiqlənənə qədər qəti deyil.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>3.2. Təsdiq:</strong> Mülk sahibi və ya BronEv komandası WhatsApp və ya telefon vasitəsilə 
              sizinlə əlaqə saxlayacaq və tarix/qiymət təfərrüatlarını dəqiqləşdirəcək.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>3.3. Ödəniş:</strong> Ödəniş şərtləri (depozit, tam ödəniş) mülk sahibi ilə razılaşdırılır. 
              BronEv ödəniş vasitəçisi deyil, yalnız əlaqələndirmə platformasıdır.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed">
              <strong>3.4. Ləğvetmə:</strong> Bronun ləğvi şərtləri hər mülk üçün fərqlidir. 
              Ləğvetmə qaydalarını mülk sahibi ilə əvvəlcədən dəqiqləşdirin.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">4. Qiymətlər və Ödənişlər</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>4.1. Qiymətlərin Dəyişməsi:</strong> Saytda göstərilən qiymətlər standart/baza qiymətlərdir. 
              Həftəsonları, bayram günləri və tətil mövsümündə qiymətlər dəyişə bilər.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>4.2. Əlavə Ödənişlər:</strong> Bəzi mülklərdə əlavə təmizlik haqqı, 
              depozit və ya kommunal ödənişlər tələb oluna bilər.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed">
              <strong>4.3. BronEv Komissiyası:</strong> Platform hal-hazırda istifadəçilərdən komisyon tutmur. 
              Xidmət tamamilə pulsuzdur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">5. Mülk Sahiblərinin Məsuliyyəti</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              Mülk sahibləri öhdəsinə götürür ki:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F]">
              <li>Yerləşdirdikləri məlumat və şəkillər doğru və aktualdır</li>
              <li>Təsvir edilən bütün imkanlar (hovuz, barbeku, Wi-Fi və s.) əlçatandır</li>
              <li>Mülk təmiz və yaşayış üçün yararlıdır</li>
              <li>Qonaqları hörmətlə qarşılayacaq və razılaşdırılmış şərtlərə riayət edəcəklər</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">6. Məsuliyyətin Məhdudlaşdırılması</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>6.1. BronEv vasitəçidir:</strong> Biz mülk sahibləri və kirayəçilər arasında əlaqə yaradırıq. 
              Mülkün keyfiyyəti, təmizliyi, təhlükəsizliyi və ya xidmət səviyyəsinə görə məsuliyyət daşımırıq.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>6.2. Zərər və itkilər:</strong> BronEv heç bir halda mülkdə baş verən 
              hadisələr (oğurluq, zədə, xəsarət) üçün məsuliyyət daşımır.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed">
              <strong>6.3. Üçüncü tərəf linklər:</strong> Saytımızda üçüncü tərəf veb-saytlara 
              (Google Maps, WhatsApp və s.) keçidlər ola bilər. Bu saytların məzmunu üçün məsuliyyət daşımırıq.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">7. Əqli Mülkiyyət Hüquqları</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              BronEv brendi, loqosu, dizaynı və sayt məzmunu müəlliflik hüququ ilə qorunur. 
              İcazəsiz surətdəçıxarma, yenidən paylaşma və ya kommersiya məqsədləri üçün istifadə qadağandır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">8. Rəylər və Şikayətlər</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              <strong>8.1. Rəy Yazma:</strong> İstifadəçilər qaldıqları mülklər haqqında rəy yaza bilərlər. 
              Rəylər şəxsi təcrübəyə əsaslanmalı və kobud ifadələr ehtiva etməməlidir.
            </p>
            <p className="text-[#6B5D4F] leading-relaxed">
              <strong>8.2. Şikayət:</strong> Mülk sahibi və ya xidmətlə bağlı şikayətləriniz varsa, 
              24 saat ərzində bizimlə əlaqə saxlayın. Problemi həll etmək üçün əlimizdən gələni edəcəyik.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">9. Hesabın Dayandırılması</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              BronEv aşağıdakı hallarda hesabınızı dayandırmaq və ya silmək hüququna malikdir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B5D4F] mt-4">
              <li>İstifadə şərtlərinin pozulması</li>
              <li>Yalançı məlumat vermə</li>
              <li>Digər istifadəçilərə zərər vuran davranış</li>
              <li>Qanunvericiliyi pozan fəaliyyət</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">10. Dəyişikliklər</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              BronEv istifadə şərtlərini istənilən vaxt dəyişdirmək hüququna malikdir. 
              Dəyişikliklər saytda dərc edildikdən sonra qüvvəyə minir. Saytdan istifadə etməyə davam etməklə, 
              yenilənmiş şərtləri qəbul etmiş olursunuz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">11. Qanunvericilik</h2>
            <p className="text-[#6B5D4F] leading-relaxed">
              Bu şərtlər Azərbaycan Respublikasının qanunvericiliyinə uyğun tənzimlənir. 
              Mübahisələr danışıqlar yolu ilə həll edilməlidir. Razılığa gəlinmədiyi halda, 
              Azərbaycan məhkəmələri səlahiyyətlidir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2C2416] mb-4">12. Əlaqə Məlumatları</h2>
            <p className="text-[#6B5D4F] leading-relaxed mb-4">
              İstifadə şərtləri ilə bağlı suallarınız varsa, bizimlə əlaqə saxlayın:
            </p>
            <ul className="space-y-2 text-[#6B5D4F]">
              <li><strong>Email:</strong> info@bron-ev.com</li>
              <li><strong>Telefon:</strong> +994 XX XXX XX XX</li>
              <li><strong>WhatsApp:</strong> +994 XX XXX XX XX</li>
              <li><strong>Ünvan:</strong> Bakı, Azərbaycan</li>
            </ul>
          </section>

          <section className="border-t border-[#E5DDD5] pt-8">
            <p className="text-sm text-[#8B7355]">
              Bu istifadə şərtlərini oxuduğunuza və qəbul etdiyinizə görə təşəkkür edirik. 
              Suallarınız və ya təklifləriniz varsa, bizimlə əlaqə saxlamaqdan çəkinməyin!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
