from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://vault:vault@localhost:5432/vault"
    jwt_secret: str = "change-me-in-production-use-a-long-random-string"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30
    admin_username: str = "admin"
    admin_password: str = "vault-admin"
    admin_display_name: str = "Mbithe Jeddie"
    admin_email: str = "mbithejeddie@gmail.com"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
