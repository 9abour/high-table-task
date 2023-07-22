import { useState } from "react";
import "./App.scss";
import Stock from "./components/Stock";
import axios from "axios";

function App() {
	const [searchResults, setSearchResults] = useState([]);

	const searchForSymbol = async keywords => {
		const { data } = await axios(
			`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=BG8QX229T25UMVRO`
		);
		try {
			if (keywords != "") {
				setSearchResults(data.bestMatches);
			} else {
				setSearchResults([]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	console.log(searchResults);

	return (
		<>
			<main className="main">
				{/* Search */}
				<form className="search">
					<input
						type="text"
						placeholder="PayPal"
						onChange={e => {
							searchForSymbol(e.target.value);
						}}
					/>
					<button type="submit">Search</button>
					{!searchResults ||
						(searchResults.length > 0 && (
							<div className="search__results">
								{searchResults.map(item => (
									<div key={item["1. symbol"]}>
										<button>{item["1. symbol"]}</button>
									</div>
								))}
							</div>
						))}
				</form>
				<div className="stock__info">
					<h2>PayPal</h2>
					<h4>$130.58</h4>
					<h6>
						$5.0 (+4.31%) <span>Tody</span>
					</h6>
					<h6>
						$5.0 (+4.31%) <span>Tody</span>
					</h6>
				</div>
				<div>
					<Stock />
				</div>
			</main>
		</>
	);
}

export default App;
