import axios from "axios";

export const getSearchResults = async keywords => {
	try {
		const { data } = await axios.get(
			`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${
				import.meta.env.VITE_API_KEY
			}`
		);
		return data.bestMatches;
	} catch (err) {
		console.error(err);
	}
};
