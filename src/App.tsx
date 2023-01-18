import { CalendarDate, parseDate } from "@internationalized/date";
import { useState } from "react";
import "./App.css";
import { DatePicker } from "./DatePicker";

function App() {
  const [d, setD] = useState(new CalendarDate(2023, 5, 23));
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-red-500 text-xl">Magico Date Picker</h1>
      <DatePicker
        label="selected date"
        value={d}
        onChange={(da) => {
          console.log(da.toString());
          setD(parseDate(da.toString()));
        }}
      />
    </div>
  );
}

export default App;
