import React from "react";
import { ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../Brand/BrandMark";

const Footer = () => {
  return (
    <footer className="boutique-footer">
      <div className="boutique-footer__top">
        <div className="boutique-footer__statement">
          <p>Private sourcing service</p>
          <h2>Can’t find the piece you have in mind?</h2>
          <a href="https://wa.me/971566425118" target="_blank" rel="noreferrer">
            Speak to a curator <ArrowUpRight size={18} />
          </a>
        </div>
        <span className="boutique-footer__monogram" aria-hidden="true">
          ER
        </span>
      </div>

      <div className="boutique-footer__grid">
        <div className="boutique-footer__about">
          <BrandMark inverted />
          <p>
            A considered destination for designer poducts, bags, eyewear and
            accessories—curated in Dubai for a quietly confident wardrobe.
          </p>
        </div>

        <div>
          <p className="boutique-footer__label">Collections</p>
          <Link to="/women">Women</Link>
          <Link to="/men">Men</Link>
          <Link to="/new-arrivals">New arrivals</Link>
          <Link to="/bestSellers">Best sellers</Link>
        </div>

        <div>
          <p className="boutique-footer__label">Client care</p>
          <Link to="/basket">Your bag</Link>
          <Link to="/address">Delivery details</Link>
          <a href="https://wa.me/971566425118">WhatsApp concierge</a>
          <a href="mailto:mohammadnorouzi308@gmail.com">Email us</a>
        </div>

        <div>
          <p className="boutique-footer__label">Visit & connect</p>
          <p>United Arab Emirates</p>
          <p>Daily · 10:00—22:00</p>
          <div className="boutique-footer__socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://wa.me/971566425118"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a href="mailto:mohammadnorouzi308@gmail.com" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="boutique-footer__bottom">
        <p>© {new Date().getFullYear()} EbRahaStyle. All rights reserved.</p>
        <p>Made With ❤️ By Shairut</p>
      </div>
    </footer>
  );
};

export default Footer;
