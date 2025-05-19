"use client";
import React, { useState } from "react";
import { format, getDaysInMonth } from "date-fns";

const TimesheetApp = () => {
  const [hours, setHours] = useState({});
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);

  const handleHourChange = (day, value) => {
    setHours({ ...hours, [day]: value });
    console.log(Object.values(hours));
  };

  const handleSubmit = () => {
    console.log("Submitted hours:", hours);
    alert("Timesheet submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Timesheet App</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">John Doe</span>
          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {/* Employee Details */}
        <section className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Employee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>Name:</strong> John Doe
            </div>
            <div>
              <strong>Employee ID:</strong> EMP12345
            </div>
            <div>
              <strong>Role:</strong> Software Engineer
            </div>
          </div>
        </section>

        {/* Timesheet */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Timesheet - {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Day</th>
                  <th className="px-4 py-2 text-left">Hours Worked</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: daysInMonth }, (_, index) => {
                  const date = new Date(year, month, index + 1);
                  const dayName = format(date, "EEEE");
                  const dayNum = format(date, "d");
                  const key = format(date, "yyyy-MM-dd");

                  return (
                    <tr key={key} className="border-t">
                      <td className="px-4 py-2">{format(date, "MMM d")}</td>
                      <td className="px-4 py-2">{dayName}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          className="border rounded px-2 py-1 w-20"
                          value={hours[key] || ""}
                          onChange={(e) =>
                            handleHourChange(key, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Timesheet
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TimesheetApp;
