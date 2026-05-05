from pydantic import BaseModel
from typing import Optional, List

class Property(BaseModel):
    id: int
    title: str
    price: int
    location: str
    bedrooms: int
    bathrooms: int
    area: int          # sqft
    type: str          # Apartment / Villa / Plot / Commercial
    status: str        # For Sale / For Rent
    description: str
    images: List[str]
    featured: bool = False
    whatsapp: str = "+919876543210"

class EnquiryIn(BaseModel):
    name: str
    phone: str
    property_id: Optional[int] = None
    property_title: Optional[str] = ""
    message: str
