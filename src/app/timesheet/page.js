'use client'
import { useState } from "react";

const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

const getWeeks = (days) => {
    const weeks = [];
    let currentWeek = [];
    days.forEach((day) => {
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(day);
    });
    if (currentWeek.length) weeks.push(currentWeek);
    return weeks;
};

export default function TimesheetPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [projects, setProjects] = useState({});
    const [hours, setHours] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = () => {
        if (username === "employee1" && password === "pass123") {
            setIsLoggedIn(true);
            setMessage("Login successful");
        } else {
            setMessage("Invalid credentials");
        }
    };

    const days = getDaysInMonth(year, month);
    const weeks = getWeeks(days);

    const handleHourChange = (weekIndex, dayIndex, value) => {
        const key = `${weekIndex}-${dayIndex}`;
        setHours((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    const handleProjectChange = (weekIndex, value) => {
        setProjects((prev) => ({ ...prev, [weekIndex]: value }));
    };

    const getDayTotal = (dayIndex) => {
        return weeks.reduce((sum, _, weekIndex) => {
            const key = `${weekIndex}-${dayIndex}`;
            return sum + (hours[key] || 0);
        }, 0);
    };

    const getWeekTotal = (weekIndex) => {
        return weeks[weekIndex].reduce((sum, _, dayIndex) => {
            const key = `${weekIndex}-${dayIndex}`;
            return sum + (hours[key] || 0);
        }, 0);
    };

    if (!isLoggedIn) {
        return (
            <div className="w-full max-w-sm mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg">
            <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-black">Login</h2>
            <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
            Sign In
            </button>
            {message && (
                <div
                className={`text-center font-medium mt-2 ${message.includes("successful") ? "text-green-600" : "text-red-600"
                }`}
                >
                {message}
                </div>
            )}
            </div>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-8"> 
        <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Timesheet</h2>
        <div className="flex gap-2">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border p-2 rounded">
        {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
        ))}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border p-2 rounded">
        {[...Array(5)].map((_, i) => {
            const y = today.getFullYear() - 2 + i;
            return <option key={y} value={y}>{y}</option>;
        })}
        </select>
        </div>
        </div>

        <div>
            
        </div>

        {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col items-center">
            <div className="border rounded-xl shadow p-4 space-y-2">
            <h3 className="text-lg font-semibold">Week {weekIndex + 1}</h3>
            <div>
            <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-center">
            {week.map((day, idx) => <div key={idx}>{day.toLocaleDateString()}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs text-center">
            {week.map((day, idx) => <div key={idx}>{day.toLocaleDateString('default', { weekday: 'short' })}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
            {week.map((_, dayIndex) => (
                <input
                key={dayIndex}
                type="number"
                className="border p-2 rounded w-full"
                placeholder="Hours"
                max = "24"
                value={hours[`${weekIndex}-${dayIndex}`] || ""}
                onChange={(e) => handleHourChange(weekIndex, dayIndex, e.target.value)}
                />
            ))}
            </div>
            <div className="text-right font-semibold mt-2">Week Total: {getWeekTotal(weekIndex)} hrs</div>

            </div>
            </div>
            <textarea
            key={weekIndex}
            className="w-full border rounded-xl p-2"
            rows={2}
            placeholder="Describe project/work for the week"
            value={projects[weekIndex] || ""}
            onChange={(e) => handleProjectChange(weekIndex, e.target.value)}
            />
            </div>
        ))}

        <div className="border-t pt-4">
        <h4 className="text-lg font-bold">Daily Totals</h4>
        <div className="grid grid-cols-7 gap-2 text-center font-semibold">
        {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex}>{getDayTotal(dayIndex)} hrs</div>
        ))}
        </div>
        </div>
        </div>
    );
}
