# Needs Connect – One-Page Overview

**Live Demo:** https://vnoormal7.github.io/NeedsConnectV2/

**Roles:**
- `admin` username → Manager view (needs creation, analytics)
- Any other username → Helper view (funding + volunteering)

---

## Problem & Vision
- Charities juggle urgent requests without objective prioritization.
- Donors and volunteers lack transparency on where support matters most.
- Needs Connect delivers a unified workspace that triages needs, tracks funding progress, and coordinates volunteers in real time.

## Core Modules
1. **Needs Intelligence**
   - Priority formula: `(urgency × 100) + ((7 - daysOld) × 10) + (interestedHelpers × 5)`
   - Premium cards with funding progress, helper interest, detailed metadata
   - Basket workflow to curate missions before funding

2. **Impact Dashboard**
   - Recharts visualizations (Funded vs Target, Needs distribution)
   - Live metrics: total funded, completion rate, category breakdowns

3. **Admin Command Center**
   - Create/edit/delete needs with glassmorphism modal forms
   - Real-time stats: total funded, total target, completed missions
   - Category analytics charts for portfolio balance

4. **Volunteer Orchestration**
   - Post tasks with capacity, date, location
   - Register volunteers with contact and skills
   - Helpers sign up; system tracks capacity and status (open/full/registered)

## Sample Dataset
- 10 preloaded needs across Food, Education, Shelter, Health
- Total target value: **$30,500**
- Example: Emergency Meals (Urgency 5, target $5,000, 3 days old)

## Technical Snapshot
- **Frontend:** React 18 + Vite SPA
- **Styling:** Tailwind CSS with custom glassmorphism theme, Inter font
- **Icons:** Lucide React (HeartHandshake, Sparkles, Users, etc.)
- **Analytics:** Recharts for funding and category charts
- **Persistence:** LocalStorage (needs, tasks, volunteers, current user)
- **Deployment:** GitHub Actions → GitHub Pages (auto-build on push)

## Differentiators
- Intelligent priority algorithm surfaces the most urgent, high-impact needs
- End-to-end workflow: needs + funding + volunteering in one interface
- Production-ready UI without third-party component kits
- Instant deployments; shareable public demo for judges and stakeholders

## Future Roadmap
- Payment gateway integration for direct funding
- Notification system (email/SMS) for updates
- Multi-language and accessibility enhancements
- Social impact sharing and reporting exports

---

**Tagline:** "Empower communities by connecting needs with the people ready to act."
