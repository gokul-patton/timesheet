'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    const userDetails = JSON.parse(localStorage.getItem("user"));
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [projects, setProjects] = useState({});
    const [hours, setHours] = useState({});
    const [isLogout, setIsLogout] = useState(false);
    const days = getDaysInMonth(year, month);
    const weeks = getWeeks(days);

    const handleHourChange = (weekIndex, dayIndex, value) => {
        const key = `${weekIndex}-${dayIndex}`;
        setHours((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    const handleProjectChange = (weekIndex, value) => {
        time
        setProjects((prev) => ({ ...prev, [weekIndex]: value }));
    };

    const getMonthTotal = (dayIndex) => {
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


    // if (isLogout) {
    //     setIsLogout(false); 
    //     router.push('/');
    // }
    return (
        <div className="min-h-screen">
            {/* NavBar*/}
            <nav className="shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Timesheet App</h1>
                <div className="flex items-center space-x-4">
                    <span className="font-medium">{userDetails.name}</span>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    // onClick={setIsLogout(true)}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="mx-40">
                {/* Employee details*/}
                <section className="p-4 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-2">Employee Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><strong>Name:</strong> {userDetails.name}</div>
                        <div><strong>Employee ID:</strong> {userDetails.employeeId}</div>
                        <div><strong>Role:</strong> {userDetails.desigination}</div>

                        <div className="gap-2">
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
                </section>

                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-row place-content-center items-center mb-[1em]">
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
                                            className="border p-2 rounded w-[6em] "
                                            placeholder="Hours"
                                            max="24"
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
                            className="w-[20em] h-[10em] border rounded-xl p-2 ms-5"
                            rows={2}
                            placeholder="Describe about project/work for the week"
                            value={projects[weekIndex] || ""}
                            onChange={(e) => handleProjectChange(weekIndex, e.target.value)}
                        />
                    </div>
                ))}

                <div className="border-t p-4">
                    <h4 className="text-lg font-bold">Totals</h4>
                    <div>
                        <div className="grid grid-cols-7 gap-2 text-center font-semibold">
                            <div>Week 1</div>
                            <div>Week 2</div>
                            <div>Week 3</div>
                            <div>Week 4</div>
                            <div>Week 5</div>
                            <div>Total</div>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center font-semibold">
                            {Array.from({ length: 5 }).map((_, dayIndex) => (
                                <div key={dayIndex}>{getWeekTotal(dayIndex)} hrs</div>
                            ))}
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-red-600">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
