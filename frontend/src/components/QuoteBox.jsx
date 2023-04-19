import "./QuoteBox.css"
import { useEffect, useRef, useState } from "react";

const QuoteBox = ({author, quote, date}) => {
    const [intersectionRatio, changeIntersecting] = useState(0)
    const ref = useRef();

    useEffect(  () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach( (entry) => {
                changeIntersecting(entry.intersectionRatio)
            })
        })

        observer.observe(ref.current)
        return () => {
            observer.unobserve(ref.current)
        }
    }, []);


    return (
        <div ref={ref} className={`QuoteBox fade-in ${intersectionRatio > 0 ? "is-visible" : ""}`}>
            <p className="author-text">{author}</p>
            <p className="quote-text">{quote}</p>
            <p className="date-text">{date}</p>
        </div>
    )
}

export default QuoteBox;