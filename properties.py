from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from models import Property

router = APIRouter()

PROPERTIES: list[Property] = [
    Property(
        id=1, title="Luxury 3BHK Apartment", price=8500000,
        location="Banjara Hills, Hyderabad", bedrooms=3, bathrooms=2,
        area=1850, type="Apartment", status="For Sale", featured=True,
        description="Stunning 3BHK apartment in the heart of Banjara Hills with premium fittings, modular kitchen, and panoramic city views. Gated community with 24/7 security, gym, and swimming pool.",
        images=[
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        ]
    ),
    Property(
        id=2, title="Modern 2BHK Flat", price=4200000,
        location="Kondapur, Hyderabad", bedrooms=2, bathrooms=2,
        area=1100, type="Apartment", status="For Sale", featured=True,
        description="Well-designed 2BHK flat in a prime IT corridor location. Close to major tech parks, schools, and hospitals. Ready to move in with all amenities.",
        images=[
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
        ]
    ),
    Property(
        id=3, title="Independent Villa", price=18000000,
        location="Jubilee Hills, Hyderabad", bedrooms=4, bathrooms=4,
        area=3500, type="Villa", status="For Sale", featured=True,
        description="Exquisite 4BHK independent villa with private garden, home theatre, and rooftop terrace. Premium locality with excellent connectivity to all major areas.",
        images=[
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        ]
    ),
    Property(
        id=4, title="Studio Apartment", price=18000,
        location="Gachibowli, Hyderabad", bedrooms=1, bathrooms=1,
        area=550, type="Apartment", status="For Rent", featured=False,
        description="Fully furnished studio apartment ideal for working professionals. Walking distance from major IT companies. Includes high-speed WiFi, AC, and housekeeping.",
        images=[
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
        ]
    ),
    Property(
        id=5, title="Spacious 2BHK Rental", price=25000,
        location="Madhapur, Hyderabad", bedrooms=2, bathrooms=2,
        area=1200, type="Apartment", status="For Rent", featured=True,
        description="Semi-furnished 2BHK in a well-maintained society. Covered parking, power backup, and children's play area. Ideal for families.",
        images=[
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
            "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
        ]
    ),
    Property(
        id=6, title="Commercial Office Space", price=12000000,
        location="HITEC City, Hyderabad", bedrooms=0, bathrooms=4,
        area=4000, type="Commercial", status="For Sale", featured=False,
        description="Premium Grade-A office space in HITEC City. Open floor plan with modern interiors, server room, conference halls, and dedicated parking for 20 cars.",
        images=[
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
        ]
    ),
    Property(
        id=7, title="Residential Plot 200 Sq Yd", price=6500000,
        location="Shamshabad, Hyderabad", bedrooms=0, bathrooms=0,
        area=1800, type="Plot", status="For Sale", featured=False,
        description="HMDA approved residential plot in a fast-developing area near the airport. Clear title, all approvals in place. Excellent investment opportunity.",
        images=[
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        ]
    ),
    Property(
        id=8, title="Penthouse 4BHK", price=25000000,
        location="Film Nagar, Hyderabad", bedrooms=4, bathrooms=5,
        area=5200, type="Apartment", status="For Sale", featured=True,
        description="Ultra-luxury penthouse with private pool, sky lounge, and 360° city views. Imported marble flooring, smart home automation, and dedicated concierge service.",
        images=[
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
        ]
    ),
]

@router.get("/")
def get_properties(
    location: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    status: Optional[str] = None,
    type: Optional[str] = None,
):
    result = PROPERTIES
    if location:
        result = [p for p in result if location.lower() in p.location.lower()]
    if min_price is not None:
        result = [p for p in result if p.price >= min_price]
    if max_price is not None:
        result = [p for p in result if p.price <= max_price]
    if status:
        result = [p for p in result if p.status == status]
    if type:
        result = [p for p in result if p.type == type]
    return result

@router.get("/featured")
def get_featured():
    return [p for p in PROPERTIES if p.featured]

@router.get("/{property_id}")
def get_property(property_id: int):
    prop = next((p for p in PROPERTIES if p.id == property_id), None)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop
