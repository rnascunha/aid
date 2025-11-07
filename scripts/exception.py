class AIdException(Exception):
    def __init__(self, code: int, title: str, message: str = "AId unkwnow error"):
        super().__init__(self.message)
        self.message = message
        self.code = code
        self.title = title

    def json(self):
        return {"code": self.code, "error": self.title, "detail": self.message}


class ProviderException(AIdException):
    def __init__(self, message="Invalid provider"):
        self.message = message
        super().__init__(20, "Provider Error", self.message)


class ProviderAuthException(AIdException):
    def __init__(self, message="Invalid provider auth parameter"):
        self.message = message
        super().__init__(23, "Provider Auth Error", self.message)


class RunClientAIException(AIdException):
    def __init__(self, message="Error running API"):
        self.message = message
        super().__init__(32, "API Run Error", self.message)
