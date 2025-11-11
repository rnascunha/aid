from datetime import datetime
import requests
from exception import ToolParameterException


def get_current_datetime_wrapper(toolInfo):
    def get_current_datetime():
        """
        Returns the current date and time as a string.
        """

        return datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    return get_current_datetime


def get_user_location_wrapper(toolInfo):
    if len(toolInfo["geoLocationApiKey"]) == 0:
        raise ToolParameterException(
            f"Tool 'get_user_location' missing 'geoLocationApiKey' parameter"
        )

    def get_user_location(ip: str):
        """
        Get user location using its IP.

        Args:
            ip: ip of the user
        """
        response = requests.get(
            f"https://geo.ipify.org/api/v2/country?apiKey={toolInfo["geoLocationApiKey"]}&ipAddress={ip}"
        )
        if response.status_code == 200:
            data = response.json()
            return data
        raise ConnectionError(f"Error requesting location [{response.status_code}]")

    return get_user_location


def get_user_ip_wrapper(toolInfo):
    if len(toolInfo["ip"]) == 0:
        raise ToolParameterException(f"Tool 'get_user_ip' missing 'ip' parameter")

    def get_user_ip():
        """Get user ip"""

        return toolInfo["ip"]

    return get_user_ip


toolMap = {
    "get_current_datetime": get_current_datetime_wrapper,
    "get_user_location": get_user_location_wrapper,
    "get_user_ip": get_user_ip_wrapper,
}

toolList = toolMap.keys()
