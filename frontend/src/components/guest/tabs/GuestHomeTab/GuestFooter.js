// GuestFooter.js
import React from 'react';
import '../../../../styles/guest/GuestHomeTab/GuestFooter.css';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import logoAmeo from "../../../../assets/icon/icon-logo-white.png"

const GuestFooter = () => {
  const quickLinks = [
    { name: "Features", href: "#features" },
    { name: "Exams", href: "#exams" },
    { name: "Daily Problem", href: "#daily-problem" },
    { name: "Events", href: "#events" },
    { name: "Testimonials", href: "#testimonials" }
  ];

  const supportLinks = [
    { name: "FAQs", href: "#faqs" },
    { name: "User Guides", href: "#user-guides" },
    { name: "Contact Support", href: "#contact-support" },
    { name: "System Status", href: "#system-status" },
    { name: "Privacy Policy", href: "#privacy-policy" }
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Cookie Policy", href: "#cookies" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Instagram, href: "#instagram", label: "Instagram" },
    { icon: Youtube, href: "#youtube", label: "YouTube" }
  ];

  return (
    <footer className="guest-footer">
      <div className="footer-container">
        <div className="footer-grid">

          <div className="footer-brand">
            <div className="logo-container">
              <img src={logoAmeo} alt="MathExamHub Logo" className="logo-img" />
              <h3 className="logo-text">Zamix</h3>
            </div>
            <p className="footer-description">
              Riverside High School's comprehensive platform for mathematics exam preparation,
              management, and assessment.
            </p>
            <div className="social-icons">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a key={index} href={social.href} aria-label={social.label} className="social-link">
                    <IconComponent className="icon" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin className="contact-icon" />
                  <p>123 Education Blvd, Riverside, CA</p>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" />
                <a href="tel:+15551234567" className="footer-link">(555) 123-4567</a>
              </div>
              <div className="contact-item">
                <Mail className="contact-icon" />
                <a href="mailto:info@riversidehigh.edu" className="footer-link">info@riversidehigh.edu</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="copyright">
            © 2023 Riverside High School. All rights reserved.
          </div>
          <div className="legal-links">
            {legalLinks.map((link, index) => (
              <a key={index} href={link.href} className="footer-link legal">{link.name}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GuestFooter;
