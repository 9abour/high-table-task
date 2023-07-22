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
			display: false,
		},
		title: {
			display: false,
		},
	},
};

const Stock = data => {
	const labels = data.stockData.map(item => item[0]);
	return (
		<Line
			options={options}
			data={{
				labels,
				datasets: [
					{
						label: "",
						data: data.stockData.map(item => item[1]["4. close"]),
						borderColor: "#1db954",
						backgroundColor: "#1db954a3",
					},
				],
			}}
		/>
	);
};

export default Stock;
