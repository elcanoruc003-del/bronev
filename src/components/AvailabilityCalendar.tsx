'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface AvailabilityCalendarProps {
  propertyId?: string;
  blockedDates?: string[]; // Array of date strings in YYYY-MM-DD format
  onDateToggle?: (date: string, isBlocked: boolean) => void;
  readOnly?: boolean;
  showLegend?: boolean;
}

export default function AvailabilityCalendar({
  propertyId,
  blockedDates = [],
  onDateToggle,
  readOnly = false,
  showLegend = true,
}: AvailabilityCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set(blockedDates));
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  useEffect(() => {
    setSelectedDates(new Set(blockedDates));
  }, [blockedDates]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (date: Date) => {
    if (readOnly) return;

    const dateStr = formatDate(date);
    const newSelectedDates = new Set(selectedDates);
    
    if (newSelectedDates.has(dateStr)) {
      newSelectedDates.delete(dateStr);
      onDateToggle?.(dateStr, false);
    } else {
      newSelectedDates.add(dateStr);
      onDateToggle?.(dateStr, true);
    }
    
    setSelectedDates(newSelectedDates);
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    const dateStr = formatDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Past dates
    if (date < today) {
      return 'past-date';
    }
    
    // Blocked dates (red)
    if (selectedDates.has(dateStr)) {
      return 'blocked-date';
    }
    
    // Available dates (green)
    return 'available-date';
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="availability-calendar-container">
      {showLegend && (
        <div className="mb-4 p-3 bg-gradient-to-br from-[#FAF8F5] to-[#F5F1ED] rounded-xl border border-[#E5DDD5]">
          <div className="flex items-center gap-4 text-xs md:text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-500"></div>
              <span className="text-[#2C2416] font-medium">Boş</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-500"></div>
              <span className="text-[#2C2416] font-medium">Dolu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-300"></div>
              <span className="text-[#6B5D4F]">Keçmiş</span>
            </div>
          </div>
          {!readOnly && (
            <div className="mt-2 flex items-start gap-2 text-xs text-[#8B7355]">
              <FaInfoCircle className="mt-0.5 flex-shrink-0" />
              <span>Tarixə klikləyərək boş/dolu statusunu dəyişə bilərsiniz</span>
            </div>
          )}
        </div>
      )}

      <div className="calendar-wrapper">
        <Calendar
          onChange={() => {}}
          onClickDay={handleDateClick}
          value={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) setActiveStartDate(activeStartDate);
          }}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          minDate={new Date()}
          locale="az-AZ"
          navigationLabel={({ date }) => {
            const months = [
              'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
              'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
            ];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
          }}
          formatShortWeekday={(locale, date) => {
            const days = ['B', 'Be', 'Ça', 'C', 'Ca', 'Ş', 'B'];
            return days[date.getDay()];
          }}
        />
      </div>

      <style jsx global>{`
        .availability-calendar-container {
          width: 100%;
        }

        .calendar-wrapper {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #E5DDD5;
        }

        .react-calendar {
          width: 100%;
          border: none;
          font-family: 'Poppins', sans-serif;
        }

        .react-calendar__navigation {
          display: flex;
          margin-bottom: 16px;
          gap: 8px;
        }

        .react-calendar__navigation button {
          min-width: 40px;
          background: #FAF8F5;
          border: 1px solid #E5DDD5;
          border-radius: 8px;
          color: #2C2416;
          font-weight: 600;
          font-size: 14px;
          padding: 8px;
          transition: all 0.2s;
        }

        .react-calendar__navigation button:hover:not(:disabled) {
          background: #8B7355;
          color: white;
          border-color: #8B7355;
        }

        .react-calendar__navigation button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .react-calendar__month-view__weekdays {
          text-align: center;
          font-weight: 700;
          font-size: 11px;
          color: #6B5D4F;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .react-calendar__month-view__weekdays__weekday {
          padding: 8px 4px;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }

        .react-calendar__tile {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
          border-radius: 8px;
          border: 2px solid transparent;
          transition: all 0.2s;
          cursor: pointer;
          margin: 2px;
        }

        .react-calendar__tile:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .react-calendar__tile--now {
          background: #FFF9E6;
          border-color: #FFD700;
          font-weight: 700;
        }

        .react-calendar__tile.available-date {
          background: #E8F5E9;
          border-color: #4CAF50;
          color: #2E7D32;
        }

        .react-calendar__tile.available-date:hover:not(:disabled) {
          background: #C8E6C9;
          border-color: #388E3C;
        }

        .react-calendar__tile.blocked-date {
          background: #FFEBEE;
          border-color: #F44336;
          color: #C62828;
        }

        .react-calendar__tile.blocked-date:hover:not(:disabled) {
          background: #FFCDD2;
          border-color: #D32F2F;
        }

        .react-calendar__tile.past-date {
          background: #F5F5F5;
          border-color: #E0E0E0;
          color: #9E9E9E;
          cursor: not-allowed;
        }

        .react-calendar__tile:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        @media (max-width: 640px) {
          .calendar-wrapper {
            padding: 12px;
          }

          .react-calendar__navigation button {
            min-width: 32px;
            font-size: 12px;
            padding: 6px;
          }

          .react-calendar__tile {
            font-size: 11px;
            margin: 1px;
          }

          .react-calendar__month-view__weekdays {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
