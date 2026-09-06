TIGSBD + SARONGO — NEW PLATFORM MASTER SPECIFICATION

Version: 1.0
Status: Build Specification
Purpose: Clean-slate rebuild from the existing TIGSBD reconstruction source.

1. PRODUCT VISION

Build a new, production-ready e-commerce platform that operates two Amazon-like storefronts under one shared infrastructure/domain:

TIGSBD — the primary/general e-commerce storefront.

Sarongo — a completely separate second storefront with its own catalog and store identity.

This is a NEW codebase. Do not repair, refactor, or copy the old implementation directly.

The old project is a reconstruction/reference source only. Preserve confirmed business/design behavior, but redesign the architecture cleanly.

Core principle:

Two independent catalogs and storefront identities, with shared customer shopping infrastructure so customers do not repeat work and administrators can manage commerce from one unified order center.

2. NON-NEGOTIABLE BUSINESS RULES

2.1 Two stores

TIGSBD and Sarongo have COMPLETELY SEPARATE PRODUCT CATALOGS.

A product belongs to exactly one store.

Do NOT create a shared-product catalog.

Each store has independent:

Products

Categories

Product media

Product pricing

Product discounts

Product inventory

Store banners

Store merchandising

Store-specific settings

Store-specific promotions where applicable

Store-specific analytics/reporting

2.2 Shared customer identity

One customer account works across both stores.

Customer should not need:

Separate TIGSBD account

Separate Sarongo account

Separate login

Separate address book

The same customer identity is used platform-wide.

2.3 Shared cart

The cart is SHARED across both stores.

Example:

Customer visits TIGSBD:

Product A

Product B

Then visits Sarongo:

Product C

Product D

All four can exist in one cart.

Cart UI must clearly identify which store each item belongs to.

Example:

CART
TIGSBD
Product A
Product B

SARONGO
Product C
Product D

The customer checks out once.

2.4 Shared checkout

Checkout is shared.

The customer should enter checkout information once:

Name

Email

Phone

Shipping address

City/district

Delivery information

Payment method

Coupon/promotion where applicable

Do not force the customer through two separate checkout processes merely because the cart contains products from two stores.

2.5 Shared orders

The order system is shared.

One checkout may create one customer-facing order containing products from either or both stores.

Every order item MUST carry a store context.

Example:

ORDER #10045

TIGSBD

Phone Case

USB Cable

Sarongo

Watch

Wallet

Admin sees one order but can immediately identify the originating store for every item.

2.6 Shared admin order center

There should be ONE unified admin order center.

Admin can:

View all orders

Search orders

Filter by store

Filter by customer

Filter by status

Filter by payment status

Filter by date

Open an order

See store per line item

Update order status

Handle returns/refunds

Export orders

View fulfillment information

Store filter:

All Stores

TIGSBD

Sarongo

Mixed Store Orders

A mixed order must be visibly marked as mixed.

2.7 Store-aware administration

Although orders are centrally visible, administration must support permissions.

Examples:

Super Admin:

TIGSBD

Sarongo

Platform

TIGSBD Admin:

TIGSBD catalog

TIGSBD merchandising

TIGSBD store settings

Shared order center according to permission

Sarongo Admin:

Sarongo catalog

Sarongo merchandising

Sarongo store settings

Shared order center according to permission

A TIGSBD-only admin must not automatically gain unrestricted access to Sarongo private catalog/settings data.

3. REFERENCE TO OLD SYSTEM

The existing reconstruction source confirms:

Laravel 10 / PHP 8.1+

MySQL as default

Laravel session authentication

Sanctum API authentication

Socialite OAuth support

Vite 4

Tailwind CSS 3

Axios

Laravel Excel

DomPDF

QR order links

Existing Store A features

Existing Sarongo catalog

Existing TIGSBD visual identity

The old implementation has known inconsistencies, including Store A-only transaction infrastructure, lack of store discriminators, inconsistent guest cart behavior, disabled coupons, and incomplete Sarongo commerce.

These limitations are NOT to be copied into the new system.

Reference source: TIGSBD REBUILD SOURCE.

4. RECOMMENDED ARCHITECTURE

Build one application/platform with explicit store-aware domain models.

Concept:

                TIGSBD PLATFORM
                       |
      +----------------+----------------+
      |                                 |
  TIGSBD STORE                       SARONGO STORE
  Own Catalog                        Own Catalog
  Own Categories                     Own Categories
  Own Inventory                      Own Inventory
  Own Merchandising                  Own Merchandising
      |                                 |
      +----------------+----------------+
                       |
                SHARED COMMERCE
                       |
    +------------------+------------------+
    |                  |                  |
 Customer            Cart             Checkout
 Identity                              |
    |                                   |
    +-------------------+---------------+
                        |
                     Orders
                        |
               Unified Admin Center
                        |
              Store-aware reporting
                        |
                Marketing Analytics

5. DATA ARCHITECTURE

Use explicit store entities.

Minimum conceptual models:

Platform

stores

users

customer_addresses

admin_users / admin assignments

roles

permissions

store_admin_assignments

Catalog

products

categories

product_images

product_gallery_items

product_variants

product_attributes/specifications

product_brands where required

product_inventory

Every catalog record must have store_id where store ownership applies.

Do not create separate legacy table families such as:

products

sarongo_products

Instead use a clean common schema:

products
id
store_id
sku
name
slug
description
price
discount_price
stock/status fields
SEO fields
timestamps

This does NOT mean catalogs are shared. It means one clean database model contains two isolated catalogs through store_id.

A product from TIGSBD can never accidentally appear in Sarongo.

Shopping

carts

cart_items

Cart is customer/platform-level, not store-specific.

cart_items reference:

cart_id

product_id

store_id or derive securely from product

quantity

price snapshot as needed

Orders

orders

order_items

payments

shipments

shipment_items

order_status_history

returns

refunds

Orders are shared.

Order items must contain store_id.

A single order can therefore contain items from multiple stores.

Customer features

wishlists

wishlist_items

reviews

notifications

loyalty transactions

restock requests

Where a feature is store-specific, store_id must be represented.

Marketing

analytics_events

marketing_sessions/attribution

campaign attribution data

coupon/promotion records

product feeds

conversion records

Every relevant commerce event must be store-aware.

6. CUSTOMER EXPERIENCE

6.1 Navigation

The main site should make the two stores obvious.

TIGSBD remains the primary storefront.

Sarongo should be prominently accessible from navigation.

Preserve the existing idea of a dedicated Sarongo navigation/mobile entry point.

6.2 Store switching

Customer can switch:

TIGSBD -> Sarongo
Sarongo -> TIGSBD

Without logging in again.

Cart remains available.

Example:

Customer has 2 TIGSBD products in cart.

Switches to Sarongo.

Adds 2 Sarongo products.

Cart badge becomes 4.

6.3 Account

One account:

Profile

Email

Phone

Password

OAuth identities

Address book

Orders

Returns

Wishlist

Reviews

Notifications

Loyalty

Security settings

Order history should show store labels.

6.4 Guest shopping

Browsing does not require login.

Cart should work for guests.

Guest checkout should be supported where business policy permits.

Do NOT reproduce the old random-password account creation behavior.

If a guest later creates an account, provide a secure account-claim/order-link process where appropriate.

7. SHARED CART DESIGN

Cart must support:

Guest cart

Logged-in cart

Persistent cart

Guest-to-account merge

Products from both stores

Stock validation

Price refresh

Product availability checks

Quantity changes

Remove item

Save for later where implemented

Cart should not require authentication merely to add/remove items.

Cart UI should group products by store.

Totals:

Subtotal
Shipping
Discount
Tax if enabled
Grand Total

If shipping differs by store or shipment, show a clear breakdown.

8. SHARED CHECKOUT DESIGN

Checkout should be one unified experience.

Recommended stages:

Contact

Shipping address

Delivery/fulfillment

Payment

Order review

Confirmation

Customer should not repeat information.

Support:

Saved addresses

Default address

Guest checkout

Address validation

Phone validation

Payment method

Coupon/promotion

Order notes if enabled

Store-aware shipping calculation

The architecture must allow different stores to have different fulfillment rules while retaining one customer checkout.

9. MIXED-STORE ORDER MODEL

Example:

Order #10045

Customer: John

Items:

Store: TIGSBD

Wireless Earbuds x1

USB Cable x2

Store: Sarongo

Watch x1

The customer sees one order.

Admin sees:

ORDER #10045
Mixed Store Order

TIGSBD subtotal: ...
Sarongo subtotal: ...
Shipping: ...
Discount: ...
Grand total: ...

Fulfillment can be split internally if necessary.

Example:

Shipment A
Store: TIGSBD
Tracking: XXXXX
Status: Shipped

Shipment B
Store: Sarongo
Tracking: YYYYY
Status: Processing

The customer still has one order history record.

10. PAYMENT ARCHITECTURE

Start with a clean payment abstraction.

Current confirmed old implementation is COD.

The new architecture should support COD first and be extensible for future gateways.

Possible future gateway adapters:

COD

SSLCommerz

Stripe

PayPal

Other approved gateways

Payment provider credentials MUST be stored in environment/configuration, never source code.

Payment states:

pending

authorized

paid

failed

cancelled

refunded

partially_refunded

Webhook/callback processing must be idempotent.

11. SHIPPING ARCHITECTURE

Old confirmed Store A behavior includes:

Inside Dhaka: BDT 60

Outside Dhaka: BDT 120

Treat this as legacy/reference business logic, not an immutable technical limitation.

New system should support:

Store-aware shipping rules

Destination rules

Shipping methods

Shipping fees

Multiple shipments

Tracking number

Carrier

Shipment status

Delivery estimates

Mixed-store fulfillment

Business rules should be configurable rather than hardcoded.

12. INVENTORY

Each product has store-owned inventory.

Support:

Available quantity

Reserved quantity

Low-stock threshold

Out-of-stock state

Inventory adjustment

Inventory history

Reservation during checkout where appropriate

Safe concurrency handling

Stock deduction

Restock

Return-to-stock

Use transactional operations to prevent overselling.

Inventory changes must be auditable.

13. PRODUCT SYSTEM

Build a stronger product model than the old project.

Support:

SKU

Name

Slug

Description

Short description

Price

Sale/discount price

Stock

Store

Category

Brand

Images

Gallery

Video where applicable

Variants

Attributes

Specifications

Status

Featured

SEO title

SEO description

SEO keywords where appropriate

Search metadata

Created/updated timestamps

Do not require every advanced field for every product.

14. SEARCH

Preserve the useful old TIGSBD behavior:

Name search

Description search

SKU search

Exact match priority

Prefix match

Contains match

Typo/fuzzy tolerance

Improve it for both stores.

Filters should support:

Category

Price

Brand

Rating

Availability

Attributes

Discount

Store

Sort order

Storefront search automatically searches the active store unless the user explicitly searches a platform-wide context.

15. REVIEWS

Both stores should support reviews.

Rules:

Rating 1-5

Title

Comment

Verified purchase

Helpful/unhelpful

One review per customer/product unless business policy changes

Moderation

Report review

Store-aware analytics

Verified purchase should be based on actual qualifying order/fulfillment history.

16. WISHLIST

Both stores support wishlist.

One customer account can have:

TIGSBD wishlist
Sarongo wishlist

UI may present:

All saved products

TIGSBD

Sarongo

Guest wishlist may optionally use local storage/session and merge after login.

17. COUPONS AND PROMOTIONS

The old system has coupon infrastructure but it was disabled.

New system should properly support:

Percentage discount

Fixed amount

Start/end dates

Usage limits

Per-customer limits

Minimum order

Store restrictions

Product/category restrictions

First-order promotions

Campaign codes

A coupon can be:

TIGSBD-only

Sarongo-only

Platform-wide

Platform-wide coupons must explicitly declare whether they apply to mixed-store carts.

Do not silently apply store-specific coupons to the wrong store.

18. ADMIN PLATFORM

Create one professional admin application.

Main sections:

Dashboard
Orders
Customers
Products
Categories
Inventory
Reviews
Wishlists/engagement
Coupons
Promotions
Payments
Shipping
Returns
Refunds
Analytics
Marketing
Store Management
Admin Management
Settings
Activity Logs

Store filter

Admin can switch context:

ALL STORES
TIGSBD
SARONGO

When in TIGSBD context, default catalog operations are TIGSBD only.

When in Sarongo context, default catalog operations are Sarongo only.

Order center

Orders remain centrally managed.

Columns:

Order ID

Customer

Stores

Items

Amount

Payment

Fulfillment

Status

Date

A mixed order must be visually obvious.

19. ADMIN PERMISSIONS

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

Permissions should be granular.

Examples:

products.view
products.create
products.update
products.delete

orders.view
orders.update
orders.refund

tigsbd.catalog.manage
sarongo.catalog.manage

analytics.view
marketing.manage

Admin assignments must define which stores an administrator can access.

20. DASHBOARD ANALYTICS

Admin dashboard should provide:

Platform totals
TIGSBD metrics
Sarongo metrics

Metrics:

Revenue

Orders

Average order value

Conversion rate

Customers

New customers

Returning customers

Products sold

Top products

Low stock

Refunds

Abandoned carts

Traffic

Traffic source

Campaign performance

Date filters:

Today
Yesterday
7 days
30 days
90 days
Custom

Store filters:

All
TIGSBD
Sarongo

21. GOOGLE MARKETING + ANALYTICS

Marketing/analytics is a CORE requirement.

Prepare the platform for:

Google Analytics 4

Google Tag Manager

Google Ads

Google Search Console

Google Merchant Center

Product feeds

Conversion tracking

Track at minimum:

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

Every event should include store context.

Example:

store = tigsbd
event = purchase
currency = BDT
value = 2500

or:

store = sarongo
event = purchase
currency = BDT
value = 1800

For mixed orders, event data must preserve item-level store attribution.

22. META / FACEBOOK MARKETING

Prepare for:

Meta Pixel

Meta Conversions API

Facebook/Instagram campaign attribution

Product catalog feeds

Retargeting events

Purchase conversion tracking

Track equivalent commerce events.

Use server-side conversion support where appropriate.

Do not expose server secrets in frontend code.

23. UTM + ATTRIBUTION

Capture campaign parameters such as:

utm_source
utm_medium
utm_campaign
utm_term
utm_content

Also support:

Google Ads click identifiers where applicable

Meta click identifiers where applicable

Landing page

Referrer

First-touch attribution

Last-touch attribution

Attribution should survive navigation between TIGSBD and Sarongo during the same customer session where technically appropriate.

24. SEO

Both stores need independent SEO.

Support:

Store-specific metadata

Product metadata

Category metadata

Canonical URLs

Open Graph

Twitter/social metadata

Structured data

Product schema

Breadcrumb schema

Organization/store schema

XML sitemap

robots.txt

Search-friendly URLs

Google Merchant Center feeds must distinguish products by store/catalog where required.

25. PERFORMANCE

Target a fast Amazon-like experience.

Requirements:

Responsive design

Optimized images

Lazy loading

Caching

Pagination

Efficient database queries

Indexed search fields

CDN-compatible assets

Minified production assets

No unnecessary API calls

Server-side validation

Rate limiting

Avoid building a visually impressive but slow storefront.

26. SECURITY

Implement:

CSRF protection

Authentication hardening

Authorization policies

Role/permission checks

Rate limiting

Input validation

Output escaping

Secure file uploads

MIME validation

Size limits

Password hashing

Secure sessions

API token protection

Audit logging

Payment webhook verification

Secret/environment protection

SQL injection protection

XSS protection

Never expose:

API secrets

Payment keys

OAuth secrets

Database credentials

Marketing server secrets

27. FILE / MEDIA MANAGEMENT

Admin media system should support:

Product image upload

Multiple images

Gallery ordering

Image replacement

Image deletion

Store-aware media ownership

Alt text

Compression/optimization

Safe file validation

TIGSBD media must not accidentally become Sarongo media and vice versa.

28. DESIGN SYSTEM

Preserve TIGSBD's recognizable visual identity.

Confirmed reference design:

Dark slate/near-black navigation

Amber/gold brand treatment

Gold gradient logo

White product cards

Soft borders

Large rounded corners

Pronounced shadows

Strong product imagery

Premium modern e-commerce appearance

Responsive desktop/mobile navigation

Sarongo prominence

Primary visual language includes:

Dark:
slate-900 / slate-950

Amber/gold:
#fbbf24
#f59e0b
#d97706

Muted:
#94a3b8

Existing design uses:

Montserrat 800/900 for TIGSBD logo

Poppins 800/900 for sub-labels

Do not replace the identity with a generic Tailwind template.

29. MOBILE FIRST

Mobile must be treated as a first-class storefront.

Requirements:

Mobile navigation

Dedicated Sarongo access

Slide-in menu

Touch-friendly controls

Sticky cart access

Responsive product grids

Horizontal category rails where appropriate

Responsive checkout

Responsive admin where practical

No horizontal overflow

Optimized image loading

Target breakpoints may retain the old 640 / 768 / 1024 behavior but should be implemented according to the new UI architecture.

30. UNIQUE TIGSBD FEATURES TO PRESERVE / IMPROVE

Preserve the useful identity/features from the old project:

Sarongo in-navigation second storefront

Distinct Sarongo branding/logo

QR order tracking/receipt concept

Fuzzy typo-tolerant search

Restock requests

Loyalty system

Product discounts

Related products

Customer reviews

Wishlist

Returns

Notifications

Admin exports

Product media/gallery

Improve all of these for the two-store architecture.

31. ORDER LIFECYCLE

Recommended lifecycle:

pending
confirmed
processing
partially_shipped
shipped
partially_delivered
delivered
cancelled
returned
refunded
partially_refunded

Store/fulfillment-specific shipment statuses can exist separately from the customer-facing order status.

Every status change should create an order-status history record.

32. QR ORDER TRACKING

Preserve the old QR order-link idea.

Each order can have a secure tracking/receipt URL.

QR code must NOT expose sensitive information.

Use:

Secure token

Expiration/revocation strategy where appropriate

Read-only public tracking information

Customer can scan the QR code to view order status.

33. CUSTOMER COMMUNICATION

Prepare infrastructure for:

Order confirmation

Payment confirmation

Shipping notification

Delivery notification

Cancellation

Refund

Password reset

Account verification

Restock notification

Promotional campaigns where consent/legal requirements allow

Email templates should be store-aware.

A TIGSBD order email should use TIGSBD branding.

A Sarongo order email should use Sarongo branding.

A mixed order email can clearly show both stores.

34. AI / RECOMMENDATION LAYER

The old system documents a separate Python AI HTTP service for analytics/recommendations/bug checking.

Do not make the entire commerce platform depend on AI.

AI features should be optional and isolated.

Possible uses:

Product recommendations

Similar products

Search improvement

Merchandising suggestions

Sales insights

Anomaly detection

Admin assistance

AI failures must never break checkout or order processing.

35. API

Build clean API namespaces with explicit store context.

Examples conceptually:

/api/v1/stores
/api/v1/stores/{store}/products
/api/v1/stores/{store}/categories
/api/v1/cart
/api/v1/checkout
/api/v1/orders
/api/v1/customer
/api/v1/admin

Do not create an isolated Sarongo API as an afterthought.

Both stores use the same API architecture with store authorization.

36. ROUTING CONCEPT

Recommended public routes:

/                         -> TIGSBD
/products
/product/{slug}
/cart
/checkout
/account

/sarongo
/sarongo/products
/sarongo/product/{slug}

The exact routing may evolve, but store context must be unambiguous.

Avoid unnecessary legacy .html compatibility unless required by migration/SEO.

37. DATABASE INTEGRITY

Use foreign keys.

Enforce:

product belongs to valid store

category belongs to same store as product

store-specific promotion cannot target another store unless explicitly allowed

store-specific admin cannot modify unauthorized store

order item store must match product store

review store must match product store

wishlist item store must match product store

These rules must be enforced server-side, not merely through UI filters.

38. TESTING REQUIREMENTS

Create tests for:

Authentication
Authorization
Store isolation
Product CRUD
Category CRUD
Cart
Guest cart
Account cart
Guest-to-account merge
Mixed-store cart
Checkout
Mixed-store checkout
Payment states
Inventory reservation/deduction
Order lifecycle
Returns
Refunds
Reviews
Wishlist
Coupons
Admin permissions
Analytics events
Marketing attribution

Critical scenario:

Add TIGSBD product.

Switch to Sarongo.

Add Sarongo product.

Open shared cart.

Checkout once.

Create mixed order.

Admin opens order.

Admin sees both stores and each item's store.

Store-specific permissions remain enforced.

This scenario is mandatory.

39. DEVELOPMENT PRINCIPLES

Do not recreate old technical debt.

Do not:

Copy legacy table structures blindly

Duplicate the whole application for Sarongo

Create separate auth systems

Create separate carts

Create separate checkout flows

Create separate order centers

Hardcode store rules throughout controllers

Put secrets in source code

Make AI mandatory for core commerce

Make analytics scripts responsible for checkout

Depend on static HTML as the actual commerce backend

Do:

Use explicit store context

Use reusable domain services

Use policies/authorization

Use database constraints

Use service classes for checkout/order/payment/shipping

Keep storefront and admin concerns separated

Keep integrations modular

Make business rules configurable

Write tests for cross-store behavior

40. RECOMMENDED BUILD PHASES

Phase 1 — Foundation

New Laravel application

Environment configuration

Database

Authentication

Users

Stores

Roles/permissions

Base layouts

Design tokens

Phase 2 — Catalog

Products

Categories

Images

Variants

Attributes

Search

Filters

TIGSBD storefront

Sarongo storefront

Phase 3 — Shared Commerce

Guest cart

Account cart

Shared cart

Cart merge

Checkout

Addresses

Payment abstraction

Shipping

Phase 4 — Orders

Orders

Order items

Mixed orders

Shipments

Tracking

Status history

QR tracking

Customer order history

Phase 5 — Customer Features

Reviews

Wishlist

Returns

Notifications

Loyalty

Restock

Phase 6 — Admin

Unified dashboard

Unified order center

Store filters

Catalog management

Inventory

Customers

Promotions

Payments

Shipping

Returns/refunds

Roles/permissions

Phase 7 — Marketing

GA4

GTM

Google Ads

Search Console

Merchant feeds

Meta Pixel

Meta Conversions API

UTM attribution

Event tracking

Phase 8 — SEO + Performance

Metadata

Schema

Sitemap

robots.txt

Image optimization

Caching

Performance tuning

Phase 9 — QA

Automated tests

Security checks

Cross-store isolation

Mixed-cart testing

Mixed-order testing

Mobile testing

Analytics event verification

Phase 10 — Deployment

Production environment
Database
Storage
Email
Domains
SSL
Backups
Monitoring
Analytics verification
Payment verification
Final security review

41. COPILOT BUILD INSTRUCTIONS

Copilot should build the NEW project from this specification.

Important:

Do not inspect the old project unless explicitly instructed.

Do not import old code.

Do not copy old database migrations.

Do not reproduce known broken behavior.

Prefer clean architecture over legacy compatibility.

Build incrementally.

After each phase, run tests and verify the application.

Keep documentation updated.

Never overwrite working features without understanding dependencies.

Never place secrets in code.

Do not invent external credentials.

Use placeholders/environment variables for integrations.

When a requirement is ambiguous, mark it as TODO/DECISION REQUIRED rather than silently inventing business rules.

42. DEFINITION OF DONE

The rebuild is not complete until:

Stores

TIGSBD works as a complete store.

Sarongo works as a complete store.

Catalogs are completely separate.

Products cannot cross stores accidentally.

Customer

One account works across both.

One address book works across both.

No repeated login.

Shopping

One shared cart works across both.

Mixed-store cart works.

One shared checkout works.

Customer does not repeat checkout information.

Orders

One unified order system.

Mixed orders work.

Every item identifies its store.

Fulfillment can split when required.

Customer has one order history.

Admin

One unified order center.

Store filtering works.

Store-specific permissions work.

Catalog management is isolated.

Inventory is store-aware.

Marketing

GA4 event architecture works.

Google Ads conversion architecture works.

Meta Pixel architecture works.

Meta server-side conversion architecture is prepared.

UTM attribution works.

Store attribution works.

Mixed-order attribution works.

Design

TIGSBD visual identity preserved.

Sarongo identity preserved.

Desktop responsive.

Mobile responsive.

Fast and polished.

Security

Authorization enforced server-side.

Store isolation enforced server-side.

Secrets protected.

Payment/webhook security implemented.

Audit logs available for important admin actions.

43. FINAL ARCHITECTURE SUMMARY

The final product is NOT:

"two separate websites."

It is:

ONE shared e-commerce platform with TWO independent storefronts.

TIGSBD and Sarongo own their catalogs and store-specific business data.

The customer owns one account.

The platform owns one shared cart.

The platform owns one shared checkout.

The platform owns one unified order system.

The admin owns one centralized commerce console with store-aware visibility and permissions.

Marketing and analytics operate across the platform while preserving store-level attribution.

Conceptually:

                     TIGSBD PLATFORM
                            |
      +---------------------+---------------------+
      |                                           |
  TIGSBD STORE                               SARONGO STORE
  Independent                                Independent
  Catalog                                    Catalog
      |                                           |
      +-------------------+-----------------------+
                          |
                SHARED CUSTOMER IDENTITY
                          |
                    SHARED CART
                          |
                  SHARED CHECKOUT
                          |
                   SHARED ORDERS
                          |
                UNIFIED ADMIN CENTER
                          |
              +-----------+-----------+
              |                       |
         TIGSBD DATA             SARONGO DATA
              |                       |
              +-----------+-----------+
                          |
                 MARKETING LAYER
                          |
          +---------------+---------------+
          |               |               |
         GA4          GOOGLE ADS         META
          |               |               |
          +---------------+---------------+
                          |
                 PLATFORM ANALYTICS

This is the target architecture for the clean rebuild.