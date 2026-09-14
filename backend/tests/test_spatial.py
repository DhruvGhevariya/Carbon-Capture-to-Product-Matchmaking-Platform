import asyncio
import pytest
from app.core.spatial import calculate_haversine_distance, query_nearby_resources_postgis


def test_haversine_distance_calculation():
    # Houston, TX (29.7604, -95.3698) to Corpus Christi, TX (27.8006, -97.3964) ~ 300 km
    dist = calculate_haversine_distance(29.7604, -95.3698, 27.8006, -97.3964)
    assert 280.0 <= dist <= 320.0, f"Expected distance ~300 km, got {dist}"


def test_spatial_distance_query():
    # Test Haversine query helper logic
    dist = calculate_haversine_distance(29.7604, -95.3698, 29.8000, -95.4000)
    assert dist < 50.0

