'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
// import TimesheetPage from "../app/timesheet"

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();


    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/user/auth", {
                method: "GET",
                headers: {
                    "username": username,
                    "password": password,
                },
            });

            if (response.ok) {
                setIsLoggedIn(true);
                setMessage("Login successful");
            } else if (response.status === 401) {
                setMessage("Missing username or password");
            } else {
                setMessage("Unexpected error occurred");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Network error");
        }
    };


    if (isLoggedIn) {
        setIsLoggedIn(false)
        router.push('/timesheet')
    }

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
