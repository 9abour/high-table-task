import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
		},
	},
};

const arr = {
	"2023-07-21": {
		"1. open": "138.2100",
		"2. high": "139.7799",
		"3. low": "137.7600",
		"4. close": "138.9400",
		"5. volume": "5858741",
	},
	"2023-07-20": {
		"1. open": "137.1900",
		"2. high": "140.3200",
		"3. low": "136.5600",
		"4. close": "138.3800",
		"5. volume": "10896330",
	},
	"2023-07-19": {
		"1. open": "135.5300",
		"2. high": "136.4500",
		"3. low": "135.1900",
		"4. close": "135.4800",
		"5. volume": "5519992",
	},
	"2023-07-18": {
		"1. open": "134.7100",
		"2. high": "135.9500",
		"3. low": "134.2900",
		"4. close": "135.3600",
		"5. volume": "3852058",
	},
	"2023-07-17": {
		"1. open": "133.2600",
		"2. high": "134.6100",
		"3. low": "133.1000",
		"4. close": "134.2400",
		"5. volume": "3168419",
	},
	"2023-07-14": {
		"1. open": "133.9100",
		"2. high": "133.9200",
		"3. low": "132.9400",
		"4. close": "133.4000",
		"5. volume": "2861496",
	},
	"2023-07-13": {
		"1. open": "133.5100",
		"2. high": "135.0700",
		"3. low": "133.3600",
		"4. close": "133.9200",
		"5. volume": "3221422",
	},
};

const labels = Array.from(Array(7)).fill("");

console.log(arr);

export const data = {
	labels,
	datasets: [
		{
			label: "",
			data: arr["2023-07-21"]["5. volume"],
			borderColor: "#1db954",
			backgroundColor: "#1db954a3",
		},
	],
};

const Stock = () => {
	return <Line options={options} data={data} />;
};

export default Stock;
