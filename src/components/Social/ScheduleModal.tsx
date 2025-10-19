"use client";

import { useState } from "react";

interface ScheduleModalProps {
  onSchedule: (date: Date) => void;
  onClose: () => void;
}

export default function ScheduleModal({ onSchedule, onClose }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("12:00");

  const handleConfirm = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    if (dateTime < new Date()) {
      alert("Please select a future date and time");
      return;
    }

    onSchedule(dateTime);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark">
        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Schedule Post
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTodayDate()}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-stroke px-4 py-2 font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-opacity-90"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
