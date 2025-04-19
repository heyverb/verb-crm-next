"use client";

import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/MiniCalendar.css";

const Datepicker = ({ ...rest }: CalendarProps) => {
  return <Calendar {...rest} />;
};

export default Datepicker;
