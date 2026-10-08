"use client";
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useState, useRef } from "react";
import { handleSubscription, getUserDetails, getSubscriptionDetail, getallprojects } from "@/service/api";
import { toast } from "react-toastify";
import useSessionStorageData from "@/utils/useSessionStorageData";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Check, Sparkles, Zap, Crown, Gem, Star, ArrowRight, ChevronDown, X } from "lucide-react";

// Scoped CSS styles matching modern design with clean contrast and spacing
const pricingStyles = `
.pricing-page-root {
  --bg: #F8F9FA;
  --card: #FFFFFF;
  --line: #E2E8F0;
  --grid: #CBD5E1;
  --ink: #0F172A;
  --navy: #1F2A3D;
  --navy-2: #2C3A52;
  --muted: #64748B;
  --faint: #94A3BF;
  --red: #DC2626;
  --red-dark: #B91C1C;
  --green: #16A34A;
  --green-on-navy: #86EFAC;
  --font: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-family: var(--font);
  background-color: var(--bg);
  color: var(--ink);
  padding-bottom: 96px;
  overflow-x: hidden;
  width: 100%;
}

.pricing-page-root *, .pricing-page-root *::before, .pricing-page-root *::after {
  box-sizing: border-box;
}

.pricing-wrap {
  max-width: 1340px;
  margin: 0 auto;
  padding: 0 20px;
}

.pricing-narrow {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 640px) {
  .pricing-wrap, .pricing-narrow {
    padding: 0 16px;
  }
}

/* Hero Section */
.pricing-hero {
  position: relative;
  text-align: center;
  padding: 44px 0 32px;
  background-color: var(--bg);
  overflow: hidden;
}

@media (max-width: 640px) {
  .pricing-hero {
    padding: 24px 0 20px;
  }
}

.pricing-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(203, 213, 225, 0.3) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(203, 213, 225, 0.3) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

.pricing-hero .pricing-wrap {
  position: relative;
  z-index: 1;
}

.crumbs {
  margin: 0 auto 16px;
  padding: 0;
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--muted);
  font-weight: 500;
}
.crumbs li + li::before {
  content: "/";
  margin-right: 8px;
  color: var(--faint);
}
.crumbs a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s ease;
}
.crumbs a:hover {
  color: var(--ink);
  text-decoration: underline;
}

.pill-new {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--muted);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
.pill-new b {
  color: var(--red);
  font-weight: 800;
}

.pricing-hero h1 {
  margin: 18px auto 0;
  max-width: 32ch;
  font-weight: 800;
  font-size: clamp(1.45rem, 1.15rem + 1.8vw, 3.25rem);
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--ink);
  word-break: break-word;
}

.pricing-hero .lede {
  margin: 16px auto 0;
  max-width: 60ch;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.pricing-hero .answer {
  margin: 16px auto 0;
  max-width: 64ch;
  font-size: 1rem;
  color: var(--ink);
  line-height: 1.6;
}

.pricing-hero .updated {
  margin: 10px 0 0;
  font-size: 0.82rem;
  color: var(--muted);
}

@media (max-width: 640px) {
  .pricing-hero .lede {
    font-size: 0.94rem;
    line-height: 1.5;
    margin-top: 12px;
  }
  .pricing-hero .answer {
    font-size: 0.9rem;
    line-height: 1.55;
    margin-top: 12px;
  }
}

.seg-filter {
  display: inline-flex;
  gap: 4px;
  margin-top: 26px;
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  max-width: 100%;
}
.seg-filter button {
  font-family: var(--font);
  font-weight: 600;
  font-size: 0.9rem;
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.seg-filter button[aria-pressed="true"] {
  background: var(--navy);
  color: #FFFFFF;
}

@media (max-width: 480px) {
  .seg-filter {
    display: flex;
    width: 100%;
    max-width: 335px;
    margin: 20px auto 0;
    padding: 3px;
  }
  .seg-filter button {
    flex: 1;
    padding: 7px 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    text-align: center;
  }
}

/* Plans Grid */
.plans-sec {
  padding: 24px 0 12px;
}
.plans-title {
  margin: 0 0 16px;
  text-align: center;
  font-weight: 800;
  font-size: 1.6rem;
  color: var(--ink);
}

.plans-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;
  align-items: stretch;
  padding-top: 24px;
}
@media (min-width: 640px) {
  .plans-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 960px) {
  .plans-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1200px) {
  .plans-grid { grid-template-columns: repeat(var(--cols, 5), 1fr); }
}

@media (max-width: 640px) {
  .plans-sec {
    padding: 16px 0 10px;
  }
  .plans-title {
    font-size: 1.35rem;
    margin-bottom: 14px;
  }
  .plans-grid {
    gap: 20px;
    padding-top: 16px;
  }
}

.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 24px 20px 20px;
  box-shadow: 0 4px 14px rgba(16, 24, 40, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(16, 24, 40, 0.08);
}

@media (max-width: 480px) {
  .plan-card {
    padding: 22px 16px 18px;
    border-radius: 16px;
  }
}

.plan-top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.plan-ico {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #F1F5F9;
  display: grid;
  place-items: center;
  flex: none;
  color: var(--navy);
}
.plan-card h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink);
}

.plan-tag {
  margin: 14px 0 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Price Display */
.plan-price {
  margin: 12px 0 0;
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
  color: #000000;
}
.plan-cur {
  font-weight: 800;
  font-size: 1.25rem;
  color: #000000;
}
.plan-amt {
  font-weight: 800;
  font-size: 2.35rem;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #000000;
}
.plan-per {
  color: #64748B;
  font-size: 0.88rem;
  font-weight: 600;
}

.plan-eq {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
  min-height: 1.4em;
}

.plan-save {
  margin: 10px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #F1F5F9;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--muted);
  line-height: 1.25;
}
.plan-save--good {
  background: #DCFCE7;
  color: #15803D;
}

@media (max-width: 480px) {
  .plan-price {
    margin-top: 10px;
  }
  .plan-cur {
    font-size: 1.15rem;
  }
  .plan-amt {
    font-size: 2.15rem;
  }
  .plan-per {
    font-size: 0.84rem;
  }
  .plan-eq {
    margin-top: 6px;
    font-size: 0.82rem;
    min-height: auto;
  }
  .plan-save {
    min-height: auto;
    padding: 8px 10px;
    font-size: 0.78rem;
    margin-top: 8px;
  }
}

.plan-feat {
  list-style: none;
  margin: 16px 0 18px;
  padding: 14px 0 0;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 11px;
}
.plan-feat li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
  color: #334155;
}
.plan-feat li.key {
  font-weight: 700;
  color: var(--ink);
}
.plan-feat li.off {
  color: var(--faint);
  text-decoration: line-through;
}

.plan-ck {
  width: 18px;
  height: 18px;
  flex: none;
  color: #64748B;
  margin-top: 1px;
}
.off .plan-ck {
  color: #CBD5E1;
}

.plan-nw {
  margin-left: auto;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #2563EB;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 4px;
  padding: 2px 5px;
  line-height: 1.3;
  flex: none;
}

.plan-tools {
  margin: 0;
  width: 100%;
}
.plan-tools summary {
  list-style: none;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  color: var(--ink);
}
.plan-tools summary::-webkit-details-marker {
  display: none;
}
.plan-tools summary .chev {
  width: 14px;
  height: 14px;
  margin-top: 3px;
  flex: none;
  color: var(--muted);
  transition: transform 0.15s ease;
}
.plan-tools[open] summary .chev {
  transform: rotate(180deg);
}
.plan-tools ul {
  list-style: none;
  margin: 10px 0 0 28px;
  padding: 0;
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 0.84rem;
}

.plan-cta {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 13px 12px;
  border-radius: 10px;
  background: var(--navy);
  color: #FFFFFF;
  border: 0;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
  width: 100%;
}
.plan-cta:hover:not(:disabled) {
  background: #0F172A;
  color: #FFFFFF;
}
.plan-cta--red {
  background: var(--red);
}
.plan-cta--red:hover:not(:disabled) {
  background: var(--red-dark);
}
.plan-cta--green {
  background: var(--green);
}
.plan-cta--green:hover:not(:disabled) {
  background: #15803D;
}
.plan-cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.plan-pay {
  margin: 10px 0 0;
  text-align: center;
  font-size: 0.78rem;
  color: var(--muted);
}

.plan-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  padding: 7px 14px;
  color: #FFFFFF;
  background: var(--navy);
  box-shadow: 0 6px 14px rgba(16, 24, 40, 0.18);
  z-index: 10;
}
.plan-badge--red {
  background: var(--red);
}

/* Gold Plan Highlight */
.plan-card--gold {
  background: var(--navy);
  color: #FFFFFF;
  border-color: var(--navy);
  box-shadow: 0 22px 44px rgba(16, 24, 40, 0.28);
}
@media (min-width: 1200px) {
  .plan-card--gold {
    transform: translateY(-12px);
    padding-bottom: 30px;
  }
}
.plan-card--gold h3 {
  color: #FFFFFF;
}
.plan-card--gold .plan-ico {
  background: var(--red);
  color: #FFFFFF;
}
.plan-card--gold .plan-tag {
  color: #CBD5E1;
}
.plan-card--gold .plan-price,
.plan-card--gold .plan-cur,
.plan-card--gold .plan-amt {
  color: #FFFFFF !important;
}
.plan-card--gold .plan-per {
  color: #CBD5E1 !important;
}
.plan-card--gold .plan-eq {
  color: #CBD5E1;
}
.plan-card--gold .plan-pay {
  color: #CBD5E1;
}
.plan-card--gold .plan-save {
  background: var(--navy-2);
  color: var(--green-on-navy);
}
.plan-card--gold .plan-feat {
  border-top-color: #334155;
}
.plan-card--gold .plan-feat li {
  color: #F1F5F9;
}
.plan-card--gold .plan-feat li.key {
  color: #FFFFFF;
}
.plan-card--gold .plan-ck {
  background: var(--red);
  color: #FFFFFF;
  border-radius: 50%;
  padding: 3px;
}
.plan-card--gold .plan-tools summary {
  color: #FFFFFF;
}
.plan-card--gold .plan-tools ul {
  color: #CBD5E1;
}
.plan-card--gold .plan-nw {
  background: var(--red);
  color: #FFFFFF;
  border-color: var(--red);
}
.plan-card--gold .plan-cta {
  background: var(--red);
}
.plan-card--gold .plan-cta:hover:not(:disabled) {
  background: #EF4444;
}

/* Assurance */
.assure-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  margin: 40px 0 0;
}
@media (min-width: 760px) {
  .assure-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .assure-grid {
    margin: 24px 0 0;
    gap: 10px;
  }
  .assure-item {
    padding: 14px 14px;
    border-radius: 12px;
  }
  .assure-item b {
    font-size: 0.9rem;
  }
  .assure-item span {
    font-size: 0.82rem;
  }
}
.assure-item {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}
.assure-item b {
  display: block;
  margin-bottom: 4px;
  font-weight: 700;
  color: var(--ink);
}
.assure-item span {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Section styling */
.pricing-sec {
  padding: 56px 0 0;
}
.pricing-sec h2 {
  margin: 0 0 8px;
  font-weight: 800;
  font-size: clamp(1.3rem, 1rem + 1.2vw, 2rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.pricing-sec .intro {
  margin: 0 0 24px;
  color: var(--muted);
  max-width: 62ch;
  line-height: 1.6;
}
.pricing-panel {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

@media (max-width: 640px) {
  .pricing-sec {
    padding: 36px 0 0;
  }
  .pricing-sec h2 {
    font-size: 1.25rem;
    margin-bottom: 6px;
  }
  .pricing-sec .intro {
    font-size: 0.88rem;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  .pricing-panel {
    padding: 18px 14px;
    border-radius: 14px;
  }
}

/* Cost per day */
.cpd-wrapper {
  display: grid;
  gap: 22px;
}
.cpd-row {
  display: grid;
  gap: 8px;
}
.cpd-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.cpd-name {
  font-weight: 700;
  color: var(--ink);
}
.cpd-val {
  font-weight: 700;
  color: var(--ink);
}
.cpd-val small {
  font-weight: 600;
  color: var(--green);
  margin-left: 8px;
}
.cpd-track {
  height: 12px;
  background: #EEF2F6;
  border-radius: 999px;
  overflow: hidden;
}
.cpd-fill {
  height: 100%;
  width: 0;
  background: var(--navy);
  border-radius: 999px;
  transition: width 1s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.cpd-row--base .cpd-fill {
  background: #94A3B8;
}
.cpd-wrapper.in .cpd-fill {
  width: var(--w);
}
.cpd-wrapper.in .cpd-row:nth-child(2) .cpd-fill { transition-delay: 0.1s; }
.cpd-wrapper.in .cpd-row:nth-child(3) .cpd-fill { transition-delay: 0.2s; }
.cpd-wrapper.in .cpd-row:nth-child(4) .cpd-fill { transition-delay: 0.3s; }
.cpd-foot {
  margin: 18px 0 0;
  color: var(--muted);
  font-size: 0.85rem;
}

@media (max-width: 640px) {
  .cpd-wrapper {
    gap: 14px;
  }
  .cpd-top {
    font-size: 0.86rem;
    gap: 4px;
  }
  .cpd-name, .cpd-val {
    font-size: 0.86rem;
  }
  .cpd-val small {
    font-size: 0.76rem;
    margin-left: 4px;
  }
  .cpd-track {
    height: 10px;
  }
  .cpd-foot {
    font-size: 0.78rem;
    margin-top: 12px;
  }
}

/* Credits Table */
.credits-two {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}
@media (min-width: 900px) {
  .credits-two {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }
}
.credits-rule {
  margin: 0 0 12px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.5;
}
.credits-table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.credits-table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.credits-table th, .credits-table td {
  text-align: left;
  padding: 12px 8px 12px 0;
  border-top: 1px solid var(--line);
}
.credits-table thead th {
  border-top: 0;
  color: var(--muted);
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.credits-table tbody th {
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
}
.credits-table td:last-child, .credits-table th:last-child {
  text-align: right;
  padding-right: 0;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .credits-two {
    gap: 16px;
  }
  .credits-rule {
    font-size: 0.92rem;
    line-height: 1.45;
  }
  .credits-table {
    font-size: 0.82rem;
  }
  .credits-table th, .credits-table td {
    padding: 9px 4px 9px 0;
  }
  .credits-table thead th {
    font-size: 0.72rem;
  }
}

/* Format & Category links */
.sub-heading {
  margin: 22px 0 10px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink);
}
.pill-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}
.pill-links a {
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--ink);
  transition: all 0.2s ease;
}
.pill-links a:hover {
  border-color: var(--navy);
  background: #F1F5F9;
}
.pill-links .plain-tag {
  display: inline-block;
  font-weight: 600;
  font-size: 0.9rem;
  background: #F1F5F9;
  border: 1px dashed var(--line);
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--muted);
}

.tool-pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tool-pill-list li {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--ink);
}

@media (max-width: 640px) {
  .sub-heading {
    margin: 16px 0 8px;
    font-size: 0.92rem;
  }
  .pill-links {
    gap: 6px;
    margin-bottom: 12px;
  }
  .pill-links a, .pill-links .plain-tag {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
  .tool-pill-list {
    gap: 6px;
  }
  .tool-pill-list li {
    padding: 6px 10px;
    font-size: 0.8rem;
    border-radius: 8px;
  }
}

/* FAQs */
.faq-list {
  display: grid;
  gap: 10px;
}
.faq-item {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 0 18px;
  transition: all 0.2s ease;
}
.faq-item summary {
  list-style: none;
  cursor: pointer;
  padding: 16px 28px 16px 0;
  font-weight: 600;
  font-size: 0.98rem;
  color: var(--ink);
  position: relative;
}
.faq-item summary::-webkit-details-marker {
  display: none;
}
.faq-item summary .faq-icon {
  position: absolute;
  right: 2px;
  top: 16px;
  color: var(--muted);
  transition: transform 0.2s ease;
}
.faq-item[open] summary .faq-icon {
  transform: rotate(180deg);
}
.faq-item p {
  margin: 0 0 16px;
  color: #334155;
  max-width: 68ch;
  line-height: 1.6;
  font-size: 0.92rem;
}

@media (max-width: 640px) {
  .faq-list {
    gap: 8px;
  }
  .faq-item {
    padding: 0 14px;
    border-radius: 12px;
  }
  .faq-item summary {
    padding: 13px 24px 13px 0;
    font-size: 0.88rem;
    line-height: 1.35;
  }
  .faq-item summary .faq-icon {
    top: 13px;
    right: 0;
  }
  .faq-item p {
    font-size: 0.84rem;
    line-height: 1.5;
    margin-bottom: 12px;
  }
}
`;

const aiToolsList = [
  "AI Architecture → 3D",
  "AI Interior → 3D",
  "AI Sketch → 3D",
  "AI 2D → 3D",
  "AI 3D → 2D",
  "AI Image → DWG",
  "AI Floor Plan",
  "AI Mood Board",
  "PlanForge 2D",
  "Vastu Analysis",
  "Projects Thesis",
];

const plans = [
  {
    id: "free",
    name: "Free Plan",
    tagline: "Start free, no card needed",
    price: "$0",
    period: "forever",
    eq: "\u00A0",
    save: "Limited access to AI Studio",
    saveGood: false,
    popular: false,
    badge: null,
    term: "free",
    icon: "sparkle",
    stripeId: null,
    ctaLabel: "Start free",
    payNotice: "No card needed",
    features: [
      { label: "3 AI credits to try", key: true },
      { label: "10 Free downloads / day", key: true },
      { label: "All free files", key: false },
      { label: "No premium files", off: true },
      { label: "No Gold downloads", off: true },
      { label: "Create library", key: false },
      { label: "Upload files", key: false },
      { label: "Projects library", key: false },
      { label: "Unit converter", key: false },
    ],
  },
  {
    id: "silver",
    name: "Silver Plan",
    tagline: "Try the full library",
    price: "$9.99",
    period: "/ Week",
    eq: "$1.43 a day, $43.29 a month",
    save: "Good for one project or a quick test",
    saveGood: false,
    popular: false,
    badge: null,
    term: "short",
    icon: "bolt",
    stripeId: "price_1TSAT3Fy6VKViPpJP4SIMcZX",
    ctaLabel: "Get weekly plan",
    payNotice: null,
    features: [
      { label: "25 AI credits", key: true },
      { label: "10 Gold downloads / day", key: true },
      { label: "10 Free downloads / day", key: true },
      { label: "All premium files", key: false },
      { label: "All free files", key: false },
      { isAiTools: true },
      { label: "Create library", key: false },
      { label: "Upload files", key: false },
      { label: "Projects library", key: false },
      { label: "Unit converter", key: false },
    ],
  },
  {
    id: "gold",
    name: "Gold Plan",
    tagline: "Best for active designers",
    price: "$19.99",
    period: "/ Month",
    eq: "$0.66 a day",
    save: "54% less per day than weekly",
    saveGood: true,
    popular: true,
    badge: "Most popular",
    badgeRed: true,
    term: "short",
    icon: "crown",
    stripeId: "price_1UO8M3Fy6VKViPpJQuLeuVq1",
    ctaLabel: "Get monthly plan",
    payNotice: null,
    features: [
      { label: "100 AI credits", key: true },
      { label: "20 Gold downloads / day", key: true },
      { label: "15 Free downloads / day", key: true },
      { label: "All premium files", key: false },
      { label: "All free files", key: false },
      { isAiTools: true },
      { label: "Create library", key: false },
      { label: "Upload files", key: false },
      { label: "Projects library", key: false },
      { label: "Unit converter", key: false },
    ],
  },
  {
    id: "platinum",
    name: "Platinum Plan",
    tagline: "Power for studios",
    price: "$49.99",
    period: "/ 3 Months",
    eq: "$16.66 a month, $0.55 a day",
    save: "62% less per day than weekly",
    saveGood: true,
    popular: false,
    badge: null,
    term: "long",
    icon: "star",
    stripeId: "price_1UO8ZHFy6VKViPpJ57GVbkgx",
    ctaLabel: "Get 3-month plan",
    payNotice: null,
    features: [
      { label: "300 AI credits", key: true },
      { label: "30 Gold downloads / day", key: true },
      { label: "25 Free downloads / day", key: true },
      { label: "All premium files", key: false },
      { label: "All free files", key: false },
      { isAiTools: true },
      { label: "Create library", key: false },
      { label: "Upload files", key: false },
      { label: "Projects library", key: false },
      { label: "Unit converter", key: false },
    ],
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    tagline: "Maximum savings",
    price: "$99.00",
    period: "/ Year",
    eq: "$8.25 a month, $0.27 a day",
    save: "81% less per day than weekly",
    saveGood: true,
    popular: false,
    badge: "Best value",
    badgeRed: false,
    term: "long",
    icon: "gem",
    stripeId: "price_1Q8PNDFy6VKViPpJSYVg4mvU",
    ctaLabel: "Get yearly plan",
    payNotice: null,
    features: [
      { label: "1,500 AI credits", key: true },
      { label: "40 Gold downloads / day", key: true },
      { label: "50 Free downloads / day", key: true },
      { label: "All premium files", key: false },
      { label: "All free files", key: false },
      { isAiTools: true },
      { label: "Create library", key: false },
      { label: "Upload files", key: false },
      { label: "Projects library", key: false },
      { label: "Unit converter", key: false },
    ],
  },
];

const faqsData = [
  {
    q: "Which file formats can I download on Cadbull?",
    a: "Cadbull has DWG, 3ds Max, Revit, SketchUp, PDF, DXF, JPEG and Photoshop files, and DWG is the most common. You can browse files by type from the categories page."
  },
  {
    q: "How do AI credits work?",
    a: "Each AI generation, like Sketch to 3D, Image to DWG or AI Floor Plan, uses one credit. Credits stay valid for the whole length of your plan."
  },
  {
    q: "What is included in AI Studio?",
    a: "Every paid plan includes AI Studio with 11 tools: AI Architecture → 3D, AI Interior → 3D, AI Sketch → 3D, AI 2D → 3D, AI 3D → 2D, AI Image → DWG, AI Floor Plan, AI Mood Board, PlanForge 2D, Vastu Analysis and Projects Thesis. The generation tools use AI credits."
  },
  {
    q: "Do unused downloads carry over?",
    a: "No. Daily download limits reset every 24 hours and don't roll over. AI Credits remain valid for the full duration of your active subscription plan."
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. Upgrade or downgrade from your dashboard at any time. Billing is prorated."
  },
  {
    q: "Which payment methods can I use?",
    a: "We accept all major credit and debit cards, PayPal, and UPI for customers in India."
  },
  {
    q: "Can I try Cadbull for free?",
    a: "Yes. The Free plan has no time limit and needs no card. It includes free files and 10 free downloads a day."
  },
  {
    q: "Does my plan renew automatically?",
    a: "Yes, subscriptions renew automatically at the end of each billing cycle (weekly, monthly, quarterly, or yearly) to ensure uninterrupted access. You can cancel renewal anytime from your billing settings before the next cycle."
  },
  {
    q: "Can I get a refund?",
    a: "Because Cadbull provides immediate digital access to downloadable CAD files and AI tools, subscription fees are generally non-refundable once activated. If you experience technical issues or duplicate charges, please contact our support team at cadbull2014@gmail.com and we'll gladly assist you."
  },
  {
    q: "Can I use the files in client projects?",
    a: "Yes! All CAD drawings, 3D models, and design assets downloaded with an active subscription can be used for both personal and commercial client projects. Direct resale or redistribution of raw CAD files on other platforms is strictly prohibited."
  },
  {
    q: "What are the daily download limits for each plan?",
    a: "Download limits depend on your membership plan: Free Plan: Upto 10 Free files/day (0 Gold files); Silver Plan: Upto 10 Gold & 10 Free files/day; Gold Plan: Upto 20 Gold & 15 Free files/day; Platinum Plan: Upto 30 Gold & 25 Free files/day; Diamond Plan: Upto 40 Gold & 50 Free files/day."
  }
];

const PlanIcon = ({ type }) => {
  switch (type) {
    case "sparkle":
      return <Sparkles size={18} />;
    case "bolt":
      return <Zap size={18} />;
    case "crown":
      return <Crown size={18} />;
    case "star":
      return <Star size={18} />;
    case "gem":
      return <Gem size={18} />;
    default:
      return <Sparkles size={18} />;
  }
};

const Pricing = ({ lastProductId = 0, initialProductCount = 0 }) => {
  const router = useRouter();
  const userData = useSessionStorageData("userData");
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSubscription, setActiveSubscription] = useState(false);
  const [activePlanId, setActivePlanId] = useState(null);
  const [showMessage, setShowMessage] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'short' | 'long'
  const [productCount, setProductCount] = useState(lastProductId || initialProductCount || 0);
  const cpdRef = useRef(null);

  // Fallback in case SSR count was not populated
  useEffect(() => {
    if (!productCount) {
      getallprojects(1, 12)
        .then((res) => {
          const count =
            res.data?.lastProductId ??
            res.data?.totalProducts ??
            (res.data?.products?.[0]?.id || 0);
          if (count) {
            setProductCount(count);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch product count:", err);
        });
    }
  }, [productCount]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await getUserDetails();
        if (!response) return;
        setUser(response.data);
        const expDate = new Date(response.data.acc_exp_date);
        const today = new Date();
        if (response.data.acc_exp_date && expDate > today) {
          setActiveSubscription(true);
          try {
            const subRes = await getSubscriptionDetail();
            if (subRes && subRes.data?.plan) {
              const subPlan = subRes.data.plan;
              setActivePlanId(subPlan.stripe_price_id);
              const planName = subPlan.plan_name || "Premium";
              setMessage(`✅ Your ${planName} is active and expires on ${expDate.toDateString()}`);
            } else {
              setMessage(`✅ Your Premium account is active and expires on ${expDate.toDateString()}`);
            }
          } catch (subErr) {
            setMessage(`✅ Your Premium account is active and expires on ${expDate.toDateString()}`);
          }
        } else {
          setActiveSubscription(false);
          setActivePlanId(null);
          setMessage("✖ You do not have an active subscription yet. Choose a plan below to get full access to our entire CAD library and AI Studio!");
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      }
    };
    if (isAuthenticated) fetchUserDetails();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!cpdRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cpdRef.current.classList.add("in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(cpdRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!userData && !user) {
      router.push(`/auth/login?redirect=${router.asPath}`);
      return;
    }
    if (!plan.stripeId) {
      if (!isAuthenticated) {
        router.push("/auth/register");
      } else {
        toast.info("You already have the Free Plan by default!");
      }
      return;
    }
    if (activeSubscription) {
      toast.error("You already have an active subscription. Cancel your current plan first from Manage Billing.");
      return;
    }
    try {
      const currentUserId = user?.id || userData?.id;
      const res = await handleSubscription(plan.stripeId, currentUserId);
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error(err?.response?.data?.error || "Failed to initiate checkout. Please try again.");
    }
  };

  const filteredPlans = filter === "all"
    ? plans
    : filter === "short"
      ? plans.filter((p) => ["free", "silver", "gold"].includes(p.id))
      : plans.filter((p) => ["free", "platinum", "diamond"].includes(p.id));

  const formattedProductCount = productCount ? `${Number(productCount).toLocaleString("en-US")}+` : "";
  const countPrefix = formattedProductCount ? `${formattedProductCount} ` : "";

  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://cadbull.com/#organization",
        "name": "Cadbull",
        "url": "https://cadbull.com/",
        "sameAs": [
          "https://www.facebook.com/cadbull/",
          "https://twitter.com/cadbull",
          "https://www.youtube.com/channel/UCy5GarRRRiH5he-WQ5JS5gQ"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://cadbull.com/#website",
        "url": "https://cadbull.com/",
        "name": "Cadbull",
        "publisher": {
          "@id": "https://cadbull.com/#organization"
        },
        "inLanguage": "en"
      },
      {
        "@type": "WebPage",
        "@id": "https://cadbull.com/pricing#webpage",
        "url": "https://cadbull.com/pricing",
        "name": `Cadbull Pricing | ${countPrefix}DWG, Revit & 3D Files + AI Studio`,
        "description": `Cadbull plans from $9.99 a week. Download ${countPrefix}DWG, 3ds Max, Revit and 3D model files, plus AI Studio for floor plans and 3D views.`,
        "isPartOf": {
          "@id": "https://cadbull.com/#website"
        },
        "about": {
          "@id": "https://cadbull.com/pricing#product"
        },
        "breadcrumb": {
          "@id": "https://cadbull.com/pricing#breadcrumb"
        },
        "inLanguage": "en"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cadbull.com/pricing#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cadbull.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Pricing",
            "item": "https://cadbull.com/pricing"
          }
        ]
      },
      {
        "@type": "Product",
        "@id": "https://cadbull.com/pricing#product",
        "name": "Cadbull Premium Membership",
        "description": "Membership for premium DWG, 3ds Max, Revit and 3D model files, plus AI Studio for floor plans, 3D views and DWG conversion.",
        "brand": {
          "@type": "Brand",
          "name": "Cadbull"
        },
        "offers": [
          {
            "@type": "Offer",
            "name": "Silver Plan (weekly)",
            "price": "9.99",
            "priceCurrency": "USD",
            "url": "https://cadbull.com/pricing",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Gold Plan (monthly)",
            "price": "19.99",
            "priceCurrency": "USD",
            "url": "https://cadbull.com/pricing",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Platinum Plan (3 months)",
            "price": "49.99",
            "priceCurrency": "USD",
            "url": "https://cadbull.com/pricing",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Diamond Plan (yearly)",
            "price": "99.00",
            "priceCurrency": "USD",
            "url": "https://cadbull.com/pricing",
            "availability": "https://schema.org/InStock"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cadbull.com/pricing#faq",
        "mainEntity": faqsData.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return (
    <Fragment>
      <Head>
        <title>{`Cadbull Pricing | ${countPrefix}DWG, Revit & 3D Files + AI Studio`}</title>
        <meta name="description" content={`Cadbull plans from $9.99 a week. Download ${countPrefix}DWG, 3ds Max, Revit and 3D model files, plus AI Studio for floor plans and 3D views.`} />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL || "https://cadbull.com"}/pricing`} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="theme-color" content="#1F2A3D" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cadbull" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL || "https://cadbull.com"}/pricing`} />
        <meta property="og:title" content={`Cadbull Pricing | ${countPrefix}DWG, Revit & 3D Files + AI Studio`} />
        <meta property="og:description" content={`Cadbull plans from $9.99 a week. Download ${countPrefix}DWG, 3ds Max, Revit and 3D model files, plus AI Studio for floor plans and 3D views.`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cadbull" />
        <meta name="twitter:title" content={`Cadbull Pricing | ${countPrefix}DWG, Revit & 3D Files + AI Studio`} />
        <meta name="twitter:description" content={`Cadbull plans from $9.99 a week. Download ${countPrefix}DWG, 3ds Max, Revit and 3D model files, plus AI Studio for floor plans and 3D views.`} />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
        />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: pricingStyles }} />

      <div className="pricing-page-root">
        {/* Top Notification Banner if Logged In */}
        {message && showMessage && (
          <div className="pricing-wrap pt-4">
            <div
              className="p-3 position-relative rounded d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: activeSubscription ? "#DCFCE7" : "#FFF1F2",
                color: activeSubscription ? "#166534" : "#991B1B",
                border: activeSubscription ? "1px solid #BBF7D0" : "1px solid #FECDD3",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)"
              }}
            >
              <span className="fw-semibold" style={{ fontSize: "0.92rem" }}>
                {message}
              </span>
              <button
                onClick={() => setShowMessage(false)}
                className="btn btn-link p-1 text-decoration-none shadow-none border-0"
                style={{ color: "inherit" }}
                aria-label="Close message"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pricing-hero" aria-labelledby="pricing-h1">
          <div className="pricing-wrap">
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">Pricing</li>
              </ol>
            </nav>

            <div className="d-block mb-3">
              <span className="pill-new">
                <b>NEW</b> AI design tools now included
              </span>
            </div>

            <h1 id="pricing-h1">
              {countPrefix}DWG, 3ds Max, Revit and 3D model files, plus an AI studio
            </h1>

            <p className="lede">
              Download AutoCAD DWG, 3ds Max, Revit and 3D model files, then use AI Studio to turn sketches and images into 3D views, floor plans and DWG.
            </p>

            <p className="answer">
              Cadbull plans start at <strong>$9.99 a week</strong>. Monthly is <strong>$19.99</strong>, 3 months is <strong>$49.99</strong> and yearly is <strong>$99.00</strong>. Every paid plan includes all premium files and AI Studio.
            </p>

            <p className="updated">
              Prices last updated <time dateTime="2026-10">October 2026</time>
            </p>

            {/* Filter Toggle */}
            <div className="seg-filter" role="group" aria-label="Filter plans by length">
              <button
                type="button"
                onClick={() => setFilter("all")}
                aria-pressed={filter === "all"}
              >
                All plans
              </button>
              <button
                type="button"
                onClick={() => setFilter("short")}
                aria-pressed={filter === "short"}
              >
                Short-term
              </button>
              <button
                type="button"
                onClick={() => setFilter("long")}
                aria-pressed={filter === "long"}
              >
                Long-term
              </button>
            </div>
          </div>
        </section>

        {/* Plan Cards Section */}
        <section className="plans-sec" id="plans" aria-labelledby="plans-h">
          <div className="pricing-wrap">
            <h2 id="plans-h" className="plans-title">Cadbull plans and pricing</h2>

            <div className="plans-grid" style={{ "--cols": filteredPlans.length }}>
              {filteredPlans.map((plan) => {
                const isCurrent =
                  (plan.id === "free" && !activeSubscription) ||
                  (plan.stripeId && activePlanId && (
                    plan.stripeId === activePlanId ||
                    (plan.id === "silver" && ["price_1QLNQAFy6VKViPpJGQCXH5KE", "price_1TSAT3Fy6VKViPpJP4SIMcZX", "price_1TVxFsFy6VKViPpJCRGnLEYH", "price_1RjwuyFy6VKViPpJHrCcff1Y"].includes(activePlanId)) ||
                    (plan.id === "gold" && ["price_1Q8P4NFy6VKViPpJeRzGAybE", "price_1TSAo6Fy6VKViPpJRV0M9OY4", "price_1UO8M3Fy6VKViPpJQuLeuVq1"].includes(activePlanId)) ||
                    (plan.id === "platinum" && ["price_1Q8H9gFy6VKViPpJwEh4k3c1", "price_1TSB3UFy6VKViPpJdcvQYrh2", "price_1UO8ZHFy6VKViPpJ57GVbkgx"].includes(activePlanId)) ||
                    (plan.id === "diamond" && ["price_1Q8PNDFy6VKViPpJSYVg4mvU"].includes(activePlanId))
                  ));

                return (
                  <article
                    key={plan.id}
                    className={`plan-card ${plan.popular ? "plan-card--gold" : ""}`}
                    data-term={plan.term}
                  >
                    {plan.badge && (
                      <span className={`plan-badge ${plan.badgeRed ? "plan-badge--red" : ""}`}>
                        {plan.badge}
                      </span>
                    )}

                    <div className="plan-top">
                      <span className="plan-ico">
                        <PlanIcon type={plan.icon} />
                      </span>
                      <h3>{plan.name}</h3>
                    </div>

                    <p className="plan-tag">{plan.tagline}</p>

                    <p className="plan-price">
                      <span className="plan-cur">$</span>
                      <span className="plan-amt">{plan.price.replace("$", "")}</span>
                      <span className="plan-per">{plan.period}</span>
                    </p>

                    <p className="plan-eq">{plan.eq}</p>

                    <p className={`plan-save ${plan.saveGood ? "plan-save--good" : ""}`}>
                      {plan.save}
                    </p>

                    <ul className="plan-feat">
                      {plan.features.map((f, idx) => {
                        if (f.isAiTools) {
                          return (
                            <li key={idx}>
                              <details className="plan-tools">
                                <summary>
                                  <Check className="plan-ck" size={16} strokeWidth={2.5} />
                                  <span>11 AI tools</span>
                                  <span className="plan-nw">NEW</span>
                                  <ChevronDown className="chev" size={14} />
                                </summary>
                                <ul>
                                  {aiToolsList.map((t, tIdx) => (
                                    <li key={tIdx}>{t}</li>
                                  ))}
                                </ul>
                              </details>
                            </li>
                          );
                        }
                        return (
                          <li
                            key={idx}
                            className={`${f.key ? "key" : ""} ${f.off ? "off" : ""}`}
                          >
                            <Check className="plan-ck" size={16} strokeWidth={2.5} />
                            <span>{f.label}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleSubscribe(plan)}
                      disabled={activeSubscription && !isCurrent}
                      className={`plan-cta ${isCurrent
                          ? "plan-cta--green"
                          : plan.popular
                            ? "plan-cta--red"
                            : plan.id === "free"
                              ? "plan-cta--green"
                              : ""
                        }`}
                    >
                      {isCurrent ? "CURRENT PLAN" : plan.ctaLabel}
                      {!isCurrent && <ArrowRight size={16} strokeWidth={2.5} />}
                    </button>

                    {plan.payNotice && <p className="plan-pay">{plan.payNotice}</p>}
                  </article>
                );
              })}
            </div>

            {/* Assurance 3-column banner */}
            <div className="assure-grid">
              <div className="assure-item">
                <b>Switch plans any time</b>
                <span>Upgrade or downgrade from your dashboard. Billing is prorated.</span>
              </div>
              <div className="assure-item">
                <b>Pay your way</b>
                <span>UPI for Indian customers, plus credit cards, debit cards, and PayPal.</span>
              </div>
              <div className="assure-item">
                <b>Credits last the whole plan</b>
                <span>AI credits don&apos;t expire daily. Download limits reset every 24 hours.</span>
              </div>
            </div>
          </div>
        </section>

        {/* DWG, 3ds Max, Revit section */}
        <section className="pricing-sec" aria-labelledby="fmt-h">
          <div className="pricing-narrow">
            <h2 id="fmt-h">DWG, 3ds Max, Revit and 3D model files in one library</h2>
            <p className="intro">
              Cadbull is not only a CAD library. Premium plans open all premium files across the formats below, and the Free plan includes a free-files library.
            </p>

            <h3 className="sub-heading">Browse by file format</h3>
            <ul className="pill-links">
              <li><Link href="/categories/1?file_type=DWG">DWG (AutoCAD) files</Link></li>
              <li><Link href="/categories/1?file_type=3d%20max">3ds Max files</Link></li>
              <li><Link href="/categories/1?file_type=3d%20sketchup">SketchUp (SKP) files</Link></li>
              <li><Link href="/categories/1?file_type=Revit">Revit (RVT) files</Link></li>
              <li><Link href="/categories/1?file_type=PDF">PDF files</Link></li>
            </ul>

            <h3 className="sub-heading">Browse by category</h3>
            <ul className="pill-links">
              <li><Link href="/Cad-Architecture">CAD architecture drawings</Link></li>
              <li><Link href="/3d-Drawings">3D drawings and models</Link></li>
              <li><Link href="/DWG-Blocks">DWG blocks</Link></li>
              <li><Link href="/Autocad-Furniture-Blocks--&-DWG-Models">Furniture blocks and models</Link></li>
              <li><Link href="/Interior-design">Interior design files</Link></li>
              <li><Link href="/Electrical-Cad">Electrical CAD drawings</Link></li>
              <li><Link href="/Cad-Landscaping">Landscape CAD files</Link></li>
              <li><Link href="/Autocad-Machinery-Blocks-&-DWG-Models">Machinery CAD models</Link></li>
              <li><Link href="/Detail">Construction details</Link></li>
              <li><Link href="/Structure-detail">Structure details</Link></li>
              <li><Link href="/Urban-design">Urban design drawings</Link></li>
              <li><Link href="/Projects">Project drawings</Link></li>
            </ul>
          </div>
        </section>

        {/* Cost Per Day Section */}
        <section className="pricing-sec" aria-labelledby="cpd-h">
          <div className="pricing-narrow">
            <h2 id="cpd-h">What each plan costs per day</h2>
            <p className="intro">
              The longer the plan, the less each day costs. Weekly is the baseline for every saving on this page.
            </p>

            <div className="pricing-panel">
              <div
                className="cpd-wrapper"
                id="cpd"
                ref={cpdRef}
                role="img"
                aria-label="Cost per day: weekly $1.43, monthly $0.66, 3 months $0.55, yearly $0.27."
              >
                <div className="cpd-row cpd-row--base" style={{ "--w": "100%" }}>
                  <div className="cpd-top">
                    <span className="cpd-name">Weekly</span>
                    <span className="cpd-val">$1.43 a day</span>
                  </div>
                  <div className="cpd-track">
                    <div className="cpd-fill"></div>
                  </div>
                </div>

                <div className="cpd-row" style={{ "--w": "46.2%" }}>
                  <div className="cpd-top">
                    <span className="cpd-name">Monthly</span>
                    <span className="cpd-val">$0.66 a day <small>54% less</small></span>
                  </div>
                  <div className="cpd-track">
                    <div className="cpd-fill"></div>
                  </div>
                </div>

                <div className="cpd-row" style={{ "--w": "38.4%" }}>
                  <div className="cpd-top">
                    <span className="cpd-name">3 Months</span>
                    <span className="cpd-val">$0.55 a day <small>62% less</small></span>
                  </div>
                  <div className="cpd-track">
                    <div className="cpd-fill"></div>
                  </div>
                </div>

                <div className="cpd-row" style={{ "--w": "19.2%" }}>
                  <div className="cpd-top">
                    <span className="cpd-name">Yearly</span>
                    <span className="cpd-val">$0.27 a day <small>81% less</small></span>
                  </div>
                  <div className="cpd-track">
                    <div className="cpd-fill"></div>
                  </div>
                </div>
              </div>
              <p className="cpd-foot">Savings are compared with the weekly plan.</p>
            </div>
          </div>
        </section>

        {/* AI Credits Table Section */}
        <section className="pricing-sec" aria-labelledby="credits-h">
          <div className="pricing-narrow">
            <div className="pricing-panel credits-two">
              <div>
                <h2 id="credits-h">What an AI credit gets you</h2>
                <p className="credits-rule">
                  One credit is one generation: a sketch turned into 3D, an image turned into DWG, or a floor plan.
                </p>
                <p className="intro" style={{ margin: 0 }}>
                  Bigger plans include far more credits, so each generation costs less. Credits stay valid for the whole length of your plan.
                </p>
              </div>

              <div className="credits-table-wrap">
                <table className="credits-table">
                  <caption className="visually-hidden">Price per AI generation by plan</caption>
                  <thead>
                    <tr>
                      <th scope="col">Plan</th>
                      <th scope="col">Credits</th>
                      <th scope="col">Per generation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Silver, weekly</th>
                      <td>25</td>
                      <td>$0.40</td>
                    </tr>
                    <tr>
                      <th scope="row">Gold, monthly</th>
                      <td>100</td>
                      <td>$0.20</td>
                    </tr>
                    <tr>
                      <th scope="row">Platinum, 3 months</th>
                      <td>300</td>
                      <td>$0.17</td>
                    </tr>
                    <tr>
                      <th scope="row">Diamond, yearly</th>
                      <td>1,500</td>
                      <td>$0.07</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* AI Studio Tools Section */}
        <section className="pricing-sec" aria-labelledby="tools-h">
          <div className="pricing-narrow">
            <h2 id="tools-h">AI Studio tools in every paid plan</h2>
            <p className="intro">
              Turn sketches, images and 2D drawings into 3D views, floor plans and DWG without leaving Cadbull.
            </p>
            <ul className="tool-pill-list">
              {aiToolsList.map((tool, idx) => (
                <li key={idx}>{tool}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="pricing-sec" aria-labelledby="faq-h">
          <div className="pricing-narrow">
            <h2 id="faq-h" style={{ marginBottom: "20px" }}>Questions before you buy</h2>
            <div className="faq-list">
              {faqsData.map((faq, idx) => (
                <details key={idx} className="faq-item">
                  <summary>
                    {faq.q}
                    <ChevronDown className="faq-icon" size={18} />
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export async function getServerSideProps({ res }) {
  try {
    if (res) {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    }
    const projectRes = await getallprojects(1, 12);
    const count =
      projectRes?.data?.lastProductId ??
      projectRes?.data?.totalProducts ??
      (projectRes?.data?.products?.[0]?.id || 0);

    return {
      props: {
        lastProductId: count || 0,
        initialProductCount: count || 0,
      },
    };
  } catch (error) {
    console.error("Failed to get product count in getServerSideProps:", error);
    return {
      props: {
        lastProductId: 0,
        initialProductCount: 0,
      },
    };
  }
}

Pricing.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Pricing;
