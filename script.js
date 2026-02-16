/* ========================================
   Sumit Mishra Portfolio — Script
   ======================================== */

import { supabase } from './supabaseClient.js';

/* ---------- Project Data ---------- */
const projects = {
    1: {
        title: "AI Lead Generation Agent",
        category: "AGENTIC WORKFLOW",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
        tags: ["n8n", "OPENAI", "APOLLO API", "CLAY"],
        problem: "Manual lead sourcing and qualification took the sales team 20+ hours/week with low conversion rates.",
        solution: "Built a multi-agent system on n8n that scrapes detailed prospect data, scores leads based on ICP fit using GPT-4o, and syncs high-intent leads to HubSpot.",
        process: [
            "Connected Apollo API to fetch raw lead lists",
            "Used Firecrawl to scrape prospect websites for live context",
            "Implemented GPT-4o agent to score leads (0-100) based on verified signals",
            "Automated personalized email drafting and CRM syncing"
        ],
        link: "#"
    },
    2: {
        title: "SaaS Starter Kit",
        category: "SAAS PRODUCT",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        tags: ["NEXT.JS", "SUPABASE", "STRIPE", "TAILWIND"],
        problem: "Setting up auth, payments, and database schema repeatedly wastes weeks of dev time for every new MVP.",
        solution: "Created a comprehensive starter kit with pre-configured auth, Stripe subscriptions, and a vector database setup for AI apps.",
        process: [
            "Integrated Supabase Auth with Google/GitHub social login",
            "Set up Stripe Webhooks for handling subscription tiers",
            "Built a reusable 'Credit System' logic for usage-based AI billing",
            "Optimized edge functions for 100ms response times"
        ],
        link: "#"
    },
    3: {
        title: "Autonomous Research Agent",
        category: "AI TOOL",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
        tags: ["PLASMO", "REACT", "ANTHROPIC", "NOTION API"],
        problem: "Researchers spend hours reading fluff to find key insights and manually verifying sources.",
        solution: "An AI-powered sidebar that scans the current page, extracts specific data points based on user natural language queries, and citation-backs every claim.",
        process: [
            "Built remote DOM scraper to extract readable text",
            "Engineered prompts for Claude 3.5 Sonnet to extract dense facts",
            "Created a 'Citation Engine' that links claims back to source paragraphs",
            "Syncs structured findings directly to Notion databases"
        ],
        link: "#"
    },
    4: {
        title: "Finance Dashboard Automations",
        category: "BUSINESS OPS",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
        tags: ["MAKE.COM", "AIRTABLE", "SOFTR", "QUICKBOOKS"],
        problem: "Finance teams were manually exporting CSVS twice a week to update internal dashboards.",
        solution: "Real-time sync pipeline that watches for new invoices, categorizes expenses using AI, and updates a Softr client portal instantly.",
        process: [
            "Set up Make.com webhooks to listen for QuickBooks events",
            "Used GPT-4-mini to auto-categorize vague expense descriptions",
            "Structured data in Airtable for easy filtering",
            "Built a frontend in Softr for read-only access by stakeholders"
        ],
        link: "#"
    }
};

/* ---------- DOM Elements ---------- */
const navbar = document.getElementById('navbar');
const navHamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

const contactModal = document.getElementById('contactModal');
const openContactBtn = document.getElementById('openContactModal');
const closeContactBtn = document.getElementById('closeContactModal');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const projectModal = document.getElementById('projectModal');
const closeProjectBtn = document.getElementById('closeProjectModal');
const projectCards = document.querySelectorAll('.project-card');

/* ---------- Navbar Shadow on Scroll ---------- */
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---------- Mobile Menu ---------- */
function openMobile() { mobileMenu.classList.add('open'); }
function closeMobile() { mobileMenu.classList.remove('open'); }

navHamburger.addEventListener('click', openMobile);
mobileMenuClose.addEventListener('click', closeMobile);
mobileLinks.forEach(link => link.addEventListener('click', closeMobile));

/* ---------- Modal Helpers ---------- */
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* Close modals on ESC */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(contactModal);
        closeModal(projectModal);
    }
});

/* Close modals on overlay click */
[contactModal, projectModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
});

/* ---------- Contact Modal ---------- */
openContactBtn.addEventListener('click', () => openModal(contactModal));
closeContactBtn.addEventListener('click', () => closeModal(contactModal));

// Also open contact modal from "Book a call" buttons
document.querySelectorAll('a[href="#contact"]').forEach(link => {
    // Only intercept the CTA buttons, not the nav scroll links
});

/* ---------- Contact Form ---------- */
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('formName');
    const email = document.getElementById('formEmail');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('formSubmit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    name.classList.remove('error');
    email.classList.remove('error');

    let valid = true;

    if (!name.value.trim()) {
        nameError.textContent = 'Name is required';
        name.classList.add('error');
        valid = false;
    }

    if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        email.classList.add('error');
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.textContent = 'Enter a valid email';
        email.classList.add('error');
        valid = false;
    }

    if (!valid) return;

    // Show loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Insert into Supabase
        if (!supabase) {
            throw new Error('Supabase client is not initialized. Check your environment variables.');
        }

        const { error } = await supabase
            .from('contacts')
            .insert([
                {
                    name: data.name,
                    email: data.email,
                    project_type: data.project_type,
                    budget: data.budget,
                    message: data.message
                }
            ]);

        if (error) throw error;

        // Success
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';

    } catch (err) {
        console.error('Submission error:', err);
        btnText.style.display = '';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        alert(`Error: ${err.message || 'Unknown error occurred'}`);
    }
});

/* ---------- Project Modal ---------- */
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const id = card.getAttribute('data-project');
        const project = projects[id];
        if (!project) return;

        document.getElementById('projectModalTitle').textContent = project.title;
        document.getElementById('projectModalCategory').textContent = project.category;
        document.getElementById('projectModalLink').href = project.link;

        // New Fields
        document.getElementById('projectModalProblem').textContent = project.problem;
        document.getElementById('projectModalSolution').textContent = project.solution;

        // Process List
        const processList = document.getElementById('projectModalProcess');
        processList.innerHTML = project.process.map(step => `<li>${step}</li>`).join('');

        // Image (Background + Overlay)
        const imgEl = document.getElementById('projectModalImage');
        imgEl.style.backgroundImage = `url('${project.image}')`;
        imgEl.style.height = '250px';
        imgEl.style.width = '100%';
        imgEl.style.backgroundSize = 'cover';
        imgEl.style.backgroundPosition = 'center';
        imgEl.style.marginBottom = '20px';
        imgEl.style.borderRadius = 'var(--radius-md)';

        // Tags
        const tagsEl = document.getElementById('projectModalTags');
        tagsEl.innerHTML = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

        openModal(projectModal);
    });
});

closeProjectBtn.addEventListener('click', () => closeModal(projectModal));

/* ---------- Scroll Animations (Intersection Observer) ---------- */
const animatedElements = document.querySelectorAll('.animate-in');

const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
};

let delay = 0;
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Stagger based on siblings
            const siblings = entry.target.parentElement.querySelectorAll('.animate-in');
            const index = Array.from(siblings).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.08}s`;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

/* ---------- Stat Number Counter Animation ---------- */
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 1600;
            const start = performance.now();
            const animate = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(animate);
                else el.textContent = target;
            };
            requestAnimationFrame(animate);
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

/* ---------- Smooth Scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


