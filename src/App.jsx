import { useEffect, useRef, useState } from "react";
import "./App.scss";
import Stock from "./components/Stock";
import axios from "axios";

function App() {
	const [searchResults, setSearchResults] = useState([]);
	const [searchResultsIsOpen, setSearchResultsIsOpen] = useState(false);
	const [globalQuote, setGlobalQuote] = useState(null);
	const [timeOption, setTimeOption] = useState("1D");
	const [currentStockData, setCurrentStockData] = useState(null);
	const [currentSymbol, setCurrentSymbol] = useState("GOOG");

	const timeOptions = {
		oneDay: -1,
		oneWeek: 7,
		oneMonth: 30,
		threeMonths: 90,
		oneYear: 12,
		fiveYears: 60,
	};

	const searchForSymbol = async keywords => {
		try {
			const { data } = await axios(
				`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${
					import.meta.env.VITE_API_KEY
				}`
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

	// Get price and info about current symbol
	const fetchGlobalQuote = async () => {
		try {
			const { data } = await axios(
				`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${currentSymbol}&apikey=${
					import.meta.env.VITE_API_KEY
				}`
			);
			setGlobalQuote(data["Global Quote"]);
		} catch (err) {
			console.log(err);
		}
	};

	const getSymbol = symbol => {
		setCurrentSymbol(symbol);
		fetchGlobalQuote(symbol);
	};

	// Time option set to active
	const timeOptionsRef = useRef();
	useEffect(() => {
		if (timeOptionsRef.current) {
			const timeElements = timeOptionsRef.current;
			Array(...timeElements.children).forEach(activeItem => {
				activeItem.addEventListener("click", () => {
					Array(...timeElements.children).forEach(notActiveItem => {
						if (notActiveItem.innerText != activeItem.innerText) {
							notActiveItem.classList.remove("active");
						}
						activeItem.classList.add("active");
						setTimeOption(activeItem.innerText);
					});
				});
			});
		}
	}, [timeOptionsRef]);

	const getStockData = async (
		timeSeries,
		timeSeriesUrl,
		timeNumber,
		interval = ""
	) => {
		try {
			const { data } = await axios(
				`https://www.alphavantage.co/query?function=${timeSeriesUrl}&symbol=${currentSymbol}${interval}&apikey=${
					import.meta.env.VITE_API_KEY
				}`
			);
			setCurrentStockData(
				Object.entries(data[timeSeries]).slice(0, timeNumber)
			);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchStock = () => {
		switch (timeOption) {
			case "1D":
				getStockData(
					"Time Series (5min)",
					"TIME_SERIES_INTRADAY",
					timeOptions.oneDay,
					"&interval=5min"
				);
				break;
			case "1W":
				getStockData(
					"Time Series (Daily)",
					"TIME_SERIES_DAILY",
					timeOptions.oneWeek
				);
				break;
			case "1M":
				getStockData(
					"Time Series (Daily)",
					"TIME_SERIES_DAILY",
					timeOptions.oneMonth
				);
				break;
			case "3M":
				getStockData(
					"Time Series (Daily)",
					"TIME_SERIES_DAILY",
					timeOptions.threeMonths
				);
				break;
			case "1Y":
				getStockData(
					"Monthly Time Series",
					"TIME_SERIES_MONTHLY",
					timeOptions.oneYear
				);
				break;
			default:
				getStockData(
					"Monthly Time Series",
					"TIME_SERIES_MONTHLY",
					timeOptions.fiveYears
				);
		}
	};

	// Update the charts and stack info when the symbol changes
	useEffect(() => {
		fetchStock();
		fetchGlobalQuote();
	}, [currentSymbol]);

	// Just update the charts by the new time when time option changes
	useEffect(() => {
		fetchStock();
	}, [timeOption]);

	const inputRef = useRef();
	useEffect(() => {
		if (inputRef.current != null) {
			inputRef.current.addEventListener("focus", () => {
				setSearchResultsIsOpen(true);
			});

			inputRef.current.addEventListener("focusout", () => {
				setTimeout(() => {
					setSearchResultsIsOpen(false);
				}, 200);
			});
		}
	}, [inputRef]);

	return (
		<main className="main">
			<form
				className="search"
				onSubmit={e => {
					e.preventDefault();
					getSymbol(searchResults[0]["1. symbol"]);
					inputRef.current.blur();
				}}
			>
				<input
					type="text"
					placeholder="PayPal"
					onChange={e => {
						searchForSymbol(e.target.value);
					}}
					ref={inputRef}
				/>
				<button type="submit">Search</button>
				<ul className="search__results">
					{searchResultsIsOpen && (
						<>
							{searchResults.length ? (
								searchResults.map(item => (
									<li key={item["1. symbol"]}>
										<button type="submit">{item["1. symbol"]}</button>
									</li>
								))
							) : (
								<h4 className="loading">No results!</h4>
							)}
						</>
					)}
				</ul>
			</form>
			{globalQuote && (
				<div className="stock__info">
					<h2>{globalQuote["01. symbol"]}</h2>
					<h4>${Number(globalQuote["05. price"]).toFixed(2)}</h4>
					<h6>
						Change: {globalQuote["09. change"]}{" "}
						<span>({globalQuote["10. change percent"]})</span>
					</h6>
				</div>
			)}
			<div className="stock">
				{currentStockData && <Stock stockData={currentStockData} />}
			</div>
			<ul ref={timeOptionsRef} className="time__option">
				<li className="active">1D</li>
				<li>1W</li>
				<li>1M</li>
				<li>3M</li>
				<li>1Y</li>
				<li>5Y</li>
			</ul>
		</main>
	);
}

export default App;
