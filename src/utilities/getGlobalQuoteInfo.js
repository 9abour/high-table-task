import axios from "axios";

export const getGlobalQuoteInfo = async symbol => {
	try {
		const { data } = await axios(
			`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${
				import.meta.env.VITE_API_KEY
			}`
		);
		return data["Global Quote"];
	} catch (err) {
		console.log(err);
	}
};
