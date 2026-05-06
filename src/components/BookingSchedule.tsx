import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { format, addDays, startOfToday, isWeekend, setHours, setMinutes, isAfter, addMinutes, startOfHour } from "date-fns";

interface BookingScheduleProps {
  onComplete: (details: { date: Date; time: string; timezone: string }) => void;
  projectData: any;
}

export const BookingSchedule = ({ onComplete, projectData }: BookingScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfToday(), 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>("");
  const [gmtOffset, setGmtOffset] = useState<string>("");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);
    
    const date = new Date();
    const offset = -date.getTimezoneOffset() / 60;
    setGmtOffset(`GMT${offset >= 0 ? '+' : ''}${offset}`);

    // If initial date is a weekend, move to Monday
    if (isWeekend(selectedDate)) {
      let nextDate = selectedDate;
      while (isWeekend(nextDate)) {
        nextDate = addDays(nextDate, 1);
      }
      setSelectedDate(nextDate);
    }
  }, []);

  const generateTimeSlots = (date: Date) => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 22; // 10 PM
    
    let current = setMinutes(setHours(date, startHour), 0);
    const end = setHours(date, endHour);

    while (current < end) {
      const timeStr = format(current, "HH:mm");
      // Don't show past times if date is today
      if (isAfter(current, new Date())) {
        slots.push(timeStr);
      }
      current = addMinutes(current, 30);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

  const handleNextDay = () => {
    let next = addDays(selectedDate, 1);
    while (isWeekend(next)) next = addDays(next, 1);
    setSelectedDate(next);
    setSelectedTime(null);
  };

  const handlePrevDay = () => {
    let prev = addDays(selectedDate, -1);
    if (isAfter(prev, startOfToday())) {
      while (isWeekend(prev)) prev = addDays(prev, -1);
      setSelectedDate(prev);
      setSelectedTime(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-surface/30 border border-white/5 backdrop-blur-xl p-6 md:p-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2 block">Phase 02 // Scheduling</span>
          <h2 className="font-sans text-3xl md:text-4xl font-medium text-white tracking-tight">Synchronize <span className="text-neutral-500">Uplink.</span></h2>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-full">
          <Globe size={14} className="text-accent" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] uppercase text-neutral-400 leading-tight">{userTimezone}</span>
            <span className="font-mono text-[8px] text-accent/60 leading-tight">{gmtOffset} Offset</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Calendar Selection */}
        <div className="lg:col-span-12 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handlePrevDay}
              disabled={!isAfter(addDays(selectedDate, -1), startOfToday())}
              className="p-2 hover:bg-white/5 text-neutral-500 hover:text-white transition-colors disabled:opacity-20"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">Selected Date</span>
              <h3 className="font-sans text-xl text-white font-medium">{format(selectedDate, "EEEE, MMMM do")}</h3>
            </div>
            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-white/5 text-neutral-500 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-4 font-mono text-xs border transition-all duration-300 ${
                  selectedTime === time
                    ? "bg-accent border-accent text-black font-bold shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                    : "bg-surface border-white/5 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {timeSlots.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/10 opacity-50">
              <Clock size={24} className="mx-auto mb-4 text-neutral-500" />
              <p className="font-sans text-sm text-neutral-500">No slots available for this timeline. Please select a future date.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center shrink-0">
             <AlertCircle size={18} className="text-accent" />
          </div>
          <div className="max-w-xs">
            <h4 className="font-sans text-sm text-white font-medium mb-1">Protocol Availability</h4>
            <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
              Human consultation windows are locked to Business Hours (08:00 - 22:00 LV). Our system automatically maps these to your local time.
            </p>
          </div>
        </div>

        <button
          disabled={!selectedTime}
          onClick={() => selectedTime && onComplete({ date: selectedDate, time: selectedTime, timezone: userTimezone })}
          className={`flex items-center gap-4 px-10 py-5 font-mono text-[11px] uppercase tracking-[0.3em] transition-all ${
            selectedTime 
              ? "bg-white text-black font-black hover:bg-accent active:scale-95" 
              : "bg-white/5 text-neutral-700 cursor-not-allowed"
          }`}
        >
          Confirm Schedule <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
