import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {fetchSelectOrdercount  } from "../services/grapdata";
import { useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Graf() {
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState(null);
    const [chartData, setChartData] = useState({
        labels: [], // Days of the week
        datasets: [
            {
                label: 'Order Count',
                data: [], // Order counts
                backgroundColor: [
                    '#FF6F00', 
                    '#FFA000', 
                    '#F57C00', 
                    '#E65100', 
                    '#6D4C41',
                    '#4E342E', 
                    '#3E2723', 
                ],
                borderColor: '#2E2E2E',
                borderWidth: 1,
            },
        ],
    });


      useEffect(() => {
        const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
        if (!adminUserId) {
          alert("Session Closed. Please Login Again!");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setAdminId(Number(adminUserId));
        }
      }, [navigate]);

      useEffect(() => {
        const fetchData = async () => {
            try {
                // Ensure adminId is available
                if (!adminId) {
                    console.error('Admin ID is not defined.');
                    return;
                }
    
                // Fetch data from the backend
                const response = await fetchSelectOrdercount(adminId); // Ensure `adminId` is defined
                const backendData = response;
    
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const orderCounts = new Array(7).fill(0); // Initialize counts for all days
    
                backendData.forEach((item) => {
                    const dayIndex = daysOfWeek.indexOf(item.DayName);
                    if (dayIndex !== -1) {
                        orderCounts[dayIndex] = item.OrderCount;
                    }
                });
    
                setChartData((prevData) => ({
                    ...prevData,
                    labels: daysOfWeek,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: orderCounts,
                        },
                    ],
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        // Call fetchData only if adminId is set
        if (adminId) {
            fetchData();
        }
    }, [adminId]); // Dependency array includes adminId

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333333',
                },
            },
            title: {
                display: true,
                text: 'Weekly Order Count Overview',
                color: '#333333',
                font: {
                    size: 18,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#333333',
                },
                grid: {
                    color: '#E0E0E0',
                },
            },
            y: {
                ticks: {
                    color: '#333333',
                },
                grid: {
                    color: '#E0E0E0',
                },
            },
        },
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md w-full h-96">
           
            <div className="w-full h-full">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}