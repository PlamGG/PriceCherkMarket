---
name: Clean Wholesale Theme
description: A high-density, professional B2B design system optimized for fast scanning, tabular data, and trustworthiness.
colors:
  primary: "#16a34a"
  background: "#ffffff"
  text: "#111827"
typography:
  heading: "system-ui"
  body: "system-ui"
rounded:
  small: "4px"
  medium: "8px"
  large: "12px"
spacing:
  comfortable: "16px"
  dense: "8px"
components:
  button: true
  input: true
  card: true
---

## Overview

**Creative North Star: "High-density data meets professional clarity."**

The Clean Wholesale Theme is built for B2B buyers who need to scan hundreds of prices quickly. It sheds the playful, dark "night market" aesthetic in favor of a crisp, daylight-white environment. Information density is high, layout is strict, and visual noise is reduced to the absolute minimum. 

**Key Characteristics:**
- **Data Density:** Tight padding and compact structures that maximize viewport usage.
- **Precision:** Tabular numerals and strict alignment for all financial and metric data.
- **Professional Trust:** Clean white backgrounds, crisp gray borders, and minimal use of color reserved only for state or action.

## Colors

Color is treated as a scarce resource, used exclusively for data status (up/down) and primary actions.

### Primary
- **Market Green** (Tailwind `green-600`): Used for primary buttons, active states, and positive price trends.

### Secondary
- **Energetic Yellow** (Tailwind `yellow-400`): Used exclusively for the Watchlist star to command immediate micro-attention.
- **Alert Red** (Tailwind `red-600`): Used for negative price trends.

### Neutral
- **Clean White** (Tailwind `white`): The structural background of cards and containers.
- **Canvas Gray** (Tailwind `gray-50`): The page background and zebra-stripe row color.
- **Ink Black** (Tailwind `gray-900`): Primary text color for maximum contrast.

## Typography

**The Numeral Precision Rule.** All prices and metrics must use tabular numerals (`tabular-nums`) to ensure vertical alignment of digits across lists and tables.

- **Display**: system-ui, bold (text-3xl/4xl)
- **Body**: system-ui, regular (text-sm/base)
- **Data**: system-ui, bold, tabular-nums (text-base/lg)

## Layout

**The Wholesale Density Rule.** List items and table rows should use minimal vertical padding (`py-2` or `py-3` max) to allow scanning of 20+ items at a glance without scrolling.

- **Containers**: Max-width constraints (`max-w-7xl`) for readability on ultrawide monitors.
- **Data Tables**: Utilize zebra striping (`even:bg-gray-50`) to maintain tracking across wide rows.

## Elevation & Depth

**The Flat Data Rule.** Avoid structural shadows. Separation is achieved through 1px gray borders (`border-gray-200`) and slight background variations. Soft shadows (`shadow-sm`) are reserved only for floating elements like the Mega Menu or hover states.

## Shapes

- **Cards & Containers**: `rounded-xl` (12px) for outer containers to soften the B2B edge.
- **Tags & Inputs**: `rounded-md` or `rounded-lg` (6px - 8px) for interactive elements.

## Components

### High-Density Data Table
- **Structure**: Explicit columns for Before, Current, and Diff.
- **Styling**: `border-b border-gray-100`, hover states on rows (`hover:bg-green-50/40`), and right-aligned numeric data.

### Compact Product Card
- **Structure**: Image on top (aspect-square/short), details below.
- **Typography**: 2-line truncated title, inline category, bold price at the bottom right.

## Do's and Don'ts

- **Do** align all prices to the right in lists and tables.
- **Do** use simple, professional SVG icons (1.5px or 2px stroke).
- **Don't** use emojis as category markers or fallbacks.
- **Don't** use kickers (small colored labels) directly above primary `H1` headings. Let the heading breathe.
