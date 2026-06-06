from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_poems: int = 0
    published: int = 0
    drafts: int = 0
    total_views: int = 0
    subscribers: int = 0
    views_change: int = 0


class Manuscript(BaseModel):
    id: str
    title: str
    last_edited: str
    status: str
    icon: str


class Activity(BaseModel):
    id: str
    timestamp: str
    message: str
    type: str


class MonthlyGrowth(BaseModel):
    month: str
    count: int



