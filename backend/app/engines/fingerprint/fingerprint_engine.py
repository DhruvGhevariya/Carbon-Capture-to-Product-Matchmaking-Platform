from datetime import datetime, timezone
from typing import Dict, Any, List
from app.core.config import settings


class CO2FingerprintEngine:
    """
    Evaluates raw CO2 stream attributes (purity, volume, pressure, temperature, impurities)
    and computes normalized quality scores, readiness tiers, and suitable utilization grades.
    Stores reproducible versioning metadata.
    """

    @classmethod
    def generate_fingerprint(cls, source_data: Dict[str, Any]) -> Dict[str, Any]:
        purity: float = float(source_data.get("purity_percentage", 95.0))
        daily_volume: float = float(source_data.get("daily_capture_tonnes", 50.0))
        pressure_bar: float = float(source_data.get("pressure_bar", 1.013))
        temperature_c: float = float(source_data.get("temperature_c", 25.0))

        # 1. Purity Score (0 - 100)
        if purity >= 99.9:
            purity_score = 100.0
        elif purity >= 95.0:
            purity_score = 80.0 + ((purity - 95.0) / 4.9) * 20.0
        elif purity >= 85.0:
            purity_score = 50.0 + ((purity - 85.0) / 10.0) * 30.0
        else:
            purity_score = max(0.0, (purity / 85.0) * 50.0)

        # 2. Volume Score (0 - 100)
        volume_score = min(100.0, max(10.0, (daily_volume / 500.0) * 100.0))

        # 3. Pressure Score (0 - 100)
        if pressure_bar >= 10.0:
            pressure_score = 95.0
        elif pressure_bar >= 2.0:
            pressure_score = 75.0
        else:
            pressure_score = 50.0

        # 4. Temperature Score (0 - 100)
        if 15.0 <= temperature_c <= 40.0:
            temperature_score = 95.0
        else:
            temperature_score = max(30.0, 95.0 - abs(temperature_c - 25.0) * 1.5)

        # Overall Quality Score
        overall = (purity_score * 0.40) + (volume_score * 0.30) + (pressure_score * 0.15) + (temperature_score * 0.15)
        overall_quality_score = round(overall, 1)

        # Readiness Classification
        if purity >= 98.0 and pressure_bar >= 5.0:
            readiness = "READY"
        elif purity >= 92.0:
            readiness = "CONDITIONALLY_READY"
        elif purity >= 80.0:
            readiness = "REQUIRES_TREATMENT"
        else:
            readiness = "NOT_READY"

        # Suitable Grades
        suitable_grades: List[str] = []
        if purity >= 99.9:
            suitable_grades.extend(["Food & Beverage Grade", "Pharma Grade", "Electronics Grade"])
        if purity >= 97.0:
            suitable_grades.extend(["Chemical Synthesis", "Methanol Production", "Synthetic Fuels"])
        if purity >= 90.0:
            suitable_grades.extend(["Concrete Mineralization", "Algae Cultivation", "Building Materials"])
        if not suitable_grades:
            suitable_grades.append("Geological Sequestration Pre-treatment Required")

        return {
            "algorithm_version": settings.ALGORITHM_VERSION,
            "fingerprint_version": 1,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "input_snapshot_json": {
                "purity_percentage": purity,
                "daily_capture_tonnes": daily_volume,
                "pressure_bar": pressure_bar,
                "temperature_c": temperature_c,
            },
            "purity_score": round(purity_score, 1),
            "volume_score": round(volume_score, 1),
            "pressure_score": round(pressure_score, 1),
            "temperature_score": round(temperature_score, 1),
            "overall_quality_score": overall_quality_score,
            "readiness_classification": readiness,
            "suitable_grades": suitable_grades,
        }


fingerprint_engine = CO2FingerprintEngine()
