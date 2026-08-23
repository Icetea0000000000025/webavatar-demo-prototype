import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, MapPin, Phone, Mail, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
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
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  const handleContactCardClick = (type: 'address' | 'phone' | 'email', actionUrl?: string, textToCopy?: string) => {
    if (textToCopy) {
      navigator.clipboard?.writeText(textToCopy);
      setCopiedCard(type);
      setTimeout(() => setCopiedCard(null), 2500);
    }
    if (actionUrl) {
      if (actionUrl.startsWith('http')) {
        window.open(actionUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = actionUrl;
      }
    }
  };

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

    setToastDetails({
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      formNumber,
      message: formData.message
    });
    setShowSuccessToast(true);

    setFormData({
      name: '',
      email: '',
      inquiryType: 'contact',
      message: ''
    });
  };

  const handleDownloadList = () => {
    const hasDraft = Boolean(formData.name.trim() || formData.email.trim());
    const dataToExport = submissions.length > 0 
      ? submissions 
      : hasDraft 
      ? [{
          id: 1,
          formNumber: 1,
          name: formData.name,
          email: formData.email,
          inquiryType: formData.inquiryType,
          message: formData.message,
          timestamp: new Date().toLocaleString()
        }]
      : [];

    if (dataToExport.length === 0) {
      alert("ยังไม่มีรายการติดต่อในระบบ กรุณากรอกแบบฟอร์มเพื่อทดลองดาวน์โหลด (No submissions to download yet)");
      return;
    }

    const headers = ["Form ID", "Name", "Email", "Inquiry Type", "Message", "Timestamp"];
    const rows = dataToExport.map(sub => [
      `"#${sub.formNumber}"`,
      `"${(sub.name || '').replace(/"/g, '""')}"`,
      `"${(sub.email || '').replace(/"/g, '""')}"`,
      `"${(getInquiryTypeLabel(sub.inquiryType) || sub.inquiryType || '').replace(/"/g, '""')}"`,
      `"${(sub.message || '').replace(/"/g, '""')}"`,
      `"${sub.timestamp || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `webavatar_contact_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="contact-page-wrapper w-full relative overflow-hidden bg-transparent text-foreground">

      {/* ══════════════════════════════════════════
          1. HEADER TITLE (SHARED WITH NAVBAR DYNAMIC BACKGROUND)
      ══════════════════════════════════════════ */}
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto text-left" id="contact-hero" aria-label="Contact Hero">
        <AnimatedSection direction="up" duration={0.6}>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-primary uppercase mb-3 select-none">
            <span className="inline-block w-5 h-px bg-primary"></span>
            <span>{t('contact.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-3xl mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </AnimatedSection>
      </div>

      {/* ══════════════════════════════════════════
          2. UNIFIED DYNAMIC BACKGROUND FOR THE ENTIRE PAGE
      ══════════════════════════════════════════ */}
      <div className="w-full bg-transparent relative z-10">

        {/* Clean Minimal Hairline Divider */}
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-px bg-border/40"></div>
        </div>

        {/* ══════════════════════════════════════════
            3. UNIFIED CONTACT & SANDBOX CARD
        ══════════════════════════════════════════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto" id="contact-form-section" aria-label="Contact Information and Inquiry Form">
          <AnimatedSection direction="up" duration={0.6}>
            <div className="bg-card/90 dark:bg-card/85 backdrop-blur-md border border-border/70 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* LEFT COLUMN: OFFICE CHANNELS (5 COLS) */}
                <div className="lg:col-span-5 flex flex-col gap-6 lg:border-r lg:border-border/40 lg:pr-10" id="office-location">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
                      {t('contact.office_heading')}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('contact.office_subheading')}
                    </p>
                  </div>

                  {/* Contact Channels List without individual box frames */}
                  <div className="flex flex-col divide-y divide-border/40">
                    
                    {/* Item 1: Address */}
                    <div 
                      className="py-4 first:pt-0 last:pb-0 group cursor-pointer transition-colors"
                      onClick={() => handleContactCardClick('address', 'https://maps.google.com/?q=253+Asok+Montri+Rd+Bangkok', '21 Asok Building, 253 Asok Montri Rd, Khlong Toei Nuea, Watthana, Bangkok 10110')}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wider">
                          <MapPin className="size-3.5" />
                          Location
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary">
                          Open Map <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          21 Asok Building
                        </h3>
                        {copiedCard === 'address' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center gap-1">
                            <Check className="size-3" /> Copied
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        253 Asok Montri Rd, Khlong Toei Nuea, Watthana, Bangkok 10110
                      </p>
                    </div>

                    {/* Item 2: Phone */}
                    <div 
                      className="py-4 first:pt-0 last:pb-0 group cursor-pointer transition-colors"
                      onClick={() => handleContactCardClick('phone', 'tel:0641922433', '0641922433')}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase tracking-wider">
                          <Phone className="size-3.5" />
                          Hotline
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary">
                          Call Now <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                          064 192 2433
                        </h3>
                        {copiedCard === 'phone' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center gap-1">
                            <Check className="size-3" /> Copied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mon–Fri, 9:00–18:00 ICT (Business Operations)
                      </p>
                    </div>

                    {/* Item 3: Email */}
                    <div 
                      className="py-4 first:pt-0 last:pb-0 group cursor-pointer transition-colors"
                      onClick={() => handleContactCardClick('email', 'mailto:admin@botnoigroup.com', 'admin@botnoigroup.com')}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1.5 text-sky-500 font-bold uppercase tracking-wider">
                          <Mail className="size-3.5" />
                          Electronic Mail
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary">
                          Send Email <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                          admin@botnoigroup.com
                        </h3>
                        {copiedCard === 'email' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center gap-1">
                            <Check className="size-3" /> Copied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enterprise partnerships, AI avatar demos, and solutions
                      </p>
                    </div>

                  </div>
                </div>

                {/* RIGHT COLUMN: SANDBOX INQUIRY FORM (7 COLS) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Minimal Toast Notification */}
                  <AnimatePresence>
                    {showSuccessToast && (
                      <motion.div 
                        className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left flex items-start justify-between gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div>
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
                            <Check className="size-4" />
                            <span>{t('contact.toast_title')}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {t('contact.toast_desc')}
                          </p>
                          <div className="text-xs font-mono text-muted-foreground space-y-0.5">
                            <div>Name: {toastDetails.name} ({toastDetails.email})</div>
                            <div>Type: {getInquiryTypeLabel(toastDetails.inquiryType)} • Ref: #{toastDetails.formNumber}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowSuccessToast(false)}
                          className="text-muted-foreground hover:text-foreground text-sm cursor-pointer p-1"
                        >×</button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
                      {t('contact.form_heading')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t('contact.form_subheading')}
                    </p>
                  </div>

                  {/* Framed Card Input Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Two-Column Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name Input */}
                      <div className="text-left">
                        <label htmlFor="input-name" className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          {t('contact.form_name')} <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="input-name" 
                          name="name" 
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('contact.form_name_placeholder')}
                          className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 shadow-2xs"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="text-left">
                        <label htmlFor="input-email" className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          {t('contact.form_email')} <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          id="input-email" 
                          name="email" 
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('contact.form_email_placeholder')}
                          className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Inquiry Type Select */}
                    <div className="text-left">
                      <label htmlFor="select-inquiry" className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        {t('contact.form_type')}
                      </label>
                      <div className="relative">
                        <select 
                          id="select-inquiry" 
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full appearance-none bg-background border border-border/80 rounded-xl pl-4 pr-11 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
                        >
                          <option value="contact" className="bg-background text-foreground">{t('contact.inquiry_label_contact')}</option>
                          <option value="webavatar" className="bg-background text-foreground">{t('contact.inquiry_label_webavatar')}</option>
                          <option value="chatbot" className="bg-background text-foreground">{t('contact.inquiry_label_chatbot')}</option>
                          <option value="voice" className="bg-background text-foreground">{t('contact.inquiry_label_voice')}</option>
                          <option value="enterprise" className="bg-background text-foreground">{t('contact.inquiry_label_enterprise')}</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-colors" />
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div className="text-left">
                      <label htmlFor="textarea-message" className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        {t('contact.form_message')}
                      </label>
                      <textarea 
                        id="textarea-message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.form_message_placeholder')}
                        rows={4}
                        className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y placeholder:text-muted-foreground/50 shadow-2xs"
                      />
                    </div>

                    {/* Submit Action */}
                    <div className="pt-2 flex justify-start">
                      <button 
                        type="submit" 
                        className="btn btn-outline-primary cursor-pointer"
                        id="submit-inquiry-button"
                      >
                        <span>{t('contact.form_submit')}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

      {/* Clean Minimal Hairline Divider */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-px bg-border/40"></div>
      </div>

      {/* ══════════════════════════════════════════
          3. BORDERLESS INQUIRY LEDGER TABLE
      ══════════════════════════════════════════ */}
      <section className="py-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto" id="contact-ledger" aria-label="Inquiry Log">
        <AnimatedSection direction="up" duration={0.6}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
                {t('contact.roster_heading')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('contact.roster_subheading')}
              </p>
            </div>

            <button 
              type="button"
              onClick={handleDownloadList}
              className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer py-1.5" 
              id="download-ledger-button"
            >
              <Download className="size-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Minimal Borderless Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-mono font-bold text-muted-foreground/80 uppercase">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {/* Live Reactive Draft Row */}
                <AnimatePresence>
                  {(formData.name.trim() || formData.email.trim()) && (
                    <motion.tr 
                      className="text-primary font-medium bg-primary/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td className="py-3.5 px-2 font-mono font-bold">[DRAFT]</td>
                      <td className="py-3.5 px-4">{formatRedactedName(formData.name) || <span className="opacity-40 italic">Typing name...</span>}</td>
                      <td className="py-3.5 px-4">{formatRedactedEmail(formData.email) || <span className="opacity-40 italic">Typing email...</span>}</td>
                      <td className="py-3.5 px-4"><span className="text-xs font-mono">{getInquiryTypeLabel(formData.inquiryType)}</span></td>
                      <td className="py-3.5 px-2 font-mono text-xs text-right opacity-60">--:--</td>
                    </motion.tr>
                  )}
                </AnimatePresence>

                {/* Submissions List */}
                {submissions.length > 0 ? (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-xs text-muted-foreground">#{sub.formNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">{formatRedactedName(sub.name)}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{formatRedactedEmail(sub.email)}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-mono text-primary font-semibold">
                          {getInquiryTypeLabel(sub.inquiryType)}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-mono text-xs text-muted-foreground text-right tabular-nums">{sub.timestamp}</td>
                    </tr>
                  ))
                ) : (
                  !formData.name.trim() && !formData.email.trim() && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground/60">
                        {t('contact.no_submissions')}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </section>

      {/* Clean Minimal Hairline Divider */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-px bg-border/60"></div>
      </div>

      {/* ══════════════════════════════════════════
          4. MINIMAL HAIRLINE FAQ ACCORDION
      {/* ══════════════════════════════════════════
          4. BENTO GRID FAQ SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 pb-28 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto" id="contact-faq" aria-label="Frequently Asked Questions">
        <AnimatedSection direction="up" duration={0.6}>
          <div className="text-left mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              {t('contact.faq_heading')}
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t('contact.faq_subheading')}
            </p>
          </div>
        </AnimatedSection>

        {/* Bento Grid Layout (Asymmetric 12-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Tile 1: Core WebAvatar Platform & SDK (7 cols) */}
          <motion.div 
            className="md:col-span-7 bg-card/90 dark:bg-card/85 backdrop-blur-md border border-border/70 rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 shadow-sm hover:shadow-md group"
            whileHover={{ y: -2 }}
            id="faq-bento-1"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-4">
                {t('contact.faq_q1')}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t('contact.faq_a1')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Lightweight JS SDK • DOM Reactive</span>
              <span className="text-sky-500 font-bold">SPA Ready ↗</span>
            </div>
          </motion.div>

          {/* Bento Tile 2: Continuous Voice Acoustics (5 cols) */}
          <motion.div 
            className="md:col-span-5 bg-card/90 dark:bg-card/85 backdrop-blur-md border border-border/70 rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 shadow-sm hover:shadow-md group"
            whileHover={{ y: -2 }}
            id="faq-bento-2"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-3">
                {t('contact.faq_q2')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('contact.faq_a2')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Thai NLP Engine</span>
              <span className="text-sky-500 font-bold">Continuous Speech</span>
            </div>
          </motion.div>

          {/* Bento Tile 3: 3D Customization & Brand Persona (5 cols) */}
          <motion.div 
            className="md:col-span-5 bg-card/90 dark:bg-card/85 backdrop-blur-md border border-border/70 rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 shadow-sm hover:shadow-md group"
            whileHover={{ y: -2 }}
            id="faq-bento-3"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-3">
                {t('contact.faq_q3')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('contact.faq_a3')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>3D Rigging • Mascots</span>
              <span className="text-sky-500 font-bold">Brand Persona</span>
            </div>
          </motion.div>

          {/* Bento Tile 4: Leadership & Research Labs (7 cols) */}
          <motion.div 
            className="md:col-span-7 bg-card/90 dark:bg-card/85 backdrop-blur-md border border-border/70 rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 shadow-sm hover:shadow-md group"
            whileHover={{ y: -2 }}
            id="faq-bento-4"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-4">
                {t('contact.faq_q4')}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t('contact.faq_a4')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Bangkok Headquarters</span>
              <span className="text-sky-500 font-bold">Dr. Winn &amp; AI Labs</span>
            </div>
          </motion.div>

        </div>
      </section>

      <AppFooter />
      </div>
    </div>
  );
}

export default Contact;



