def get_password_hash(password: str) -> str:
    """hash password (mock)

    Parameters
    ----------
    password : str
        password

    Returns
    -------
    str
        hashed passwaord
    """
    return password + "qawsedrftgyhujikolp"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password
