import { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios'
import QuoteBox from "./components/QuoteBox";


function App() {

	const [name, changeName] = useState("");
	const [quote, changeQuote] = useState("");
	const [first_col, changeFirstCol] = useState([]);
	const [second_col, changeSecondCol] = useState([]);
	const [third_col, changeThirdCol] = useState([]);

	useEffect (
		 () => {
			try {
				const retrieveQuotes = async () => {
					const response = await axios.get("api/get-quote");
					const quote_list = response.data
					changeFirstCol(quote_list.slice(0, quote_list.length/3))
					changeSecondCol(quote_list.slice(quote_list.length/3, 2*(quote_list.length/3)))
					changeThirdCol(quote_list.slice(2*quote_list.length/3))
				};
				retrieveQuotes();
			} catch (error) {
				alert(`${error.name} occurred: ${error.message}`);
			}

		},
		[]
	)

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const form = new FormData;
			form.append("name", name);
			form.append("message", quote);
			await axios.post('api/quote', form);
			changeName("")
			changeQuote("")
		} catch (error){
			alert(`${error.name} occurred: ${error.message}`);
		}
	}

	return (
		<div className="App">
			
			<div className="center-menu">
				<div className="center-topbar">

					<div className="topbar">
						<div className="topbar-text">

							<div className="title">
								<h1 className="deliverable-header">Hack @ UCI Tech Deliverable</h1>
								<h2 className="submit-quote-text">Submit a quote</h2>
							</div>
							<img 
								className="quote-image"
								src="https://file.notion.so/f/s/c9f6ea9f-45de-4088-a0c9-2563f8e4b4b4/quotebook.png?id=523e9bd3-b49e-4db4-af12-132698ae81dd&table=block&spaceId=4e23f586-3e2e-403c-b0fd-e532279b0d08&expirationTimestamp=1681623817510&signature=kS5ssaNgmRI3fVcdbOIYevkBag2IdvqfqkERcxMNeVE&downloadName=quotebook.png"
							/>

						</div>
						
						<div className="submit-quote-section">
							<form id="quote-form" className="submit-elems">
								<label htmlFor="input-name">Name</label>
								<input type="text" name="name" id="input-name" value={name} onChange={(e) => changeName(e.target.value)} required />
								<label htmlFor="input-message">Quote</label>
								<input type="text" name="message" id="input-message" value={quote} onChange={(e) => changeQuote(e.target.value)} required />
								<button type="submit" onClick={handleSubmit}>Submit</button>
							</form>
						</div>
						
					</div>


				</div>
			</div>

			<h2 className="prevQuoteText">Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}

			<div className="quoteListing">
				<div className="columns">
					{
						first_col && first_col.map( (quoteEntry, index) => {
							return <QuoteBox
											key={index}
											author={quoteEntry.name}
											quote={quoteEntry.message}
											date={quoteEntry.time}/>
						} )
					}
				</div>
				<div className="columns">
					{
						second_col && second_col.map( (quoteEntry, index) => {
								return <QuoteBox
												key={index}
												author={quoteEntry.name}
												quote={quoteEntry.message}
												date={quoteEntry.time}/>
						} )
					}
				</div>
				<div className="columns">
					{
						third_col && third_col.map( (quoteEntry, index) => {
								return <QuoteBox
												key={index}
												author={quoteEntry.name}
												quote={quoteEntry.message}
												date={quoteEntry.time}/>
						} )
					}
				</div>
			</div>
		</div>
	);
}

export default App;
