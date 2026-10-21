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
import { isUserSubscribed } from "@/utils/subscription";
import { X } from "lucide-react";

const pricingStyles = `.pricing-page-root {
  --bg:#F6F7F9;--card:#fff;--line:#E3E7EE;--grid:#E9EDF3;
  --ink:#111827;--navy:#1F2A3D;--navy-2:#2C3A52;--muted:#5F6D80;--faint:#A3AEBF;
  --red:#DC3C41;--red-dark:#C42F34;--green:#15803D;--green-soft:#E8F6EC;--blue:#2563EB;
  --yellow:#FFF3C4;
  --display:"Inter",system-ui,sans-serif;
  --font:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}

.pricing-page-root *, .pricing-page-root *::before, .pricing-page-root *::after {
  box-sizing:border-box
}

.pricing-page-root {
  -webkit-text-size-adjust:100%;scroll-behavior:smooth;scroll-padding-top:12px
}

.pricing-page-root {
  margin:0;background:var(--bg);color:var(--ink);font:400 15px/1.55 var(--font);overflow-wrap:break-word
}

.pricing-page-root a {
  color:inherit
}

.pricing-page-root [hidden] {
  display:none!important
}

.pricing-page-root :focus-visible {
  outline:3px solid var(--blue);outline-offset:2px
}

.pricing-page-root .wrap {
  max-width:1280px;margin:0 auto;padding:0 20px
}

.pricing-page-root .sr {
  position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap
}

.pricing-page-root .skip {
  position:absolute;left:-999px;top:8px;background:var(--ink);color:#fff;padding:8px 12px;z-index:60
}

.pricing-page-root .skip:focus {
  left:8px
}

.pricing-page-root svg {
  max-width:100%
}

.pricing-page-root .btn {
  display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 22px;border-radius:12px;font:700 .95rem var(--font);text-decoration:none;border:2px solid transparent;cursor:pointer;transition:background .15s,border-color .15s
}

.pricing-page-root .btn svg {
  width:18px;height:18px;flex:none
}

.pricing-page-root .btn--red {
  background:var(--red);color:#fff
}

.pricing-page-root .btn--red:hover {
  background:var(--red-dark)
}

.pricing-page-root .btn--ghost {
  background:#fff;border-color:var(--line);color:var(--ink)
}

.pricing-page-root .btn--ghost:hover {
  border-color:var(--navy)
}

.pricing-page-root .btn--sm {
  min-height:44px;padding:0 16px;font-size:.88rem;border-radius:10px;width:100%
}

.pricing-page-root .btn--navy {
  background:var(--navy);color:#fff
}

.pricing-page-root .btn--navy:hover {
  background:#0F1726
}

.pricing-page-root .btn--green {
  background:var(--green);color:#fff
}

.pricing-page-root .btn--green:hover {
  background:#116530
}

.pricing-page-root .btn--light {
  background:transparent;border-color:rgba(255,255,255,.5);color:#fff
}

.pricing-page-root .btn--light:hover {
  background:rgba(255,255,255,.12)
}

.pricing-page-root .hero {
  position:relative;overflow:hidden;padding:48px 0 28px
}

.pricing-page-root .hero::before {
  content:"";position:absolute;inset:0;background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:linear-gradient(to bottom,#000 25%,transparent);mask-image:linear-gradient(to bottom,#000 25%,transparent);pointer-events:none
}

.pricing-page-root .hero-grid {
  position:relative;display:grid;grid-template-columns:1fr;gap:32px;align-items:center
}

@media (min-width:960px) {
.pricing-page-root .hero-grid {
  grid-template-columns:1.12fr .88fr;gap:40px
}
}

.pricing-page-root .hero-copy {
  min-width:0
}

.pricing-page-root .crumbs {
  margin:0 0 10px;padding:0;list-style:none;display:flex;gap:8px;font-size:.84rem;color:var(--muted)
}

.pricing-page-root .crumbs li {
  display:flex;align-items:center
}

.pricing-page-root .crumbs li+li::before {
  content:"/";margin-right:8px;color:var(--faint)
}

.pricing-page-root .crumbs a {
  display:inline-flex;align-items:center;min-height:44px;padding:0 2px;text-decoration:none
}

.pricing-page-root .crumbs a:hover {
  text-decoration:underline
}

.pricing-page-root .pill-new {
  display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:999px;padding:6px 14px;font-size:.82rem;font-weight:600;color:var(--muted)
}

.pricing-page-root .pill-new b {
  color:var(--red);font-weight:800
}

.pricing-page-root h1 {
  margin:16px 0 0;max-width:21ch;font:800 clamp(1.85rem,1rem + 3.3vw,3.3rem)/1.06 var(--display);letter-spacing:-.032em
}

.pricing-page-root .lede {
  margin:16px 0 0;max-width:56ch;color:var(--muted);font-size:1.06rem
}

.pricing-page-root .answer {
  margin:12px 0 0;max-width:60ch
}

.pricing-page-root .hero-cta {
  display:flex;flex-wrap:wrap;gap:12px;margin-top:22px
}

.pricing-page-root .trust {
  list-style:none;margin:20px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px 18px;font-size:.88rem;font-weight:600;color:#334155
}

.pricing-page-root .trust li {
  display:flex;align-items:center;gap:6px
}

.pricing-page-root .trust svg {
  width:16px;height:16px;color:var(--green);flex:none
}

.pricing-page-root .ext-chips {
  list-style:none;margin:16px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px
}

.pricing-page-root .ext-chips li {
  font:800 .8rem var(--display);border:1.5px solid var(--navy);border-radius:6px;padding:4px 9px;background:#fff
}

.pricing-page-root .updated {
  margin:14px 0 0;font-size:.8rem;color:var(--muted)
}

.pricing-page-root .hero-art {
  display:none
}

@media (min-width:960px) {
.pricing-page-root .ext-chips {
  display:none
}
.pricing-page-root .hero-art {
  display:block;position:relative;height:380px
}
}

.pricing-page-root .sheet {
  position:absolute;width:272px;height:196px;border:2px solid var(--navy);border-radius:8px;background-color:#fff;background-image:linear-gradient(#EEF1F6 1px,transparent 1px),linear-gradient(90deg,#EEF1F6 1px,transparent 1px);background-size:18px 18px;box-shadow:0 26px 46px -20px rgba(16,24,40,.32);overflow:hidden
}

.pricing-page-root .sheet svg {
  position:absolute;inset:0;width:100%;height:100%
}

.pricing-page-root .tb {
  position:absolute;right:0;bottom:0;display:flex;flex-direction:column;gap:2px;min-width:96px;padding:6px 12px 7px;background:#fff;border-top:2px solid var(--navy);border-left:2px solid var(--navy);line-height:1.1
}

.pricing-page-root .tb b {
  font:800 1.05rem var(--display)
}

.pricing-page-root .tb span {
  font-size:.72rem;font-weight:600;color:var(--muted)
}

.pricing-page-root .s-rvt {
  left:0;top:16px;transform:rotate(-7deg)
}

.pricing-page-root .s-max {
  right:0;top:0;transform:rotate(6deg)
}

.pricing-page-root .s-dwg {
  left:64px;top:150px;transform:rotate(-1.5deg);z-index:2
}

.pricing-page-root .plans-sec {
  padding:20px 0 8px
}

.pricing-page-root .plans-title {
  margin:0;text-align:center
}

.pricing-page-root .plans-sub {
  margin:8px 0 0;text-align:center;color:var(--muted)
}

.pricing-page-root h1, .pricing-page-root h2 {
  text-wrap:balance
}

.pricing-page-root h2 {
  margin:0 0 8px;font:800 clamp(1.45rem,1rem + 1.4vw,2.05rem)/1.15 var(--display);letter-spacing:-.025em
}

.pricing-page-root .finder {
  margin:22px auto 0;text-align:center
}

.pricing-page-root .finder-q {
  margin:0 0 10px;font-weight:700
}

.pricing-page-root .seg {
  display:inline-flex;gap:4px;background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px
}

.pricing-page-root .seg button {
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-height:54px;padding:0 22px;border:0;background:transparent;border-radius:999px;font:700 .95rem/1.15 var(--font);color:var(--muted);cursor:pointer;transition:background .15s,color .15s
}

.pricing-page-root .seg button small {
  font-size:.72rem;font-weight:700;color:var(--green)
}

.pricing-page-root .seg button:hover {
  color:var(--ink)
}

.pricing-page-root .seg button[aria-pressed="true"] {
  background:var(--navy);color:#fff
}

.pricing-page-root .seg button[aria-pressed="true"] small {
  color:#86EFAC
}

.pricing-page-root .seg button:first-child small {
  color:var(--muted)
}

.pricing-page-root .seg button[aria-pressed="true"]:first-child small {
  color:#B7C2D3
}

.pricing-page-root .finder-msg {
  margin:12px auto 0;min-height:3.2em;max-width:58ch;color:var(--muted);font-size:.95rem
}

.pricing-page-root .plans {
  display:grid;gap:20px;grid-template-columns:1fr;align-items:stretch;padding-top:22px
}

@media (min-width:640px) {
.pricing-page-root .plans {
  grid-template-columns:repeat(2,1fr)
}
}

@media (min-width:920px) {
.pricing-page-root .plans {
  grid-template-columns:repeat(3,1fr)
}
}

@media (min-width:1240px) {
.pricing-page-root .plans {
  grid-template-columns:repeat(5,1fr);gap:16px
}
}

.pricing-page-root .plan {
  position:relative;display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:22px 20px 20px;box-shadow:0 1px 2px rgba(16,24,40,.04),0 14px 28px -20px rgba(16,24,40,.22);transition:transform .18s,box-shadow .18s
}

@media (hover:hover) {
.pricing-page-root .plan:hover {
  transform:translateY(-4px);box-shadow:0 1px 2px rgba(16,24,40,.04),0 22px 36px -18px rgba(16,24,40,.30)
}
}

.pricing-page-root .plan.is-pick {
  box-shadow:0 0 0 3px var(--red),0 22px 40px -16px rgba(220,60,65,.45)
}

.pricing-page-root .pick-tag {
  display:none;position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);z-index:3;background:var(--red);color:#fff;font-size:.74rem;font-weight:800;padding:6px 14px;border-radius:999px;white-space:nowrap
}

.pricing-page-root .is-pick .pick-tag {
  display:block
}

.pricing-page-root .badge {
  position:absolute;top:-14px;left:50%;transform:translateX(-50%);z-index:3;white-space:nowrap;border-radius:999px;font-size:.72rem;font-weight:800;padding:7px 14px;color:#fff;background:var(--navy);box-shadow:0 8px 16px -6px rgba(16,24,40,.35)
}

.pricing-page-root .badge--red {
  background:var(--red)
}

.pricing-page-root .p-head {
  display:flex;align-items:center;gap:10px
}

.pricing-page-root .ico {
  width:36px;height:36px;border-radius:10px;background:#F1F4F9;display:grid;place-items:center;flex:none
}

.pricing-page-root .ico svg {
  width:18px;height:18px
}

.pricing-page-root .p-head h3 {
  margin:0;flex:1;min-width:0;font:800 1.05rem/1.15 var(--display)
}

.pricing-page-root .term {
  flex:none;font-size:.72rem;font-weight:700;color:var(--muted);background:#F1F4F9;border-radius:999px;padding:4px 9px;white-space:nowrap
}

.pricing-page-root .p-tag {
  margin:12px 0 0;font-size:.86rem;font-weight:600;color:var(--muted)
}

.pricing-page-root .p-price {
  margin:6px 0 0;display:flex;align-items:baseline;gap:3px
}

.pricing-page-root .cur {
  font:800 1.2rem var(--display)
}

.pricing-page-root .amt {
  font:800 2.7rem/1 var(--display);letter-spacing:-.045em
}

.pricing-page-root .per-line {
  margin:2px 0 0;color:var(--muted);font-size:.88rem
}

.pricing-page-root .eq {
  margin:2px 0 0;min-height:1.5em;color:var(--muted);font-size:.84rem
}

.pricing-page-root .pill {
  margin:8px 0 0;display:flex;align-items:center;min-height:42px;padding:8px 12px;border-radius:10px;background:#F1F4F9;color:var(--muted);font-size:.82rem;font-weight:700;line-height:1.25
}

.pricing-page-root .pill--good {
  background:var(--green-soft);color:var(--green)
}

.pricing-page-root .ruler {
  margin-top:14px
}

.pricing-page-root .ruler-top {
  display:flex;justify-content:space-between;align-items:baseline;font-size:.8rem;color:var(--muted)
}

.pricing-page-root .ruler-top b {
  font:800 .98rem var(--display);color:var(--ink)
}

.pricing-page-root .ruler-bar {
  position:relative;height:10px;margin-top:6px;background:#E8ECF3;border-radius:3px;overflow:hidden
}

.pricing-page-root .ruler-bar i {
  position:absolute;left:0;top:0;bottom:0;width:var(--w);background:#94A3B8
}

.pricing-page-root .ruler--good .ruler-bar i {
  background:var(--green)
}

.pricing-page-root .ruler-bar::after {
  content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 1.5px),rgba(255,255,255,.95) calc(10% - 1.5px) 10%)
}

html.js .pricing-page-root .ruler-bar i {
  width:0;transition:width .9s cubic-bezier(.2,.7,.2,1)
}

html.js .pricing-page-root .plans.in .ruler-bar i {
  width:var(--w)
}

.pricing-page-root .p-hero {
  margin:14px 0 0;display:flex;gap:8px;align-items:flex-start;min-height:2.8em;font-size:.9rem;line-height:1.35
}

.pricing-page-root .p-hero svg {
  width:18px;height:18px;flex:none;margin-top:1px;color:var(--navy)
}

.pricing-page-root .p-hero b {
  font-weight:800
}

.pricing-page-root .tiles {
  display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:6px;margin-top:12px
}

.pricing-page-root .tile {
  background:#F1F4F9;border-radius:10px;padding:10px 4px 9px;text-align:center;min-width:0
}

.pricing-page-root .tile b {
  display:block;font:800 1.12rem/1.1 var(--display);letter-spacing:-.02em;white-space:nowrap
}

.pricing-page-root .tile span {
  display:block;margin-top:3px;font-size:.72rem;line-height:1.2;color:var(--muted);white-space:nowrap
}

.pricing-page-root .tile--off {
  opacity:.55
}

.pricing-page-root .p-list {
  list-style:none;margin:14px 0 18px;padding:12px 0 0;border-top:1px solid var(--line);display:grid;gap:2px;font-size:.88rem;color:#334155
}

.pricing-page-root .p-list>li {
  display:flex;align-items:center;gap:10px;min-height:32px
}

.pricing-page-root .p-list>li.li-tools {
  display:block
}

.pricing-page-root .ck {
  width:18px;height:18px;flex:none;color:#7C8AA0
}

.pricing-page-root .tools summary {
  list-style:none;display:flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;font-weight:600;color:var(--ink)
}

.pricing-page-root .tools summary::-webkit-details-marker {
  display:none
}

.pricing-page-root .tools .chev {
  width:14px;height:14px;margin-left:auto;color:var(--muted);transition:transform .15s
}

.pricing-page-root .tools[open] .chev {
  transform:rotate(180deg)
}

.pricing-page-root .tools ul {
  list-style:none;margin:2px 0 8px 28px;padding:0;display:grid;gap:7px;color:var(--muted);font-size:.84rem
}

.pricing-page-root .nw {
  font-size:.7rem;font-weight:800;letter-spacing:.04em;color:var(--blue);background:#EAF1FF;border:1px solid #C9DBFF;border-radius:4px;padding:2px 5px;line-height:1.3
}

.pricing-page-root .cta {
  margin-top:auto;display:flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:0 14px;border-radius:12px;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;font-size:.95rem;transition:background .15s
}

.pricing-page-root .cta:hover {
  background:#0F1726
}

.pricing-page-root .cta svg {
  width:17px;height:17px
}

.pricing-page-root .cta--red {
  background:var(--red)
}

.pricing-page-root .cta--red:hover {
  background:var(--red-dark)
}

.pricing-page-root .cta--green {
  background:var(--green)
}

.pricing-page-root .cta--green:hover {
  background:#116530
}

.pricing-page-root .pay {
  margin:10px 0 0;display:flex;align-items:center;justify-content:center;gap:6px;font-size:.78rem;color:var(--muted)
}

.pricing-page-root .pay svg {
  width:13px;height:13px
}

.pricing-page-root .plan--gold {
  background-color:var(--navy);color:#fff;border-color:var(--navy);background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:22px 22px;box-shadow:0 26px 48px -18px rgba(16,24,40,.55)
}

.pricing-page-root .plan--gold .ico {
  background:var(--red);color:#fff
}

.pricing-page-root .plan--gold .term {
  background:var(--navy-2);color:#D3DBE7
}

.pricing-page-root .plan--gold .p-tag, .pricing-page-root .plan--gold .per-line, .pricing-page-root .plan--gold .eq, .pricing-page-root .plan--gold .pay, .pricing-page-root .plan--gold .ruler-top {
  color:#B7C2D3
}

.pricing-page-root .plan--gold .ruler-top b {
  color:#fff
}

.pricing-page-root .plan--gold .pill--good {
  background:var(--navy-2);color:#86EFAC
}

.pricing-page-root .plan--gold .ruler-bar {
  background:#3A4963
}

.pricing-page-root .plan--gold .ruler-bar::after {
  background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 1.5px),var(--navy) calc(10% - 1.5px) 10%)
}

.pricing-page-root .plan--gold .ruler--good .ruler-bar i {
  background:#4ADE80
}

.pricing-page-root .plan--gold .p-hero svg {
  color:#fff
}

.pricing-page-root .plan--gold .tile {
  background:var(--navy-2)
}

.pricing-page-root .plan--gold .tile span {
  color:#B7C2D3
}

.pricing-page-root .plan--gold .p-list {
  border-top-color:#3A4963;color:#E6EBF3
}

.pricing-page-root .plan--gold .ck {
  background:var(--red);color:#fff;border-radius:50%;padding:3px
}

.pricing-page-root .plan--gold .tools summary {
  color:#fff
}

.pricing-page-root .plan--gold .tools .chev, .pricing-page-root .plan--gold .tools ul {
  color:#B7C2D3
}

.pricing-page-root .plan--gold .nw {
  background:var(--red);border-color:var(--red);color:#fff
}

.pricing-page-root .plan--gold :focus-visible {
  outline-color:#fff
}

@media (min-width:1240px) {
.pricing-page-root .plan--gold {
  margin-top:-14px
}
}

.pricing-page-root .plan--diamond {
  border:2px solid var(--navy);padding:21px 19px 19px
}

.pricing-page-root .assure {
  list-style:none;margin:40px 0 0;padding:0;display:grid;gap:12px;grid-template-columns:1fr
}

@media (min-width:760px) {
.pricing-page-root .assure {
  grid-template-columns:repeat(3,1fr)
}
}

.pricing-page-root .assure li {
  display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px
}

.pricing-page-root .assure svg {
  width:22px;height:22px;flex:none;color:var(--navy);margin-top:2px
}

.pricing-page-root .assure b {
  display:block
}

.pricing-page-root .assure span {
  color:var(--muted);font-size:.9rem
}

.pricing-page-root .sec {
  padding:60px 0 0
}

.pricing-page-root .intro {
  margin:0 0 24px;max-width:62ch;color:var(--muted)
}

.pricing-page-root .sub {
  margin:22px 0 10px;font-size:1rem;font-weight:700
}

.pricing-page-root .panel {
  background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px
}

.pricing-page-root .why {
  display:grid;gap:14px;grid-template-columns:1fr;margin-top:20px
}

@media (min-width:860px) {
.pricing-page-root .why {
  grid-template-columns:repeat(3,1fr);gap:18px
}
}

.pricing-page-root .why-i {
  background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px
}

.pricing-page-root .why-i h3 {
  margin:14px 0 6px;font:800 1.08rem/1.25 var(--display)
}

.pricing-page-root .why-i p {
  margin:0;color:var(--muted)
}

.pricing-page-root .cmp-wrap>summary {
  display:none
}

.pricing-page-root .panel--flush {
  padding:0;overflow:clip
}

.pricing-page-root .cmp-panel {
  border-radius:20px;box-shadow:0 1px 2px rgba(16,24,40,.04),0 16px 40px -24px rgba(16,24,40,.25)
}

.pricing-page-root .cmp {
  width:100%;border-collapse:separate;border-spacing:0;font-variant-numeric:tabular-nums;table-layout:fixed
}

.pricing-page-root .cmp th, .pricing-page-root .cmp td {
  padding:15px 12px;border-top:1px solid var(--line);text-align:center;font-size:.93rem;color:#334155;vertical-align:middle
}

.pricing-page-root .cmp thead th {
  position:sticky;top:72px;z-index:10;border-top:0;padding:22px 12px 16px;background:#fff;border-bottom:1px solid var(--line);vertical-align:bottom
}

.pricing-page-root .cmp thead th:first-child {
  width:25%
}

.pricing-page-root .ch-name {
  display:block;font:800 1.1rem/1.1 var(--display);letter-spacing:-.01em;color:var(--ink)
}

.pricing-page-root .ch-tier {
  display:block;margin-top:5px;font-size:.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)
}

.pricing-page-root .ch-badge {
  display:block;width:max-content;margin:0 auto 8px;padding:4px 10px;border-radius:999px;background:var(--navy);color:#fff;font-style:normal;font-size:.72rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase
}

.pricing-page-root .ch-badge--red {
  background:var(--red)
}

.pricing-page-root .cmp thead .col-gold {
  background:var(--navy);color:#fff
}

.pricing-page-root .cmp thead .col-gold .ch-name {
  color:#fff
}

.pricing-page-root .cmp thead .col-gold .ch-tier {
  color:#B7C2D3
}

.pricing-page-root .cmp thead .col-gold .ch-badge {
  background:var(--red)
}

.pricing-page-root .cmp tbody th {
  text-align:left;font-weight:700;color:var(--ink);padding-left:22px
}

.pricing-page-root .cmp tbody th small {
  display:block;margin-top:3px;font-weight:500;font-size:.76rem;color:var(--muted)
}

.pricing-page-root .cmp td b {
  font-weight:800;color:var(--ink)
}

.pricing-page-root .cmp td small {
  font-size:.8rem;color:var(--muted)
}

.pricing-page-root .cmp tbody tr:not(.grp):not(.cta-row):hover th, .pricing-page-root .cmp tbody tr:not(.grp):not(.cta-row):hover td:not(.col-gold) {
  background:#F8FAFC
}

.pricing-page-root .cmp .col-gold {
  background:#F1F5FB;border-left:1px solid #DCE4F0;border-right:1px solid #DCE4F0
}

.pricing-page-root .cmp tbody tr:not(.grp):not(.cta-row):hover td.col-gold {
  background:#E8EEF8
}

.pricing-page-root .cmp .col-free {
  color:var(--muted)
}

.pricing-page-root .cmp .grp th {
  padding:11px 22px;text-align:left;background:#F6F7F9;border-top:1px solid var(--line);font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)
}

.pricing-page-root .cmp .grp:first-child th {
  border-top:0
}

.pricing-page-root .price-v b {
  font:800 1.12rem var(--display);letter-spacing:-.02em
}

.pricing-page-root .price-v small {
  display:inline;font-weight:600
}

.pricing-page-root .cpd-v {
  display:grid;gap:6px;justify-items:center
}

.pricing-page-root .cpd-v b {
  font-size:.98rem
}

.pricing-page-root .cpd-bar {
  display:block;width:70%;max-width:90px;height:5px;border-radius:99px;background:#E6EAF1;overflow:hidden
}

.pricing-page-root .cpd-bar u {
  display:block;height:100%;border-radius:99px;background:var(--navy);text-decoration:none
}

.pricing-page-root .col-gold .cpd-bar u {
  background:var(--red)
}

.pricing-page-root .save-pill {
  display:inline-block;padding:5px 11px;border-radius:999px;background:var(--green-soft);color:var(--green);font-weight:800;font-size:.8rem
}

.pricing-page-root .yes {
  display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--green-soft);color:var(--green)
}

.pricing-page-root .yes svg {
  width:14px;height:14px
}

.pricing-page-root .dash {
  color:#B6C0CE;font-weight:700
}

.pricing-page-root .cmp .cta-row th, .pricing-page-root .cmp .cta-row td {
  padding:18px 10px 22px;background:#fff
}

.pricing-page-root .cmp .cta-row .col-gold {
  background:#F1F5FB
}

.pricing-page-root .wrap--wide {
  max-width:1560px
}

.pricing-page-root .sec--tools {
  padding-top:64px
}

.pricing-page-root .sec-head {
  text-align:center;max-width:760px;margin:0 auto 30px
}

.pricing-page-root .eyebrow {
  display:inline-flex;align-items:center;min-height:30px;padding:0 12px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:.72rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)
}

.pricing-page-root .sec-head h2 {
  margin-top:14px
}

.pricing-page-root .sec-head .intro {
  margin:10px auto 0;max-width:62ch
}

.pricing-page-root .tools-chips {
  list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:18px 0 0;padding:0
}

.pricing-page-root .tools-chips li {
  display:inline-flex;align-items:center;min-height:32px;padding:0 13px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:.8rem;font-weight:700;color:var(--ink)
}

.pricing-page-root .tools-chips li:first-child {
  background:var(--navy);border-color:var(--navy);color:#fff
}

.pricing-page-root .tgrid {
  list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))
}

@media (min-width:760px) {
.pricing-page-root .tgrid {
  grid-template-columns:repeat(4,minmax(0,1fr));gap:16px
}
}

@media (min-width:1200px) {
.pricing-page-root .tgrid {
  grid-template-columns:repeat(7,minmax(0,1fr));gap:14px
}
}

.pricing-page-root .tcard {
  --a1:var(--navy);position:relative;display:flex;flex-direction:column;gap:0;background:#fff;border:1px solid var(--line);border-radius:18px;padding:10px 10px 12px;box-shadow:0 1px 2px rgba(16,24,40,.04),0 8px 22px -12px rgba(16,24,40,.12);transition:transform .22s cubic-bezier(.2,.7,.2,1),box-shadow .22s,border-color .22s
}

.pricing-page-root .tcard::before {
  content:"";position:absolute;left:0;top:0;height:3px;width:46%;background:var(--red);border-radius:0 0 3px 0;transition:width .3s
}

.pricing-page-root .tcard:hover, .pricing-page-root .tcard:focus-within {
  transform:translateY(-4px);border-color:var(--navy);box-shadow:0 2px 4px rgba(16,24,40,.05),0 18px 34px -16px rgba(16,24,40,.35)
}

.pricing-page-root .tcard:hover::before, .pricing-page-root .tcard:focus-within::before {
  width:100%
}

.pricing-page-root .tcard--free {
  border-color:#BFE3C8;background:linear-gradient(180deg,#F5FBF6,#fff 55%)
}

.pricing-page-root .tc-media {
  position:relative;aspect-ratio:5/3;border-radius:12px;overflow:hidden;background:#F4F6FA;margin-top:4px
}

.pricing-page-root .tc-media img {
  display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.2,.7,.2,1)
}

.pricing-page-root .tcard:hover .tc-media img {
  transform:scale(1.06)
}

.pricing-page-root .tc-num {
  position:absolute;left:6px;top:6px;display:inline-flex;align-items:baseline;gap:1px;padding:3px 7px;border-radius:999px;background:rgba(255,255,255,.92);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font:800 .7rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--a1);box-shadow:0 1px 3px rgba(16,24,40,.12)
}

.pricing-page-root .tc-num i {
  font-style:normal;font-weight:700;opacity:.55
}

.pricing-page-root .tc-kind {
  position:absolute;right:6px;top:6px;padding:3px 7px;border-radius:999px;background:rgba(17,24,39,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-size:.72rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#fff
}

.pricing-page-root .tc-free {
  position:absolute;left:6px;bottom:6px;padding:3px 9px;border-radius:999px;background:var(--green);color:#fff;font-size:.72rem;font-weight:800;letter-spacing:.08em;box-shadow:0 4px 10px rgba(21,128,61,.35)
}

.pricing-page-root .tc-name {
  margin:12px 2px 0;font:800 .96rem/1.2 var(--display);letter-spacing:-.01em
}

.pricing-page-root .tc-name a {
  color:var(--ink);text-decoration:none
}

.pricing-page-root .tc-name a::after {
  content:"";position:absolute;inset:0;z-index:2;border-radius:18px
}

.pricing-page-root .tc-name a:focus-visible {
  outline:0
}

.pricing-page-root .tcard:has(.tc-name a:focus-visible) {
  outline:3px solid var(--blue);outline-offset:2px
}

.pricing-page-root .tc-desc {
  margin:5px 2px 0;font-size:.78rem;line-height:1.4;color:var(--muted);min-height:calc(1.4em * 3)
}

.pricing-page-root .tc-tags {
  display:flex;flex-wrap:wrap;gap:5px;margin:10px 2px 12px
}

.pricing-page-root .tc-chip {
  display:inline-flex;align-items:center;gap:4px;min-height:22px;padding:0 8px;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1;white-space:nowrap
}

.pricing-page-root .tc-chip svg {
  width:11px;height:11px;flex:none
}

.pricing-page-root .tc-chip--ft {
  background:#F1F4F9;color:var(--navy)
}

.pricing-page-root .tc-chip--plan {
  background:transparent;color:var(--muted);padding-left:2px
}

.pricing-page-root .tc-chip--free {
  background:var(--green-soft);color:var(--green)
}

.pricing-page-root .tc-btn {
  margin-top:auto;display:flex;align-items:center;justify-content:center;gap:7px;min-height:44px;border-radius:12px;background:var(--navy);color:#fff;font-weight:800;font-size:.84rem;transition:background .2s
}

.pricing-page-root .tc-btn svg {
  width:15px;height:15px;transition:transform .2s
}

.pricing-page-root .tcard:hover .tc-btn, .pricing-page-root .tcard:focus-within .tc-btn {
  background:var(--red)
}

.pricing-page-root .tcard:hover .tc-btn svg {
  transform:translateX(3px)
}

@media (max-width:759px) {
.pricing-page-root .sec--tools {
  padding-top:48px
}
.pricing-page-root .sec-head {
  text-align:left;margin-bottom:22px
}
.pricing-page-root .tools-chips {
  justify-content:flex-start
}
.pricing-page-root .tcard {
  padding:8px 8px 10px;border-radius:16px
}
.pricing-page-root .tcard:hover {
  transform:none
}
.pricing-page-root .tc-name {
  font-size:.92rem;margin-top:10px
}
.pricing-page-root .tc-desc {
  font-size:.76rem
}
}

@media (max-width:359px) {
.pricing-page-root .tc-chip {
  white-space:normal;line-height:1.15;padding:4px 7px
}
.pricing-page-root .tc-kind {
  display:none
}
.pricing-page-root .tc-name {
  font-size:.86rem
}
}

@media (prefers-reduced-motion:reduce) {
.pricing-page-root .tcard, .pricing-page-root .tcard::before, .pricing-page-root .tc-media img, .pricing-page-root .tc-btn, .pricing-page-root .tc-btn svg {
  transition:none
}
.pricing-page-root .tcard:hover {
  transform:none
}
.pricing-page-root .tcard:hover .tc-media img {
  transform:none
}
}

.pricing-page-root .tool-list {
  list-style:none;margin:0;padding:0;display:grid;gap:8px
}

.pricing-page-root .tool-list li {
  display:flex;align-items:center;min-height:44px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:0 12px;font-weight:600;font-size:.9rem
}

.pricing-page-root .tool-list a {
  display:flex;align-items:center;align-self:stretch;flex:1;margin:-1px -13px;padding-left:13px!important;padding-right:13px;text-decoration:none;border-radius:10px;color:var(--blue)
}

.pricing-page-root .tool-list a:hover {
  background:#EAF1FF
}

.pricing-page-root .links {
  display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none
}

.pricing-page-root .links a, .pricing-page-root .links .plain {
  display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border-radius:999px;font-weight:600;font-size:.9rem;text-decoration:none
}

.pricing-page-root .links a {
  background:#fff;border:1px solid var(--line)
}

.pricing-page-root .links a:hover {
  border-color:var(--navy);background:#F1F4F9
}

.pricing-page-root .links .plain {
  background:#F1F4F9;border:1px dashed var(--line);color:var(--muted)
}

.pricing-page-root .faq {
  display:grid;gap:10px;max-width:820px
}

@media (min-width:1000px) {
.pricing-page-root .faq {
  max-width:none;grid-template-columns:repeat(2,1fr);align-items:start
}
}

.pricing-page-root .faq details {
  background:#fff;border:1px solid var(--line);border-radius:14px;padding:0 18px
}

.pricing-page-root .faq summary {
  list-style:none;cursor:pointer;min-height:56px;display:flex;align-items:center;padding:12px 30px 12px 0;font-weight:600;position:relative
}

.pricing-page-root .faq summary::-webkit-details-marker {
  display:none
}

.pricing-page-root .faq summary::after {
  content:"+";position:absolute;right:2px;top:50%;transform:translateY(-52%);font:400 1.5rem/1 var(--font);color:var(--muted)
}

.pricing-page-root .faq details[open] summary::after {
  content:"\\2212"
}

.pricing-page-root .faq p {
  margin:0 0 16px;color:#334155;max-width:64ch
}

.pricing-page-root .todo {
  background:var(--yellow);border:1px dashed #B88700;padding:2px 6px;border-radius:4px
}

.pricing-page-root .final {
  position:relative;margin-top:64px;padding:60px 0;text-align:center;color:#fff;background-color:var(--navy);background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:26px 26px
}

.pricing-page-root .final h2 {
  color:#fff;margin:0 auto;max-width:26ch
}

.pricing-page-root .final p {
  margin:12px auto 0;max-width:52ch;color:#C5CEDB
}

.pricing-page-root .final-cta {
  display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:24px
}

.pricing-page-root .final-sub {
  display:flex;flex-direction:column;align-items:center
}

.pricing-page-root .final-free {
  display:inline-flex;align-items:center;min-height:44px;color:#fff;font-weight:700
}

.pricing-page-root .sticky {
  display:none
}

.pricing-page-root .note {
  display:none;margin:18px 0 0;padding:12px 14px;background:var(--yellow);border:1px solid #E6CF77;color:#3B3200;border-radius:10px;font-size:.86rem;line-height:1.5;max-width:92ch
}

.pricing-page-root .note b {
  font-weight:800
}

.pricing-page-root .note ul {
  margin:6px 0 0;padding-left:18px
}

.pricing-page-root .note li {
  margin:4px 0
}

.pricing-page-root .show-notes .note {
  display:block
}

@media (max-width:759px) {
.pricing-page-root .wrap {
  padding-left:16px;padding-right:16px
}
.pricing-page-root .hero {
  padding:20px 0 16px
}
.pricing-page-root .crumbs {
  margin-bottom:4px
}
.pricing-page-root h1 {
  max-width:none;letter-spacing:-.028em
}
.pricing-page-root .lede {
  font-size:1rem
}
.pricing-page-root .hero-cta .btn {
  flex:1 1 100%
}
.pricing-page-root .plans-sec {
  padding-top:12px
}
.pricing-page-root .plans-title {
  font-size:1.5rem
}
.pricing-page-root .finder {
  margin-top:18px
}
.pricing-page-root .seg {
  display:flex;width:100%
}
.pricing-page-root .seg button {
  flex:1;padding:0 2px;font-size:.88rem
}
.pricing-page-root .plans {
  gap:24px
}
.pricing-page-root .plan--free {
  order:6
}
.pricing-page-root .plan {
  padding:22px 18px 18px;border-radius:18px
}
.pricing-page-root .plan--diamond {
  padding:21px 17px 17px
}
.pricing-page-root .sec {
  padding-top:48px
}
.pricing-page-root .panel {
  padding:18px 16px
}
.pricing-page-root .final {
  margin-top:48px;padding:48px 0
}
.pricing-page-root .final-cta .btn {
  flex:1 1 100%
}
.pricing-page-root .cmp .cta-row {
  display:none
}
.pricing-page-root .cmp-wrap>summary {
  display:flex;align-items:center;justify-content:space-between;min-height:54px;padding:0 16px;background:#fff;border:1px solid var(--line);border-radius:14px;font-weight:700;cursor:pointer;list-style:none
}
.pricing-page-root .cmp-wrap>summary::-webkit-details-marker {
  display:none
}
.pricing-page-root .cmp-wrap>summary::after {
  content:"+";font:400 1.5rem/1 var(--font);color:var(--muted)
}
.pricing-page-root .cmp-wrap[open]>summary::after {
  content:"\\2212"
}
.pricing-page-root .cmp-wrap[open]>summary {
  margin-bottom:12px
}
.pricing-page-root .panel--flush {
  background:transparent;border:0;border-radius:0;overflow:visible
}
.pricing-page-root .cmp, .pricing-page-root .cmp tbody, .pricing-page-root .cmp tr, .pricing-page-root .cmp th, .pricing-page-root .cmp td {
  display:block;width:100%
}
.pricing-page-root .cmp thead {
  position:absolute;left:-9999px
}
.pricing-page-root .cmp-panel {
  box-shadow:none;border-radius:0;padding:0
}
.pricing-page-root .cmp tr {
  margin:0 0 10px;padding:6px 14px 8px;background:#fff;border:1px solid var(--line);border-radius:14px
}
.pricing-page-root .cmp .grp {
  margin:18px 0 8px;padding:0;background:transparent;border:0
}
.pricing-page-root .cmp .grp th {
  padding:0 2px;background:transparent;border:0;font-size:.74rem
}
.pricing-page-root .cmp .grp:first-child {
  margin-top:4px
}
.pricing-page-root .cmp .col-gold {
  border-left:0;border-right:0
}
.pricing-page-root .cmp tbody th {
  width:100%;padding:10px 0 6px;border:0;font:800 .98rem var(--display)
}
.pricing-page-root .cmp td {
  display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--line);text-align:right;font-size:.9rem
}
.pricing-page-root .cpd-v {
  grid-auto-flow:column;align-items:center;gap:10px
}
.pricing-page-root .cpd-bar {
  width:56px
}
.pricing-page-root .cmp td::before {
  content:attr(data-label);color:var(--muted);font-weight:500;text-align:left
}
.pricing-page-root .cmp td.col-gold {
  margin:0 -8px;width:calc(100% + 16px);padding:10px 8px;border-radius:8px
}
.pricing-page-root .cmp tbody th small {
  margin-top:1px
}
.pricing-page-root .sticky {
  position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;align-items:center;gap:12px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--line);box-shadow:0 -10px 24px rgba(16,24,40,.12)
}
.pricing-page-root .sticky-txt {
  flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25
}
.pricing-page-root .sticky-txt b {
  font-size:.92rem
}
.pricing-page-root .sticky-txt span {
  font-size:.78rem;font-weight:600;color:var(--green)
}
.pricing-page-root .sticky .btn {
  flex:none;min-height:46px;padding:0 18px
}
body.has-sticky {
  padding-bottom:76px
}
}

@media (max-width:359px) {
.pricing-page-root .amt {
  font-size:2.4rem
}
.pricing-page-root .badge {
  font-size:.7rem;padding:6px 11px
}
.pricing-page-root .seg button {
  font-size:.8rem
}
.pricing-page-root .sticky-txt b {
  font-size:.84rem
}
.pricing-page-root .sticky .btn {
  padding:0 14px
}
}

@media (prefers-reduced-motion:reduce) {
.pricing-page-root {
  scroll-behavior:auto
}
html.js .pricing-page-root .ruler-bar i {
  transition:none
}
.pricing-page-root .plan, .pricing-page-root .tools .chev, .pricing-page-root .menu-btn span {
  transition:none
}
}

.pricing-page-root .tcard--free .tc-btn {
  background:var(--green)
}

.pricing-page-root .tcard--free:hover .tc-btn, .pricing-page-root .tcard--free:focus-within .tc-btn {
  background:#116530
}

.pricing-page-root .tc-name, .pricing-page-root .tc-desc {
  overflow-wrap:anywhere
}

.pricing-page-root .tc-chip {
  max-width:100%;white-space:normal;line-height:1.15;padding-top:4px;padding-bottom:4px
}

.pricing-page-root .tcard::before {
  border-top-left-radius:18px
}

.pricing-page-root .p-hero {
  text-wrap:balance
}

.pricing-page-root .sec-head--plans {
  margin-bottom:0
}

.pricing-page-root .sec-head--plans .plans-sub {
  max-width:58ch;margin:10px auto 0
}

.pricing-page-root .eq--was s {
  color:#8A97AA;text-decoration-thickness:1.5px
}

.pricing-page-root .plan--gold .eq--was s {
  color:#8E9BB0
}

.pricing-page-root .eq--was {
  font-weight:600
}

.pricing-page-root .pill .dot {
  margin:0 5px;opacity:.5
}

.pricing-page-root .incl {
  list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:8px 22px;margin:20px auto 0;padding:0
}

.pricing-page-root .incl li {
  display:inline-flex;align-items:center;gap:8px;font-size:.9rem;font-weight:600;color:#334155
}

.pricing-page-root .incl svg {
  width:20px;height:20px;padding:4px;border-radius:50%;background:var(--green-soft);color:var(--green);flex:none
}

.pricing-page-root .plan {
  transition:transform .22s cubic-bezier(.2,.7,.2,1),box-shadow .22s,border-color .22s
}

@media (hover:hover) {
.pricing-page-root .plan:not(.plan--gold):hover {
  transform:translateY(-4px);border-color:#CBD5E3;box-shadow:0 2px 4px rgba(16,24,40,.05),0 22px 38px -22px rgba(16,24,40,.35)
}
}

.pricing-page-root .plan--gold::after {
  content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(180deg,rgba(220,60,65,.28),transparent 22%)
}

.pricing-page-root .plan--gold>* {
  position:relative;z-index:1
}

.pricing-page-root .plan--gold>.badge {
  position:absolute
}

@media (max-width:759px) {
.pricing-page-root .incl {
  display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;margin-top:16px;justify-items:start
}
.pricing-page-root .incl li {
  font-size:.84rem;align-items:flex-start;line-height:1.3
}
.pricing-page-root .incl svg {
  margin-top:0
}
.pricing-page-root .sec-head--plans {
  text-align:center
}
}

@media (max-width:359px) {
.pricing-page-root .seg button {
  font-size:.8rem
}
.pricing-page-root .seg button small {
  font-size:.72rem
}
.pricing-page-root .incl {
  grid-template-columns:1fr
}
}

.pricing-page-root .incl {
  margin-bottom:6px
}

@media (min-width:1240px) {
.pricing-page-root .plans {
  padding-top:44px
}
}

.pricing-page-root .tcard {
  overflow:hidden
}

.pricing-page-root .tcard::before {
  top:0;left:0;border-radius:0
}

/* ==========================================================================
   HIGH SPECIFICITY OVERRIDES TO DEFEAT BOOTSTRAP AND MATCH ORIGINAL HTML EXACTLY
   ========================================================================== */

.pricing-page-root {
  --bg: #F6F7F9;
  --card: #ffffff;
  --line: #E3E7EE;
  --grid: #E9EDF3;
  --ink: #111827;
  --navy: #1F2A3D;
  --navy-2: #2C3A52;
  --muted: #5F6D80;
  --faint: #A3AEBF;
  --red: #DC3C41;
  --red-dark: #C42F34;
  --green: #15803D;
  --green-soft: #E8F6EC;
  --blue: #2563EB;
  --yellow: #FFF3C4;
  --display: "Inter", system-ui, -apple-system, sans-serif;
  --font: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-family: var(--font) !important;
  font-size: 15px !important;
  line-height: 1.55 !important;
  color: var(--ink) !important;
  background-color: var(--bg) !important;
}

/* Base typography resets inside pricing page */
.pricing-page-root h1,
.pricing-page-root .hero h1 {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: clamp(1.85rem, 1rem + 2.5vw, 3.1rem) !important;
  line-height: 1.06 !important;
  letter-spacing: -0.032em !important;
  color: #111827 !important;
  margin: 16px 0 0 !important;
  max-width: 21ch !important;
}

.pricing-page-root h2,
.pricing-page-root .plans-title {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: clamp(1.45rem, 1rem + 1.4vw, 2.05rem) !important;
  line-height: 1.15 !important;
  letter-spacing: -0.025em !important;
  color: #111827 !important;
  margin: 0 0 8px !important;
}

.pricing-page-root h3 {
  font-family: var(--display) !important;
}

.pricing-page-root p {
  margin: 0;
}

.pricing-page-root a {
  text-decoration: none;
  color: inherit;
}

.pricing-page-root .lede {
  font-family: var(--font) !important;
  font-size: 1.06rem !important;
  line-height: 1.55 !important;
  color: #5F6D80 !important;
  margin: 16px 0 0 !important;
  max-width: 56ch !important;
}

.pricing-page-root .answer {
  font-family: var(--font) !important;
  font-size: 0.95rem !important;
  line-height: 1.55 !important;
  color: #111827 !important;
  margin: 12px 0 0 !important;
  max-width: 60ch !important;
}

.pricing-page-root .crumbs {
  font-size: 0.84rem !important;
  color: #5F6D80 !important;
}

.pricing-page-root .pill-new {
  font-size: 0.82rem !important;
  font-weight: 600 !important;
  color: #5F6D80 !important;
}

.pricing-page-root .trust {
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  color: #334155 !important;
}

.pricing-page-root .ext-chips li {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 0.8rem !important;
}

.pricing-page-root .updated {
  font-size: 0.8rem !important;
  color: #5F6D80 !important;
}

.pricing-page-root .eyebrow {
  font-size: 0.72rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.09em !important;
  text-transform: uppercase !important;
  color: #5F6D80 !important;
}

.pricing-page-root .plans-sub {
  font-size: 0.95rem !important;
  color: #5F6D80 !important;
  margin: 8px 0 0 !important;
}

.pricing-page-root .finder-q {
  font-size: 1rem !important;
  font-weight: 700 !important;
  color: #111827 !important;
}

.pricing-page-root .seg button {
  font-family: var(--font) !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  color: #5F6D80 !important;
}

.pricing-page-root .seg button small {
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  color: #15803D !important;
}

.pricing-page-root .seg button[aria-pressed="true"] {
  background: #1F2A3D !important;
  color: #FFFFFF !important;
}

.pricing-page-root .seg button[aria-pressed="true"] small {
  color: #86EFAC !important;
}

.pricing-page-root .finder-msg {
  font-size: 0.95rem !important;
  color: #5F6D80 !important;
}

.pricing-page-root .incl li {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  color: #334155 !important;
}

/* ==========================================================================
   PLAN CARDS - EXACT FONT SIZES & CONTRAST
   ========================================================================== */

.pricing-page-root .plan {
  background: #FFFFFF !important;
  border: 1px solid #E3E7EE !important;
  border-radius: 20px !important;
  padding: 22px 20px 20px !important;
}

.pricing-page-root .p-head h3 {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 1.05rem !important;
  line-height: 1.15 !important;
  letter-spacing: -0.01em !important;
  color: #111827 !important;
  margin: 0 !important;
}

.pricing-page-root .p-tag {
  font-size: 0.86rem !important;
  font-weight: 600 !important;
  color: #5F6D80 !important;
  margin: 12px 0 0 !important;
}

/* Default card prices: SOLID DEEP BLACK */
.pricing-page-root .plan .p-price {
  color: #111827 !important;
  margin: 6px 0 0 !important;
  display: flex !important;
  align-items: baseline !important;
  gap: 3px !important;
}

.pricing-page-root .plan .cur {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 1.2rem !important;
  color: #111827 !important;
}

.pricing-page-root .plan .amt {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 2.7rem !important;
  line-height: 1 !important;
  letter-spacing: -0.045em !important;
  color: #111827 !important;
}

.pricing-page-root .plan .per-line {
  font-size: 0.88rem !important;
  color: #5F6D80 !important;
  margin: 2px 0 0 !important;
}

.pricing-page-root .plan .eq {
  font-size: 0.84rem !important;
  color: #5F6D80 !important;
  margin: 2px 0 0 !important;
  min-height: 1.5em !important;
}

.pricing-page-root .plan .eq--was s {
  color: #8A97AA !important;
  text-decoration-thickness: 1.5px !important;
}

.pricing-page-root .plan .pill {
  font-size: 0.82rem !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
  margin: 8px 0 0 !important;
  min-height: 42px !important;
}

.pricing-page-root .plan .ruler-top {
  font-size: 0.8rem !important;
  color: #5F6D80 !important;
}

.pricing-page-root .plan .ruler-top b {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 0.98rem !important;
  color: #111827 !important;
}

.pricing-page-root .plan .p-hero {
  font-size: 0.9rem !important;
  line-height: 1.35 !important;
  color: #111827 !important;
}

.pricing-page-root .plan .p-hero b {
  font-weight: 800 !important;
  color: #111827 !important;
}

.pricing-page-root .plan .tile {
  background: #F1F4F9 !important;
}

.pricing-page-root .plan .tile b {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 1.12rem !important;
  line-height: 1.1 !important;
  letter-spacing: -0.02em !important;
  color: #111827 !important;
}

.pricing-page-root .plan .tile span {
  font-size: 0.72rem !important;
  color: #5F6D80 !important;
}

.pricing-page-root .plan .p-list {
  font-size: 0.88rem !important;
  color: #334155 !important;
}

.pricing-page-root .plan .pay {
  font-size: 0.78rem !important;
  color: #5F6D80 !important;
}

/* ==========================================================================
   GOLD PLAN - SIGNATURE DARK CARD (PURE WHITE & LIGHT BLUE ACCENTS)
   ========================================================================== */

.pricing-page-root .plan.plan--gold {
  background-color: #1F2A3D !important;
  color: #FFFFFF !important;
  border-color: #1F2A3D !important;
  background-image: linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),
                    linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px) !important;
  background-size: 22px 22px !important;
  box-shadow: 0 26px 48px -18px rgba(16,24,40,.55) !important;
}

.pricing-page-root .plan--gold .p-head h3 {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .ico {
  background: #DC3C41 !important;
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .p-tag {
  color: #B7C2D3 !important;
}

/* Gold Plan Price: PURE CRISP WHITE */
.pricing-page-root .plan--gold .p-price {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .cur {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .amt {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .per-line {
  color: #B7C2D3 !important;
}

.pricing-page-root .plan--gold .eq {
  color: #B7C2D3 !important;
}

.pricing-page-root .plan--gold .eq--was s {
  color: #8E9BB0 !important;
}

.pricing-page-root .plan--gold .pill--good {
  background: #2C3A52 !important;
  color: #86EFAC !important;
}

.pricing-page-root .plan--gold .ruler-top {
  color: #B7C2D3 !important;
}

.pricing-page-root .plan--gold .ruler-top b {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .ruler-bar {
  background: #3A4963 !important;
}

.pricing-page-root .plan--gold .p-hero,
.pricing-page-root .plan--gold .p-hero span,
.pricing-page-root .plan--gold .p-hero b,
.pricing-page-root .plan--gold .p-hero svg {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .tile {
  background: #2C3A52 !important;
}

.pricing-page-root .plan--gold .tile b {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .tile span {
  color: #B7C2D3 !important;
}

.pricing-page-root .plan--gold .p-list {
  border-top-color: #3A4963 !important;
  color: #E6EBF3 !important;
}

.pricing-page-root .plan--gold .p-list li,
.pricing-page-root .plan--gold .p-list span {
  color: #E6EBF3 !important;
}

.pricing-page-root .plan--gold .ck {
  background: #DC3C41 !important;
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .tools summary {
  color: #FFFFFF !important;
}

.pricing-page-root .plan--gold .tools .chev,
.pricing-page-root .plan--gold .tools ul {
  color: #B7C2D3 !important;
}

.pricing-page-root .plan--gold .pay {
  color: #B7C2D3 !important;
}

/* Hide pick-tag on Gold plan explicitly */
.pricing-page-root .plan--gold .pick-tag {
  display: none !important;
}

/* ==========================================================================
   OTHER SECTIONS (WHY, COMPARE TABLE, TOOLS GRID, FAQS, FINAL CTA)
   ========================================================================== */

.pricing-page-root .why-i h3 {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 1.08rem !important;
  line-height: 1.25 !important;
  color: #111827 !important;
}

.pricing-page-root .why-i p {
  font-size: 0.9rem !important;
  color: #5F6D80 !important;
}

.pricing-page-root .cmp th,
.pricing-page-root .cmp td {
  font-size: 0.93rem !important;
  color: #334155 !important;
}

.pricing-page-root .ch-name {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 1.1rem !important;
  line-height: 1.1 !important;
  color: #111827 !important;
}

.pricing-page-root .cmp thead th {
  position: sticky !important;
  top: 72px !important;
  z-index: 10 !important;
}

.pricing-page-root .cmp thead .col-gold .ch-name {
  color: #FFFFFF !important;
}

.pricing-page-root .price-v b {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 1.12rem !important;
  color: #111827 !important;
}

.pricing-page-root .tc-name {
  font-family: var(--display) !important;
  font-weight: 800 !important;
  font-size: 0.96rem !important;
  line-height: 1.2 !important;
  letter-spacing: -0.01em !important;
  color: #111827 !important;
}

.pricing-page-root .tc-name a {
  color: #111827 !important;
}

.pricing-page-root .tc-desc {
  font-size: 0.78rem !important;
  line-height: 1.4 !important;
  color: #5F6D80 !important;
}

.pricing-page-root .tc-chip {
  font-size: 0.7rem !important;
  font-weight: 700 !important;
}

.pricing-page-root .faq summary {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #111827 !important;
}

.pricing-page-root .faq p {
  font-size: 0.92rem !important;
  line-height: 1.55 !important;
  color: #334155 !important;
}

.pricing-page-root .final {
  text-align: center !important;
}

.pricing-page-root .final .wrap {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  margin: 0 auto !important;
}

.pricing-page-root .final h2 {
  font-family: var(--display) !important;
  font-size: clamp(1.45rem, 1rem + 1.4vw, 2.05rem) !important;
  font-weight: 800 !important;
  color: #FFFFFF !important;
  text-align: center !important;
  margin: 0 auto 12px auto !important;
  max-width: 32ch !important;
  width: 100% !important;
  display: block !important;
}

.pricing-page-root .final p {
  font-size: 0.95rem !important;
  color: #C5CEDB !important;
  text-align: center !important;
  margin: 0 auto !important;
  max-width: 52ch !important;
  line-height: 1.5 !important;
  width: 100% !important;
}

.pricing-page-root .final-cta {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  gap: 12px !important;
  margin-top: 24px !important;
}

.pricing-page-root .final-cta .btn {
  box-shadow: none !important;
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  min-height: 48px !important;
  padding: 0 24px !important;
  border-radius: 12px !important;
}

.pricing-page-root .btn--light {
  background: transparent !important;
  border: 1.5px solid rgba(255, 255, 255, 0.45) !important;
  color: #FFFFFF !important;
  box-shadow: none !important;
}

.pricing-page-root .btn--light:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.75) !important;
  color: #FFFFFF !important;
}

.pricing-page-root .final-sub {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  margin-top: 16px !important;
  gap: 4px !important;
}

.pricing-page-root .final-free {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 32px !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 0.92rem !important;
  text-decoration: underline !important;
  cursor: pointer !important;
  transition: opacity .15s !important;
}

.pricing-page-root .final-free:hover {
  opacity: 0.85 !important;
  color: #FFFFFF !important;
}

.pricing-page-root .final-sub span {
  color: #8E9BAE !important;
  font-size: 0.84rem !important;
  font-weight: 400 !important;
  letter-spacing: 0.01em !important;
}
`;

const aiToolsList = [
  "Architecture Renders",
  "Interior Renders",
  "Sketch to 3D",
  "AI Floor Plan",
  "Image to DWG",
  "Vastu Analysis",
  "2D Visualizer",
  "Plan Forge",
  "Thesis Builder",
  "Mood Board",
  "3D to 2D",
  "2D to 3D",
  "BOQ Generator",
  "Unit Converter"
];

const plans = [
  {
    id: "free",
    name: "Free Plan",
    tagline: "Start free, no card needed",
    price: "0",
    period: "forever",
    eq: "\u00A0",
    pill: "Limited AI Studio",
    rulerTop: "$0.00",
    rulerWidth: "0%",
    rulerClass: "ruler--none",
    heroText: "10 free downloads a day",
    heroNum: "10",
    tiles: [
      { num: "0", label: "AI credits", off: true },
      { num: "0", label: "Gold/day", off: true },
      { num: "10", label: "Free/day", off: false }
    ],
    features: [
      "Free files only",
      "Limited AI Studio",
      "Upload and library tools"
    ],
    stripeId: null,
    ctaLabel: "Start free",
    ctaClass: "cta--green",
    payNotice: "No card needed",
    icon: "#i-sparkle",
    badge: null
  },
  {
    id: "silver",
    name: "Silver Plan",
    tagline: "Try the full library",
    price: "9.99",
    period: "per week",
    eq: "$43.29 a month",
    pill: "For a single project",
    rulerTop: "$1.43",
    rulerWidth: "100.0%",
    rulerClass: "ruler--base",
    rulerAria: "Cost per day: $1.43, 100 percent of the weekly plan",
    heroText: "Up to 70 premium downloads a week",
    heroNum: "70",
    tiles: [
      { num: "25", label: "AI credits", off: false },
      { num: "10", label: "Gold/day", off: false },
      { num: "10", label: "Free/day", off: false }
    ],
    features: [
      "Premium and free files",
      "Ads free experience",
      { isAiTools: true },
      "Upload and library tools"
    ],
    stripeId: "price_1TSAT3Fy6VKViPpJP4SIMcZX",
    ctaLabel: "Get Silver",
    ctaClass: "",
    payNotice: "Secure checkout by Stripe",
    icon: "#i-bolt",
    badge: null
  },
  {
    id: "gold",
    name: "Gold Plan",
    tagline: "Best for active designers",
    price: "19.99",
    period: "per month",
    eq: "on weekly",
    eqWas: "$43.29",
    pill: "Save 54% · $23.30",
    pillGood: true,
    rulerTop: "$0.66",
    rulerWidth: "46.1%",
    rulerClass: "ruler--good",
    rulerAria: "Cost per day: $0.66, 46 percent of the weekly plan",
    heroText: "Up to 600 premium downloads a month",
    heroNum: "600",
    tiles: [
      { num: "100", label: "AI credits", off: false },
      { num: "20", label: "Gold/day", off: false },
      { num: "15", label: "Free/day", off: false }
    ],
    features: [
      "Premium and free files",
      "Ads free experience",
      { isAiTools: true },
      "Upload and library tools"
    ],
    stripeId: "price_1UO8M3Fy6VKViPpJQuLeuVq1",
    ctaLabel: "Get Gold",
    ctaClass: "cta--red",
    payNotice: "Secure checkout by Stripe",
    icon: "#i-crown",
    badge: "Most popular",
    badgeClass: "badge--red",
    isGold: true
  },
  {
    id: "platinum",
    name: "Platinum Plan",
    tagline: "Power for studios",
    price: "49.99",
    period: "per 3 months · $16.66/mo",
    eq: "on weekly",
    eqWas: "$129.87",
    pill: "Save 62% · $79.88",
    pillGood: true,
    rulerTop: "$0.55",
    rulerWidth: "38.4%",
    rulerClass: "ruler--good",
    rulerAria: "Cost per day: $0.55, 38 percent of the weekly plan",
    heroText: "Up to 2,700 premium downloads in 3 months",
    heroNum: "2,700",
    tiles: [
      { num: "300", label: "AI credits", off: false },
      { num: "30", label: "Gold/day", off: false },
      { num: "25", label: "Free/day", off: false }
    ],
    features: [
      "Premium and free files",
      "Ads free experience",
      { isAiTools: true },
      "Upload and library tools"
    ],
    stripeId: "price_1UO8ZHFy6VKViPpJ57GVbkgx",
    ctaLabel: "Get Platinum",
    ctaClass: "",
    payNotice: "Secure checkout by Stripe",
    icon: "#i-star",
    badge: null
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    tagline: "Maximum savings",
    price: "99.99",
    period: "per year · $8.33/mo",
    eq: "on weekly",
    eqWas: "$519.48",
    pill: "Save 81% · $419.49",
    pillGood: true,
    rulerTop: "$0.27",
    rulerWidth: "19.2%",
    rulerClass: "ruler--good",
    rulerAria: "Cost per day: $0.27, 19 percent of the weekly plan",
    heroText: "Up to 14,600 premium downloads a year",
    heroNum: "14,600",
    tiles: [
      { num: "1,500", label: "AI credits", off: false },
      { num: "40", label: "Gold/day", off: false },
      { num: "50", label: "Free/day", off: false }
    ],
    features: [
      "Premium and free files",
      "Ads free experience",
      { isAiTools: true },
      "Upload and library tools"
    ],
    stripeId: "price_1Q8PNDFy6VKViPpJSYVg4mvU",
    ctaLabel: "Get Diamond",
    ctaClass: "",
    payNotice: "Secure checkout by Stripe",
    icon: "#i-gem",
    badge: "Best value",
    badgeClass: "badge--navy",
    isDiamond: true
  }
];

const aiToolsCards = [
  {
    num: "01/14",
    kind: "4 images",
    name: "Architecture Renders",
    desc: "Photoreal exteriors from plans + elevations.",
    image: "/assets/images/ai-tools/architecture.jpg",
    tags: [
      { label: "Photoreal", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "02/14",
    kind: "4 images",
    name: "Interior Renders",
    desc: "Magazine-grade interior views with style & materials.",
    image: "/assets/images/ai-tools/interior.jpg",
    tags: [
      { label: "Styled", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "03/14",
    kind: "Image",
    name: "Sketch to 3D",
    desc: "Hand sketches into polished 3D renders.",
    image: "/assets/images/ai-tools/sketch.jpg",
    tags: [
      { label: "Instant", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "04/14",
    kind: "Plan",
    name: "AI Floor Plan",
    desc: "Room-labelled floor plans from a text brief.",
    image: "/assets/images/ai-tools/ai.jpg",
    tags: [
      { label: "Labelled", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "05/14",
    kind: "DWG",
    name: "Image to DWG",
    desc: "Convert sketch, PDF or image into layered DWG.",
    image: "/assets/images/ai-tools/image-to-dwg.svg",
    tags: [
      { label: "Vector CAD", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "06/14",
    kind: "Report",
    name: "Vastu Analysis",
    desc: "Instant directional energy and layout compliance scoring.",
    image: "/assets/images/ai-tools/vastu.svg",
    tags: [
      { label: "Vastu Score", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "07/14",
    kind: "Color",
    name: "2D Visualizer",
    desc: "Turn flat CAD line drawings into rich color presentations.",
    image: "/assets/images/ai-tools/visualizer-2d.svg",
    tags: [
      { label: "Rendered 2D", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "08/14",
    kind: "Generator",
    name: "Plan Forge",
    desc: "Parametric generative architectural floor plans in seconds.",
    image: "/assets/images/ai-tools/plan-forge.svg",
    tags: [
      { label: "Generative", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "09/14",
    kind: "Sheets",
    name: "Thesis Builder",
    desc: "Research concepts, site analyses and jury presentation sheets.",
    image: "/assets/images/ai-tools/thesis-builder.svg",
    tags: [
      { label: "Academic", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "10/14",
    kind: "Materials",
    name: "Mood Board",
    desc: "Curated palettes of finishes, textures and lighting concepts.",
    image: "/assets/images/ai-tools/mood-board.svg",
    tags: [
      { label: "Finishes", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "11/14",
    kind: "Elevation",
    name: "3D to 2D",
    desc: "Generate orthographic elevations and sections from 3D views.",
    image: "/assets/images/ai-tools/3d-to-2d.svg",
    tags: [
      { label: "Sectional", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "12/14",
    kind: "Model",
    name: "2D to 3D",
    desc: "Extrude 2D floor plans into full isometric 3D massing.",
    image: "/assets/images/ai-tools/2d-to-3d.svg",
    tags: [
      { label: "Volumetric", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "13/14",
    kind: "Estimates",
    name: "BOQ Generator",
    desc: "Automated bill of quantities, schedules & material counts.",
    image: "/assets/images/ai-tools/boq.svg",
    tags: [
      { label: "Costing", isFt: true },
      { label: "In paid plans", isPlan: true }
    ],
    url: "https://ai.cadbull.com/"
  },
  {
    num: "14/14",
    kind: "Calculator",
    name: "Unit Converter",
    desc: "Architectural and civil engineering unit conversion engine.",
    image: "/assets/images/ai-tools/unit-converter.svg",
    isFree: true,
    tags: [
      { label: "Free Tool", isFreeChip: true }
    ],
    url: "https://ai.cadbull.com/"
  }
];

const faqsData = [
  {
    q: "Which plan should I choose?",
    a: "Choose Silver for one project or a quick test, Gold for regular work, Platinum for studios and longer projects, and Diamond for the lowest cost per day. Longer plans cost less per day and include more AI credits."
  },
  {
    q: "Which file formats can I download on Cadbull?",
    a: "Cadbull has DWG, 3ds Max, Revit, SketchUp and PDF files, and DWG is the most common. You can browse files by type from the categories page."
  },
  {
    q: "How do AI credits work?",
    a: "Each AI generation, like Sketch to 3D, Image to DWG or AI Floor Plan, uses one credit. Credits stay valid for the whole length of your plan."
  },
  {
    q: "What is included in AI Studio?",
    a: "Every paid plan includes AI Studio with 14 tools, including Architecture Renders, Interior Renders, Sketch to 3D, AI Floor Plan, Image to DWG, Vastu Analysis, 2D Visualizer, Plan Forge, Thesis Builder, Mood Board, 3D to 2D, 2D to 3D, BOQ Generator and Unit Converter. The generation tools use AI credits."
  },
  {
    q: "Do unused downloads carry over?",
    a: "No. Daily download limits reset every 24 hours and don't roll over."
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. Upgrade or downgrade from your dashboard at any time. Billing is prorated."
  },
  {
    q: "How do I pay?",
    a: "Payments are processed securely by Stripe. The payment methods you can use are shown at checkout."
  },
  {
    q: "Can I try Cadbull for free?",
    a: "Yes. The Free plan has no time limit and needs no card. It includes free files and 10 free downloads a day."
  }
];

const Pricing = ({ lastProductId = 0, initialProductCount = 0 }) => {
  const router = useRouter();
  const userData = useSessionStorageData("userData");
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSubscription, setActiveSubscription] = useState(false);
  const [activePlanId, setActivePlanId] = useState(null);
  const [showMessage, setShowMessage] = useState(true);
  const [productCount, setProductCount] = useState(lastProductId || initialProductCount || 0);

  // Duration finder selection state
  const [pickedPlan, setPickedPlan] = useState(null);
  const [pickMessage, setPickMessage] = useState("Pick a length and we'll point you to the right plan.");

  // Mobile sticky bar state
  const [showSticky, setShowSticky] = useState(false);
  const plansRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  // Fetch product count fallback if needed
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

  // Fetch user subscription details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await getUserDetails();
        if (!response) return;
        setUser(response.data);
        const expDate = new Date(response.data.acc_exp_date);
        if (isUserSubscribed(response.data)) {
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

  // Observer for animated ruler bars
  useEffect(() => {
    if (!plansRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            plansRef.current?.classList.add("in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(plansRef.current);
    return () => observer.disconnect();
  }, []);

  // Sticky buy bar observer on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 760) {
        const plansEl = document.getElementById("plans");
        if (plansEl) {
          const rect = plansEl.getBoundingClientRect();
          const finalEl = document.querySelector(".final");
          const finalRect = finalEl ? finalEl.getBoundingClientRect() : null;
          if (rect.top < 0 && (!finalRect || finalRect.top > window.innerHeight)) {
            setShowSticky(true);
            document.body.classList.add("has-sticky");
          } else {
            setShowSticky(false);
            document.body.classList.remove("has-sticky");
          }
        }
      } else {
        setShowSticky(false);
        document.body.classList.remove("has-sticky");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (typeof document !== "undefined") {
        document.body.classList.remove("has-sticky");
      }
    };
  }, []);

  const handlePick = (planId, msg) => {
    setPickedPlan(planId);
    setPickMessage(msg);
  };

  const handleSubscribe = async (plan) => {
    if (!userData && !user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
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

  const formattedProductCount = (productCount && productCount > 1000) ? `${Number(productCount).toLocaleString("en-US")}+` : "273,258+";
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
        "description": "Membership for premium DWG, 3ds Max, Revit and 3D model files, plus AI Studio with 14 AI tools for floor plans, 3D views, DWG conversion and bills of quantities.",
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
            "price": "99.99",
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

      {/* SVG Symbols Sprite */}
      <svg width="0" height="0" style={{ position: "absolute", display: "none" }} aria-hidden="true" focusable="false">
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></symbol>
        <symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/></symbol>
        <symbol id="i-crown" viewBox="0 0 24 24"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5z M5 21h14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/></symbol>
        <symbol id="i-gem" viewBox="0 0 24 24"><path d="M7 4h10l4 5-9 11L3 9z M3 9h18 M9 4l3 5 3-5 M12 9v11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></symbol>
        <symbol id="i-file" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><path d="M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></symbol>
        <symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5z M3 13l9 5 9-5 M3 17.5l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.9"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></symbol>
      </svg>

      <div className="pricing-page-root">
        {/* Top Active Subscription Banner if Logged In */}
        {message && showMessage && (
          <div className="wrap" style={{ paddingTop: "20px" }}>
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
                style={{ color: "inherit", minHeight: "auto" }}
                aria-label="Close message"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="hero" aria-labelledby="h1">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <nav aria-label="Breadcrumb">
                <ol className="crumbs">
                  <li><Link href="/">Home</Link></li>
                  <li aria-current="page">Pricing</li>
                </ol>
              </nav>

              <span className="pill-new"><b>NEW</b> 14 AI design tools included</span>

              <h1 id="h1">
                {countPrefix}DWG, 3ds Max, Revit and 3D model files, plus an AI studio
              </h1>

              <p className="lede">
                Download AutoCAD DWG, 3ds Max, Revit and 3D model files, then use AI Studio to turn sketches and images into 3D views, floor plans and DWG.
              </p>

              <p className="answer">
                Cadbull plans start at <strong>$9.99 a week</strong>. Monthly is <strong>$19.99</strong>, 3 months is <strong>$49.99</strong> and yearly is <strong>$99.99</strong>. Every paid plan includes all premium files and AI Studio.
              </p>

              <div className="hero-cta">
                <a className="btn btn--red" href="#plans">
                  Choose your plan <svg aria-hidden="true" focusable="false"><use href="#i-arrow"/></svg>
                </a>
                <Link className="btn btn--ghost" href="/auth/register">
                  Start free
                </Link>
              </div>

              <ul className="trust">
                <li><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>New files added daily</li>
                <li><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>14 AI tools in every paid plan</li>
                <li><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>Secure checkout by Stripe</li>
              </ul>

              <ul className="ext-chips" aria-label="File formats">
                <li>.DWG</li>
                <li>.MAX</li>
                <li>.RVT</li>
                <li>.SKP</li>
                <li>.PDF</li>
              </ul>

              <p className="updated">
                Prices last updated <time dateTime="2026-10">October 2026</time>
              </p>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="sheet s-rvt">
                <svg viewBox="0 0 260 170" focusable="false">
                  <g fill="none" stroke="#1F2A3D" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M34 128V44h126v84M24 128h216" strokeWidth="2.6"/>
                    <path d="M160 128V70h56v58" strokeWidth="2.6"/>
                    <path d="M50 62h24v18H50zM90 62h24v18H90zM130 62h14v18h-14zM50 96h24v18H50zM90 96h24v18H90z" strokeWidth="1.4"/>
                    <path d="M170 82h36v14h-36z" strokeWidth="1.4"/>
                  </g>
                  <g stroke="#DC3C41" strokeWidth="1.2" fill="none">
                    <path d="M34 146h126M34 141v10M160 141v10"/>
                  </g>
                </svg>
                <div className="tb"><b>.RVT</b><span>Revit</span></div>
              </div>

              <div className="sheet s-max">
                <svg viewBox="0 0 260 170" focusable="false">
                  <g fill="none" stroke="#1F2A3D" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M70 62l60-26 60 26v56l-60 26-60-26z" strokeWidth="2.6"/>
                    <path d="M70 62l60 26 60-26M130 88v56" strokeWidth="2.6"/>
                    <path d="M100 50l60 26M160 76v56" strokeWidth="1.2" strokeDasharray="3 4"/>
                  </g>
                </svg>
                <div className="tb"><b>.MAX</b><span>3ds Max</span></div>
              </div>

              <div className="sheet s-dwg">
                <svg viewBox="0 0 260 170" focusable="false">
                  <g fill="none" stroke="#1F2A3D" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="28" y="20" width="150" height="100" strokeWidth="3"/>
                    <path d="M28 70H106M106 20v50M106 96v24" strokeWidth="3"/>
                    <path d="M106 70h22M128 70a22 22 0 0 0-22 22" strokeWidth="1.3"/>
                    <path d="M178 56h-26M152 56v64" strokeWidth="3"/>
                  </g>
                  <g stroke="#DC3C41" strokeWidth="1.2" fill="none">
                    <path d="M28 140h150M28 134v12M178 134v12"/>
                  </g>
                  <text x="103" y="136" fontSize="9" fill="#DC3C41" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600">6000</text>
                </svg>
                <div className="tb"><b>.DWG</b><span>AutoCAD</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="plans-sec" id="plans" aria-labelledby="plans-h">
          <div className="wrap">
            <div className="sec-head sec-head--plans">
              <span className="eyebrow">Pricing</span>
              <h2 id="plans-h" className="plans-title">Cadbull plans and pricing</h2>
              <p className="plans-sub">Longer plans cost less per day and come with more AI credits. Every paid plan opens all premium files and AI Studio.</p>
            </div>

            {/* Finder Interactive Selector */}
            <div className="finder">
              <p className="finder-q" id="finderQ">How long will you need Cadbull?</p>
              <div className="seg" role="group" aria-labelledby="finderQ">
                <button
                  type="button"
                  onClick={() => handlePick("silver", "One project this week? Silver is $9.99 and gives you 10 premium downloads a day.")}
                  aria-pressed={pickedPlan === "silver"}
                >
                  <span>A week</span>
                  <small>From $9.99</small>
                </button>
                <button
                  type="button"
                  onClick={() => handlePick("gold", "A month of regular work? Gold is our most popular plan and costs 54% less per day than weekly.")}
                  aria-pressed={pickedPlan === "gold"}
                >
                  <span>A month</span>
                  <small>Save 54%</small>
                </button>
                <button
                  type="button"
                  onClick={() => handlePick("platinum", "A season of studio work? Platinum works out at $16.66 a month and includes 300 AI credits.")}
                  aria-pressed={pickedPlan === "platinum"}
                >
                  <span>3 months</span>
                  <small>Save 62%</small>
                </button>
                <button
                  type="button"
                  onClick={() => handlePick("diamond", "Designing all year? Diamond has the lowest cost, $0.27 a day, with 1,500 AI credits.")}
                  aria-pressed={pickedPlan === "diamond"}
                >
                  <span>A year</span>
                  <small>Save 81%</small>
                </button>
              </div>
              <p className="finder-msg" id="pickMsg" role="status" aria-live="polite">
                {pickMessage}
              </p>
            </div>

            {/* Included in every paid plan */}
            <ul className="incl" aria-label="Included in every paid plan">
              <li><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>All premium files</li>
              <li><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>Ads free experience</li>
              <li><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>14 AI Studio tools</li>
              <li><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>Switch plans any time</li>
            </ul>

            {/* Plan Cards Grid */}
            <div className="plans" id="planGrid" ref={plansRef}>
              {plans.map((plan) => {
                const isCurrent =
                  (plan.id === "free" && !activeSubscription) ||
                  (plan.stripeId && activePlanId && (
                    plan.stripeId === activePlanId ||
                    (plan.id === "silver" && ["price_1QLNQAFy6VKViPpJGQCXH5KE", "price_1TSAT3Fy6VKViPpJP4SIMcZX", "price_1TVxFsFy6VKViPpJCRGnLEYH", "price_1RjwuyFy6VKViPpJHrCcff1Y"].includes(activePlanId)) ||
                    (plan.id === "gold" && ["price_1Q8P4NFy6VKViPpJeRzGAybE", "price_1TSAo6Fy6VKViPpJRV0M9OY4", "price_1UO8M3Fy6VKViPpJQuLeuVq1"].includes(activePlanId)) ||
                    (plan.id === "platinum" && ["price_1Q8H9gFy6VKViPpJwEh4k3c1", "price_1TSB3UFy6VKViPpJdcvQYrh2", "price_1UO8ZHFy6VKViPpJ57GVbkgx"].includes(activePlanId)) ||
                    (plan.id === "diamond" && ["price_1Q8PNDFy6VKViPpJSYVg4mvU"].includes(activePlanId))
                  ));

                const isPick = pickedPlan === plan.id;

                return (
                  <article
                    key={plan.id}
                    className={`plan plan--${plan.id} ${isPick ? "is-pick" : ""}`}
                    data-plan={plan.id}
                    aria-labelledby={`h-${plan.id}`}
                  >
                    {plan.badge && (
                      <span className={`badge ${plan.badgeClass || ""}`}>
                        {plan.badge}
                      </span>
                    )}

                    <div className="p-head">
                      <span className="ico">
                        <svg aria-hidden="true" focusable="false"><use href={plan.icon}/></svg>
                      </span>
                      <h3 id={`h-${plan.id}`}>{plan.name}</h3>
                    </div>

                    <p className="p-tag">{plan.tagline}</p>

                    <p className="p-price">
                      <span className="cur">$</span>
                      <span className="amt">{plan.price}</span>
                    </p>

                    <p className="per-line">{plan.period}</p>

                    {plan.eqWas ? (
                      <p className="eq eq--was"><s>{plan.eqWas}</s> {plan.eq}</p>
                    ) : (
                      <p className="eq">{plan.eq}</p>
                    )}

                    <p className={`pill ${plan.pillGood ? "pill--good" : ""}`}>
                      {plan.pill}
                    </p>

                    <div className={`ruler ${plan.rulerClass || ""}`} role="img" aria-label={plan.rulerAria || "Cost per day"}>
                      <div className="ruler-top">
                        <span>Cost per day</span>
                        <b>{plan.rulerTop}</b>
                      </div>
                      <div className="ruler-bar">
                        <i style={{ "--w": plan.rulerWidth }}></i>
                      </div>
                    </div>

                    <p className="p-hero">
                      <svg aria-hidden="true" focusable="false"><use href="#i-file"/></svg>
                      <span>
                        {plan.heroNum ? (
                          plan.heroText.includes("Up to") ? (
                            <>Up to <b>{plan.heroNum}</b> {plan.heroText.replace(`Up to ${plan.heroNum}`, "").trim()}</>
                          ) : (
                            <><b>{plan.heroNum}</b> {plan.heroText.replace(plan.heroNum, "").trim()}</>
                          )
                        ) : (
                          plan.heroText
                        )}
                      </span>
                    </p>

                    <div className="tiles">
                      {plan.tiles.map((t, idx) => (
                        <div key={idx} className={`tile ${t.off ? "tile--off" : ""}`}>
                          <b>{t.num}</b>
                          <span>{t.label}</span>
                        </div>
                      ))}
                    </div>

                    <ul className="p-list">
                      {plan.features.map((f, idx) => {
                        if (typeof f === "object" && f.isAiTools) {
                          return (
                            <li key={idx} className="li-tools">
                              <details className="tools">
                                <summary>
                                  <svg className="ck" aria-hidden="true" focusable="false"><use href="#i-check"/></svg>
                                  <span>14 AI tools</span>
                                  <span className="nw">NEW</span>
                                  <svg className="chev" aria-hidden="true" focusable="false"><use href="#i-chev"/></svg>
                                </summary>
                                <ul>
                                  {aiToolsList.map((tool, tIdx) => (
                                    <li key={tIdx}>{tool}</li>
                                  ))}
                                </ul>
                              </details>
                            </li>
                          );
                        }
                        return (
                          <li key={idx}>
                            <svg className="ck" aria-hidden="true" focusable="false"><use href="#i-check"/></svg>
                            <span>{f}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleSubscribe(plan)}
                      disabled={activeSubscription && !isCurrent}
                      className={`cta ${isCurrent ? "cta--green" : plan.ctaClass || ""}`}
                    >
                      {isCurrent ? "CURRENT PLAN" : plan.ctaLabel}
                      {!isCurrent && <svg aria-hidden="true" focusable="false"><use href="#i-arrow"/></svg>}
                    </button>

                    <p className="pay">
                      {plan.id !== "free" && <svg aria-hidden="true" focusable="false"><use href="#i-lock"/></svg>}
                      {plan.payNotice}
                    </p>

                    {plan.id !== "gold" && isPick && <span className="pick-tag">Your pick</span>}
                  </article>
                );
              })}
            </div>

            {/* Assurance List */}
            <ul className="assure">
              <li>
                <svg aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
                <div>
                  <b>Switch plans any time</b>
                  <span>Upgrade or downgrade from your dashboard. Billing is prorated.</span>
                </div>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false"><use href="#i-lock"/></svg>
                <div>
                  <b>Secure checkout</b>
                  <span>Payments are processed by Stripe.</span>
                </div>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false"><use href="#i-layers"/></svg>
                <div>
                  <b>Credits last the whole plan</b>
                  <span>AI credits don&apos;t expire daily. Download limits reset every 24 hours.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* What you get with a Cadbull plan */}
        <section className="sec" aria-labelledby="why-h">
          <div className="wrap">
            <h2 id="why-h">What you get with a Cadbull plan</h2>
            <div className="why">
              <div className="why-i">
                <span className="ico">
                  <svg aria-hidden="true" focusable="false"><use href="#i-file"/></svg>
                </span>
                <h3>A library for every stage</h3>
                <p>DWG, 3ds Max, Revit, SketchUp and PDF files, from house plans to furniture blocks and structure details. New files are added daily.</p>
              </div>
              <div className="why-i">
                <span className="ico">
                  <svg aria-hidden="true" focusable="false"><use href="#i-sparkle"/></svg>
                </span>
                <h3>AI Studio built in</h3>
                <p>14 AI tools turn sketches, images and 2D drawings into 3D views, floor plans and DWG, and generate bills of quantities.</p>
              </div>
              <div className="why-i">
                <span className="ico">
                  <svg aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
                </span>
                <h3>Daily downloads, reset every 24 hours</h3>
                <p>Paid plans include 10 to 40 Gold downloads and 10 to 50 free downloads every day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Compare All Plans Section */}
        <section className="sec" aria-labelledby="cmp-h">
          <div className="wrap">
            <h2 id="cmp-h">Compare all plans</h2>
            <p className="intro">Every number below comes from the cards above.</p>
            <details className="cmp-wrap" open>
              <summary>Compare all plans</summary>
              <div className="panel panel--flush cmp-panel">
                <table className="cmp">
                  <caption className="sr">Cadbull plans compared</caption>
                  <thead>
                    <tr>
                      <th scope="col"><span className="sr">Feature</span></th>
                      <th scope="col" className="col-free">
                        <span className="ch-name">Free</span>
                        <span className="ch-tier">Forever</span>
                      </th>
                      <th scope="col" className="col-silver">
                        <span className="ch-name">Silver</span>
                        <span className="ch-tier">Weekly</span>
                      </th>
                      <th scope="col" className="col-gold">
                        <em className="ch-badge ch-badge--red">Most popular</em>
                        <span className="ch-name">Gold</span>
                        <span className="ch-tier">Monthly</span>
                      </th>
                      <th scope="col" className="col-platinum">
                        <span className="ch-name">Platinum</span>
                        <span className="ch-tier">3 months</span>
                      </th>
                      <th scope="col" className="col-diamond">
                        <em className="ch-badge">Best value</em>
                        <span className="ch-name">Diamond</span>
                        <span className="ch-tier">Yearly</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="grp">
                      <th scope="colgroup" colSpan="6">Price and savings</th>
                    </tr>
                    <tr className="r-price">
                      <th scope="row">Price</th>
                      <td className="col-free" data-label="Free">
                        <span className="price-v"><b>$0</b> <small>forever</small></span>
                      </td>
                      <td className="col-silver" data-label="Silver">
                        <span className="price-v"><b>$9.99</b> <small>/ week</small></span>
                      </td>
                      <td className="col-gold" data-label="Gold">
                        <span className="price-v"><b>$19.99</b> <small>/ month</small></span>
                      </td>
                      <td className="col-platinum" data-label="Platinum">
                        <span className="price-v"><b>$49.99</b> <small>/ 3 months</small></span>
                      </td>
                      <td className="col-diamond" data-label="Diamond">
                        <span className="price-v"><b>$99.99</b> <small>/ year</small></span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Cost per day</th>
                      <td className="col-free" data-label="Free"><span className="cpd-v"><b>$0</b></span></td>
                      <td className="col-silver" data-label="Silver">
                        <span className="cpd-v"><b>$1.43</b><i className="cpd-bar"><u style={{ width: "100%" }}></u></i></span>
                      </td>
                      <td className="col-gold" data-label="Gold">
                        <span className="cpd-v"><b>$0.66</b><i className="cpd-bar"><u style={{ width: "46%" }}></u></i></span>
                      </td>
                      <td className="col-platinum" data-label="Platinum">
                        <span className="cpd-v"><b>$0.55</b><i className="cpd-bar"><u style={{ width: "38%" }}></u></i></span>
                      </td>
                      <td className="col-diamond" data-label="Diamond">
                        <span className="cpd-v"><b>$0.27</b><i className="cpd-bar"><u style={{ width: "19%" }}></u></i></span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Saving vs weekly</th>
                      <td className="col-free" data-label="Free"><span className="dash" aria-hidden="true">–</span><span className="sr">Not included</span></td>
                      <td className="col-silver" data-label="Silver"><span className="dash" aria-hidden="true">–</span><span className="sr">Not included</span></td>
                      <td className="col-gold" data-label="Gold"><span className="save-pill">Save 54%</span></td>
                      <td className="col-platinum" data-label="Platinum"><span className="save-pill">Save 62%</span></td>
                      <td className="col-diamond" data-label="Diamond"><span className="save-pill">Save 81%</span></td>
                    </tr>

                    <tr className="grp">
                      <th scope="colgroup" colSpan="6">AI Studio</th>
                    </tr>
                    <tr>
                      <th scope="row">AI credits<small>One credit is one AI generation</small></th>
                      <td className="col-free" data-label="Free">0</td>
                      <td className="col-silver" data-label="Silver"><b>25</b></td>
                      <td className="col-gold" data-label="Gold"><b>100</b></td>
                      <td className="col-platinum" data-label="Platinum"><b>300</b></td>
                      <td className="col-diamond" data-label="Diamond"><b>1,500</b></td>
                    </tr>
                    <tr>
                      <th scope="row">Cost per AI generation</th>
                      <td className="col-free" data-label="Free"><span className="dash" aria-hidden="true">–</span><span className="sr">Not included</span></td>
                      <td className="col-silver" data-label="Silver">$0.40</td>
                      <td className="col-gold" data-label="Gold">$0.20</td>
                      <td className="col-platinum" data-label="Platinum">$0.17</td>
                      <td className="col-diamond" data-label="Diamond">$0.07</td>
                    </tr>
                    <tr>
                      <th scope="row">AI Studio tools</th>
                      <td className="col-free" data-label="Free">Limited</td>
                      <td className="col-silver" data-label="Silver">All 14 tools</td>
                      <td className="col-gold" data-label="Gold">All 14 tools</td>
                      <td className="col-platinum" data-label="Platinum">All 14 tools</td>
                      <td className="col-diamond" data-label="Diamond">All 14 tools</td>
                    </tr>

                    <tr className="grp">
                      <th scope="colgroup" colSpan="6">Downloads</th>
                    </tr>
                    <tr>
                      <th scope="row">Gold downloads a day</th>
                      <td className="col-free" data-label="Free">0</td>
                      <td className="col-silver" data-label="Silver"><b>10</b></td>
                      <td className="col-gold" data-label="Gold"><b>20</b></td>
                      <td className="col-platinum" data-label="Platinum"><b>30</b></td>
                      <td className="col-diamond" data-label="Diamond"><b>40</b></td>
                    </tr>
                    <tr>
                      <th scope="row">Free downloads a day</th>
                      <td className="col-free" data-label="Free"><b>10</b></td>
                      <td className="col-silver" data-label="Silver"><b>10</b></td>
                      <td className="col-gold" data-label="Gold"><b>15</b></td>
                      <td className="col-platinum" data-label="Platinum"><b>25</b></td>
                      <td className="col-diamond" data-label="Diamond"><b>50</b></td>
                    </tr>
                    <tr>
                      <th scope="row">Premium downloads, at most</th>
                      <td className="col-free" data-label="Free">None</td>
                      <td className="col-silver" data-label="Silver"><span><b>70</b> <small>a week</small></span></td>
                      <td className="col-gold" data-label="Gold"><span><b>600</b> <small>a month</small></span></td>
                      <td className="col-platinum" data-label="Platinum"><span><b>2,700</b> <small>in 3 months</small></span></td>
                      <td className="col-diamond" data-label="Diamond"><span><b>14,600</b> <small>a year</small></span></td>
                    </tr>
                    <tr>
                      <th scope="row">Cost per premium file<small>At full daily use of Gold downloads</small></th>
                      <td className="col-free" data-label="Free"><span className="dash" aria-hidden="true">–</span><span className="sr">Not included</span></td>
                      <td className="col-silver" data-label="Silver">14¢</td>
                      <td className="col-gold" data-label="Gold">3.3¢</td>
                      <td className="col-platinum" data-label="Platinum">1.9¢</td>
                      <td className="col-diamond" data-label="Diamond">0.7¢</td>
                    </tr>

                    <tr className="grp">
                      <th scope="colgroup" colSpan="6">Extras</th>
                    </tr>
                    <tr>
                      <th scope="row">Ads free experience</th>
                      <td className="col-free" data-label="Free"><span className="dash" aria-hidden="true">–</span><span className="sr">Not included</span></td>
                      <td className="col-silver" data-label="Silver"><span className="yes"><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg><span className="sr">Yes</span></span></td>
                      <td className="col-gold" data-label="Gold"><span className="yes"><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg><span className="sr">Yes</span></span></td>
                      <td className="col-platinum" data-label="Platinum"><span className="yes"><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg><span className="sr">Yes</span></span></td>
                      <td className="col-diamond" data-label="Diamond"><span className="yes"><svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg><span className="sr">Yes</span></span></td>
                    </tr>

                    <tr className="cta-row">
                      <th scope="row"><span className="sr">Choose a plan</span></th>
                      <td className="col-free">
                        <Link className="btn btn--sm btn--green" href="/auth/register">Start free</Link>
                      </td>
                      <td className="col-silver">
                        <button type="button" className="btn btn--sm btn--navy" onClick={() => handleSubscribe(plans.find((p) => p.id === "silver"))}>Get Silver</button>
                      </td>
                      <td className="col-gold">
                        <button type="button" className="btn btn--sm btn--red" onClick={() => handleSubscribe(plans.find((p) => p.id === "gold"))}>Get Gold</button>
                      </td>
                      <td className="col-platinum">
                        <button type="button" className="btn btn--sm btn--navy" onClick={() => handleSubscribe(plans.find((p) => p.id === "platinum"))}>Get Platinum</button>
                      </td>
                      <td className="col-diamond">
                        <button type="button" className="btn btn--sm btn--navy" onClick={() => handleSubscribe(plans.find((p) => p.id === "diamond"))}>Get Diamond</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </section>

        {/* 14 AI Studio Tools Grid Section */}
        <section className="sec sec--tools" aria-labelledby="tools-h">
          <div className="wrap wrap--wide">
            <div className="sec-head">
              <span className="eyebrow">AI Studio toolkit</span>
              <h2 id="tools-h">14 AI Studio tools in every paid plan</h2>
              <p className="intro">Turn sketches, images and 2D drawings into 3D views, floor plans and DWG without leaving Cadbull. Pick a tool, upload your input and get the output. BOQ means bill of quantities.</p>
              <ul className="tools-chips" aria-label="AI Studio highlights">
                <li>14 AI tools</li>
                <li>Runs in your browser</li>
                <li>Unit Converter is free</li>
              </ul>
            </div>

            <ul className="tgrid">
              {aiToolsCards.map((tool, idx) => (
                <li key={idx} className={`tcard ${tool.isFree ? "tcard--free" : ""}`}>
                  <div className="tc-media">
                    <img
                      src={tool.image}
                      width="360"
                      height="216"
                      alt={`${tool.name} example output`}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="tc-num">{tool.num.split("/")[0]}<i>/14</i></span>
                    <span className="tc-kind">{tool.kind}</span>
                    {tool.isFree && <span className="tc-free">FREE</span>}
                  </div>

                  <h3 className="tc-name">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      {tool.name}
                    </a>
                  </h3>

                  <p className="tc-desc">{tool.desc}</p>

                  <div className="tc-tags">
                    {tool.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`tc-chip ${
                          tag.isFt
                            ? "tc-chip--ft"
                            : tag.isFreeChip
                              ? "tc-chip--free"
                              : "tc-chip--plan"
                        }`}
                      >
                        {tag.isFt && <svg aria-hidden="true" focusable="false"><use href="#i-sparkle"/></svg>}
                        {tag.isPlan && <svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>}
                        {tag.label}
                      </span>
                    ))}
                  </div>

                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tc-btn">
                    Open <svg aria-hidden="true" focusable="false"><use href="#i-arrow"/></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="sec" aria-labelledby="faq-h" style={{ paddingBottom: "40px" }}>
          <div className="wrap">
            <h2 id="faq-h" style={{ textAlign: "center", marginBottom: "24px" }}>Frequently asked questions</h2>
            <div className="faq" style={{ margin: "0 auto" }}>
              {faqsData.map((faq, idx) => (
                <details key={idx}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="final" aria-labelledby="final-h" style={{ textAlign: "center" }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", margin: "0 auto" }}>
            <h2 id="final-h" style={{ textAlign: "center", margin: "0 auto 12px auto", width: "100%", color: "#FFFFFF" }}>
              Pick a plan and start designing faster
            </h2>
            <p style={{ textAlign: "center", margin: "0 auto", maxWidth: "52ch", width: "100%", color: "#C5CEDB" }}>
              Gold is our most popular plan. Diamond has the lowest cost per day, $0.27.
            </p>
            <div className="final-cta" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "24px", width: "100%" }}>
              <button
                type="button"
                className="btn btn--red"
                data-checkout="gold"
                onClick={() => handleSubscribe(plans.find((p) => p.id === "gold"))}
              >
                Get Gold, $19.99 a month
              </button>
              <button
                type="button"
                className="btn btn--light"
                data-checkout="diamond"
                onClick={() => handleSubscribe(plans.find((p) => p.id === "diamond"))}
              >
                Get Diamond, $99.99 a year
              </button>
            </div>
            <div className="final-sub" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: "16px", gap: "4px", width: "100%" }}>
              <Link className="final-free" href="/auth/register" style={{ textAlign: "center" }}>
                <u>Or start free, no card needed</u>
              </Link>
              <span style={{ textAlign: "center" }}>Secure checkout by Stripe</span>
            </div>
          </div>
        </section>


        {/* Mobile Sticky Buy Bar */}
        {showSticky && (
          <div className="sticky">
            <div className="sticky-txt">
              <b>Gold Plan · $19.99/mo</b>
              <span>Save 54% vs weekly · 100 AI credits</span>
            </div>
            <button
              type="button"
              className="btn btn--red"
              onClick={() => handleSubscribe(plans.find((p) => p.id === "gold"))}
            >
              Get Gold
            </button>
          </div>
        )}
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
