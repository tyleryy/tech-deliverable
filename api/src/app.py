from datetime import datetime
from typing import Any, Union
from logging import getLogger

from fastapi import FastAPI, Form, status, HTTPException
from fastapi.responses import RedirectResponse

from services.database import JSONDatabase

app = FastAPI()

database: JSONDatabase[list[dict[str, Any]]
                       ] = JSONDatabase("data/database.json")

LOGGER = getLogger(__name__)


@app.on_event("startup")
def on_startup() -> None:
    if "posts" not in database:
        print("Adding posts entry to database")
        database["posts"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    database.close()


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function.
    """
    now = datetime.now().replace(microsecond=0)
    post = {
        "name": name,
        "message": message,
        "time": now.isoformat(),
    }
    database["posts"].append(post)

    return status.HTTP_303_SEE_OTHER


@app.get("/get-quote", status_code=status.HTTP_200_OK)
def get_quote(name: Union[str, None] = None,
              message: Union[str, None] = None,
              max_age_timestamp: Union[str, None] = None) -> list[dict]:
    """
    Search for quotes that match the specified
    fields, passed in by query params.

    If a query param is not given (it's value is None),
    it is not considered in the search.

    max_age_timestamp must be a ISO formatted timestamp string.
    If it is greater than the current time, error is thrown.

    if no matching quotes, [] is returned
    """

    if max_age_timestamp:
        try:
            max_age = datetime.fromisoformat(max_age_timestamp)
        except ValueError:
            LOGGER.error("Timestamp string was not ISO format")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Timestamp query param was not ISO format")
        # check if max age timestamp is after current time
        if max_age > datetime.now():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="max age of quotes is after current time")

    def quote_equality(quote: dict[str, str]) -> bool:
        """
        Check if quote has matching fields.
        """
        try:
            if name and quote["name"] != name:
                return False
            if message and quote["message"] != message:
                return False
            if max_age_timestamp:
                if datetime.fromisoformat(quote["time"]) < max_age:
                    return False
        except KeyError as exc:  # skip if bad data
            LOGGER.warning(f"Quote post is missing '{exc}' field")
            return False
        return True

    matched_quotes = []

    for quote_post in database["posts"]:
        if quote_equality(quote_post):
            matched_quotes.append(quote_post)

    return matched_quotes
