// This is a simple Bar Chart component using Chart.js and React
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

// Chart data
const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
        {
            label: 'Right of Use Asset',
            data: [150, 200, 180, 220, 170],
            backgroundColor: 'rgba(75, 192, 192)',
            borderRadius: 5
        }
    ]
};
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
// Chart options
const options = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: prefersDarkMode ? 'white' : 'black', // Label text color
            },
        },
    },
    scales: {
        x: {
            ticks: {
                color: prefersDarkMode ? 'white' : 'black', // X-axis label color
            },
            grid: {
                display: true,
                color: prefersDarkMode ? 'rgba(128, 128, 128, 0.5) ' : '#ddd', // Gridline color
            },
        },
        y: {
            ticks: {
                color: prefersDarkMode ? 'white' : 'black', // Y-axis label color
            },
            grid: {
                color: prefersDarkMode ? 'rgba(128, 128, 128, 0.5) ' : '#ddd', // Gridline color
            },
        },
    },
};


const BarChart = () => {
    return <Bar data={data} options={options} />;
};

export default BarChart;
