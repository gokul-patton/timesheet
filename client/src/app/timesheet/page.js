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
        <div className="min-h-screen bg-gray-50">
            {/* NavBar - Responsive */}
            <nav className="shadow-lg bg-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 border-b-2 border-blue-100">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Timesheet App</h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="font-semibold text-sm sm:text-base truncate max-w-32 sm:max-w-none text-gray-700">Welcome, {userDetails.name}</span>
                    <button
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 text-sm sm:text-base font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
                    // onClick={setIsLogout(true)}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Container - Responsive padding */}
            <div className="px-4 sm:px-6 lg:px-20 xl:px-40 py-4">
                {/* Employee details - Responsive grid */}
                <section className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Employee Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="text-sm sm:text-base font-medium text-gray-700"><strong className="text-gray-800">Name:</strong> {userDetails.name}</div>
                        <div className="text-sm sm:text-base font-medium text-gray-700"><strong className="text-gray-800">Employee ID:</strong> {userDetails.employeeId}</div>
                        <div className="text-sm sm:text-base font-medium text-gray-700"><strong className="text-gray-800">Role:</strong> {userDetails.desigination}</div>
                    </div>

                    {/* Date selectors - Responsive layout */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 sm:flex-none">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Month</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                className="border-2 border-gray-300 p-3 rounded-lg text-sm sm:text-base font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 sm:flex-none">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="border-2 border-gray-300 p-3 rounded-lg text-sm sm:text-base font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full"
                            >
                                {[...Array(5)].map((_, i) => {
                                    const y = today.getFullYear() - 2 + i;
                                    return <option key={y} value={y}>{y}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Weeks - Completely responsive redesign */}
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="mb-6">
                        {/* Desktop/Large screens - Side by side layout */}
                        <div className="hidden lg:flex gap-6">
                            <div className="flex-1 bg-white border rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 border-b">
                                    <h3 className="text-lg font-bold text-white">Week {weekIndex + 1}</h3>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-7 gap-2">
                                        {week.map((day, idx) => (
                                            <div key={idx} className="flex flex-col text-center space-y-2">
                                                <div className="text-sm font-bold text-gray-800">
                                                    {day.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="text-xs font-semibold text-gray-600">
                                                    {day.toLocaleDateString('default', { weekday: 'short' })}
                                                </div>
                                                <input
                                                    className={`border-2 p-2 rounded-lg w-full text-sm text-center font-medium ${day.getMonth() !== month
                                                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                        }`}
                                                    placeholder="Project"
                                                    disabled={day.getMonth() !== month}
                                                    value={projectId[`${weekIndex}-${day.getDate()}`] || ""}
                                                    onChange={(e) => handleProjectIdChange(weekIndex, day.getDate(), e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    className={`border-2 p-2 rounded-lg w-full text-sm text-center font-medium ${day.getMonth() !== month
                                                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
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
                                </div>

                                <div className="bg-gray-100 px-4 py-3 border-t">
                                    <div className="text-right font-bold text-base text-gray-800">
                                        Week Total: {getWeekTotal(weekIndex)} hrs
                                    </div>
                                </div>
                            </div>

                            {/* Project description - Right side for large screens */}
                            <div className="w-80">
                                <textarea
                                    className="w-full h-full border-2 border-gray-300 rounded-xl p-4 text-base font-medium resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Describe project/work for the week..."
                                    value={projects[weekIndex] || ""}
                                    onChange={(e) => handleProjectDescChange(weekIndex, e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Medium screens - Stack layout */}
                        <div className="hidden md:block lg:hidden">
                            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 border-b">
                                    <h3 className="text-lg font-bold text-white">Week {weekIndex + 1}</h3>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-7 gap-2">
                                        {week.map((day, idx) => (
                                            <div key={idx} className="flex flex-col text-center space-y-2">
                                                <div className="text-sm font-bold text-gray-800">
                                                    {day.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="text-xs font-semibold text-gray-600">
                                                    {day.toLocaleDateString('default', { weekday: 'short' })}
                                                </div>
                                                <input
                                                    className={`border-2 p-2 rounded-lg w-full text-sm text-center font-medium ${day.getMonth() !== month
                                                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                        }`}
                                                    placeholder="Project"
                                                    disabled={day.getMonth() !== month}
                                                    value={projectId[`${weekIndex}-${day.getDate()}`] || ""}
                                                    onChange={(e) => handleProjectIdChange(weekIndex, day.getDate(), e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    className={`border-2 p-2 rounded-lg w-full text-sm text-center font-medium ${day.getMonth() !== month
                                                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
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
                                </div>

                                <div className="bg-gray-100 px-4 py-3 border-t">
                                    <div className="text-right font-bold text-base text-gray-800">
                                        Week Total: {getWeekTotal(weekIndex)} hrs
                                    </div>
                                </div>
                            </div>

                            {/* Project description - Below for medium screens */}
                            <div className="mt-4">
                                <textarea
                                    className="w-full h-32 border-2 border-gray-300 rounded-xl p-4 text-base font-medium resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Describe project/work for the week..."
                                    value={projects[weekIndex] || ""}
                                    onChange={(e) => handleProjectDescChange(weekIndex, e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Mobile view - Card layout */}
                        <div className="md:hidden">
                            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 border-b">
                                    <h3 className="text-lg font-bold text-white">Week {weekIndex + 1}</h3>
                                </div>

                                <div className="p-4 space-y-3">
                                    {week.map((day, idx) => (
                                        <div key={idx} className={`border-2 rounded-lg p-3 ${day.getMonth() !== month ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                                            }`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-sm font-bold text-gray-800">
                                                    {day.toLocaleDateString('default', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Project ID</label>
                                                    <input
                                                        className={`border-2 p-2 rounded-lg w-full text-sm text-center font-medium ${day.getMonth() !== month
                                                            ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                            }`}
                                                        placeholder="Project"
                                                        disabled={day.getMonth() !== month}
                                                        value={projectId[`${weekIndex}-${day.getDate()}`] || ""}
                                                        onChange={(e) => handleProjectIdChange(weekIndex, day.getDate(), e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Hours</label>
                                                    <input
                                                        type="number"
                                                        className={`border-2 p-2 rounded-lg w-full text-sm text-center font-medium ${day.getMonth() !== month
                                                            ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                            }`}
                                                        placeholder="Hours"
                                                        max="24"
                                                        disabled={day.getMonth() !== month}
                                                        value={hours[`${weekIndex}-${day.getDate()}`] || ""}
                                                        onChange={(e) => handleHourChange(weekIndex, day.getDate(), e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-100 px-4 py-3 border-t">
                                    <div className="text-right font-bold text-base text-gray-800">
                                        Week Total: {getWeekTotal(weekIndex)} hrs
                                    </div>
                                </div>
                            </div>

                            {/* Project description - Below for mobile */}
                            <div className="mt-4">
                                <textarea
                                    className="w-full h-24 border-2 border-gray-300 rounded-xl p-3 text-sm font-medium resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Describe project/work for the week..."
                                    value={projects[weekIndex] || ""}
                                    onChange={(e) => handleProjectDescChange(weekIndex, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Totals section - Responsive */}
                <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-4 border-b text-center">
                        <h4 className="text-lg sm:text-xl font-bold text-white">Monthly Summary</h4>
                    </div>

                    {/* Desktop view - Grid */}
                    <div className="hidden sm:block p-6">
                        <div className="text-center space-y-4">
                            <div className="grid grid-cols-8 gap-4">
                                {weeks.map((_, weekIndex) => (
                                    <div key={weekIndex} className="text-sm font-bold text-gray-800">
                                        Week {weekIndex + 1}
                                    </div>
                                ))}
                                <div className="text-sm font-bold text-gray-800">Total</div>
                            </div>
                            <div className="grid grid-cols-8 gap-4">
                                {weeks.map((_, weekIndex) => (
                                    <div key={weekIndex} className="text-base font-semibold text-blue-600">
                                        {getWeekTotal(weekIndex)} hrs
                                    </div>
                                ))}
                                <div className="text-lg font-bold text-green-600">{getMonthTotal()} hrs</div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile view - List */}
                    <div className="sm:hidden p-6 text-center space-y-3">
                        {weeks.map((_, weekIndex) => (
                            <div key={weekIndex} className="flex justify-between text-base">
                                <span className="font-bold text-gray-800">Week {weekIndex + 1}:</span>
                                <span className="font-semibold text-blue-600">{getWeekTotal(weekIndex)} hrs</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-lg font-bold border-t pt-3 border-gray-200">
                            <span className="text-gray-800">Total:</span>
                            <span className="text-green-600">{getMonthTotal()} hrs</span>
                        </div>
                    </div>

                    <div className="bg-gray-100 px-6 py-4 border-t text-center">
                        <button
                            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-bold text-base shadow-lg transform hover:scale-105 transition-all duration-200"
                            onClick={handleSubmit}
                        >
                            Submit Timesheet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
