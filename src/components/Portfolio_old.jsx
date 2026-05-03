import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";

/* ─── SVG ICONS ─── */
const IC = {
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowR: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowL: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  ArrowD: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  Link: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Github: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Pin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Linkedin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  Download: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Send: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Code: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Zap: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Shield: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  DB: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  Server: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  Lock: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Globe: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Award: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  Briefcase: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Cpu: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Layers: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  File: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Chevron: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Eye: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Star: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  TrendUp: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Users: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Target: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Package: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Refresh: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  GitBranch: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
};

/* ─── DATA ─── */
const PROJECTS = [
  {
    id:1, num:"01", title:"Rohangems", subtitle:"Diamond & Jewelry E-Commerce",
    description:"Production-grade e-commerce backend for the diamond & jewellery industry with real-time catalogue sync and automated logistics.",
    longDesc:"A full-scale e-commerce backend powering a live jewellery business. JWT-based RBAC with role-specific endpoints for admin, staff and customers. Integrated JAS, Maitri & LGD third-party APIs to auto-fetch live product catalogues — zero manual entry required. Parcel Pro API handles automated shipment dispatch and live order tracking.",
    color:"#a78bfa", accent:"#7c3aed",
    features:[
      {Icon:IC.Lock, text:"JWT-based RBAC for admin, staff & customer roles"},
      {Icon:IC.Refresh, text:"Real-time product sync via JAS, Maitri & LGD APIs"},
      {Icon:IC.Package, text:"Parcel Pro API — automated shipment & live tracking"},
      {Icon:IC.File, text:"Bulk CSV/Excel import-export with Apache POI"},
      {Icon:IC.Mail, text:"Transactional emails — order, dispatch, account flows"},
      {Icon:IC.DB, text:"MySQL query optimization — 30% faster responses"},
    ],
    slides:[{label:"Admin Dashboard",Icon:IC.Server},{label:"Product Catalogue",Icon:IC.Layers},{label:"Order Management",Icon:IC.Briefcase},{label:"Shipment Tracking",Icon:IC.Package}],
    tech:["Java","Spring Boot","Spring Security","JWT","MySQL","Hibernate/JPA","Apache POI","OpenCSV","JavaMailSender","REST APIs"],
    highlights:["Production Live","30% Faster APIs","3 APIs Integrated"],
    live:"#", github:"#",
  },
  {
    id:2, num:"02", title:"Library Management", subtitle:"Role-Based Institutional Platform",
    description:"Full-featured LMS with hierarchical role workflows, automated fine calculation and bulk data operations.",
    longDesc:"Independently built a full-featured LMS with three distinct role-based workflows. Students request books, department staff approve within their scope, and admins oversee everything globally. Department-scoped access ensures staff only manage their own inventory.",
    color:"#38bdf8", accent:"#0284c7",
    features:[
      {Icon:IC.Users, text:"3-tier roles — Student / Staff / Admin with scoped access"},
      {Icon:IC.Lock, text:"Department-scoped RBAC — staff see only their inventory"},
      {Icon:IC.Clock, text:"Automated fine engine — real-time overdue calculation"},
      {Icon:IC.Mail, text:"Due-date & fine alerts via JavaMailSender automation"},
      {Icon:IC.File, text:"Excel/CSV export for inventory, members & fine reports"},
      {Icon:IC.DB, text:"Hibernate/JPA ACID-compliant transaction management"},
    ],
    slides:[{label:"Book Catalogue",Icon:IC.Layers},{label:"Member Portal",Icon:IC.Users},{label:"Fine Reports",Icon:IC.DB},{label:"Approval Workflow",Icon:IC.Check}],
    tech:["Java","Spring Boot","Spring Security","JWT","MySQL","Hibernate/JPA","JDBC","JavaMailSender","Apache POI","OpenCSV"],
    highlights:["3-Tier RBAC","Auto Fine Engine","Bulk Import/Export"],
    live:"#", github:"#",
  },
  {
    id:3, num:"03", title:"Inventory System", subtitle:"Multi-Warehouse Stock Platform",
    description:"Robust multi-warehouse inventory backend with supplier management, low-stock alerts and compliance reporting.",
    longDesc:"A comprehensive inventory management platform supporting multiple warehouses with real-time stock tracking. Supplier management handles purchase orders and delivery tracking. Low-stock threshold alerts fire automated email notifications to warehouse managers.",
    color:"#34d399", accent:"#059669",
    features:[
      {Icon:IC.Package, text:"Multi-warehouse stock tracking with live updates"},
      {Icon:IC.Target, text:"Low-stock alerts with automated email notifications"},
      {Icon:IC.Users, text:"Supplier management & purchase order tracking"},
      {Icon:IC.Lock, text:"RBAC — warehouse staff vs admin access control"},
      {Icon:IC.File, text:"Bulk CSV product import & Excel audit reports"},
      {Icon:IC.TrendUp, text:"Inventory analytics with movement history reports"},
    ],
    slides:[{label:"Stock Dashboard",Icon:IC.Server},{label:"Warehouse View",Icon:IC.Package},{label:"Supplier Portal",Icon:IC.Users},{label:"Alert Center",Icon:IC.Zap}],
    tech:["Java","Spring Boot","Spring Security","JWT","MySQL","Hibernate/JPA","Apache POI","OpenCSV","JavaMailSender","REST APIs"],
    highlights:["Multi-Warehouse","Auto Alerts","Full Audit Trail"],
    live:"#", github:"#",
  },
];

const SKILLS = [
  {name:"Java",Icon:IC.Code,level:92,color:"#f97316"},
  {name:"Spring Boot",Icon:IC.Server,level:90,color:"#86efac"},
  {name:"Spring Security",Icon:IC.Lock,level:87,color:"#a78bfa"},
  {name:"MySQL",Icon:IC.DB,level:88,color:"#60a5fa"},
  {name:"REST APIs",Icon:IC.Globe,level:90,color:"#34d399"},
  {name:"JWT / RBAC",Icon:IC.Shield,level:87,color:"#fbbf24"},
  {name:"Hibernate/JPA",Icon:IC.Layers,level:85,color:"#f472b6"},
  {name:"Microservices",Icon:IC.Cpu,level:65,color:"#38bdf8"},
  {name:"Apache POI",Icon:IC.File,level:83,color:"#fb923c"},
  {name:"JavaMailSender",Icon:IC.Mail,level:80,color:"#c084fc"},
  {name:"OpenCSV",Icon:IC.File,level:82,color:"#4ade80"},
  {name:"Postman",Icon:IC.Zap,level:85,color:"#f87171"},
];

const ROLES = ["Java Backend Developer","Spring Boot Specialist","REST API Engineer","Microservices Enthusiast","Problem Solver"];

const STATS = [
  {label:"Years Experience",value:"3+",Icon:IC.Briefcase},
  {label:"Projects Built",value:"10+",Icon:IC.Code},
  {label:"API Speed Boost",value:"30%↑",Icon:IC.Zap},
  {label:"MCA CGPA",value:"8.25",Icon:IC.Award},
];

const ACHIEVEMENTS = [
  {Icon:IC.Zap,title:"30% API Performance Boost",desc:"MySQL query optimization, schema redesign & strategic indexing delivered measurable improvement at Antrix Tech Zone.",color:"#fbbf24"},
  {Icon:IC.Shield,title:"Zero Security Incidents",desc:"JWT-RBAC with fine-grained role-based access control deployed across all production endpoints with zero breaches.",color:"#34d399"},
  {Icon:IC.Globe,title:"3 Live API Integrations",desc:"JAS, Maitri & LGD third-party APIs auto-fetching real-time catalogues — eliminating 100% of manual product entry.",color:"#60a5fa"},
  {Icon:IC.Package,title:"Automated Logistics Pipeline",desc:"Parcel Pro API for automated shipment dispatch and live order tracking — reducing logistics handling time significantly.",color:"#a78bfa"},
  {Icon:IC.Award,title:"MCA — 8.25 / 10 CGPA",desc:"Master of Computer Applications from LNCT University, Bhopal with distinction, specializing in distributed systems.",color:"#f472b6"},
  {Icon:IC.Layers,title:"Full SDLC Ownership",desc:"Requirements → design → development → QA → deployment → post-release support across multiple production systems.",color:"#fb923c"},
  {Icon:IC.GitBranch,title:"Microservices Transition",desc:"Actively architecting migration from monolithic to microservices, gaining hands-on exposure to distributed design patterns.",color:"#38bdf8"},
  {Icon:IC.File,title:"Bulk Data Operations",desc:"Apache POI & OpenCSV pipelines handling thousands of records — catalogues, order reports, user records and audit exports.",color:"#86efac"},
  {Icon:IC.Clock,title:"3+ Years Production Experience",desc:"Continuously delivering and maintaining production-grade systems at Antrix Tech Zone since September 2023.",color:"#fda4af"},
  {Icon:IC.TrendUp,title:"ACID-Compliant Transactions",desc:"Engineered Hibernate/JPA transaction management ensuring data integrity across complex multi-table operations.",color:"#c084fc"},
  {Icon:IC.Mail,title:"Email Automation at Scale",desc:"Reusable JavaMailSender templates powering order confirmations, dispatch alerts, fine notifications and account workflows.",color:"#67e8f9"},
  {Icon:IC.Users,title:"Multi-Role System Design",desc:"Complex hierarchical RBAC systems supporting 3+ distinct user personas with department-scoped data access controls.",color:"#fde68a"},
];

/* ─── THEME ─── */
const theme = (dark) => ({
  bg:        dark ? "#060810" : "#f5f7ff",
  bg2:       dark ? "#090d18" : "#eceffe",
  card:      dark ? "rgba(255,255,255,0.05)" : "#ffffff",
  cardB:     dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)",
  text:      dark ? "#e8eef8" : "#0f172a",
  muted:     dark ? "#64748b" : "#64748b",
  sub:       dark ? "#2d3f55" : "#c4cfe8",
  accent:    dark ? "#a78bfa" : "#6d28d9",
  accentDim: dark ? "rgba(167,139,250,0.13)" : "rgba(109,40,217,0.09)",
  accentB:   dark ? "rgba(167,139,250,0.28)" : "rgba(109,40,217,0.22)",
  navBg:     dark ? "rgba(6,8,16,0.92)" : "rgba(245,247,255,0.92)",
  shadow:    dark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.08)",
  inputBg:   dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
  inputB:    dark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.13)",
  btnGrad:   "linear-gradient(135deg,#7c3aed,#2563eb)",
});

/* ─── TYPING ─── */
const Typing = ({ accent }) => {
  const [idx,setIdx]=useState(0);
  const [txt,setTxt]=useState("");
  const [del,setDel]=useState(false);
  useEffect(()=>{
    const role=ROLES[idx];
    if(!del&&txt===role){const id=setTimeout(()=>setDel(true),1800);return()=>clearTimeout(id);}
    if(del&&txt===""){setDel(false);setIdx(i=>(i+1)%ROLES.length);return;}
    const id=setTimeout(()=>setTxt(del?role.slice(0,txt.length-1):role.slice(0,txt.length+1)),del?45:88);
    return()=>clearTimeout(id);
  },[txt,del,idx]);
  return (
    <span>
      <span style={{color:accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{txt}</span>
      <motion.span animate={{opacity:[1,0]}} transition={{repeat:Infinity,duration:0.7}} style={{color:accent}}>|</motion.span>
    </span>
  );
};

/* ─── CURSOR ─── */
const Cursor = ({accent}) => {
  const x=useMotionValue(-200),y=useMotionValue(-200);
  const sx=useSpring(x,{stiffness:520,damping:30});
  const sy=useSpring(y,{stiffness:520,damping:30});
  const [hov,setHov]=useState(false);
  useEffect(()=>{
    const mv=e=>{x.set(e.clientX);y.set(e.clientY);};
    const on=e=>{if(e.target.closest("a,button"))setHov(true);};
    const off=()=>setHov(false);
    window.addEventListener("mousemove",mv);
    window.addEventListener("mouseover",on);
    window.addEventListener("mouseout",off);
    return()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseover",on);window.removeEventListener("mouseout",off);};
  },[]);
  return (
    <>
      <motion.div style={{left:sx,top:sy,translateX:"-50%",translateY:"-50%",position:"fixed",width:8,height:8,borderRadius:"50%",pointerEvents:"none",zIndex:9999,background:accent}} animate={{scale:hov?2.2:1}} className="cursor-dot"/>
      <motion.div style={{left:sx,top:sy,translateX:"-50%",translateY:"-50%",position:"fixed",width:32,height:32,borderRadius:"50%",pointerEvents:"none",zIndex:9998,border:`1px solid ${accent}70`}} animate={{scale:hov?1.5:1}} className="cursor-dot"/>
    </>
  );
};

/* ─── MODAL ─── */
const Modal = ({p,onClose,t}) => {
  const [slide,setSlide]=useState(0);
  const dragX=useRef(0);
  const timer=useRef(null);
  const next=useCallback(()=>setSlide(s=>(s+1)%p.slides.length),[p]);
  const prev=useCallback(()=>setSlide(s=>(s-1+p.slides.length)%p.slides.length),[p]);
  useEffect(()=>{timer.current=setInterval(next,3200);return()=>clearInterval(timer.current);},[next]);
  useEffect(()=>{const fn=e=>e.key==="Escape"&&onClose();window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[onClose]);
  const SI=p.slides[slide].Icon;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"12px",backdropFilter:"blur(22px)",background:"rgba(0,0,0,0.75)"}}>
      <motion.div initial={{scale:0.87,y:40,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:0.9,y:20,opacity:0}} transition={{type:"spring",stiffness:280,damping:26}}
        style={{width:"100%",maxWidth:780,borderRadius:22,overflow:"hidden",background:t.bg,border:`1px solid ${t.cardB}`,boxShadow:`0 32px 90px ${t.shadow}`,maxHeight:"92vh",overflowY:"auto"}}>
        {/* sticky header */}
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.cardB}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,position:"sticky",top:0,background:t.bg,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:p.color,flexShrink:0}}/>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"0.95rem",color:t.text}}>{p.title}</span>
            <span style={{fontSize:"0.7rem",color:p.color,fontWeight:600}}>{p.subtitle}</span>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${t.cardB}`,background:"transparent",color:t.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IC.X/></button>
        </div>
        <div style={{padding:"18px"}}>
          {/* Carousel */}
          <div style={{borderRadius:14,overflow:"hidden",background:`${p.color}10`,border:`1px solid ${p.color}25`,position:"relative",height:180,marginBottom:"16px",userSelect:"none"}}
            onMouseDown={e=>{dragX.current=e.clientX;}}
            onMouseUp={e=>{const d=dragX.current-e.clientX;if(Math.abs(d)>40){d>0?next():prev();clearInterval(timer.current);}}}
            onTouchStart={e=>{dragX.current=e.touches[0].clientX;}}
            onTouchEnd={e=>{const d=dragX.current-e.changedTouches[0].clientX;if(Math.abs(d)>35){d>0?next():prev();clearInterval(timer.current);}}}>
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{opacity:0,x:45}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-45}} transition={{duration:0.28}}
                style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                <div style={{width:48,height:48,borderRadius:13,background:`${p.color}20`,border:`1px solid ${p.color}40`,display:"flex",alignItems:"center",justifyContent:"center",color:p.color}}><SI/></div>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:p.color,fontSize:"0.92rem"}}>{p.slides[slide].label}</p>
                <p style={{fontSize:"0.66rem",color:t.muted}}>{slide+1} / {p.slides.length} · swipe to navigate</p>
              </motion.div>
            </AnimatePresence>
            <button onClick={()=>{prev();clearInterval(timer.current);}} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",width:30,height:30,borderRadius:"50%",background:`${p.color}22`,border:"none",color:p.color,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowL/></button>
            <button onClick={()=>{next();clearInterval(timer.current);}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:30,height:30,borderRadius:"50%",background:`${p.color}22`,border:"none",color:p.color,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowR/></button>
            <div style={{position:"absolute",bottom:9,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5}}>
              {p.slides.map((_,i)=><button key={i} onClick={()=>{setSlide(i);clearInterval(timer.current);}} style={{height:5,width:i===slide?18:5,borderRadius:3,background:i===slide?p.color:t.sub,border:"none",cursor:"pointer",transition:"all 0.25s"}}/>)}
            </div>
          </div>
          {/* Overview */}
          <p style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:p.color,marginBottom:7}}>Overview</p>
          <p style={{fontSize:"0.84rem",lineHeight:1.78,color:t.muted,marginBottom:16}}>{p.longDesc}</p>
          {/* Features */}
          <p style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:p.color,marginBottom:10}}>Key Features</p>
          <div className="feat-grid" style={{marginBottom:16}}>
            {p.features.map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 11px",borderRadius:10,background:`${p.color}08`,border:`1px solid ${p.color}20`}}>
                <span style={{color:p.color,marginTop:1,flexShrink:0}}><f.Icon/></span>
                <span style={{fontSize:"0.77rem",color:t.muted,lineHeight:1.5}}>{f.text}</span>
              </div>
            ))}
          </div>
          {/* Highlights */}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {p.highlights.map(h=>(
              <span key={h} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:"0.7rem",fontWeight:700,padding:"4px 11px",borderRadius:40,background:`${p.color}18`,color:p.color,border:`1px solid ${p.color}30`}}>
                <IC.Star/> {h}
              </span>
            ))}
          </div>
          {/* Stack */}
          <p style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:p.color,marginBottom:8}}>Tech Stack</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {p.tech.map(tt=><span key={tt} style={{fontSize:"0.71rem",padding:"3px 9px",borderRadius:6,background:t.accentDim,color:t.accent,border:`1px solid ${t.accentB}`}}>{tt}</span>)}
          </div>
          {/* CTA */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <a href={p.live} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",borderRadius:11,background:`linear-gradient(135deg,${p.color},${p.accent})`,color:"#fff",fontWeight:700,fontSize:"0.8rem",textDecoration:"none"}}><IC.Link/> Live Demo</a>
            <a href={p.github} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",borderRadius:11,border:`1px solid ${t.cardB}`,color:t.text,fontWeight:700,fontSize:"0.8rem",textDecoration:"none",background:"transparent"}}><IC.Github/> GitHub</a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── REVEAL ─── */
const Rev = ({children,delay=0,dir="up"}) => {
  const ref=useRef(null);
  const inV=useInView(ref,{once:true,margin:"-50px"});
  const init=dir==="left"?{x:-34,opacity:0}:dir==="right"?{x:34,opacity:0}:{y:26,opacity:0};
  return <motion.div ref={ref} initial={init} animate={inV?{x:0,y:0,opacity:1}:{}} transition={{duration:0.62,delay,ease:[0.25,0.1,0.25,1]}}>{children}</motion.div>;
};

const SL = ({text,accent}) => (
  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
    <div style={{width:22,height:2,background:accent,borderRadius:2}}/>
    <span style={{fontSize:"0.64rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:accent}}>{text}</span>
  </div>
);

/* ─── NAV ─── */
const Nav = ({t,dark,toggle}) => {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>25);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  const links=["About","Skills","Projects","Milestones","Contact"];
  return (
    <motion.nav initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5}}
      style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?t.navBg:"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${t.cardB}`:"1px solid transparent",transition:"all 0.3s"}}>
      <div style={{maxWidth:1160,margin:"0 auto",padding:"0 20px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="#hero" style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"1.2rem",color:t.text,textDecoration:"none"}}>YK<span style={{color:t.accent}}>.</span></a>
        <div className="nav-links" style={{display:"flex",gap:28,alignItems:"center"}}>
          {links.map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{fontSize:"0.82rem",fontWeight:500,color:t.muted,textDecoration:"none",transition:"color 0.2s"}}
              onMouseEnter={e=>e.target.style.color=t.accent}
              onMouseLeave={e=>e.target.style.color=t.muted}>{l}</a>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <motion.button onClick={toggle} whileHover={{scale:1.1}} whileTap={{scale:0.9}}
            style={{width:36,height:36,borderRadius:9,border:`1px solid ${t.cardB}`,background:t.card,color:t.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <AnimatePresence mode="wait">
              <motion.span key={dark?"d":"l"} initial={{rotate:-80,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:80,opacity:0}} transition={{duration:0.18}}>
                {dark?<IC.Moon/>:<IC.Sun/>}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <a href="mailto:cyogesh10h@gmail.com" className="nav-hire"
            style={{padding:"8px 18px",borderRadius:9,background:t.btnGrad,color:"#fff",fontWeight:700,fontSize:"0.78rem",textDecoration:"none",boxShadow:"0 4px 16px rgba(124,58,237,0.32)"}}>
            Hire Me
          </a>
          <button onClick={()=>setOpen(!open)} className="nav-ham"
            style={{width:36,height:36,borderRadius:9,border:`1px solid ${t.cardB}`,background:t.card,color:t.text,cursor:"pointer",alignItems:"center",justifyContent:"center",display:"none"}}>
            {open?<IC.X/>:<IC.Menu/>}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.22}}
            style={{overflow:"hidden",background:t.navBg,backdropFilter:"blur(20px)",borderTop:`1px solid ${t.cardB}`}}>
            <div style={{padding:"8px 20px 16px",display:"flex",flexDirection:"column",gap:2}}>
              {links.map(l=>(
                <a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)}
                  style={{padding:"13px 4px",fontSize:"0.92rem",fontWeight:600,color:t.muted,textDecoration:"none",borderBottom:`1px solid ${t.cardB}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  {l}<IC.Chevron/>
                </a>
              ))}
              <a href="mailto:cyogesh10h@gmail.com" style={{marginTop:12,padding:"13px",borderRadius:12,background:t.btnGrad,color:"#fff",fontWeight:700,textAlign:"center",textDecoration:"none",fontSize:"0.88rem"}}>Hire Me</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* ─── HERO — gradient text via CSS class, not inline style ─── */
const Hero = ({t,dark}) => {
  const {scrollY}=useScroll();
  const yP=useTransform(scrollY,[0,500],[0,110]);
  const op=useTransform(scrollY,[0,320],[1,0]);
  return (
    <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",paddingTop:70}}>
      {/* bg */}
      <motion.div style={{position:"absolute",inset:0,y:yP,pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,background:dark?"radial-gradient(ellipse 65% 55% at 50% 35%, rgba(139,92,246,0.13) 0%, transparent 60%)":"radial-gradient(ellipse 65% 55% at 50% 35%, rgba(109,40,217,0.07) 0%, transparent 60%)"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${t.accent}14 1px,transparent 1px),linear-gradient(90deg,${t.accent}14 1px,transparent 1px)`,backgroundSize:"55px 55px"}}/>
        {[{w:340,h:340,top:"5%",left:"-4%",dur:9},{w:260,h:260,top:"58%",right:"-2%",dur:11},{w:160,h:160,top:"22%",left:"64%",dur:13}]
          .map((o,i)=>(
            <motion.div key={i} animate={{y:[0,-25,0],x:[0,12,0]}} transition={{duration:o.dur,repeat:Infinity,ease:"easeInOut",delay:i*2.5}}
              style={{position:"absolute",width:o.w,height:o.h,top:o.top,left:o.left,right:o.right,borderRadius:"50%",background:dark?"rgba(139,92,246,0.06)":"rgba(109,40,217,0.04)",filter:"blur(50px)"}}/>
          ))}
      </motion.div>

      <motion.div style={{opacity:op,position:"relative",zIndex:1,textAlign:"center",width:"100%",maxWidth:840,padding:"0 20px",boxSizing:"border-box"}}>
        {/* badge */}
        <motion.div initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} transition={{duration:0.45}}
          style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:40,background:t.accentDim,border:`1px solid ${t.accentB}`,fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.accent,marginBottom:24}}>
          <motion.span animate={{opacity:[1,0]}} transition={{repeat:Infinity,duration:1}} style={{width:5,height:5,borderRadius:"50%",background:t.accent,display:"inline-block",flexShrink:0}}/>
          Available for Opportunities
        </motion.div>

        {/* greeting */}
        <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.17}}
          style={{fontSize:"clamp(0.88rem,2.5vw,1rem)",color:t.muted,marginBottom:8,fontWeight:300}}>
          Hi there 👋 I'm
        </motion.p>

        {/* ── NAME: uses CSS class for gradient, NOT inline WebkitTextFillColor ── */}
        <motion.div initial={{opacity:0,y:26}} animate={{opacity:1,y:0}} transition={{delay:0.3}} style={{marginBottom:14}}>
          {/* "Yogesh Kumar" — plain color, no gradient */}
          <div className="hero-name-top">Yogesh Kumar</div>
          {/* "Chaturvedi" — gradient via CSS class (no inline fill) */}
          <div className="hero-name-bottom">Chaturvedi</div>
        </motion.div>

        {/* tagline */}
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.44}}
          style={{fontSize:"clamp(0.88rem,2.5vw,1.12rem)",color:t.muted,marginBottom:10,fontWeight:300}}>
          I build <strong style={{color:t.text,fontWeight:700}}>scalable &amp; secure</strong> backend systems
        </motion.p>

        {/* typing */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.58}}
          style={{fontSize:"clamp(0.82rem,2.2vw,1rem)",marginBottom:32,minHeight:30}}>
          <Typing accent={t.accent}/>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.74}}
          style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
          <a href="#projects" style={{display:"inline-flex",alignItems:"center",gap:7,padding:"13px 26px",borderRadius:13,background:t.btnGrad,color:"#fff",fontWeight:700,fontSize:"0.82rem",letterSpacing:"0.05em",textDecoration:"none",boxShadow:"0 0 28px rgba(124,58,237,0.38)"}}>
            View Work <IC.ArrowR/>
          </a>
          <a href="#contact" style={{display:"inline-flex",alignItems:"center",gap:7,padding:"13px 26px",borderRadius:13,border:`2px solid ${t.accentB}`,color:t.accent,fontWeight:700,fontSize:"0.82rem",letterSpacing:"0.05em",textDecoration:"none",background:t.accentDim}}>
            Contact Me <IC.Mail/>
          </a>
        </motion.div>

        {/* scroll hint */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}}
          style={{marginTop:48,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontSize:"0.64rem",letterSpacing:"0.18em",textTransform:"uppercase",color:t.sub}}>
          <motion.span animate={{y:[0,5,0]}} transition={{repeat:Infinity,duration:1.5}}><IC.ArrowD/></motion.span>
          Scroll to explore
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─── ABOUT ─── */
const About = ({t}) => (
  <section id="about" style={{padding:"80px 20px",background:t.bg2}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <div className="about-grid">
        <Rev dir="left">
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:26}}>
            <div style={{position:"relative"}}>
              <div style={{width:190,height:190,borderRadius:26,background:`linear-gradient(135deg,${t.accentDim},rgba(37,99,235,0.14))`,border:`2px solid ${t.accentB}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:"3.2rem",fontWeight:900,color:t.accent,boxShadow:`0 0 48px ${t.accent}22`,position:"relative"}}>
                YK
                <motion.div animate={{opacity:[0.35,0.85,0.35]}} transition={{repeat:Infinity,duration:3}} style={{position:"absolute",inset:-4,borderRadius:28,border:`1px solid ${t.accentB}`}}/>
              </div>
              <motion.div animate={{y:[-4,4,-4]}} transition={{repeat:Infinity,duration:2.8}}
                style={{position:"absolute",bottom:-12,right:-14,padding:"7px 13px",borderRadius:10,background:t.accentDim,border:`1px solid ${t.accentB}`,fontSize:"0.7rem",fontWeight:700,color:t.accent,backdropFilter:"blur(8px)",whiteSpace:"nowrap"}}>
                🚀 Open to Work
              </motion.div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,width:"100%",maxWidth:290}}>
              {STATS.map((s,i)=>(
                <motion.div key={s.label} initial={{opacity:0,scale:0.85}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*0.08}} whileHover={{scale:1.04}}
                  style={{padding:"13px 8px",borderRadius:13,textAlign:"center",background:t.card,border:`1px solid ${t.cardB}`,cursor:"default"}}>
                  <div style={{color:t.accent,marginBottom:5,display:"flex",justifyContent:"center"}}><s.Icon/></div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.25rem",color:t.accent,lineHeight:1}}>{s.value}</div>
                  <div style={{fontSize:"0.59rem",color:t.muted,marginTop:3}}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Rev>
        <Rev dir="right" delay={0.1}>
          <SL text="About Me" accent={t.accent}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.65rem,4vw,2.5rem)",lineHeight:1.15,color:t.text,marginBottom:18,letterSpacing:"-0.02em"}}>Turning complexity<br/>into clean architecture</h2>
          <div style={{display:"flex",flexDirection:"column",gap:13,fontSize:"0.88rem",lineHeight:1.8,color:t.muted}}>
            <p>I'm a <strong style={{color:t.text}}>Java Backend Developer</strong> based in Mumbai, driven by a genuine love for building software that works — reliably, efficiently, and elegantly.</p>
            <p>Over <strong style={{color:t.text}}>3+ years</strong>, I've mastered the full SDLC — from architecting <strong style={{color:t.accent}}>JWT-based RBAC systems</strong> to squeezing <strong style={{color:t.accent}}>30% performance gains</strong> from MySQL with strategic indexing.</p>
            <p>Currently at <strong style={{color:t.text}}>Antrix Tech Zone</strong>, building production-grade systems and actively exploring freelance opportunities where I can bring the same quality to your project.</p>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:20}}>
            {["Spring Boot","Microservices","REST APIs","MySQL","JWT·RBAC","Apache POI"].map(tag=>(
              <span key={tag} style={{padding:"5px 11px",borderRadius:7,background:t.accentDim,border:`1px solid ${t.accentB}`,fontSize:"0.73rem",fontWeight:600,color:t.accent}}>{tag}</span>
            ))}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:22}}>
            <a href="mailto:cyogesh10h@gmail.com" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:11,background:t.btnGrad,color:"#fff",fontWeight:700,fontSize:"0.8rem",textDecoration:"none",boxShadow:"0 6px 20px rgba(124,58,237,0.28)"}}>
              <IC.Mail/> Get In Touch
            </a>
            <a href="Yogesh_Kumar_Chaturvedi.pdf" download style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:11,border:`1px solid ${t.cardB}`,color:t.text,fontWeight:700,fontSize:"0.8rem",textDecoration:"none",background:t.card}}>
              <IC.Download/> Download CV
            </a>
          </div>
        </Rev>
      </div>
    </div>
  </section>
);

/* ─── SKILLS ─── */
const Skills = ({t}) => (
  <section id="skills" style={{padding:"80px 20px"}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <Rev>
        <div style={{textAlign:"center",maxWidth:460,margin:"0 auto 46px"}}>
          <SL text="Technical Skills" accent={t.accent}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.75rem,4vw,2.7rem)",color:t.text,letterSpacing:"-0.02em",marginBottom:8}}>My arsenal</h2>
          <p style={{fontSize:"0.86rem",color:t.muted}}>Tools I use every day to build robust, scalable backend systems.</p>
        </div>
      </Rev>
      <div className="skills-grid">
        {SKILLS.map((sk,i)=>(
          <motion.div key={sk.name} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.045}}
            whileHover={{y:-5,scale:1.04}}
            style={{padding:"16px 12px",borderRadius:14,textAlign:"center",background:t.card,border:`1px solid ${t.cardB}`,cursor:"default",transition:"border-color 0.2s,box-shadow 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${sk.color}50`;e.currentTarget.style.boxShadow=`0 7px 26px ${sk.color}1a`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=t.cardB;e.currentTarget.style.boxShadow="none";}}>
            <div style={{width:40,height:40,borderRadius:11,background:`${sk.color}18`,border:`1px solid ${sk.color}30`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 9px",color:sk.color}}><sk.Icon/></div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.78rem",color:t.text,marginBottom:9}}>{sk.name}</div>
            <div style={{height:4,borderRadius:4,background:t.cardB,overflow:"hidden"}}>
              <motion.div initial={{width:0}} whileInView={{width:`${sk.level}%`}} viewport={{once:true}} transition={{duration:1.1,delay:i*0.04,ease:"easeOut"}}
                style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${sk.color}88,${sk.color})`}}/>
            </div>
            <div style={{fontSize:"0.62rem",color:t.muted,marginTop:4}}>{sk.level}%</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── PROJECTS ─── */
const Projects = ({t}) => {
  const [active,setActive]=useState(null);
  return (
    <section id="projects" style={{padding:"80px 20px",background:t.bg2}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <Rev>
          <div style={{textAlign:"center",maxWidth:500,margin:"0 auto 46px"}}>
            <SL text="Projects" accent={t.accent}/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.75rem,4vw,2.7rem)",color:t.text,letterSpacing:"-0.02em",marginBottom:8}}>Things I've built</h2>
            <p style={{fontSize:"0.86rem",color:t.muted}}>Click <strong style={{color:t.accent}}>Explore Project</strong> on any card to see full details, features &amp; screenshots.</p>
          </div>
        </Rev>
        <div className="projects-grid">
          {PROJECTS.map((p,i)=>(
            <motion.div key={p.id} initial={{opacity:0,y:34}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.11}}
              style={{borderRadius:20,overflow:"hidden",background:t.card,border:`1px solid ${t.cardB}`,display:"flex",flexDirection:"column",boxShadow:`0 3px 24px ${t.shadow}`,transition:"border-color 0.25s,box-shadow 0.25s,transform 0.25s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${p.color}42`;e.currentTarget.style.boxShadow=`0 18px 48px ${t.shadow},0 0 28px ${p.color}12`;e.currentTarget.style.transform="translateY(-6px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=t.cardB;e.currentTarget.style.boxShadow=`0 3px 24px ${t.shadow}`;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{height:3,background:`linear-gradient(90deg,${p.color},${p.accent})`,flexShrink:0}}/>
              <div style={{padding:"22px 20px",display:"flex",flexDirection:"column",flex:1}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                  <div style={{width:44,height:44,borderRadius:11,background:`${p.color}18`,border:`1px solid ${p.color}30`,display:"flex",alignItems:"center",justifyContent:"center",color:p.color}}><IC.Code/></div>
                  <span style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.1em",color:t.muted}}>{p.num}</span>
                </div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.1rem",color:t.text,marginBottom:3,lineHeight:1.2}}>{p.title}</h3>
                <p style={{fontSize:"0.73rem",color:p.color,fontWeight:600,marginBottom:11}}>{p.subtitle}</p>
                <p style={{fontSize:"0.8rem",color:t.muted,lineHeight:1.7,flex:1,marginBottom:14}}>{p.description}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
                  {p.highlights.map(h=>(
                    <span key={h} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:"0.64rem",fontWeight:700,padding:"3px 8px",borderRadius:40,background:`${p.color}12`,color:p.color,border:`1px solid ${p.color}25`}}>
                      <IC.Star/> {h}
                    </span>
                  ))}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
                  {p.tech.slice(0,4).map(tt=>(
                    <span key={tt} style={{fontSize:"0.66rem",padding:"2px 8px",borderRadius:5,background:t.accentDim,color:t.accent,border:`1px solid ${t.accentB}`}}>{tt}</span>
                  ))}
                  {p.tech.length>4&&<span style={{fontSize:"0.66rem",padding:"2px 8px",borderRadius:5,background:`${p.color}12`,color:p.color,border:`1px solid ${p.color}25`}}>+{p.tech.length-4} more</span>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,borderTop:`1px solid ${t.cardB}`,paddingTop:14}}>
                  <button onClick={()=>setActive(p)}
                    style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px",borderRadius:11,background:`linear-gradient(135deg,${p.color},${p.accent})`,color:"#fff",fontWeight:700,fontSize:"0.8rem",border:"none",cursor:"pointer",boxShadow:`0 4px 18px ${p.color}35`,transition:"transform 0.15s,box-shadow 0.15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.03)";e.currentTarget.style.boxShadow=`0 6px 24px ${p.color}50`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=`0 4px 18px ${p.color}35`;}}>
                    <IC.Eye/> Explore Project
                  </button>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                    <a href={p.live} onClick={e=>e.stopPropagation()}
                      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px",borderRadius:9,background:t.accentDim,color:t.accent,fontWeight:700,fontSize:"0.74rem",textDecoration:"none",border:`1px solid ${t.accentB}`,transition:"transform 0.14s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                      <IC.Link/> Live Demo
                    </a>
                    <a href={p.github} onClick={e=>e.stopPropagation()}
                      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px",borderRadius:9,background:t.card,color:t.text,fontWeight:700,fontSize:"0.74rem",textDecoration:"none",border:`1px solid ${t.cardB}`,transition:"transform 0.14s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                      <IC.Github/> GitHub
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>{active&&<Modal p={active} onClose={()=>setActive(null)} t={t}/>}</AnimatePresence>
    </section>
  );
};

/* ─── MILESTONES ─── */
const Milestones = ({t}) => (
  <section id="milestones" style={{padding:"80px 20px"}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <Rev>
        <div style={{textAlign:"center",maxWidth:480,margin:"0 auto 46px"}}>
          <SL text="Key Milestones" accent={t.accent}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.75rem,4vw,2.7rem)",color:t.text,letterSpacing:"-0.02em",marginBottom:8}}>What I've achieved</h2>
          <p style={{fontSize:"0.86rem",color:t.muted}}>Highlights from 3+ years of production backend development.</p>
        </div>
      </Rev>
      <div className="milestones-grid">
        {ACHIEVEMENTS.map((a,i)=>(
          <motion.div key={a.title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%4)*0.07}}
            whileHover={{y:-4,scale:1.02}}
            style={{padding:"20px 18px",borderRadius:16,background:t.card,border:`1px solid ${t.cardB}`,transition:"border-color 0.2s,box-shadow 0.2s",cursor:"default"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${a.color}40`;e.currentTarget.style.boxShadow=`0 8px 28px ${a.color}12`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=t.cardB;e.currentTarget.style.boxShadow="none";}}>
            <div style={{width:40,height:40,borderRadius:11,background:`${a.color}16`,border:`1px solid ${a.color}28`,display:"flex",alignItems:"center",justifyContent:"center",color:a.color,marginBottom:12}}><a.Icon/></div>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"0.88rem",color:t.text,marginBottom:5,lineHeight:1.3}}>{a.title}</h3>
            <p style={{fontSize:"0.77rem",color:t.muted,lineHeight:1.65}}>{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── CONTACT ─── */
const Contact = ({t}) => {
  const [form,setForm]=useState({name:"",email:"",message:""});
  const [state,setState]=useState("idle");
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const submit=()=>{setState("loading");setTimeout(()=>setState("done"),1500);};
  const iS={width:"100%",padding:"14px 12px 6px",borderRadius:11,border:`1px solid ${t.inputB}`,background:t.inputBg,color:t.text,fontSize:"0.87rem",outline:"none",fontFamily:"inherit",transition:"border-color 0.2s",resize:"none",boxSizing:"border-box"};
  const socials=[
    {Icon:IC.Mail,label:"Email",val:"cyogesh10h@gmail.com",href:"mailto:cyogesh10h@gmail.com",color:"#a78bfa"},
    {Icon:IC.Phone,label:"Phone",val:"+91 62635 59606",href:"tel:+916263559606",color:"#34d399"},
    {Icon:IC.Pin,label:"Location",val:"Dombivli West, Mumbai",href:"#",color:"#f472b6"},
    {Icon:IC.Linkedin,label:"LinkedIn",val:"Connect with me",href:"https://linkedin.com",color:"#60a5fa"},
    {Icon:IC.Github,label:"GitHub",val:"View my repos",href:"https://github.com",color:"#94a3b8"},
    {Icon:IC.Briefcase,label:"Upwork",val:"Hire on Upwork",href:"https://upwork.com",color:"#14a800"},
  ];
  return (
    <section id="contact" style={{padding:"80px 20px",background:t.bg2}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <Rev>
          <div style={{textAlign:"center",maxWidth:480,margin:"0 auto 46px"}}>
            <SL text="Contact" accent={t.accent}/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.75rem,4vw,2.7rem)",color:t.text,letterSpacing:"-0.02em",marginBottom:8}}>Let's build together</h2>
            <p style={{fontSize:"0.86rem",color:t.muted}}>Open to full-time roles, freelance projects, and collaborations.</p>
          </div>
        </Rev>
        <div className="contact-grid">
          <Rev dir="left">
            <div style={{padding:"26px 22px",borderRadius:20,background:t.card,border:`1px solid ${t.cardB}`}}>
              {state==="done"?(
                <motion.div initial={{opacity:0,scale:0.86}} animate={{opacity:1,scale:1}} style={{textAlign:"center",padding:"28px 0"}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(52,211,153,0.14)",border:"1px solid rgba(52,211,153,0.28)",display:"flex",alignItems:"center",justifyContent:"center",color:"#34d399",margin:"0 auto 14px"}}><IC.Check/></div>
                  <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.1rem",color:t.text,marginBottom:5}}>Message Sent!</h3>
                  <p style={{color:t.muted,fontSize:"0.83rem"}}>I'll get back to you shortly.</p>
                </motion.div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[{k:"name",label:"Your Name",type:"text"},{k:"email",label:"Email Address",type:"email"}].map(({k,label,type})=>(
                    <div key={k} style={{position:"relative"}}>
                      <label style={{position:"absolute",top:5,left:12,fontSize:"0.59rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.muted}}>{label}</label>
                      <input type={type} value={form[k]} onChange={set(k)} style={iS}
                        onFocus={e=>e.target.style.borderColor=t.accent}
                        onBlur={e=>e.target.style.borderColor=t.inputB}/>
                    </div>
                  ))}
                  <div style={{position:"relative"}}>
                    <label style={{position:"absolute",top:5,left:12,fontSize:"0.59rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.muted}}>Message</label>
                    <textarea rows={4} value={form.message} onChange={set("message")} style={iS}
                      onFocus={e=>e.target.style.borderColor=t.accent}
                      onBlur={e=>e.target.style.borderColor=t.inputB}/>
                  </div>
                  <motion.button onClick={submit} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                    style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"13px",borderRadius:12,background:state==="loading"?"rgba(124,58,237,0.45)":t.btnGrad,color:"#fff",fontWeight:700,fontSize:"0.84rem",border:"none",cursor:"pointer",boxShadow:"0 0 22px rgba(124,58,237,0.26)"}}>
                    <IC.Send/> {state==="loading"?"Sending…":"Send Message"}
                  </motion.button>
                </div>
              )}
            </div>
          </Rev>
          <Rev dir="right" delay={0.1}>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {socials.map((s,i)=>(
                <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.07}}
                  whileHover={{x:4}}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:13,background:t.card,border:`1px solid ${t.cardB}`,textDecoration:"none",transition:"border-color 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=`${s.color}38`}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=t.cardB}>
                  <div style={{width:38,height:38,borderRadius:10,background:`${s.color}14`,border:`1px solid ${s.color}22`,display:"flex",alignItems:"center",justifyContent:"center",color:s.color,flexShrink:0}}><s.Icon/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"0.64rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:s.color}}>{s.label}</div>
                    <div style={{fontSize:"0.8rem",fontWeight:500,color:t.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.val}</div>
                  </div>
                  <span style={{color:t.sub,flexShrink:0}}><IC.Chevron/></span>
                </motion.a>
              ))}
            </div>
          </Rev>
        </div>
      </div>
    </section>
  );
};

/* ─── FOOTER ─── */
const Footer = ({t}) => (
  <footer style={{padding:"22px 20px",borderTop:`1px solid ${t.cardB}`}}>
    <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:"0.76rem",fontWeight:600,color:t.sub}}>© 2026 Yogesh Kumar Chaturvedi</span>
      <span style={{fontSize:"0.76rem",color:t.sub}}>Built with ❤️ · Open to opportunities ✨</span>
    </div>
  </footer>
);

/* ─── ROOT — light mode default ─── */
export default function App() {
  const [dark,setDark]=useState(()=>{
    try{return localStorage.getItem("ykc-theme")==="dark";}
    catch{return false;}
  });
  const toggle=()=>setDark(d=>{
    const n=!d;
    try{localStorage.setItem("ykc-theme",n?"dark":"light");}catch{}
    return n;
  });
  const t=theme(dark);

  return (
    <div style={{minHeight:"100vh",background:t.bg,color:t.text,transition:"background 0.4s ease,color 0.3s ease",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600&family=Epilogue:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'Epilogue',sans-serif;overflow-x:hidden;}

        /* ── GRADIENT NAME FIX: CSS class, not inline style ──
           Using background-clip approach BUT as a <style> block
           so it applies at CSS level and works on all mobile browsers */
        .hero-name-top {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-size: clamp(2.4rem, 9vw, 5rem);
          color: ${t.text};
          display: block;
          word-break: break-word;
        }
        .hero-name-bottom {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-size: clamp(2.4rem, 9vw, 5rem);
          display: block;
          word-break: break-word;
          background: ${dark
            ? "linear-gradient(135deg,#a78bfa,#60a5fa)"
            : "linear-gradient(135deg,#6d28d9,#2563eb)"};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          /* Fallback for browsers that don't support text fill */
          color: ${dark ? "#a78bfa" : "#6d28d9"};
          padding-bottom: 4px;
        }

        /* Cursor desktop only */
        .cursor-dot { display: none; }
        @media (min-width: 768px) { .cursor-dot { display: block; } }

        /* Nav */
        .nav-links { display: flex !important; }
        .nav-hire  { display: inline-flex !important; }
        .nav-ham   { display: none !important; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-hire  { display: none !important; }
          .nav-ham   { display: flex !important; }
        }

        /* About */
        .about-grid { display: grid; grid-template-columns: 1fr; gap: 40px; }
        @media (min-width: 768px) {
          .about-grid { grid-template-columns: 300px 1fr; gap: 56px; align-items: start; }
        }

        /* Skills */
        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 480px)  { .skills-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px)  { .skills-grid { grid-template-columns: repeat(4, 1fr); } }

        /* Projects */
        .projects-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 600px)  { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1000px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }

        /* Milestones */
        .milestones-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 480px)  { .milestones-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px)  { .milestones-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1100px) { .milestones-grid { grid-template-columns: repeat(4, 1fr); } }

        /* Contact */
        .contact-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 768px) { .contact-grid { grid-template-columns: 1fr 1fr; gap: 24px; } }

        /* Modal features */
        .feat-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
        @media (min-width: 540px) { .feat-grid { grid-template-columns: 1fr 1fr; } }

        a, button { cursor: pointer; }
      `}</style>

      <Cursor accent={t.accent}/>
      <Nav t={t} dark={dark} toggle={toggle}/>
      <Hero t={t} dark={dark}/>
      <About t={t}/>
      <Skills t={t}/>
      <Projects t={t}/>
      <Milestones t={t}/>
      <Contact t={t}/>
      <Footer t={t}/>
    </div>
  );
}
