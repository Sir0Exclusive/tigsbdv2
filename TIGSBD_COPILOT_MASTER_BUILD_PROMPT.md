TIGSBD + SARONGO — COPILOT MASTER BUILD PROMPT

Clean-Slate Rebuild | Vercel + Turso | Local-First Development

You are building a NEW production-ready e-commerce platform called TIGSBD.

IMPORTANT:
This is a clean-slate rebuild.
Do NOT repair, refactor, or copy the old TIGSBD codebase.
Do NOT import its legacy migrations, controllers, routes, database tables, or broken behavior.
The old reconstruction document is reference material only.

The target is ONE shared e-commerce platform containing TWO independent Amazon-like storefronts:

TIGSBD

Sarongo

They have completely separate catalogs, but share the customer shopping/commerce infrastructure.

============================================================

AUTHORITATIVE BUSINESS ARCHITECTURE
============================================================

TWO STORES:

TIGSBD:

Independent catalog

Independent categories

Independent product media

Independent inventory

Independent merchandising

Independent store settings

Independent branding where applicable

SARONGO:

Independent catalog

Independent categories

Independent product media

Independent inventory

Independent merchandising

Independent store settings

Independent branding

A product belongs to exactly ONE store.

Do NOT build a shared product catalog.

SHARED PLATFORM SERVICES:

One customer identity/account

One authentication system

One address book

One shared cart

One shared checkout

One shared order system

One unified admin order center

Shared payment abstraction

Shared shipping framework

Shared customer support/order history

Shared analytics infrastructure

Shared marketing attribution infrastructure

The key principle is:

TWO STORES + TWO CATALOGS + ONE CUSTOMER + ONE CART + ONE CHECKOUT + ONE ORDER CENTER.

Production:

Host on Vercel.

The user already owns a domain.

Build the application so the domain can be connected later.

Do not invent or modify DNS credentials.

Keep production secrets in environment variables.

Database:

Use Turso/libSQL for the current database plan.

Design database access cleanly so future database/storage migration is possible.

Do not hardcode database credentials.

Images/media:

The current plan is to keep product/image data in the Turso-backed system for now.

Build a clean MediaService/repository abstraction so media storage can later move to object storage/CDN without rewriting the catalog.

LOCAL-FIRST DEVELOPMENT IS REQUIRED.

The application MUST remain runnable locally throughout development.

After every major phase:

Start the local development server.

Run relevant tests/build checks.

Verify important routes.

If browser tooling is available, visually inspect the running application.

Report exactly what was verified.

Stop and wait for user approval before beginning the next major phase when the user wants staged review.

Never build the entire platform blindly and only test at the end.

Recommended development loop:

BUILD
→ RUN LOCALLY
→ TEST
→ VISUAL CHECK
→ USER REVIEW
→ FIX
→ APPROVE
→ NEXT PHASE

Use a modern Vercel-friendly architecture.

Preferred direction:

Next.js App Router

TypeScript

Tailwind CSS

React

Turso/libSQL

Drizzle ORM or another Vercel/Turso-compatible typed ORM

Zod for validation

Secure server-side authentication/session architecture

Server actions/API routes where appropriate

Do not introduce unnecessary technologies.

Before adding a dependency:

Check whether the requirement can be solved with existing framework capabilities.

Prefer small, stable dependencies.

Avoid packages that create deployment complexity.

Use a clear separation between:

UI

domain/business logic

database/repositories

integrations

authentication/authorization

analytics

marketing

media

Use a maintainable structure similar in concept to:

app/
(storefront)/
...
sarongo/
...
account/
...
cart/
checkout/
orders/
admin/
api/

components/
ui/
storefront/
cart/
checkout/
account/
admin/

lib/
auth/
db/
stores/
catalog/
cart/
checkout/
orders/
payments/
shipping/
inventory/
reviews/
wishlist/
promotions/
analytics/
marketing/
media/
email/

drizzle/
schema/
migrations/

tests/

Do not blindly copy this exact structure if a better Next.js architecture is justified.
Keep responsibilities clear.

Create an explicit stores table/entity.

Example conceptual fields:

stores

id

key

name

slug

description

logo

status

settings

created_at

updated_at

Initial stores:

tigsbd
sarongo

Store IDs must be referenced by store-owned entities.

Never determine store ownership only from a URL.

URL/store context is a UI concern.
Database store_id is the security/business boundary.

Use ONE clean database schema.

Do NOT create:
products
sarongo_products

Instead:

stores
products

products:

id

store_id

sku

name

slug

description

short_description

price

discount_price

status

stock

low_stock_threshold

brand_id if used

category_id

featured

SEO fields

timestamps

Categories must also be store-aware.

Every relevant store-owned entity must have store context.

Examples:

products

categories

product media

inventory

reviews

wishlists

coupons/promotions where store-restricted

banners

store settings

store admin assignments

Database constraints and application validation must prevent cross-store contamination.

One user table/entity.

One login works for both stores.

Support:

Registration

Login

Logout

Password reset

Email verification if enabled

OAuth if enabled

Profile

Phone

Address book

Security settings

Browsing should not require login.

Cart should not require login.

Guest checkout should be supported if business configuration permits.

DO NOT reproduce the old random-password guest-account behavior.

If an order needs to be associated with a later account, implement a secure claim/verification flow.

There is ONE cart system.

A cart can contain products from both stores.

Example:

Cart:
TIGSBD

Product A

Product B

SARONGO

Product C

Product D

The cart UI must group items by store.

Support:

Guest cart

Logged-in cart

Persistent cart

Guest-to-account merge

Quantity changes

Remove item

Stock validation

Price refresh

Availability validation

Do not require authentication merely to add/remove cart items.

Server-side validation is mandatory.

There is ONE checkout.

Customer enters checkout information once.

Support:

Contact information

Phone

Shipping address

Saved addresses

Delivery method

Payment method

Coupon/promotion

Order notes if enabled

Final order review

A mixed TIGSBD + Sarongo cart must be able to complete one checkout.

The system may internally create multiple shipments/fulfillment groups when necessary, but the customer should not be forced through separate checkouts.

Use ONE orders table/entity.

Use ONE order_items table/entity.

Each order item must have store_id.

Example:

ORDER #10045

TIGSBD:

Earbuds

USB Cable

SARONGO:

Watch

Wallet

The customer sees one order.

Admin sees one order with clear store grouping.

An order may be:

TIGSBD-only

Sarongo-only

Mixed

Do not create separate TIGSBD orders and Sarongo orders unless a future business requirement explicitly requires order splitting.

If fulfillment must split, use shipment/fulfillment entities.

Create ONE order-management interface.

Admin can:

View all orders

Search

Filter by store

Filter by mixed/all

Filter by customer

Filter by date

Filter by status

Filter by payment status

Filter by fulfillment

Open order details

Update status

Process returns

Process refunds where supported

Export

Every order item must visibly show its store.

Example:

ORDER #10045
Mixed Store Order

TIGSBD
Earbuds x1
Cable x2

Sarongo
Watch x1

Store filter:

All

TIGSBD

Sarongo

Mixed

Implement role-based authorization.

Suggested roles:

Super Admin
Platform Admin
TIGSBD Manager
Sarongo Manager
Order Manager
Customer Support
Inventory Manager
Marketing Manager
Finance Manager
Content Manager

Do not assume every admin can see every store.

Store assignments must be explicit.

Examples:

TIGSBD manager can manage TIGSBD catalog.

Sarongo manager can manage Sarongo catalog.

Shared order access can be granted through explicit permissions.

Super Admin can access everything.

Authorization MUST be enforced server-side.

Do not rely on hiding buttons in the UI.

Both stores need complete Amazon-like catalog functionality.

Support:

Product CRUD

Categories

Product images

Gallery ordering

Product variants

Attributes

Specifications

Brand

SKU

Pricing

Sale pricing

Inventory

Featured

Product status

SEO

Related products

Search metadata

Do not over-engineer variants until they are actually needed, but the schema should not make future variants impossible.

Storefront search must be store-aware.

TIGSBD search searches TIGSBD catalog.

Sarongo search searches Sarongo catalog.

Support:

Name

Description

SKU

Category

Brand

Price

Availability

Attributes

Discount

Rating

Sort

Preserve the useful old behavior:

Exact match priority

Prefix match

Contains match

Typo/fuzzy tolerance where practical

Do not build a complex external search cluster unless scale requires it.

Inventory belongs to products and therefore to stores.

Support:

Available stock

Reserved stock where needed

Low-stock threshold

Out of stock

Inventory adjustments

Inventory history

Reservation

Release

Deduction

Restock

Use database transactions/atomic operations to avoid overselling.

Checkout must revalidate stock server-side.

Start with COD if that is the currently required live method.

Build a payment abstraction so future gateways can be added.

Potential adapters:

COD

SSLCommerz

Stripe

PayPal

Payment credentials must be environment variables.

Payment states:

pending

authorized

paid

failed

cancelled

refunded

partially_refunded

Webhook/callback handling must be secure and idempotent.

Create a configurable shipping layer.

Legacy reference:

Inside Dhaka: BDT 60

Outside Dhaka: BDT 120

Do not hardcode these values throughout the code.

Support future:

Store-specific shipping rules

Destination rules

Shipping methods

Multiple shipments

Carrier

Tracking number

Fulfillment status

Delivery estimate

One checkout can produce multiple shipments.

Both stores support reviews.

Support:

1–5 rating

Title

Comment

Verified purchase

Helpful/unhelpful

Moderation

Report

Store-aware reporting

Verified purchase must be based on qualifying order data.

Both stores support wishlist.

One account.

Store-aware wishlist items.

UI can provide:

All

TIGSBD

Sarongo

Optional guest wishlist may use local browser storage and merge after login.

Build real promotion support.

Support:

Percentage

Fixed amount

Start/end date

Usage limits

Per-customer limits

Minimum order

Store restriction

Product restriction

Category restriction

First-order promotion

Coupon scope:

TIGSBD

Sarongo

Platform-wide

Mixed-store behavior must be explicit.

Never apply a store-specific coupon to another store silently.

One account across both stores.

Sections:

Profile

Addresses

Orders

Returns

Wishlist

Reviews

Notifications

Loyalty

Security

Order history clearly labels:

TIGSBD

Sarongo

Mixed

Marketing analytics is a CORE requirement.

Prepare for:

Google Analytics 4

Google Tag Manager

Google Ads

Google Search Console

Google Merchant Center

Meta Pixel

Meta Conversions API

Facebook/Instagram campaign attribution

Do NOT hardcode measurement IDs.

Use environment variables/configuration.

Create a centralized analytics event layer.

Do not scatter raw tracking calls throughout every component.

Minimum events:

page_view
view_item
search
add_to_cart
remove_from_cart
view_cart
begin_checkout
add_shipping_info
add_payment_info
purchase
refund
sign_up
login
add_to_wishlist
coupon_use

Each relevant event should include:

event name

timestamp

store

session identifier where appropriate

customer identifier where appropriate

product/item data

order ID where appropriate

currency

value

campaign attribution where available

For mixed orders, preserve item-level store attribution.

Capture:

utm_source
utm_medium
utm_campaign
utm_term
utm_content

Also support applicable:

Google Ads identifiers

Meta click identifiers

Referrer

Landing page

First-touch attribution

Last-touch attribution

Attribution should survive normal navigation between TIGSBD and Sarongo during the same session.

Prepare for:

Meta Pixel
Meta Conversions API

Track relevant commerce events.

Server-side events should be deduplicated with browser events where both are used.

Never expose Meta server secrets in frontend code.

Prepare for:

GA4
GTM
Google Ads conversions
Search Console
Merchant Center

Create product feed architecture suitable for both stores.

Product/store identifiers must remain unambiguous.

Each store needs independent SEO.

Support:

Product metadata

Category metadata

Store metadata

Canonicals

Open Graph

Structured data

Product schema

Breadcrumbs

Organization/store schema

XML sitemap

robots.txt

Avoid duplicate canonical problems between stores.

Preserve TIGSBD's established visual identity.

Core visual language:

Dark slate/near-black navigation

Amber/gold brand treatment

Gold gradient logo

White product cards

Soft borders

Rounded corners

Pronounced shadows

Premium modern e-commerce aesthetic

Known reference colors:
#fbbf24
#f59e0b
#d97706
#94a3b8
slate-900
slate-950

Typography reference:

Montserrat 800/900 for logo

Poppins 800/900 for sub-labels

Do NOT turn the new platform into a generic Tailwind starter template.

Sarongo should retain its distinct identity while fitting the platform.

Mobile is first-class.

Must support:

Mobile navigation

Sarongo access

Slide-in menu

Touch-friendly controls

Responsive product grids

Category rails where appropriate

Responsive cart

Responsive checkout

Responsive account

Responsive admin where practical

No horizontal overflow

Optimize for a fast storefront.

Use:

Server rendering where useful

Efficient queries

Proper indexes

Pagination

Image optimization

Lazy loading

Caching

Minimal client JavaScript

Avoid unnecessary network requests

Do not sacrifice functionality for superficial performance scores, but aim for excellent real-world UX.

Implement:

Secure authentication

Authorization

CSRF protection where applicable

Input validation

Output escaping

Rate limiting

Secure file/media handling

Password hashing

Secure sessions

Webhook verification

Audit logging

Environment secrets

Critical rule:

A user/admin must never be able to bypass store isolation by manually changing a URL, ID, API parameter, or request payload.

For now, keep image/media data in the Turso-backed setup as planned.

Create a media abstraction:

MediaService
MediaRepository

So later we can move to:

Vercel-compatible object storage

CDN

another object store

without changing product/business logic.

Validate uploads:

MIME

extension

size

dimensions where appropriate

Preserve the useful QR order tracking concept.

QR should point to a secure order tracking URL.

Do not expose sensitive customer information.

Use secure tokens.

Prepare for store-aware email/notification templates.

Examples:

Order confirmation

Payment confirmation

Shipping

Delivery

Cancellation

Refund

Password reset

Verification

Restock

TIGSBD emails should use TIGSBD branding.
Sarongo emails should use Sarongo branding.
Mixed orders should clearly identify both stores.

AI is OPTIONAL and must never be required for core commerce.

Potential future uses:

Recommendations

Similar products

Search assistance

Merchandising insights

Sales analysis

Anomaly detection

If AI fails, checkout/orders must continue working.

The old TIGSBD reconstruction source may be consulted only for confirmed business/design requirements.

Do NOT:

Copy old controllers

Copy old migrations

Copy old route files

Copy old database structure

Copy old bugs

Copy old guest-account behavior

Copy old static-export architecture

Reproduce known inconsistencies

Known legacy limitations include:

Store A-only transactional system

Incomplete Sarongo commerce

Missing store discriminators

Inconsistent cart authentication

Disabled coupon flow

Static export not reliably bound to live data

These are reasons for the rebuild, not requirements.

BUILD ONLY ONE MAJOR PHASE AT A TIME.

PHASE 0 — Project bootstrap

New Next.js project

TypeScript

Tailwind

Turso connection

ORM/schema setup

Environment variables

Base lint/typecheck/test setup

Base application shell

LOCAL CHECK:

Run locally

Confirm home page loads

Confirm database connection

Confirm build/typecheck

PHASE 1 — Store foundation

stores

TIGSBD

Sarongo

Store-aware layouts/navigation

Store switching

Design system

LOCAL CHECK:

TIGSBD storefront shell

Sarongo storefront shell

Desktop

Mobile

PHASE 2 — Authentication

User model

Registration

Login

Logout

Password/security flow

Account foundation

LOCAL CHECK:

Guest browsing

Register

Login

Logout

PHASE 3 — Catalog

Products

Categories

Product media

Product detail

Search

Filters

Admin catalog CRUD

LOCAL CHECK:

TIGSBD product flow

Sarongo product flow

Store isolation

PHASE 4 — Shared cart

Guest cart

Account cart

Persistence

Merge

Mixed-store cart

LOCAL CHECK:

Add TIGSBD item

Switch Sarongo

Add Sarongo item

View shared cart

Update/remove

PHASE 5 — Checkout

Address

Shipping

Payment abstraction

COD

Coupon framework

Mixed-store checkout

LOCAL CHECK:

Complete test checkout

Mixed-store checkout

PHASE 6 — Orders

Orders

Items

Status history

Shipments

QR tracking

Customer order history

Unified admin order center

LOCAL CHECK:

Create mixed order

Admin views order

Store labels correct

Status changes

PHASE 7 — Customer commerce

Wishlist

Reviews

Returns

Notifications

Loyalty

Restock

LOCAL CHECK:

Customer features

Store isolation

PHASE 8 — Admin platform

Dashboard

Inventory

Customers

Products

Orders

Payments

Shipping

Returns/refunds

Promotions

Roles/permissions

Activity logs

LOCAL CHECK:

Test every role

Test unauthorized store access

PHASE 9 — Marketing

Analytics abstraction

GA4

GTM

Google Ads

Meta Pixel

Meta CAPI

UTM attribution

Merchant feeds

LOCAL CHECK:

Verify event payloads

Verify store attribution

Verify mixed-order item attribution

PHASE 10 — SEO/performance

Metadata

Structured data

Sitemap

Robots

Image optimization

Caching

Query optimization

LOCAL CHECK:

Inspect SEO output

Mobile performance

Desktop performance

PHASE 11 — Production readiness

Security review

Database migration

Environment configuration

Vercel build

Production smoke test

Domain connection preparation

Backup/monitoring plan

After every major phase, provide:

What was built.

Local URL(s).

Commands used to run it.

Tests/typecheck/build result.

What was visually verified.

Known limitations.

What needs user approval before continuing.

If browser automation/verification tooling is available, use it for visual checks.

Do not claim something is visually verified unless it was actually checked.

Mandatory tests include:

Authentication

Authorization

Store isolation

Product CRUD

Category CRUD

Cart

Guest cart

Account cart

Cart merge

Mixed cart

Checkout

Mixed checkout

Inventory concurrency

Payment states

Orders

Mixed orders

Shipments

Reviews

Wishlist

Coupons

Admin permissions

Analytics events

Marketing attribution

MANDATORY END-TO-END SCENARIO:

Open TIGSBD.

Add a TIGSBD product.

Navigate to Sarongo.

Add a Sarongo product.

Open shared cart.

Verify both stores appear.

Checkout once.

Submit one order.

Verify one mixed order exists.

Open admin order center.

Verify both store items are correctly labeled.

Filter TIGSBD.

Filter Sarongo.

Verify permissions.

Verify analytics events contain correct store attribution.

Prefer:

Type-safe domain models

Small reusable services

Clear server/client boundaries

Validation schemas

Database constraints

Transactions

Explicit error handling

Useful comments only where necessary

Avoid:

Giant components

Giant controllers/actions

Repeated business logic

Hardcoded store IDs everywhere

Hardcoded marketing IDs

Secrets in source

Any bypass around authorization

Unnecessary abstractions

Maintain:

README.md
ARCHITECTURE.md
DATABASE.md
ENVIRONMENT.md
DEPLOYMENT.md
MARKETING_ANALYTICS.md
DECISIONS.md
PROGRESS.md

PROGRESS.md should state:

Completed phase

Tests

Local verification

Known issues

Next phase

DECISIONS.md should record ambiguous decisions instead of silently inventing them.

Create an .env.example.

Include placeholders for relevant values such as:

DATABASE_URL
DATABASE_AUTH_TOKEN

AUTH/session secrets

Google:
GA measurement ID
GTM ID
Google Ads ID
Merchant configuration

Meta:
Pixel ID
CAPI credentials

Payment:
COD configuration
Future gateway credentials

Email:
Provider configuration

Do not put real secrets in source control.

The application must be designed for Vercel.

Before production:

Run production build locally.

Check environment variables.

Check Turso connectivity.

Check server/client boundaries.

Check file/media behavior.

Check dynamic routes.

Check API/server actions.

Check authentication.

Check caching behavior.

Do not deploy until the local production build succeeds.

The user already owns a domain. Do not invent a domain name or DNS configuration.

The customer should feel that TIGSBD and Sarongo are two stores within one shopping ecosystem.

The experience should NOT feel like:

"Leave one website, create another account, rebuild your cart, re-enter your address, checkout again."

Instead:

"Browse TIGSBD → switch to Sarongo → continue shopping → one cart → one checkout → one order."

The administrator should feel that this is one commerce operation.

The experience should NOT be:

"Process TIGSBD completely, then log into a separate Sarongo system and repeat everything."

Instead:

"Open unified admin → see all orders → identify store per item → filter by store → manage fulfillment and commerce efficiently."

Do NOT start by building all features.

First:

Create the NEW project.

Confirm the technology stack.

Create the initial folder structure.

Configure TypeScript/Tailwind.

Configure Turso.

Create the initial stores schema.

Add TIGSBD and Sarongo seed data.

Build a minimal storefront shell.

Run it locally.

Verify desktop and mobile.

Report results.

STOP and wait for approval before Phase 1 continues.

Do not silently proceed through multiple phases.

When uncertain, preserve these priorities in order:

Customer usability

Store data isolation

Shared shopping convenience

Admin efficiency

Security

Correctness

Performance

Maintainability

Visual quality

Optional advanced features

The finished result must be a real, maintainable e-commerce platform, not a mockup or static demo.