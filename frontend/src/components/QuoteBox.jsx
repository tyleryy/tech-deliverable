import "./QuoteBox.css"
import { useEffect, useRef, useState } from "react";

const QuoteBox = ({author, quote, date}) => {
    const [intersectionRatio, changeIntersecting] = useState(0)
    const ref = useRef();
    const options = {
        threshold: [0, 0.25, 0.5, 0.75, 1]
      };

    useEffect(  () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach( (entry) => {
                changeIntersecting(entry.intersectionRatio)
            })
        }, options)

        observer.observe(ref.current)
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, []);


    return (
        <div ref={ref} className={`QuoteBox fade-in ${intersectionRatio > 0 ? "is-visible" : ""}`}>
            <p className="quote-text">"{quote}"</p>
            <p className="author-text">- {author}</p>
        </div>
    )
}

export default QuoteBox;