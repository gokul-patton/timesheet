'use client'
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

//getting all days in the month
const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        if (date.getDate() == 1 && date.getDay() != 0) {
            for (let i = 0; i < date.getDay(); i++) {
                const prevDate = new Date(year, month, 0 - (date.getDay() - 1 - i));
                days.push(prevDate);
            }
        }
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

//separting days based on week
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
    // const router = useRouter();

    //user data
    const userDetails = JSON.parse(localStorage.getItem("user"));

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [projects, setProjects] = useState({});
    const [hours, setHours] = useState({});
    const [projectId, setProjectId] = useState({});
    // const [isLogout, setIsLogout] = useState(false);
    const days = getDaysInMonth(year, month);
    const weeks = getWeeks(days);

    const handleHourChange = (weekIndex, date, value) => {
        const key = `${weekIndex}-${date}`;
        setHours((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    const handleProjectDescChange = (weekIndex, value) => {
        setProjects((prev) => ({ ...prev, [weekIndex]: value }));
    };

    const handleProjectIdChange = (weekIndex, date, value) => {
        const key = `${weekIndex}-${date}`;
        setProjectId((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    const getWeekTotal = (weekIndex) => {
        return weeks[weekIndex].reduce((sum, day) => {
            const key = `${weekIndex}-${day.getDate()}`;
            return sum + (hours[key] || 0);
        }, 0);
    };

    const getMonthTotal = () => {
        console.log("total month called");
        return weeks.reduce((weekSum, _, weekIndex) => {
            return weekSum + weeks[weekIndex].reduce((sum, day) => {
                const key = `${weekIndex}-${day.getDate()}`;
                return sum + (hours[key] || 0);
            }, 0);
        }, 0)
    };

    const handleSubmit = async () => {
        const weeksData = weeks.map((week, weekIndex) => {
            const daysOfWeek = week.map((day) => {
                const key = `${weekIndex}-${day.getDate()}`;
                return {
                    date: day || "",
                    day: day?.toLocaleDateString('default', { weekday: 'long' }),
                    timeWorked: hours[key] || 0,
                    projectId: projectId[key] || "",
                };
            }); // optionally skip days without hours

            return {
                weekNo: weekIndex,
                weekWorkDescription: projects[weekIndex],
                weekTotalWorkedHr: getWeekTotal(weekIndex),
                daysOfWeek,
            };
        });

        const payload = {
            //FIXME: need object id to update the varaible
            // _id: "684c9ce3c4979a8c92fbe00e",
            employeeId: userDetails.employeeId,
            year,
            month,
            weeks: weeksData,
            created_at: new Date(),
            updated_at: new Date(),
            canEdit: false,
        };

        const savingURL = "http://localhost:8080/api/v1/timesheet/" + userDetails.employeeId + "?year=" + year + "&month=" + month;
        console.log("the saving URL is ", savingURL);
        console.log("the payload looks like ", payload);
        await fetch(savingURL, {
            method: "POST", // or PUT
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    };

    useEffect(() => {
        const fetchTimesheet = async () => {
            const res = await fetch(
                `http://localhost:8080/api/v1/timesheet/${userDetails.employeeId}?year=${year}&month=${month}`
            );

            if (res.ok) {
                const data = await res.json();
                console.log("the data for current month is ", data)

                // Map backend timesheet structure to frontend hours/projects
                const newHours = {};
                const newProjects = {};
                const newProjectKeys = {};

                data.weeks.forEach((week) => {
                    newProjects[week.weekNo] = week.weekWorkDescription || "";
                    week.daysOfWeek.forEach((day) => {
                        const dateObj = new Date(day.date);
                        const key = `${week.weekNo}-${dateObj.getDate()}`;
                        newHours[key] = parseFloat(day.timeWorked) || 0;
                        newProjectKeys[key] = day.projectId || "";
                    });
                });

                setHours(newHours);
                setProjects(newProjects);
                setProjectId(newProjectKeys);
            }
        };

        fetchTimesheet();
    }, [year, month]);
    //
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
                            <select value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                className="border p-2 rounded"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                            <select value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="border p-2 rounded"
                            >
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
                            <div className="grid grid-cols-7 gap-2">
                                {week.map((day, idx) => (
                                    <div key={idx} className="flex flex-col text-center">
                                        {/* Date */}
                                        <div className="text-sm font-semibold">
                                            {day.toLocaleDateString()}
                                        </div>

                                        {/* Day name */}
                                        <div className="text-xs">
                                            {day.toLocaleDateString('default', { weekday: 'short' })}
                                        </div>


                                        {/* Project ID input */}
                                        <input
                                            className={`border p-2 rounded w-20 mb-1 text-xs ${day.getMonth() !== month ? 'bg-gray-200 cursor-not-allowed' : ''
                                                }`}
                                            placeholder="Project Id"
                                            disabled={day.getMonth() !== month}
                                            value={projectId[`${weekIndex}-${day.getDate()}`] || ""}
                                            onChange={(e) => handleProjectIdChange(weekIndex, day.getDate(), e.target.value)}
                                        />

                                        {/* Hours input */}
                                        <input
                                            type="number"
                                            className={`border p-2 rounded w-20 ${day.getMonth() !== month ? 'bg-gray-200 cursor-not-allowed' : ''
                                                }`}
                                            placeholder="Hours"
                                            max="24"
                                            disabled={day.getMonth() !== month}
                                            value={hours[`${weekIndex}-${day.getDate()}`] || ""}
                                            onChange={(e) => handleHourChange(weekIndex, day.getDate(), e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-right font-semibold mt-2">
                                Week Total: {getWeekTotal(weekIndex)} hrs
                            </div>
                        </div>

                        <textarea
                            key={weekIndex}
                            className="w-[20em] h-[10em] border rounded-xl p-2 ms-5"
                            rows={2}
                            placeholder="Describe about project/work for the week"
                            value={projects[weekIndex] || ""}
                            onChange={(e) => handleProjectDescChange(weekIndex, e.target.value)}
                        />
                    </div>
                ))}

                <div className="border-t p-4">
                    <h4 className="text-lg font-bold">Totals</h4>
                    <div>
                        <div className="grid grid-cols-7 gap-2 text-center font-semibold">
                            {weeks.map((_, weekIndex) => (
                                <div> Week {weekIndex + 1} </div>
                            ))}
                            <div>Total</div>
                            <div></div>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center font-semibold">
                            {weeks.map((_, weekIndex) => (
                                <div key={weekIndex}>{getWeekTotal(weekIndex)} hrs</div>
                            ))}
                            <div>{getMonthTotal()} hrs</div>
                            <button
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
