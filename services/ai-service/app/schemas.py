from pydantic import BaseModel


class TaskDoc(BaseModel):
    id: str           # UUID string (Qdrant accepts int or UUID as point IDs)
    title: str
    description: str | None = None


class IndexRequest(BaseModel):
    tasks: list[TaskDoc]


class SearchRequest(BaseModel):
    query: str
    limit: int = 5


class SearchHit(BaseModel):
    id: str
    title: str
    score: float