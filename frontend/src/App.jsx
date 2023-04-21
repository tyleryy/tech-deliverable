import { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios'
import DatePicker from "react-datepicker"
import QuoteBox from "./components/QuoteBox";

import "react-datepicker/dist/react-datepicker.css";


function App() {

	const [name, changeName] = useState("");
	const [quote, changeQuote] = useState("");
	const [first_col, changeFirstCol] = useState([]);
	const [second_col, changeSecondCol] = useState([]);
	const [third_col, changeThirdCol] = useState([]);
	const [startDate, setStartDate] = useState("");

	const retrieveQuotes = async () => {
		const response = await axios.get("api/get-quote");
		const quote_list = response.data
		changeFirstCol(quote_list.slice(0, quote_list.length/3))
		changeSecondCol(quote_list.slice(quote_list.length/3, 2*(quote_list.length/3)))
		changeThirdCol(quote_list.slice(2*quote_list.length/3))
	};

	useEffect (
		 () => {
			try {
				retrieveQuotes();
			} catch (error) {
				alert("Unable to retrieve quotes");
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
			let quote_list;
			if (startDate) {
				const dateObj = new Date(startDate)
				dateObj.setHours(0, 0, 0, 0);
				const date_str = dateObj.toISOString().split('T')[0] + "T00:00:00.000"
				quote_list = await axios.get(`api/get-quote?max_age_timestamp=${date_str}`)
			} else {
				quote_list = await axios.get(`api/get-quote`)
			}
			quote_list = quote_list.data
			changeFirstCol(quote_list.slice(0, quote_list.length/3))
			changeSecondCol(quote_list.slice(quote_list.length/3, 2*(quote_list.length/3)))
			changeThirdCol(quote_list.slice(2*quote_list.length/3))

		} catch (error){
			alert("Error submiting form");
		}
	}

	const handleSelect = async (e) => {
		const dateObj = new Date(e)
		dateObj.setHours(0, 0, 0, 0);
		const date_str = dateObj.toISOString().split('T')[0] + "T00:00:00.000"
		let quote_list = await axios.get(`api/get-quote?max_age_timestamp=${date_str}`)
		quote_list = quote_list.data
		changeFirstCol(quote_list.slice(0, quote_list.length/3))
		changeSecondCol(quote_list.slice(quote_list.length/3, 2*(quote_list.length/3)))
		changeThirdCol(quote_list.slice(2*quote_list.length/3))
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
								src="https://hack.ics.uci.edu/static/media/hack-at-uci-logo.d33c5cee07c84da6f485d6a7e4ce1b4a.svg"
							/>
						</div>
						
						<div className="submit-quote-section">
							<form id="quote-form" className="submit-elems">
								<label htmlFor="input-name">Name:</label>
								<input className="quote-input" type="text" name="name" id="input-name" 
									value={name} onChange={(e) => changeName(e.target.value)} required />
								<label htmlFor="input-message">Quote:</label>
								<input className="quote-input" type="text" name="message" id="input-message" 
									value={quote} onChange={(e) => changeQuote(e.target.value)} required />
								<button title="Fill out the fields and press to submit your quote!" 
								className="quote-submit-button" type="submit" onClick={handleSubmit}>Submit</button>
							</form>
						</div>
						
					</div>

					
				</div>
			</div>
			<div className="calendarFilter">
				<h2 className="prevQuoteText">Previous Quotes</h2>
				<div title="Select from dropdown calendar to display quotes that were submitted in between the selected date to today's date."
				className="date-picker">

					<DatePicker 
						showIcon
						closeOnScroll={true}
						selected={startDate} 
						onSelect={handleSelect}
						onChange={(date) => setStartDate(date)} 
					/>
				</div>
			</div>

			<div className="quoteListing">

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
						first_col && first_col.map( (quoteEntry, index) => {
							return <QuoteBox
											key={index}
											author={quoteEntry.name}
											quote={quoteEntry.message}
											date={quoteEntry.time}/>
						} )
					}
				</div>
				<div>
					{
						<img className={first_col.length + second_col.length + third_col.length === 0 ? "" : "hidden"} 
						alt="petr-easter-egg" src="../petr.jpeg">
						</img>
					}

				</div>
			</div>
		</div>
	);
}

export default App;
