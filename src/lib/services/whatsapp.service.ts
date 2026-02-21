import { format } from 'date-fns';
import { az } from 'date-fns/locale';
import type { WhatsAppBookingMessage } from '@/types/property';

/**
 * WhatsApp Integration Service
 * Generates professional booking messages
 */

export class WhatsAppService {
  private static readonly PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '994777670031';

  /**
   * Generate WhatsApp booking URL
   */
  static generateBookingURL(data: WhatsAppBookingMessage): string {
    const message = this.formatBookingMessage(data);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.PHONE_NUMBER}?text=${encodedMessage}`;
  }

  /**
   * Format professional booking message
   */
  private static formatBookingMessage(data: WhatsAppBookingMessage): string {
    const checkInFormatted = format(data.checkIn, 'dd MMMM yyyy, EEEE', { locale: az });
    const checkOutFormatted = format(data.checkOut, 'dd MMMM yyyy, EEEE', { locale: az });

    const lines = [
      '🏠 *BRON SORĞUSU*',
      '',
      `📍 *Ev:* ${data.propertyTitle}`,
      `🆔 *ID:* ${data.propertyId}`,
      '',
      '📅 *TARİXLƏR*',
      `▫️ Giriş: ${checkInFormatted}`,
      `▫️ Çıxış: ${checkOutFormatted}`,
      `▫️ Gecələr: ${data.nights}`,
      '',
      `👥 *Qonaq sayı:* ${data.guests}`,
      '',
      `💰 *Ümumi qiymət:* ${this.formatPrice(data.totalPrice)} AZN`,
    ];

    if (data.guestName) {
      lines.push('', `👤 *Ad:* ${data.guestName}`);
    }

    if (data.guestPhone) {
      lines.push(`📱 *Telefon:* ${data.guestPhone}`);
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
   * Format price with thousands separator
   */
  private static formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Generate inquiry message (without dates)
   */
  static generateInquiryURL(propertyId: string, propertyTitle: string): string {
    const message = [
      '🏠 *EV HAQQINDA MƏLUMAT*',
      '',
      `📍 *Ev:* ${propertyTitle}`,
      `🆔 *ID:* ${propertyId}`,
      '',
      'Salam! Bu ev haqqında ətraflı məlumat almaq istəyirəm.',
      '',
      '_BronEv.com vasitəsilə göndərildi_',
    ].join('\n');

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.PHONE_NUMBER}?text=${encodedMessage}`;
  }

  /**
   * Generate booking confirmation message (for admin to send)
   */
  static formatConfirmationMessage(
    bookingNumber: string,
    propertyTitle: string,
    checkIn: Date,
    checkOut: Date,
    totalPrice: number
  ): string {
    const checkInFormatted = format(checkIn, 'dd MMMM yyyy', { locale: az });
    const checkOutFormatted = format(checkOut, 'dd MMMM yyyy', { locale: az });

    return [
      '✅ *REZERVASIYA TƏSDİQLƏNDİ*',
      '',
      `📋 *Bron nömrəsi:* ${bookingNumber}`,
      `🏠 *Ev:* ${propertyTitle}`,
      '',
      '📅 *TARİXLƏR*',
      `▫️ Giriş: ${checkInFormatted}`,
      `▫️ Çıxış: ${checkOutFormatted}`,
      '',
      `💰 *Ümumi məbləğ:* ${this.formatPrice(totalPrice)} AZN`,
      '',
      '━━━━━━━━━━━━━━━━━━━',
      '📞 Əlavə suallarınız üçün bizimlə əlaqə saxlayın.',
      '',
      'Xoş istirahət arzulayırıq! 🌟',
      '',
      '_BronEv.com_',
    ].join('\n');
  }

  /**
   * Generate cancellation message
   */
  static formatCancellationMessage(
    bookingNumber: string,
    propertyTitle: string,
    refundAmount?: number
  ): string {
    const lines = [
      '❌ *REZERVASIYA LƏĞV EDİLDİ*',
      '',
      `📋 *Bron nömrəsi:* ${bookingNumber}`,
      `🏠 *Ev:* ${propertyTitle}`,
      '',
    ];

    if (refundAmount && refundAmount > 0) {
      lines.push(
        `💵 *Geri qaytarılacaq məbləğ:* ${this.formatPrice(refundAmount)} AZN`,
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
}
