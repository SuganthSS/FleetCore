from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="FleetCore ML Engine",
    version="1.0.0",
    description="Predictive Analytics and AI Engine for FleetCore"
)

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="UP",
        service="FleetCore ML Engine"
    )
