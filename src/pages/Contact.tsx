import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../lib/LanguageContext';
import AnimatedSection from '../components/AnimatedSection';
import AppFooter from '../components/AppFooter';
import './Pages.css';

interface Submission {
  id: number;
  formNumber: number;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  timestamp: string;
}

// Redaction Helpers
const formatRedactedName = (name: string) => {
  if (!name) return "";
  const cleaned = name.trim();
  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return cleaned + "...";
  return cleaned[0] + "..." + cleaned[cleaned.length - 1];
};

const formatRedactedEmail = (email: string) => {
  if (!email) return "";
  const cleaned = email.trim();
  const firstLetter = cleaned.length > 0 ? cleaned[0] : "";
  const atIndex = cleaned.indexOf("@");
  if (atIndex !== -1) {
    const domainPart = cleaned.substring(atIndex + 1);
    const dotIndex = domainPart.lastIndexOf(".");
    const tld = dotIndex !== -1 ? domainPart.substring(dotIndex + 1) : "com";
    return `${firstLetter}***@***.${tld}`;
  }
  return `${firstLetter}***@***.com`;
};

function Contact() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'contact',
    message: ''
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem('botnoi_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading submissions", e);
      return [];
    }
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastDetails, setToastDetails] = useState({ name: '', email: '', inquiryType: 'contact', formNumber: 0, message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auto-hide success toast after 5 seconds
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case 'contact': return t('contact.inquiry_label_contact');
      case 'webavatar': return t('contact.inquiry_label_webavatar');
      case 'chatbot': return t('contact.inquiry_label_chatbot');
      case 'voice': return t('contact.inquiry_label_voice');
      case 'enterprise': return t('contact.inquiry_label_enterprise');
      default: return type;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert(t('flight.booking_error'));
      return;
    }

    const formNumber = submissions.length + 1;
    // Build unique persistent entry
    const newInquiry: Submission = {
      id: Date.now(),
      formNumber,
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      message: formData.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedSubmissions = [newInquiry, ...submissions];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('botnoi_inquiries', JSON.stringify(updatedSubmissions));

    // Show visual confirmation toast with form state details before clearing
    setToastDetails({
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      formNumber,
      message: formData.message
    });
    setShowSuccessToast(true);

    // Reset all form inputs immediately
    setFormData({
      name: '',
      email: '',
      inquiryType: 'contact',
      message: ''
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: t('contact.faq_q1'),
      a: t('contact.faq_a1')
    },
    {
      q: t('contact.faq_q2'),
      a: t('contact.faq_a2')
    },
    {
      q: t('contact.faq_q3'),
      a: t('contact.faq_a3')
    },
    {
      q: t('contact.faq_q4'),
      a: t('contact.faq_a4')
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>

      {/* CONTACT HERO */}
      <section className="hero-section" id="contact-hero" style={{ paddingBottom: '3rem' }} aria-label="Contact Hero">
        <AnimatedSection direction="up" duration={0.8}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6 shadow-sm">
            {t('contact.badge')}
          </span>
          <h1 className="leading-tight text-wrap-balance">{t('contact.title')}</h1>
          <p className="hero-subtitle" style={{ margin: '0 auto' }}>
            {t('contact.subtitle')}
          </p>
        </AnimatedSection>
      </section>

      {/* TWO COLUMN GRID FOR CONTACT & FORM */}
      <section className="section-wrapper relative z-10" style={{ paddingTop: '1rem' }} id="contact-form-section" aria-label="Contact Information and Inquiry Form">
        <div className="contact-container" style={{ padding: '0 1.5rem', maxWidth: '1150px', margin: '0 auto' }}>
          
          {/* LEFT COLUMN: OFFICE DETAILS */}
          <AnimatedSection direction="right" duration={0.8} className="contact-info-cards" id="office-location">
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
                {t('contact.office_heading')}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', margin: 0 }}>
                {t('contact.office_subheading')}
              </p>
            </div>

            <div className="contact-info-card" id="contact-address">
              <div className="contact-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="contact-card-content">
                <h4>Address</h4>
                <p>
                  21 Asok Building, 253 Asok Montri Rd,<br />
                  Khlong Toei Nuea, Watthana,<br />
                  Bangkok 10110
                </p>
              </div>
            </div>

            <div className="contact-info-card" id="contact-phone">
              <div className="contact-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="contact-card-content">
                <h4>Phone</h4>
                <p>064 192 2433 • Office Hours (Mon-Fri, 9:00 - 18:00 ICT)</p>
              </div>
            </div>

            <div className="contact-info-card" id="contact-email">
              <div className="contact-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className="contact-card-content">
                <h4>Email</h4>
                <p>admin@botnoigroup.com</p>
              </div>
            </div>
          </AnimatedSection>

          {/* RIGHT COLUMN: LEAD FORM OR SUCCESS STATE */}
          <AnimatedSection direction="left" duration={0.8} className="glass-panel" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'none' }}>
            <AnimatePresence>
              {showSuccessToast && (
                <motion.div 
                  className="success-toast" 
                  style={{
                    background: '#ECFDF5',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.05)'
                  }}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success)',
                    fontWeight: '800',
                    flexShrink: 0
                  }}>✓</div>
                  <div style={{ flexGrow: 1, textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--accent-foreground)', fontSize: '0.9rem', fontWeight: '800' }}>
                      {t('contact.toast_title')}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                      {t('contact.toast_desc')}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1rem', fontSize: '0.75rem', borderTop: '1px dashed rgba(16,185,129,0.2)', paddingTop: '0.5rem' }}>
                      <div><strong>{t('contact.toast_detail_name')}:</strong> {toastDetails.name}</div>
                      <div><strong>{t('contact.toast_detail_email')}:</strong> {toastDetails.email}</div>
                      <div><strong>{t('contact.toast_detail_type')}:</strong> {getInquiryTypeLabel(toastDetails.inquiryType)}</div>
                      <div><strong>{t('contact.toast_detail_num')}:</strong> #{toastDetails.formNumber}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSuccessToast(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted-foreground)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      position: 'absolute',
                      top: '10px',
                      right: '12px'
                    }}
                    aria-label={t('contact.toast_close')}
                  >×</button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em', color: 'var(--card-foreground)' }}>
                  {t('contact.form_heading')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: 0 }}>
                  {t('contact.form_subheading')}
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <label htmlFor="input-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                  {t('contact.form_name')} <span style={{ color: 'var(--destructive)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  id="input-name" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.form_name_placeholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    transition: 'border-color 0.2s',

                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <label htmlFor="input-email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                  {t('contact.form_email')} <span style={{ color: 'var(--destructive)' }}>*</span>
                </label>
                <input 
                  type="email" 
                  id="input-email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.form_email_placeholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <label htmlFor="select-inquiry" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                  {t('contact.form_type')}
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    id="select-inquiry" 
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      outline: 'none',
                      fontSize: '0.9rem',

                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="contact" className="bg-card text-foreground">{t('contact.inquiry_label_contact')}</option>
                    <option value="webavatar" className="bg-card text-foreground">{t('contact.inquiry_label_webavatar')}</option>
                    <option value="chatbot" className="bg-card text-foreground">{t('contact.inquiry_label_chatbot')}</option>
                    <option value="voice" className="bg-card text-foreground">{t('contact.inquiry_label_voice')}</option>
                    <option value="enterprise" className="bg-card text-foreground">{t('contact.inquiry_label_enterprise')}</option>
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--muted-foreground)',
                    fontSize: '0.75rem'
                  }}>▼</div>
                </div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted-foreground)', marginTop: '0.35rem', opacity: 0.85 }}>
                  {t('contact.form_type_helper')}
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem', textAlign: 'left' }}>
                <label htmlFor="textarea-message" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                  {t('contact.form_message')}
                </label>
                <textarea 
                  id="textarea-message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.form_message_placeholder')}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    transition: 'border-color 0.2s',

                  }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem' }}
                id="submit-inquiry-button"
              >
                {t('contact.form_submit')}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* REACTIVE STATE DRAFT SUMMARY */}
      <section className="section-wrapper relative z-10" id="contact-ledger" style={{ margin: '4rem auto', maxWidth: '1150px', padding: '0 1.5rem' }} aria-label="Inquiry Log">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="glass-panel" style={{ padding: '3rem', transition: 'none' }}>
            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
                {t('contact.roster_heading')}
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)', margin: 0 }}>
                {t('contact.roster_subheading')}
              </p>
            </div>

            <div className="ledger-table-container">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>{t('contact.th_id')}</th>
                    <th>{t('contact.th_name')}</th>
                    <th>{t('contact.th_email')}</th>
                    <th>{t('contact.th_type')}</th>
                    <th>{t('contact.th_time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* REACTIVE ACTIVE DRAFT ROW (IF USER STARTED FILLING) */}
                  <AnimatePresence>
                    {(formData.name.trim() || formData.email.trim()) && (
                      <motion.tr 
                        className="ledger-draft-row"
                        initial={{ opacity: 0, background: 'rgba(99, 102, 241, 0.05)' }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ color: 'var(--primary)', fontWeight: '500' }}
                      >
                        <td>[DRAFT]</td>
                        <td>{formatRedactedName(formData.name) || <em style={{ opacity: 0.5 }}>Typing name...</em>}</td>
                        <td>{formatRedactedEmail(formData.email) || <em style={{ opacity: 0.5 }}>Typing email...</em>}</td>
                        <td>{getInquiryTypeLabel(formData.inquiryType)}</td>
                        <td>--:--</td>
                      </motion.tr>
                    )}
                  </AnimatePresence>

                  {/* HISTORIC SUBMISSIONS */}
                  {submissions.length > 0 ? (
                    submissions.map((sub) => (
                      <tr 
                        key={sub.id} 
                        className="ledger-row-hover"
                      >
                        <td>#{sub.formNumber}</td>
                        <td style={{ fontWeight: '600' }}>{formatRedactedName(sub.name)}</td>
                        <td>{formatRedactedEmail(sub.email)}</td>
                        <td>{getInquiryTypeLabel(sub.inquiryType)}</td>
                        <td>{sub.timestamp}</td>
                      </tr>
                    ))
                  ) : (
                    !formData.name.trim() && !formData.email.trim() && (
                      <tr>
                        <td colSpan={5} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                          {t('contact.no_submissions')}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-secondary" 
              disabled 
              style={{ 
                opacity: 0.4, 
                cursor: 'not-allowed', 
                background: 'var(--muted)',
                borderColor: 'var(--border)',
                color: 'var(--muted-foreground)',
                borderRadius: '8px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                transition: 'none'
              }}
              id="download-ledger-button"
            >
              Download List (Disabled)
            </button>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="section-wrapper relative z-10" id="contact-faq" style={{ paddingBottom: '6rem', margin: '4rem auto', maxWidth: '1150px', paddingLeft: '1.5rem', paddingRight: '1.5rem' }} aria-label="Frequently Asked Questions">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="section-header">
            <h2>{t('contact.faq_heading')}</h2>
            <p>{t('contact.faq_subheading')}</p>
          </div>
        </AnimatedSection>

        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openFaq === index ? 'open' : ''}`}
              id={`faq-item-${index}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFaq(index)} 
                id={`faq-question-${index}`} 
                aria-expanded={openFaq === index}
              >
                <span>{faq.q}</span>
                <motion.span 
                  className="faq-toggle font-mono"
                  animate={{ rotate: openFaq === index ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  +
                </motion.span>
              </div>
              <AnimatePresence initial={false}>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="faq-answer-content">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <AppFooter />
    </div>
  );
}

export default Contact;
