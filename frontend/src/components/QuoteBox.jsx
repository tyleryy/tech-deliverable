import "./QuoteBox.css"

const QuoteBox = ({author, quote, date}) => {


    return (
        <div className="QuoteBox">
            <p className="author-text">{author}</p>
            <p className="quote-text">{quote}</p>
            <p className="date-text">{date}</p>
        </div>
    )
}

export default QuoteBox;