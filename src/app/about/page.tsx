import { FaHome, FaHeart, FaShieldAlt, FaUsers, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#2C2416] via-[#3D3224] to-[#4A3E2D] text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Haqqımızda</h1>
          <p className="text-xl md:text-2xl text-[#E5DDD5] max-w-3xl mx-auto">
            Azərbaycanda günlük kirayə evlərin axtarışını asanlaşdıran, 
            etibarlı və müasir platforma
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-6 text-center">
            Bizim Missiyamız
          </h2>
          <p className="text-lg text-[#6B5D4F] leading-relaxed text-center max-w-4xl mx-auto">
            BronEv platforması olaraq məqsədimiz Azərbaycanda istirahət və turizm sənayesini 
            inkişaf etdirməkdir. Biz mülk sahibləri və kirayəçilər arasında təhlükəsiz, 
            şəffaf və rahat əlaqə yaratmağa çalışırıq. Hər kəsin rahatlıqla arzusundakı 
            evi taparaq unudulmaz xatirələr yaratmasına kömək edirik.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHome className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2416] mb-3">Geniş Seçim</h3>
            <p className="text-[#6B5D4F]">
              Bakı, Qəbələ, Şəki və digər şəhərlərdə yüzlərlə villa, mənzil və kottec
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2416] mb-3">Təhlükəsizlik</h3>
            <p className="text-[#6B5D4F]">
              Bütün mülklər yoxlanılır və təsdiqlənir. Məxfilik və təhlükəsizlik prioritetdir
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2416] mb-3">Şəffaflıq</h3>
            <p className="text-[#6B5D4F]">
              Qiymətlər və şərtlər aydın göstərilir. Gizli ödəniş və ya komissiya yoxdur
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2416] mb-3">24/7 Dəstək</h3>
            <p className="text-[#6B5D4F]">
              Komandamız hər zaman sizə kömək etməyə hazırdır. WhatsApp və telefon dəstəyi
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-2xl shadow-xl p-8 md:p-12 text-white mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Bizim Hekayəmiz</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed">
            <p>
              BronEv layihəsi 2024-cü ildə Azərbaycanda günlük kirayə bazar sahəsində 
              mövcud problemləri həll etmək məqsədilə yaradıldı. Biz gördük ki, insanlar 
              villa və mənzil axtararkən çətinlik çəkir, qiymətlər qeyri-şəffaf olur və 
              etibarlı platformalar yoxdur.
            </p>
            <p>
              Müasir texnologiyalar və istifadəçi dostu dizayn ilə biz bu problemləri aradan qaldırmaq istədik. 
              Məqsədimiz sadədir — hər kəs bir neçə kliklə arzuladığı evi tapsın və istirahət etsin.
            </p>
            <p>
              Bu gün BronEv Azərbaycanın ən böyük günlük kirayə platformalarından birinə çevrilib. 
              Minlərlə istifadəçi bizə etibar edir və hər gün yeni mülklər əlavə olunur.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-6">Komandamız</h2>
          <p className="text-lg text-[#6B5D4F] max-w-3xl mx-auto mb-12">
            BronEv komandası gənc, dinamik və müştəri məmnuniyyətinə sadiq mütəxəssislərdən ibarətdir. 
            Biz hər gün platformamızı təkmilləşdirir və daha çox insana çatmağa çalışırıq.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl font-bold text-[#8B7355] mb-2">500+</div>
            <div className="text-lg text-[#6B5D4F] font-semibold">Aktiv Mülk</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl font-bold text-[#8B7355] mb-2">10K+</div>
            <div className="text-lg text-[#6B5D4F] font-semibold">Məmnun Müştəri</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl font-bold text-[#8B7355] mb-2">15+</div>
            <div className="text-lg text-[#6B5D4F] font-semibold">Şəhər</div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-[#2C2416] mb-6">Bizimlə Əlaqə</h2>
          <p className="text-lg text-[#6B5D4F] mb-8 max-w-2xl mx-auto">
            Sualınız var? Mülkünüzü platformamıza əlavə etmək istəyirsiniz? 
            Və ya sadəcə bizə təklif vermək istəyirsiniz? Bizimlə əlaqə saxlayın!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/994777670031"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#20BA5A] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <FaWhatsapp className="text-2xl" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+994777670031"
              className="flex items-center gap-3 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <FaPhone className="text-xl" />
              <span>Zəng Et</span>
            </a>
            <a
              href="mailto:info@bron-ev.com"
              className="flex items-center gap-3 bg-[#2C2416] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <FaEnvelope className="text-xl" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
