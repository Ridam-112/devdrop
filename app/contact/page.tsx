"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, Shield } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Feature Suggestion");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 inline-block mb-3">
          SUPPORT &amp; FEEDBACK
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          Contact DevDrop
        </h1>
        <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
          Have an idea for a new web utility, bug report, or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Direct Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyber-green" />
              Direct Communication
            </h3>
            <p className="text-xs text-slate-400 mb-2">General inquiries &amp; feedback:</p>
            <a
              href="mailto:support@devdrop.online"
              className="text-xs font-mono text-emerald-400 hover:underline break-all"
            >
              support@devdrop.online
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <h3 className="text-sm font-bold text-white font-mono mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyber-purple" />
              Privacy &amp; Safety
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For security disclosures, questions about client-side data handling, or terms inquiries, reach out directly to our team.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-cyber-card border border-cyber-borderSubtle shadow-card-cyber">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-cyber-green/20 border border-cyber-green flex items-center justify-center text-cyber-green mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white font-mono">Transmission Dispatched!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Thank you for reaching out, {name}. Our team has received your communication and will reply if a response is needed.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-cyber-panel border border-cyber-borderSubtle text-xs font-mono text-slate-200 hover:text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl py-2.5 px-3.5 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyber-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl py-2.5 px-3.5 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyber-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl py-2.5 px-3.5 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="Feature Suggestion">Feature or Tool Suggestion</option>
                  <option value="Bug Report">Technical Bug or UI Glitch</option>
                  <option value="Partnership">Media & Partnership Inquiry</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3.5 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyber-green resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyber-green/90 shadow-neon-green/30 transition-all"
              >
                <Send className="w-4 h-4 fill-black" />
                <span>Send Communication</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
