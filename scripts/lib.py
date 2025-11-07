from base64 import b64decode
from io import BytesIO


def base64_to_bytesio(base64_string: str) -> BytesIO:
    """
    Converts a Base64 encoded string to a BytesIO object.

    Args:
        base64_string: The Base64 encoded string.

    Returns:
        A BytesIO object containing the decoded binary data.
    """
    # Ensure the input is a bytes-like object for b64decode
    decoded_bytes = b64decode(base64_string.encode("utf-8"))
    bytes_io_object = BytesIO(decoded_bytes)
    return bytes_io_object
