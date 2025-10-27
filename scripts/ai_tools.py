from datetime import datetime


def get_current_datetime():
    """
    Returns the current date and time as a string.
    """

    return datetime.now().strftime("%d/%m/%Y %H:%M:%S")
