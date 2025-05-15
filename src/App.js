import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [events, setEvents] = useState({});
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(4); // May
  const [direction, setDirection] = useState(0);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
    alert("保存しました！");
  };

  const getDateKey = (day) => {
    return `${currentYear}-${currentMonth + 1}-${day}`;
  };

  const changeMonth = (offset) => {
    setDirection(offset);
    setCurrentMonth((prev) => {
      if (prev + offset < 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      } else if (prev + offset > 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + offset;
    });
  };

  return (
    <div className="container">
      <h1>Calendar</h1>

      <div className="calendar-wrapper">
        <button className="nav-btn left" onClick={() => changeMonth(-1)}>＜</button>

        <div className="calendar-content">
          <h2>{currentYear}年{currentMonth + 1}月</h2>
          <button className="save-btn" onClick={handleSave}>saved</button>

          {/* 曜日ラベル */}
          <div className="weekday-row">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="weekday-cell">{day}</div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentYear}-${currentMonth}`}
              className="calendar"
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const key = getDateKey(day);
                // 今日の日付と一致するかを判定
                const today = new Date();
                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();

                return (
                  <div key={day} className={`day-cell ${isToday ? "today" : ""}`}>
                    <div className="date">{day}</div>
                    <textarea
                      rows={3}
                      value={events[key] || ""}
                      onChange={(e) =>
                        setEvents({ ...events, [key]: e.target.value })
                      }
                      placeholder="your schedule"
                    />
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="nav-btn right" onClick={() => changeMonth(1)}>＞</button>
      </div>
    </div>
  );
}

export default App;
