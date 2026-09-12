import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/utils';
import {
  Truck,
} from 'lucide-react';

export const LogisticsPage: React.FC = () => {
  const [origin, setOrigin] = useState('Ahmedabad');
  const [destination, setDestination] = useState('Vadodara');
  const [tonnage, setTonnage] = useState<number>(150);
  const [transportType, setTransportType] = useState('cryo_tanker');

  const originCoords: Record<string, { lat: number; lng: number; distToVadodara: number }> = {
    Ahmedabad: { lat: 22.9868, lng: 72.3814, distToVadodara: 112 },
    Surat: { lat: 21.1702, lng: 72.8311, distToVadodara: 154 },
    Jamnagar: { lat: 22.4707, lng: 70.0577, distToVadodara: 328 },
    Vadodara: { lat: 22.3072, lng: 73.1812, distToVadodara: 0 },
  };

  const distanceKm =
    origin === destination
      ? 24
      : Math.abs((originCoords[origin]?.distToVadodara || 100) - (originCoords[destination]?.distToVadodara || 0)) || 95;

  const ratePerTonKm = 4.2;
  const baseFreight = Math.round(distanceKm * ratePerTonKm * tonnage);
  const fuelSurcharge = Math.round(baseFreight * 0.12);
  const tollAndHandling = Math.round(distanceKm * 18);
  const totalFreight = baseFreight + fuelSurcharge + tollAndHandling;
  const costPerTon = Math.round(totalFreight / tonnage);
  const etaHours = Math.max(1.5, Math.round((distanceKm / 45) * 10) / 10);
  const carbonFootprintTons = Math.round((distanceKm * 0.00012 * tonnage) * 10) / 10;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Freight & Cryo-Logistics Calculator"
        description="Simulate bulk liquid CO₂ tanker routes, hazardous transit permits, and landed freight estimates across Gujarat."
        breadcrumbs={[
          { label: 'Marketplace', to: '/marketplace' },
          { label: 'Logistics' },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Route Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-neutral-300">
            <CardHeader className="border-b border-neutral-100 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-black" />
                <CardTitle>Route & Fleet Parameters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Select
                label="Origin Point (Emitter Hub)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                options={[
                  { value: 'Ahmedabad', label: 'UltraTech Cement (Sanand, Ahmedabad)' },
                  { value: 'Surat', label: 'Ambuja Cement (Hazira, Surat)' },
                  { value: 'Jamnagar', label: 'Tata Steel (Jamnagar Corridor)' },
                  { value: 'Vadodara', label: 'JSW Steel (Waghodia, Vadodara)' },
                ]}
              />

              <Select
                label="Destination Hub (Off-Taker)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                options={[
                  { value: 'Vadodara', label: 'GreenGrow Chemicals (Kheda/Vadodara Agri Hub)' },
                  { value: 'Ahmedabad', label: 'EcoBuild Materials (Naroda, Ahmedabad)' },
                  { value: 'Surat', label: 'CarbonFuel Labs (Surat Clean Tech Park)' },
                ]}
              />

              <Input
                label="Transport Payload (Metric Tons)"
                type="number"
                min="10"
                max="1000"
                value={tonnage}
                onChange={(e) => setTonnage(Number(e.target.value) || 10)}
              />

              <Select
                label="Specialized Transport Equipment"
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                options={[
                  { value: 'cryo_tanker', label: 'Cryogenic Semi-Trailer (LCO₂ @ -20°C, 20 bar)' },
                  { value: 'iso_tank', label: 'ISO Tank Container (Intermodal Multimodal)' },
                  { value: 'tube_trailer', label: 'High Pressure Tube Trailer (Gas @ 200 bar)' },
                ]}
              />

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
                <span className="font-semibold text-black">Hazmat Compliance:</span> Meets PESO & AIS-028 cryogenic transport regulations for liquid industrial CO₂.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Calculations & Route Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-neutral-500">Route Distance</span>
              <p className="mt-1 font-mono text-2xl font-black text-black">{distanceKm} km</p>
              <span className="text-[10px] text-neutral-400">Direct NH-48 Corridor</span>
            </div>

            <div className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-neutral-500">Estimated Transit ETA</span>
              <p className="mt-1 font-mono text-2xl font-black text-black">{etaHours} hrs</p>
              <span className="text-[10px] text-neutral-400">Speed restricted (45 km/h)</span>
            </div>

            <div className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-neutral-500">Freight Per Ton</span>
              <p className="mt-1 font-mono text-2xl font-black text-black">{formatINR(costPerTon)} / t</p>
              <span className="text-[10px] text-neutral-400">Inclusive of tolls</span>
            </div>
          </div>

          {/* Detailed Cost Breakdown Card */}
          <Card className="border-neutral-300">
            <CardHeader className="border-b border-neutral-100 pb-3">
              <div className="flex items-center justify-between w-full">
                <CardTitle>Logistics Breakdown for {tonnage} Metric Tons</CardTitle>
                <Badge variant="primary" size="sm">
                  Instant Quote
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Base Freight ({distanceKm} km × ₹{ratePerTonKm}/t·km):</span>
                  <span className="font-mono font-semibold text-black">{formatINR(baseFreight)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Cryogenic Refrigeration & Fuel Surcharge (12%):</span>
                  <span className="font-mono font-semibold text-black">{formatINR(fuelSurcharge)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">NHAI Fastag Tolls & Hazardous Cargo Handling:</span>
                  <span className="font-mono font-semibold text-black">{formatINR(tollAndHandling)}</span>
                </div>

                <div className="flex justify-between py-2 border-t border-neutral-300 text-sm font-bold">
                  <span className="text-black">Total Landed Freight Cost:</span>
                  <span className="font-mono text-black">{formatINR(totalFreight)}</span>
                </div>
              </div>

              {/* Carrier Details */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">Designated Fleet Carrier:</span>
                  <Badge variant="secondary" size="sm">
                    Verified Carrier
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-600">
                  CryoTrans Gujarat Logistics Ltd • Fleet GJ-05-CX Cryo-Tankers with GPS Telemetry & Pressure Logging.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Transport Carbon Footprint: <strong>{carbonFootprintTons} t CO₂e</strong></span>
                  <span>Scope 3 Logged</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPage;
