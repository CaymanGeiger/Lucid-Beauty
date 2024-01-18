  "use client"
  import React, { useState, useEffect } from 'react';
  import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
  import dayjs from 'dayjs';

  const appointments = [
    { date: '2024-01-04', time: '14:00' },
    { date: '2023-11-02', time: '17:00' }
  ];

  const StaticDateTimePickerWrapper = (props: any) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [bookedAppointments, setBookedAppointments] = useState<any>({});
    console.log(bookedAppointments)


    const fetchAppointments = async () => {
      const res = await fetch('http://localhost:8080/api/appointments/');
      if (!res.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await res.json();
      const formattedData = data.map(appointment => ({
        date: appointment.appointment_date,
        time: appointment.appointment_time
      }));
      setBookedAppointments(formattedData);
    }
      useEffect(() => {
        fetchAppointments()
      } ,[])




    const handleDateChange = (newValue) => {
      setSelectedDate(newValue);
    };

    const shouldDisableDate = (date) => {
      return bookedAppointments.some(appointment => {
        const appointmentDate = dayjs(appointment.date);
        return date.isSame(appointmentDate, 'day');
      });
    };


    const shouldDisableTime = (time, clockType) => {
      if (clockType === 'hours') {
        // Define working hours in 24-hour format
        const startHour = 8; // 8 AM
        const endHour = 18; // 6 PM

        // Assuming 'time' is provided as a number representing the hour
        // Check if time is outside working hours
        const isOutsideWorkingHours = time < startHour || time >= endHour;

        return isOutsideWorkingHours;
      }
      return false;
    };


    return (
        <StaticDateTimePicker
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate}
          // shouldDisableTime={shouldDisableTime}
          minTime={dayjs().set('hour', 8)}
          maxTime={dayjs().set('hour', 17)}
          // timeSteps={{ minutes: 20 }}
          {...props} />
    );
  };

  export default StaticDateTimePickerWrapper;
