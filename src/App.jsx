import { useEffect, useRef, useState } from "react";
import "./App.scss";
import Stock from "./components/Stock";
import axios from "axios";

function App() {
	const [searchResults, setSearchResults] = useState([]);
	const [searchResultsIsOpen, setSearchResultsIsOpen] = useState(false);
	const [globalQuote, setGlobalQuote] = useState({
		"01. symbol": "IBM",
		"02. open": "138.2100",
		"03. high": "139.7799",
		"04. low": "137.7600",
		"05. price": "138.9400",
		"06. volume": "5858741",
		"07. latest trading day": "2023-07-21",
		"08. previous close": "138.3800",
		"09. change": "0.5600",
		"10. change percent": "0.4047%",
	});
	const [timeOption, setTimeOption] = useState("1D");
	const [currentStockData, setCurrentStockData] = useState(null);
	const [currentSymbol, setCurrentSymbol] = useState("IBM");

	const timeOptions = {
		oneDay: -1,
		oneWeek: 6,
		oneMonth: 29,
		threeMonths: 89,
		oneYear: 12,
		fiveYears: 60,
	};

	const searchForSymbol = async keywords => {
		try {
			const { data } = await axios(
				`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo`
			);
			if (keywords != "") {
				setSearchResults(data.bestMatches);
			} else {
				setSearchResults([]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// just to hide search results
	useEffect(() => {
		if (searchResults) {
			setSearchResultsIsOpen(true);
		} else {
			setSearchResultsIsOpen(false);
		}
	}, [searchResults]);

	// Get price and info about current symbol
	const fetchGlobalQuote = async symbol => {
		try {
			const { data } = await axios(
				`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`
			);
			setGlobalQuote(data["Global Quote"]);
		} catch (err) {
			console.log(err);
		}
	};

	const getSymbol = async symbol => {
		setCurrentSymbol(symbol["1. symbol"]);
		await fetchGlobalQuote(symbol["1. symbol"]);
	};

	// Time option set to active
	const timeOptionRef = useRef();
	useEffect(() => {
		if (timeOptionRef.current) {
			const timeElements = timeOptionRef.current;
			Array(...timeElements.children).forEach(activeItem => {
				activeItem.addEventListener("click", () => {
					Array(...timeElements.children).forEach(notActiveItem => {
						if (notActiveItem.innerText !== activeItem.innerText) {
							notActiveItem.classList.remove("active");
						}
						activeItem.classList.add("active");
						setTimeOption(activeItem.innerText);
					});
				});
			});
		}
	}, [timeOptionRef]);

	const fetchStock = async (
		timeSeries,
		timeSeriesUrl,
		timeNumber,
		interval = ""
	) => {
		try {
			const { data } = await axios(
				`https://www.alphavantage.co/query?function=${timeSeriesUrl}&symbol=IBM${interval}&apikey=demo`
			);
			setCurrentStockData(
				Object.entries(data[timeSeries]).slice(0, timeNumber)
			);
		} catch (err) {
			console.log(err);
		}
	};

	// Update the charts by the new time when time option changes
	useEffect(() => {
		switch (timeOption) {
			case "1D":
				fetchStock(
					"Time Series (5min)",
					"TIME_SERIES_INTRADAY",
					timeOptions.oneDay,
					"&interval=5min"
				);
				break;
			case "1W":
				fetchStock(
					"Time Series (Daily)",
					"TIME_SERIES_DAILY",
					timeOptions.oneWeek
				);
				break;
			case "1M":
				fetchStock(
					"Time Series (Daily)",
					"TIME_SERIES_DAILY",
					timeOptions.oneMonth
				);
				break;
			case "3M":
				fetchStock(
					"Time Series (Daily)",
					"TIME_SERIES_DAILY",
					timeOptions.threeMonths
				);
				break;
			case "1Y":
				fetchStock(
					"Monthly Time Series",
					"TIME_SERIES_MONTHLY",
					timeOptions.oneYear
				);
				break;
			default:
				fetchStock(
					"Monthly Time Series",
					"TIME_SERIES_MONTHLY",
					timeOptions.fiveYears
				);
		}
	}, [timeOption]);

	// When symbol changes fetch new price and info about the changed symbol
	useEffect(() => {
		fetchGlobalQuote();
	}, [currentSymbol]);

	return (
		<>
			<main className="main">
				{/* Search */}
				<form
					className="search"
					onSubmit={e => {
						e.preventDefault();
						getSymbol(searchResults[0]);
					}}
				>
					<input
						type="text"
						placeholder="PayPal"
						onChange={e => {
							searchForSymbol(e.target.value);
						}}
						autoFocus
					/>
					<button type="submit">Search</button>
					{searchResultsIsOpen && (
						<ul className="search__results">
							{searchResults.map(item => (
								<li key={item["1. symbol"]}>
									<button
										onClick={e => {
											e.preventDefault();
											getSymbol(item);
										}}
									>
										{item["1. symbol"]}
									</button>
								</li>
							))}
						</ul>
					)}
				</form>
				<div className="stock__info">
					<h2>{globalQuote["01. symbol"]}</h2>
					<h4>${Number(globalQuote["05. price"]).toFixed(2)}</h4>
					<h6>
						Change:{" "}
						{globalQuote["09. change"] > 0
							? `+${globalQuote["09. change"]}`
							: `-${globalQuote["09. change"]}`}{" "}
						<span>({globalQuote["10. change percent"]})</span>
					</h6>
				</div>
				<div className="stock">
					{currentStockData && <Stock stockData={currentStockData} />}
				</div>
				<ul ref={timeOptionRef} className="time__option">
					<li className="active">1D</li>
					<li>1W</li>
					<li>1M</li>
					<li>3M</li>
					<li>1Y</li>
					<li>5Y</li>
				</ul>
			</main>
		</>
	);
}

export default App;
