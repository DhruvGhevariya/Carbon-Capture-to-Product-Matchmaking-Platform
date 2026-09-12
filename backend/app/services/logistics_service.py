import math
from typing import Dict, Any


class LogisticsService:
    @staticmethod
    def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates great-circle distance between two coordinates in kilometers,
        scaled by a 1.25 road network winding factor.
        """
        R = 6371.0  # Earth mean radius in kilometers

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2.0) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2.0) ** 2
        )
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        direct_km = R * c
        road_km = direct_km * 1.25  # Industrial winding coefficient
        return round(max(road_km, 5.0), 2)

    @classmethod
    def estimate_logistics(
        cls,
        origin_lat: float,
        origin_lon: float,
        dest_lat: float,
        dest_lon: float,
        volume_tons: float = 1.0,
    ) -> Dict[str, Any]:
        """
        Computes road haulage distance, ETA, and transport freight costs.
        Returns:
            distance_km: float
            eta_hours: float
            transport_cost: float
        """
        distance_km = cls.calculate_haversine_distance(origin_lat, origin_lon, dest_lat, dest_lon)
        
        # ETA calculation: average road tanker speed of 45 km/h + 0.5 hr loading/unloading buffer
        eta_hours = round((distance_km / 45.0) + 0.5, 1)

        # Transport cost estimation: $5.00/ton baseline handling + $0.22 per ton-kilometer
        transport_cost = round(5.00 + (distance_km * 0.22), 2)
        total_freight_cost = round(transport_cost * volume_tons, 2)

        # Diesel carbon debt accounting
        diesel_emissions = round(distance_km * 2.0 * 0.0009, 4)
        net_abated = round(max(volume_tons - diesel_emissions, 0.0), 4)
        emission_ratio = round((diesel_emissions / volume_tons) * 100, 3) if volume_tons > 0 else 0.0

        return {
            "distance_km": distance_km,
            "eta_hours": eta_hours,
            "transport_cost": transport_cost,
            "transit_duration_hours": eta_hours,
            "transport_cost_per_ton": transport_cost,
            "total_freight_cost": total_freight_cost,
            "carbon_accounting": {
                "gross_co2_diverted_tons": round(volume_tons, 2),
                "diesel_haulage_emissions_tons": diesel_emissions,
                "net_abated_co2_tons": net_abated,
                "emission_ratio_percentage": emission_ratio,
            }
        }


logistics_service = LogisticsService()
