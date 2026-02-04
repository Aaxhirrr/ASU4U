"use client";

import { useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, HeatmapLayerF } from "@react-google-maps/api";
import { Zap, Navigation, Layers, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const GOOGLE_MAPS_LIBRARIES: ("visualization" | "places")[] = ["visualization"];
const ASU_CENTER = { lat: 33.4242, lng: -111.9281 };

const MAP_STYLES = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

const HEATMAP_POINTS_RAW = [
    { lat: 33.4235, lng: -111.9289, weight: 5 }, // Hayden
    { lat: 33.4175, lng: -111.9344, weight: 3 }, // SDFC
    { lat: 33.4255, lng: -111.9400, weight: 4 }, // West campus
    { lat: 33.4215, lng: -111.9250, weight: 2 }, // East
    { lat: 33.4245, lng: -111.9315, weight: 5 }, // MU
];

export function VibeMapFeature({ isFullScreen = false }: { isFullScreen?: boolean }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: GOOGLE_MAPS_LIBRARIES
    });
    const [pingSent, setPingSent] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        styles: MAP_STYLES,
        minZoom: 15,
        maxZoom: 18,
    }), []);

    const heatmapData = useMemo(() => {
        if (!isLoaded || typeof google === 'undefined') return [];
        return HEATMAP_POINTS_RAW.map(p => ({
            location: new google.maps.LatLng(p.lat, p.lng),
            weight: p.weight
        }));
    }, [isLoaded]);

    const handlePing = () => {
        setPingSent(true);
        setTimeout(() => setPingSent(false), 3000);
    };

    return (
        <div className={cn("flex h-full", isFullScreen ? "flex-col md:flex-row" : "")}>
            <div className={cn(
                "w-full md:w-80 h-full border-r border-white/5 bg-black/40 backdrop-blur-xl p-8 space-y-8 flex flex-col z-20",
                isFullScreen ? "pt-28" : "pt-24"
            )}>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold tracking-widest uppercase">Live Activity</span>
                    </div>
                    <h3 className="text-4xl font-light text-white">Hayden<br /><span className="font-bold">Library</span></h3>
                    <p className="text-white/40 text-sm leading-relaxed">High concentration of focus energy detected. 45 students active.</p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Hotspots</h4>
                    {[
                        { name: "Memorial Union", val: 89, color: "bg-rose-500" },
                        { name: "SDFC Fields", val: 64, color: "bg-orange-500" },
                        { name: "Secret Garden", val: 12, color: "bg-blue-500" },
                    ].map((spot, i) => (
                        <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5" onClick={() => {
                            map?.panTo(HEATMAP_POINTS_RAW[i]);
                        }}>
                            <span className="text-sm font-medium text-gray-200">{spot.name}</span>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full", spot.color)} />
                                <span className="text-xs font-mono text-white/50">{spot.val}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePing}
                    disabled={pingSent}
                    className={cn(
                        "mt-auto py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg",
                        pingSent ? "bg-white text-emerald-600 shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "bg-emerald-500 text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    )}
                >
                    {pingSent ? "PING SENT! 📍" : "PING YOUR LOCATION"}
                </button>
            </div>

            <div className="flex-1 h-full relative bg-[#212121]">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={ASU_CENTER}
                        zoom={16}
                        options={mapOptions}
                        onLoad={(map) => setMap(map)}
                    >
                        <HeatmapLayerF
                            data={heatmapData}
                            options={{
                                radius: 60,
                                opacity: 0.8,
                                gradient: ['rgba(0,0,0,0)', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
                            }}
                        />
                    </GoogleMap>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                <div className="absolute bottom-8 right-8 flex gap-2">
                    <button className="p-4 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10" onClick={() => map?.panTo(ASU_CENTER)}>
                        <Navigation className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
