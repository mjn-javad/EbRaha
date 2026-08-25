import React from "react";
import { BadgeCheck, Headphones, PackageCheck, ScanSearch } from "lucide-react";

const services = [
  [BadgeCheck, "Curated selection", "Designer pieces chosen with a sharp eye."],
  [PackageCheck, "Considered delivery", "Carefully packed and delivered across the UAE."],
  [ScanSearch, "Private sourcing", "Send us a reference and we will source it for you."],
  [Headphones, "Human support", "Real assistance before and after your purchase."],
];

const TrustFeature2 = () => (
  <section className="service-editorial">
    <div className="service-editorial__heading">
      <p>The EbRaha standard</p>
      <h2>Luxury is in the way it feels.</h2>
    </div>
    <div className="service-editorial__grid">
      {services.map(([icon, title, copy], index) => (
        <article key={title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          {React.createElement(icon, { size: 25, strokeWidth: 1.25 })}
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  </section>
);

export default TrustFeature2;
