import React from "react";
import { ArrowUpRight, Camera, MessageCircleMore, Search } from "lucide-react";

const ProductFinderBox = () => {
  const phoneNumber = "971566425118";
  const message =
    "Hi EbRahaStyle, I’m looking for a product. I’ll send you a photo or reference—could you help me source it?";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section className="concierge-card">
      <div className="concierge-card__art" aria-hidden="true">
        <span className="concierge-card__ring concierge-card__ring--one" />
        <span className="concierge-card__ring concierge-card__ring--two" />
        <span className="concierge-card__er">ER</span>
        <Search size={32} strokeWidth={1} />
      </div>

      <div className="concierge-card__copy">
        <p>EbRahaStyle private sourcing</p>
        <h2>Seen something you can’t find?</h2>
        <span>
          Send our curators a photo, screenshot or product name. We’ll help you
          find the piece and confirm availability and price.
        </span>
        <div className="concierge-card__steps">
          <span><Camera size={17} /> Share a reference</span>
          <span><MessageCircleMore size={17} /> Receive a personal reply</span>
        </div>
        <a href={whatsappLink} target="_blank" rel="noreferrer">
          Start on WhatsApp <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default ProductFinderBox;
