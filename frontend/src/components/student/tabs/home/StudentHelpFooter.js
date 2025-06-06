import React from 'react';
import '../../../../styles/student/StudentHomeTab/StudentHelpFooter.css';
import { BookOpen } from 'lucide-react';

const StudentHelpFooter = () => {
  return (
    <div className="studenthelpfooter-container">
        {/* Help Section */}
        <div className="studenthelpfooter-help-box">
          <div className="studenthelpfooter-help-content">
            <div>
              <h2 className="studenthelpfooter-help-title">Need Help?</h2>
              <p className="studenthelpfooter-help-desc">
                Have questions about exams or technical issues? Our support team is here to help you succeed.
              </p>
            </div>
            <div className="studenthelpfooter-help-buttons">
              <button className="studenthelpfooter-btn-outline">
                <svg className="studenthelpfooter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQs
              </button>
              <button className="studenthelpfooter-btn-filled">
                <svg className="studenthelpfooter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="studenthelpfooter-footer">
          <div className="studenthelpfooter-footer-inner">
            <div className="studenthelpfooter-grid">
              {/* Brand Section */}
              <div className="studenthelpfooter-brand">
                <div className="studenthelpfooter-brand-header">
                  <div className="studenthelpfooter-logo">
                    <BookOpen className="studenthelpfooter-logo-icon" />
                  </div>
                  <span className="studenthelpfooter-brand-title">Lincoln High Math</span>
                </div>
                <p className="studenthelpfooter-brand-desc">
                  Empowering students with advanced math examination tools and resources.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="studenthelpfooter-heading">QUICK LINKS</h3>
                <ul className="studenthelpfooter-links">
                  <li><a href="/login">Dashboard</a></li>
                  <li><a href="/login">Exam Schedule</a></li>
                  <li><a href="/login">Practice Tests</a></li>
                  <li><a href="/login">Forum</a></li>
                  <li><a href="/login">Resources</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="studenthelpfooter-heading">SUPPORT</h3>
                <ul className="studenthelpfooter-links">
                  <li><a href="/login">Help Center</a></li>
                  <li><a href="/login">FAQs</a></li>
                  <li><a href="/login">Contact Us</a></li>
                  <li><a href="/login">Technical Support</a></li>
                  <li><a href="/login">Feedback</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="studenthelpfooter-heading">CONTACT</h3>
                <div className="studenthelpfooter-contact">
                  <p>123 School Street, Lincoln, CA 95648</p>
                  <p>(555) 123-4567</p>
                  <p>math@lincolnhigh.edu</p>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="studenthelpfooter-bottom">
              <p>© 2023 Lincoln High School. All rights reserved.</p>
              <div className="studenthelpfooter-policy">
                <a href="/login">Privacy Policy</a>
                <a href="/login">Terms of Service</a>
                <a href="/login">Accessibility</a>
              </div>
            </div>
          </div>
        </footer>
      
    </div>
  );
};

export default StudentHelpFooter;
