from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import properties, enquiry

app = FastAPI(title="RG Property Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties.router, prefix="/properties", tags=["Properties"])
app.include_router(enquiry.router, prefix="/enquiry", tags=["Enquiry"])

@app.get("/")
def root():
    return {"message": "RG Property Hub API running"}
