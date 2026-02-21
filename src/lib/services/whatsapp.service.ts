import { format } from 'date-fns';
import { az } from 'date-fns/locale';

/**
 * Enterprise WhatsApp Service
 * Professional message templates with proper encoding
 * Ready for WhatsApp Business API integration
 */

interface BookingMessageData {
  propertyId: string;
  propertyTitle: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
}

export class WhatsAppService {
  private static readonly PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '994777670031';
  private static readonly BASE_URL = 'https://wa.me';

  /**
   * Generate booking request URL
   */
  static generateBookingURL(data: BookingMessageData): string {
    const message = this.formatBookingMessage(data);
    return `${this.BASE_URL}/${this.PHONE}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Generate inquiry URL
   */
  static generateInquiryURL(propertyId: string, propertyTitle: string): string {
    const message = this.formatInquiryMessage(propertyId, propertyTitle);
    return `${this.BASE_URL}/${this.PHONE}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Format booking message
   */
  private static formatBookingMessage(data: BookingMessageData): string {
    const checkInStr = format(data.checkIn, 'dd MMMM yyyy, EEEE', { locale: az });
    const checkOutStr = format(data.checkOut, 'dd MMMM yyyy, EEEE', { locale: az });

    const lines = [
      '🏠 *BRON SORĞUSU*',
      '━━━━━━━━━━━━━━━━━━━',
      '',
      `📍 *Ev:* ${data.propertyTitle}`,
      `🆔 *Ev ID:* ${data.propertyId}`,
      '',
      '📅 *TARİXLƏR*',
      `  ▫️ Giriş: ${checkInStr}`,
      `  ▫️ Çıxış: ${checkOutStr}`,
      `  ▫️ Gecələr: ${data.nights}`,
      '',
      `👥 *Qonaq sayı:* ${data.guests} nəfər`,
      '',
      `💰 *Ümumi qiymət:* ${this.formatPrice(data.totalPrice)} AZN`,
    ];

    if (data.guestName) {
      lines.push('', '👤 *ƏLAQƏ MƏLUMATLARI*');
      lines.push(`  ▫️ Ad: ${data.guestName}`);
      if (data.guestPhone) lines.push(`  ▫️ Telefon: ${data.guestPhone}`);
      if (data.guestEmail) lines.push(`  ▫️ Email: ${data.guestEmail}`);
    }

    lines.push(
      '',
      '━━━━━━━━━━━━━━━━━━━',
      '✅ Rezervasiya üçün təsdiq gözləyirəm.',
      '',
      '_BronEv.com vasitəsilə göndərildi_'
    );

    return lines.join('\n');
  }

  /**
   * Format inquiry message
   */
  private static formatInquiryMessage(propertyId: string, propertyTitle: string): string {
    return [
      '🏠 *EV HAQQINDA SORĞU*',
      '━━━━━━━━━━━━━━━━━━━',
      '',
      `📍 *Ev:* ${propertyTitle}`,
      `🆔 *Ev ID:* ${propertyId}`,
      '',
      'Salam! Bu ev haqqında ətraflı məlumat almaq istəyirəm.',
      '',
      '━━━━━━━━━━━━━━━━━━━',
      '_BronEv.com vasitəsilə göndərildi_',
    ].join('\n');
  }

  /**
   * Format confirmation message (for admin)
   */
  static formatConfirmation(
    bookingNumber: string,
    propertyTitle: string,
    checkIn: Date,
    checkOut: Date,
    totalPrice: number,
    guestName: string
  ): string {
    const checkInStr = format(checkIn, 'dd MMMM yyyy', { locale: az });
    const checkOutStr = format(checkOut, 'dd MMMM yyyy', { locale: az });

    return [
      '✅ *REZERVASIYA TƏSDİQLƏNDİ*',
      '━━━━━━━━━━━━━━━━━━━',
      '',
      `📋 *Bron №:* ${bookingNumber}`,
      `👤 *Qonaq:* ${guestName}`,
      `🏠 *Ev:* ${propertyTitle}`,
      '',
      '📅 *TARİXLƏR*',
      `  ▫️ Giriş: ${checkInStr}`,
      `  ▫️ Çıxış: ${checkOutStr}`,
      '',
      `💰 *Ümumi məbləğ:* ${this.formatPrice(totalPrice)} AZN`,
      '',
      '━━━━━━━━━━━━━━━━━━━',
      '📞 Suallarınız üçün bizimlə əlaqə saxlayın.',
      'Xoş istirahət arzulayırıq! 🌟',
      '',
      '_BronEv.com_',
    ].join('\n');
  }

  /**
   * Format cancellation message
   */
  static formatCancellation(
    bookingNumber: string,
    propertyTitle: string,
    guestName: string,
    refundAmount?: number
  ): string {
    const lines = [
      '❌ *REZERVASIYA LƏĞV EDİLDİ*',
      '━━━━━━━━━━━━━━━━━━━',
      '',
      `📋 *Bron №:* ${bookingNumber}`,
      `👤 *Qonaq:* ${guestName}`,
      `🏠 *Ev:* ${propertyTitle}`,
      '',
    ];

    if (refundAmount && refundAmount > 0) {
      lines.push(
        `💵 *Geri qaytarılacaq:* ${this.formatPrice(refundAmount)} AZN`,
        '',
        'Məbləğ 3-5 iş günü ərzində hesabınıza qaytarılacaq.',
        ''
      );
    }

    lines.push(
      '━━━━━━━━━━━━━━━━━━━',
      'Başqa suallarınız üçün bizimlə əlaqə saxlayın.',
      '',
      '_BronEv.com_'
    );

    return lines.join('\n');
  }

  /**
   * Format reminder message
   */
  static formatReminder(
    guestName: string,
    propertyTitle: string,
    checkIn: Date,
    daysUntil: number
  ): string {
    const checkInStr = format(checkIn, 'dd MMMM yyyy, EEEE', { locale: az });

    return [
      '⏰ *XATIRLATMA*',
      '━━━━━━━━━━━━━━━━━━━',
      '',
      `Hörmətli ${guestName},`,
      '',
      `Rezervasiyanıza ${daysUntil} gün qalıb!`,
      '',
      `🏠 *Ev:* ${propertyTitle}`,
      `📅 *Giriş tarixi:* ${checkInStr}`,
      '',
      '━━━━━━━━━━━━━━━━━━━',
      'Suallarınız varsa bizimlə əlaqə saxlayın.',
      '',
      '_BronEv.com_',
    ].join('\n');
  }

  /**
   * Format price with separator
   */
  private static formatPrice(price: number): string {
    return price.toLocaleString('az-AZ');
  }

  /**
   * Send message via WhatsApp Business API (future)
   */
  static async sendBusinessMessage(
    to: string,
    template: string,
    params: Record<string, string>
  ): Promise<boolean> {
    // TODO: Implement WhatsApp Business API integration
    // https://developers.facebook.com/docs/whatsapp/cloud-api
    console.log('WhatsApp Business API not yet implemented');
    return false;
  }
}
