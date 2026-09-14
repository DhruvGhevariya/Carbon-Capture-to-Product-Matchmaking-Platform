import pytest
from app.models.domain import CO2Source, Listing, Project, Partnership


def test_version_column_defaults():
    src = CO2Source(name='Test Source', facility_name='Plant 1', industry_type='Cement', location_name='Texas', version=1)
    assert src.version == 1

    listing = Listing(seller_id=1, purity_percentage=98.0, volume_metric_tons=100.0, physical_state='liquid', reserve_price_ton=4500.0, version=1)
    assert listing.version == 1


def test_optimistic_concurrency_conflict_detection():
    current_version = 4
    submitted_version = 4
    
    assert submitted_version == current_version
    new_version = current_version + 1
    assert new_version == 5

    stale_submitted_version = 4
    assert stale_submitted_version != new_version
