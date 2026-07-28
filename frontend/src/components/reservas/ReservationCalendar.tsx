import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ReservationCalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  disabledDates?: string[];
  minDate?: string;
}

export const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  selectedDate,
  onDateSelect,
  disabledDates = [],
  minDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  }, [currentDate]);

  const monthName = useMemo(() => {
    return currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Check if date is disabled
    if (disabledDates.includes(dateStr)) return true;

    // Check if date is before minDate
    if (minDate) {
      const minDateObj = new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      if (date < minDateObj) return true;
    }

    return false;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    if (!isDateDisabled(day)) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      onDateSelect(dateStr);
    }
  };

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const calendarDays: (number | null)[] = Array(firstDayOfMonth).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <Card>
      <Card.Header variant="navy">
        <div className="flex items-center justify-between">
          <h3 className="text-h3 font-600 text-white capitalize">{monthName}</h3>
          <div className="flex gap-xs">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="border-white text-white hover:bg-navy-600"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="border-white text-white hover:bg-navy-600"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-lg">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-xs mb-md">
          {days.map((day) => (
            <div key={day} className="text-center text-label font-600 text-navy-800 py-xs">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-xs">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square"></div>;
            }

            const dateStr = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            )
              .toISOString()
              .split('T')[0];

            const isSelected = selectedDate === dateStr;
            const isDisabled = isDateDisabled(day);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={`
                  aspect-square flex items-center justify-center rounded-md text-body font-500
                  transition-all duration-150
                  ${
                    isSelected
                      ? 'bg-gold-500 text-navy-800 font-600'
                      : isDisabled
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-50 text-navy-800 hover:bg-navy-50 hover:border-navy-800 border border-transparent'
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};
