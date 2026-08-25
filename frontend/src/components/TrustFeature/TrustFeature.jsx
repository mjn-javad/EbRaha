import React from "react";
import { Headphones, RefreshCcw, Ruler, Truck } from "lucide-react";

const features = [
  [Truck, "Fast UAE delivery"],
  [RefreshCcw, "Easy size exchange"],
  [Ruler, "Extended sizing to 48"],
  [Headphones, "Personal assistance"],
];

const TrustFeature = () => (
  <div className="service-ribbon">
    <div className="service-ribbon__track">
      {[...features, ...features].map(([icon, label], index) => (
        <span key={`${label}-${index}`}>
          {React.createElement(icon, { size: 15, strokeWidth: 1.5 })}
          {label}
        </span>
      ))}
    </div>
  </div>
);

export default TrustFeature;
