from datetime import datetime
from database import db
from models import URL, ClickEvent


def seed():
    """Seed the database with sample data."""
    urls_data = [
        ("https://www.codester.com/items/3423/easy-url-shortener-with-analytics-php-mysql", "NDQ", "2017-03-07T10:30:00", 2),
        ("http://www.google.com", "NDM", "2017-03-03T14:20:00", 2),
        ("http://ti.tc", "NDI", "2017-03-01T09:15:00", 4),
        ("https://www.codester.com/items/3423/easy-url-shortener-with-analytics-php-mysql", "NDE", "2017-03-01T11:45:00", 1),
        ("http://google.com", "NDA", "2017-02-28T08:00:00", 2),
        ("http://google.com", "Mzk", "2017-02-28T16:30:00", 1),
        ("https://www.codester.com/", "URLSI", "2017-02-27T12:00:00", 2),
        ("https://db.tt/K4OBP9x2", "Mzc", "2017-02-27T09:00:00", 1),
        ("https://www.codester.com/", "MzY", "2017-02-26T15:00:00", 2),
        ("https://www.youtube.com/watch?v=Gh3m0sQNdu8", "MzU", "2017-02-26T10:00:00", 1),
    ]

    for original_url, short_code, created_at, click_count in urls_data:
        url = URL(
            original_url=original_url,
            short_code=short_code,
            created_at=datetime.fromisoformat(created_at),
            click_count=click_count,
        )
        db.session.add(url)

    db.session.commit()

    # Add click events
    click_events_data = [
        (1, "2017-03-07T12:00:00"),
        (1, "2017-03-06T15:00:00"),
        (2, "2017-03-05T10:00:00"),
        (2, "2017-03-04T14:00:00"),
        (3, "2017-03-03T09:00:00"),
        (3, "2017-03-02T11:00:00"),
        (3, "2017-03-01T16:00:00"),
        (3, "2017-02-28T08:00:00"),
        (4, "2017-03-01T13:00:00"),
        (5, "2017-02-28T10:00:00"),
        (5, "2017-02-27T15:00:00"),
        (6, "2017-02-28T17:00:00"),
        (7, "2017-02-27T14:00:00"),
        (7, "2017-02-26T11:00:00"),
        (8, "2017-02-27T10:00:00"),
        (9, "2017-02-26T16:00:00"),
        (9, "2017-02-25T09:00:00"),
        (10, "2017-02-26T12:00:00"),
    ]

    for url_id, clicked_at in click_events_data:
        event = ClickEvent(
            url_id=url_id,
            clicked_at=datetime.fromisoformat(clicked_at),
        )
        db.session.add(event)

    db.session.commit()
    print("Seed data loaded successfully!")
