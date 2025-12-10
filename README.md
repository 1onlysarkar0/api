# FF 1ONLYSARKAR SHOP API Documentation

**Version:** 1.0.0  
**Base URL:** `https://www.1onlysarkar.shop`

Complete API documentation for FF 1ONLYSARKAR SHOP - Your trusted source for Free Fire emotes and premium services.

---

## Table of Contents

1. [Emotes](#emotes)
2. [User Status](#user-status)
3. [Settings & Configuration](#settings--configuration)
4. [Blog](#blog)
5. [Custom Pages](#custom-pages)
6. [Payments (Razorpay)](#payments-razorpay)
7. [Admin Authentication](#admin-authentication)
8. [Admin Dashboard](#admin-dashboard)
9. [Admin Whitelist Management](#admin-whitelist-management)
10. [Admin Plans Management](#admin-plans-management)
11. [Admin Blog Management](#admin-blog-management)
12. [Admin Custom Pages](#admin-custom-pages)
13. [Admin Settings & Config](#admin-settings--config)
14. [Admin Footer Configuration](#admin-footer-configuration)
15. [Admin 2FA Management](#admin-2fa-management)
16. [Admin Export](#admin-export)
17. [Admin Payment Management](#admin-payment-management)
18. [Admin Logs & Audit](#admin-logs--audit)
19. [Admin Backup & Restore](#admin-backup--restore)
20. [Admin File Upload](#admin-file-upload)
21. [Rate Limiting](#rate-limiting)
22. [Error Handling](#error-handling)
23. [Authentication](#authentication)

---

## Emotes

Endpoints for managing and sending emotes to Free Fire accounts.

### GET /api/emotes - Get All Emotes

Retrieves a list of all available emotes. Supports optional limit parameter for pagination.

**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Maximum number of emotes to return |

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/emotes?limit=10"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Success | `[{"id": "123456789", "url": "https://example.com/emote.gif", "name": "Dance Emote"}]` |
| 404 | Emotes file not found | `{"error": "Emotes file not found"}` |
| 500 | Server error | `{"error": "Failed to load emotes"}` |

---

### POST /api/send-emote - Send Emote

Sends an emote to a Free Fire account. Includes rate limiting, daily limits for free users, and premium bypass.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | Yes | Free Fire User ID (5-20 characters, numeric only) |
| `teamCode` | string | Yes | Team code (4-20 characters) |
| `emoteCode` | string | Yes | Emote code (8-12 digit numeric string) |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/send-emote" \
  -H "Content-Type: application/json" \
  -d '{"uid": "1234567890", "teamCode": "TEAM123", "emoteCode": "123456789"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Emote sent successfully | `{"success": true, "message": "Emote sent successfully", "isPremium": false, "cooldownSeconds": 30, "dailyStats": {"used": 1, "remaining": 9, "total": 10}}` |
| 400 | Invalid input | `{"error": "Invalid UID format"}` |
| 403 | UID blocked | `{"error": "Access Denied", "blocked": true, "blockMessage": "Your account has been blocked"}` |
| 429 | Daily limit reached | `{"error": "Daily limit reached", "limitReached": true, "dailyStats": {"used": 10, "remaining": 0, "total": 10}}` |
| 500 | Server error | `{"error": "Failed to send emote"}` |
| 504 | Request timeout | `{"error": "Request timeout. Please try again."}` |

---

## User Status

Check whitelist, blocklist, and daily usage status for users.

### POST /api/whitelist/check - Check Whitelist Status

Check if a UID is whitelisted (has premium access).

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | Yes | User ID to check |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/whitelist/check" \
  -H "Content-Type: application/json" \
  -d '{"uid": "1234567890"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Whitelist status (whitelisted) | `{"whitelisted": true, "expiresAt": 1735689600000, "planId": "monthly", "planName": "Monthly Premium"}` |
| 200 | Whitelist status (not whitelisted) | `{"whitelisted": false}` |
| 400 | Invalid UID | `{"error": "Invalid UID"}` |

---

### POST /api/blocklist/check - Check Blocklist Status

Check if a UID is blocked from using the service.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | Yes | User ID to check |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/blocklist/check" \
  -H "Content-Type: application/json" \
  -d '{"uid": "1234567890"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Not blocked | `{"blocked": false}` |
| 200 | Blocked | `{"blocked": true, "blockMessage": "Your account has been blocked for violating terms of service"}` |
| 400 | Invalid UID | `{"error": "Invalid UID"}` |

---

### POST /api/daily-stats - Get Daily Usage Stats

Get daily usage statistics for a UID.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | Yes | User ID |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/daily-stats" \
  -H "Content-Type: application/json" \
  -d '{"uid": "1234567890"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Usage statistics | `{"used": 3, "remaining": 7, "total": 10, "resetsAt": 1735776000000}` |
| 400 | Invalid UID | `{"error": "Invalid UID"}` |

---

## Settings & Configuration

Get public site settings and configurations.

### GET /api/settings - Get Site Settings

Retrieves public site settings including navigation and footer configuration.

**Authentication:** Not required

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/settings"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Site settings | `{"siteName": "FF 1ONLYSARKAR SHOP", "navigation": [...], "footer": {...}, "theme": {...}}` |

---

### GET /api/footer-config/public - Get Footer Configuration

Get public footer configuration including company info, sections, and social links.

**Authentication:** Not required

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/footer-config/public"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Footer configuration | `{"companyInfo": {"name": "FF 1ONLYSARKAR SHOP", "description": "..."}, "sections": [...], "socialLinks": [...], "bottomText": {...}}` |

---

## Blog

Public blog endpoints for accessing published content.

### GET /api/blog/public - Get Published Blog Posts

Retrieves all published blog posts.

**Authentication:** Not required

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/blog/public"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | List of published posts | `{"posts": [{"id": "1", "title": "Post Title", "slug": "post-slug", "excerpt": "Short description...", "content": "Full content...", "published": true, "createdAt": "2024-01-01T00:00:00Z"}]}` |

---

## Custom Pages

Public custom pages endpoints.

### GET /api/custom-pages/public - Get Custom Pages

Get published custom pages. Optionally get a specific page by slug.

**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | No | Page slug to retrieve specific page |

#### Example Requests

```bash
# Get all custom pages
curl -X GET "https://www.1onlysarkar.shop/api/custom-pages/public"

# Get specific page by slug
curl -X GET "https://www.1onlysarkar.shop/api/custom-pages/public?slug=about-us"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Custom pages list | `{"pages": [{"id": "1", "title": "About Us", "slug": "about-us", "content": "Page content...", "published": true}]}` |
| 200 | Single page | `{"page": {"id": "1", "title": "About Us", "slug": "about-us", "content": "Page content..."}}` |
| 404 | Page not found | `{"error": "Page not found"}` |

---

## Payments (Razorpay)

Payment processing endpoints for premium subscriptions using Razorpay.

### GET /api/razorpay/plans - Get Available Plans

Get all available premium subscription plans.

**Authentication:** Not required

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/razorpay/plans"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | List of plans | `{"enabled": true, "plans": [{"id": "monthly", "name": "Monthly Premium", "price": 99, "currency": "INR", "duration": 2592000, "description": "30 days of premium access"}]}` |

---

### POST /api/razorpay/create-order - Create Payment Order

Create a new Razorpay order for premium subscription. Includes rate limiting and duplicate order prevention.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `planId` | string | Yes | ID of the plan to purchase |
| `uid` | string | Yes | Free Fire UID to whitelist (5-20 numeric characters) |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/razorpay/create-order" \
  -H "Content-Type: application/json" \
  -d '{"planId": "monthly", "uid": "1234567890"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Order created | `{"orderId": "order_xyz123", "amount": 9900, "currency": "INR", "keyId": "rzp_live_xxx"}` |
| 400 | Invalid input | `{"error": "Invalid UID format"}` |
| 400 | Already premium | `{"error": "This UID already has premium access until Jan 15, 2025"}` |
| 429 | Rate limit exceeded | `{"error": "Too many payment attempts. Please wait before trying again."}` |
| 503 | Payment system disabled | `{"error": "Premium feature is currently disabled"}` |

---

### POST /api/razorpay/create-payment-link - Create Payment Link

Create a Razorpay payment link for premium subscription.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `planId` | string | Yes | ID of the plan |
| `uid` | string | Yes | Free Fire UID |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/razorpay/create-payment-link" \
  -H "Content-Type: application/json" \
  -d '{"planId": "monthly", "uid": "1234567890"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Payment link created | `{"success": true, "paymentLinkId": "plink_xxx123", "paymentUrl": "https://rzp.io/l/xxx123", "sessionToken": "abc123xyz"}` |
| 400 | Invalid input | `{"error": "Invalid plan ID"}` |

---

### POST /api/razorpay/verify-payment - Verify Payment

Verify payment signature and activate premium subscription. Uses cryptographic signature verification.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `razorpay_order_id` | string | Yes | Razorpay order ID |
| `razorpay_payment_id` | string | Yes | Razorpay payment ID |
| `razorpay_signature` | string | Yes | Razorpay signature for verification |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/razorpay/verify-payment" \
  -H "Content-Type: application/json" \
  -d '{"razorpay_order_id": "order_xxx", "razorpay_payment_id": "pay_xxx", "razorpay_signature": "signature_hash"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Payment verified | `{"success": true, "message": "UID 1234567890 has been whitelisted for Monthly Premium", "expiresAt": 1735689600000}` |
| 400 | Invalid signature | `{"error": "Payment verification failed. Invalid signature.", "success": false}` |
| 400 | Already processed | `{"error": "Payment already processed", "success": false}` |

---

### POST /api/razorpay/check-payment-status - Check Payment Status

Check status of a payment link payment.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `paymentLinkId` | string | Yes | Payment link ID |
| `sessionToken` | string | Yes | Session token from payment link creation |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/razorpay/check-payment-status" \
  -H "Content-Type: application/json" \
  -d '{"paymentLinkId": "plink_xxx", "sessionToken": "abc123"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Payment pending | `{"status": "pending", "success": false}` |
| 200 | Payment successful | `{"status": "paid", "success": true, "message": "Payment successful!", "uid": "1234567890", "planName": "Monthly Premium", "expiresAt": 1735689600000}` |
| 400 | Invalid session | `{"error": "Invalid session token"}` |

---

### POST /api/razorpay/webhook - Razorpay Webhook

Webhook endpoint for Razorpay payment notifications. Handles payment.captured, payment.failed, and order.paid events.

**Authentication:** Required (Razorpay webhook signature validation)

#### Headers

| Header | Description |
|--------|-------------|
| `x-razorpay-signature` | Razorpay webhook signature |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | Event type (payment.captured, payment.failed, order.paid) |
| `payload` | object | Yes | Event payload from Razorpay |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Webhook processed | `{"status": "ok"}` |
| 401 | Invalid signature | `{"error": "Invalid signature"}` |

---

## Admin Authentication

Admin login, logout, and 2FA endpoints. All admin endpoints (except login) require authentication.

### POST /api/admin/login - Admin Login

Authenticate as admin. Returns 2FA requirement if enabled.

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Admin username |
| `password` | string | Yes | Admin password |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Login successful | `{"success": true, "message": "Login successful"}` |
| 200 | 2FA required | `{"success": true, "requires2FA": true, "message": "Please enter your 2FA code"}` |
| 401 | Invalid credentials | `{"error": "Invalid credentials"}` |
| 429 | Too many attempts | `{"error": "Too many login attempts. Please try again later."}` |

---

### POST /api/admin/login/verify-2fa - Verify 2FA Code

Complete login with 2FA verification code.

**Authentication:** Not required (but requires pending 2FA session)

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | 6-digit 2FA code from authenticator app |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/admin/login/verify-2fa" \
  -H "Content-Type: application/json" \
  -d '{"token": "123456"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | 2FA verified | `{"success": true, "message": "Login successful"}` |
| 400 | Invalid code | `{"error": "Invalid 2FA code. Please try again."}` |
| 400 | Code expired | `{"error": "2FA session expired. Please login again."}` |

---

### POST /api/admin/logout - Admin Logout

End admin session.

**Authentication:** Required

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/admin/logout" \
  -H "Cookie: admin_session=xxx"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Logged out | `{"success": true, "message": "Logged out successfully"}` |

---

### GET /api/admin/check - Check Admin Status

Check if current session is authenticated as admin.

**Authentication:** Not required

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/admin/check" \
  -H "Cookie: admin_session=xxx"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Authenticated | `{"authenticated": true}` |
| 200 | Not authenticated | `{"authenticated": false}` |

---

## Admin Dashboard

Dashboard statistics and analytics. **All endpoints require admin authentication.**

### GET /api/admin/dashboard/stats - Get Dashboard Statistics

Get admin dashboard overview statistics.

**Authentication:** Required

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/admin/dashboard/stats" \
  -H "Cookie: admin_session=xxx"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Dashboard stats | `{"whitelistCount": 150, "blockedCount": 12, "todayEmotes": 523, "totalEmotes": 15420, "totalPayments": 45000, "activeUsers": 89}` |
| 401 | Unauthorized | `{"error": "Unauthorized"}` |

---

## Admin Whitelist Management

Manage whitelisted users and blocked UIDs. **All endpoints require admin authentication.**

### GET /api/admin/whitelist - Get Whitelist

Get all whitelisted users and blocked UIDs.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Whitelist data | `{"whitelist": [{"uid": "1234567890", "expiresAt": 1735689600000, "planId": "monthly", "planName": "Monthly Premium"}], "blocked": [{"uid": "9876543210", "reason": "Abuse", "message": "Blocked for abuse"}]}` |

---

### POST /api/admin/whitelist - Manage Whitelist

Add, remove, or extend whitelist entries. Also manage blocked UIDs and rate limits.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | Yes | Action: `add`, `remove`, `extend`, `cleanup`, `setCooldown`, `setDailyLimit`, `addBlocked`, `removeBlocked`, `updateBlocked` |
| `uid` | string | Conditional | User ID (required for add, remove, extend, block actions) |
| `durationSeconds` | number | Conditional | Subscription duration in seconds (required for add) |
| `planId` | string | Conditional | Plan ID (for add) |
| `planName` | string | Conditional | Plan name (for add) |
| `additionalSeconds` | number | Conditional | Seconds to extend (for extend) or cooldown value (for setCooldown) |
| `dailyLimit` | number | Conditional | Daily limit for free users (for setDailyLimit) |
| `blockMessage` | string | Conditional | Message shown to blocked user (for addBlocked/updateBlocked) |
| `blockReason` | string | Conditional | Internal reason for block (for addBlocked/updateBlocked) |

#### Example Requests

```bash
# Add to whitelist
curl -X POST "https://www.1onlysarkar.shop/api/admin/whitelist" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"action": "add", "uid": "1234567890", "durationSeconds": 2592000, "planId": "monthly", "planName": "Monthly Premium"}'

# Remove from whitelist
curl -X POST "https://www.1onlysarkar.shop/api/admin/whitelist" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"action": "remove", "uid": "1234567890"}'

# Block a UID
curl -X POST "https://www.1onlysarkar.shop/api/admin/whitelist" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"action": "addBlocked", "uid": "9876543210", "blockReason": "Abuse detected", "blockMessage": "Your account has been blocked"}'

# Set daily limit for free users
curl -X POST "https://www.1onlysarkar.shop/api/admin/whitelist" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"action": "setDailyLimit", "dailyLimit": 15}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Action completed | `{"success": true}` |
| 400 | Invalid action | `{"error": "Invalid action"}` |
| 401 | Unauthorized | `{"error": "Unauthorized"}` |

---

## Admin Plans Management

Manage premium subscription plans. **All endpoints require admin authentication.**

### GET /api/admin/plans - Get All Plans

Get all premium subscription plans.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Plans list | `{"plans": [{"id": "weekly", "name": "Weekly", "price": 49, "currency": "INR", "duration": 604800}, {"id": "monthly", "name": "Monthly", "price": 99, "currency": "INR", "duration": 2592000}]}` |

---

### POST /api/admin/plans - Manage Plans

Add, update, or delete premium plans.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | Yes | Action: `add`, `update`, `delete` |
| `plan` | object | Conditional | Plan object with id, name, duration, price, currency (for add/update) |
| `planId` | string | Conditional | Plan ID (for update/delete) |

#### Example Requests

```bash
# Add new plan
curl -X POST "https://www.1onlysarkar.shop/api/admin/plans" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"action": "add", "plan": {"id": "yearly", "name": "Yearly Premium", "price": 999, "currency": "INR", "duration": 31536000}}'

# Update plan
curl -X POST "https://www.1onlysarkar.shop/api/admin/plans" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"action": "update", "planId": "monthly", "plan": {"price": 129}}'

# Delete plan
curl -X POST "https://www.1onlysarkar.shop/api/admin/plans" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"action": "delete", "planId": "weekly"}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Action completed | `{"success": true}` |
| 400 | Invalid action | `{"error": "Invalid action"}` |

---

## Admin Blog Management

Manage blog posts. **All endpoints require admin authentication.**

### GET /api/admin/blog - Get All Blog Posts

Get all blog posts (including drafts).

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Blog posts | `{"posts": [{"id": "1", "title": "Post Title", "slug": "post-slug", "content": "...", "excerpt": "...", "published": true, "createdAt": "...", "updatedAt": "..."}]}` |

---

### POST /api/admin/blog - Create Blog Post

Create a new blog post.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `slug` | string | Yes | URL slug (lowercase, hyphens) |
| `content` | string | Yes | Post content (Markdown supported) |
| `excerpt` | string | No | Short excerpt for previews |
| `published` | boolean | No | Publish status (default: false) |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/admin/blog" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"title": "New Feature Announcement", "slug": "new-feature-announcement", "content": "We are excited to announce...", "excerpt": "Check out our new features!", "published": true}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Post created | `{"success": true, "post": {"id": "2", "title": "...", ...}}` |
| 400 | Validation error | `{"error": "Slug already exists"}` |

---

### PUT /api/admin/blog - Update Blog Post

Update an existing blog post.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Post ID |
| `title` | string | No | New title |
| `slug` | string | No | New slug |
| `content` | string | No | New content |
| `excerpt` | string | No | New excerpt |
| `published` | boolean | No | Publish status |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Post updated | `{"success": true, "post": {...}}` |
| 404 | Post not found | `{"error": "Post not found"}` |

---

### DELETE /api/admin/blog - Delete Blog Post

Delete a blog post.

**Authentication:** Required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Post ID to delete |

#### Example Request

```bash
curl -X DELETE "https://www.1onlysarkar.shop/api/admin/blog?id=post-1" \
  -H "Cookie: admin_session=xxx"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Post deleted | `{"success": true}` |
| 404 | Post not found | `{"error": "Post not found"}` |

---

## Admin Custom Pages

Manage custom content pages. **All endpoints require admin authentication.**

### GET /api/admin/custom-pages - Get All Custom Pages

Get all custom pages.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Custom pages | `{"pages": [{"id": "1", "title": "About Us", "slug": "about-us", "content": "...", "published": true}]}` |

---

### POST /api/admin/custom-pages - Create Custom Page

Create a new custom page.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Page title |
| `slug` | string | Yes | URL slug (lowercase, hyphens only) |
| `content` | string | Yes | Page content |
| `description` | string | No | Meta description for SEO |
| `published` | boolean | No | Publish status |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/admin/custom-pages" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=xxx" \
  -d '{"title": "Terms of Service", "slug": "terms-of-service", "content": "...", "published": true}'
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Page created | `{"success": true, "page": {...}}` |
| 400 | Slug exists | `{"error": "Slug already exists"}` |

---

### GET /api/admin/custom-pages/[id] - Get Single Custom Page

Get a specific custom page by ID.

**Authentication:** Required

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Page ID |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Page data | `{"page": {"id": "1", "title": "About Us", ...}}` |
| 404 | Not found | `{"error": "Page not found"}` |

---

### PUT /api/admin/custom-pages/[id] - Update Custom Page

Update a custom page.

**Authentication:** Required

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Page ID |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | New title |
| `content` | string | No | New content |
| `published` | boolean | No | Publish status |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Page updated | `{"success": true, "page": {...}}` |
| 404 | Not found | `{"error": "Page not found"}` |

---

### DELETE /api/admin/custom-pages - Delete Custom Page

Delete a custom page.

**Authentication:** Required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Page ID to delete |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Page deleted | `{"success": true}` |
| 404 | Not found | `{"error": "Page not found"}` |

---

## Admin Settings & Config

Manage site settings and configurations. **All endpoints require admin authentication unless specified.**

### GET /api/admin/settings - Get Settings

Get current site settings.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Site settings | `{"siteName": "FF 1ONLYSARKAR SHOP", "footer": {...}, "navigation": [...]}` |

---

### PUT /api/admin/settings - Update Settings

Update site settings.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `siteName` | string | No | Site name |
| `footer` | object | No | Footer configuration |
| `navigation` | array | No | Navigation items |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Settings updated | `{"success": true, "settings": {...}}` |

---

### GET /api/admin/site-config - Get Site Config

Get site configuration (branding, SEO).

**Authentication:** Not required (public endpoint)

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Site config | `{"siteName": "FF 1ONLYSARKAR SHOP", "siteDescription": "...", "logo": "/logo.png", "favicon": "/favicon.ico"}` |

---

### POST /api/admin/site-config - Update Site Config

Update site configuration.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `siteName` | string | No | Site name |
| `siteDescription` | string | No | Site description for SEO |
| `logo` | string | No | Logo URL |
| `favicon` | string | No | Favicon URL |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Config updated | `{"success": true, "message": "Site configuration updated successfully"}` |

---

### GET /api/admin/theme-config - Get Theme Config

Get theme configuration.

**Authentication:** Not required (public endpoint)

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Theme config | `{"primaryColor": "#8B5CF6", "secondaryColor": "#...", "background": "..."}` |

---

### POST /api/admin/theme-config - Update Theme Config

Update theme configuration.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `primaryColor` | string | No | Primary theme color (hex) |
| `secondaryColor` | string | No | Secondary theme color |
| `background` | string | No | Background color/style |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Theme updated | `{"success": true, "message": "Theme configuration updated successfully"}` |

---

### GET /api/admin/system-config - Get System Config

Get system configuration (session, API endpoints).

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | System config | `{"sessionSecret": "********", "adminUsername": "admin", "emoteApiEndpoint": "https://..."}` |

---

### PUT /api/admin/system-config - Update System Config

Update system configuration including admin credentials.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionSecret` | string | No | Session secret (min 32 chars) |
| `adminUsername` | string | No | Admin username (min 3 chars) |
| `newPassword` | string | No | New admin password (min 6 chars) |
| `emoteApiEndpoint` | string | No | External emote API endpoint |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Config updated | `{"success": true}` |
| 400 | Validation error | `{"error": "Password must be at least 6 characters"}` |

---

### GET /api/admin/razorpay-config - Get Razorpay Config

Get Razorpay payment configuration (secrets masked).

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Razorpay config | `{"enabled": true, "keyId": "rzp_live_xxx", "keySecret": "********", "webhookSecret": "********"}` |

---

### POST /api/admin/razorpay-config - Update Razorpay Config

Update Razorpay payment configuration.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | No | Enable/disable payments |
| `keyId` | string | No | Razorpay Key ID |
| `keySecret` | string | No | Razorpay Key Secret |
| `webhookSecret` | string | No | Webhook secret for signature validation |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Config updated | `{"success": true}` |

---

## Admin Footer Configuration

Manage footer configuration. **All endpoints require admin authentication.**

### GET /api/admin/footer-config - Get Footer Config

Get footer configuration.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Footer config | `{"companyInfo": {...}, "sections": [...], "socialLinks": [...], "bottomText": {...}}` |

---

### POST /api/admin/footer-config - Update Footer Config

Update footer configuration.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyInfo` | object | No | Company information |
| `sections` | array | No | Footer sections with links |
| `socialLinks` | array | No | Social media links |
| `bottomText` | object | No | Bottom text/copyright |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Config updated | `{"success": true}` |

---

## Admin 2FA Management

Manage two-factor authentication. **All endpoints require admin authentication.**

### GET /api/admin/2fa/status - Get 2FA Status

Get current 2FA status.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | 2FA status | `{"enabled": false}` |
| 200 | 2FA enabled | `{"enabled": true}` |

---

### POST /api/admin/2fa/setup - Setup 2FA

Generate 2FA setup (secret and QR code).

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Setup data | `{"secret": "JBSWY3DPEHPK3PXP", "qrCodeUrl": "otpauth://totp/..."}` |

---

### POST /api/admin/2fa/verify - Verify and Enable 2FA

Verify 2FA code and enable 2FA.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | 6-digit code from authenticator app |
| `secret` | string | Yes | Secret from setup step |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | 2FA enabled | `{"success": true, "message": "2FA enabled successfully"}` |
| 400 | Invalid code | `{"error": "Invalid verification code"}` |

---

### POST /api/admin/2fa/disable - Disable 2FA

Disable two-factor authentication.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Current 2FA code to confirm |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | 2FA disabled | `{"success": true, "message": "2FA disabled successfully"}` |
| 400 | Invalid code | `{"error": "Invalid 2FA code"}` |

---

## Admin Export

Export data for backup or analysis. **All endpoints require admin authentication.**

### GET /api/admin/export/whitelist - Export Whitelist

Export whitelist data as JSON.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Whitelist export | `{"whitelist": [...], "exportedAt": "2024-01-01T00:00:00Z"}` |

---

### GET /api/admin/export/payments - Export Payments

Export payment history.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Payment export | `{"payments": [...], "exportedAt": "..."}` |

---

## Admin Payment Management

Manage payments and transactions. **All endpoints require admin authentication.**

### GET /api/admin/payments - Get All Payments

Get all payment records.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Payments | `{"payments": [{"orderId": "...", "uid": "...", "amount": 99, "status": "success", "createdAt": "..."}]}` |

---

### POST /api/admin/payments/refund - Process Refund

Process a payment refund.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `paymentId` | string | Yes | Razorpay payment ID |
| `amount` | number | No | Partial refund amount (optional, full refund if not specified) |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Refund processed | `{"success": true, "refundId": "rfnd_xxx"}` |
| 400 | Refund failed | `{"error": "Refund failed: insufficient balance"}` |

---

## Admin Logs & Audit

View system logs and audit trails. **All endpoints require admin authentication.**

### GET /api/admin/logs - Get Emote Logs

Get emote sending logs.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Emote logs | `[{"timestamp": "2024-01-01T12:00:00Z", "ip": "192.168.1.1", "uid": "1234567890", "emoteCode": "123456789", "success": true}]` |

---

### GET /api/admin/audit-logs - Get Audit Logs

Get admin action audit logs.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Audit logs | `[{"action": "update", "type": "settings", "user": "admin", "timestamp": "2024-01-01T12:00:00Z", "details": {...}}]` |

---

### GET /api/admin/payment-logs - Get Payment Logs

Get payment transaction logs.

**Authentication:** Required

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Payment logs | `{"payments": [{"orderId": "order_xxx", "uid": "1234567890", "status": "success", "amount": 99, "createdAt": "..."}]}` |

---

## Admin Backup & Restore

Export and import system backups. **All endpoints require admin authentication.**

### GET /api/admin/backup/export - Export Backup

Download complete system backup as JSON file.

**Authentication:** Required

#### Example Request

```bash
curl -X GET "https://www.1onlysarkar.shop/api/admin/backup/export" \
  -H "Cookie: admin_session=xxx" \
  -o backup.json
```

#### Responses

| Status | Description |
|--------|-------------|
| 200 | JSON file download (Content-Disposition: attachment) |

---

### POST /api/admin/backup/import - Import Backup

Restore system from backup file.

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `backup` | object | Yes | Full backup JSON object |

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | Backup restored | `{"success": true, "restored": ["emotes", "settings", "whitelist", "plans"], "errors": []}` |
| 400 | Invalid backup | `{"error": "Invalid backup file", "details": ["Missing required field: settings"]}` |

---

## Admin File Upload

Upload files like logo and favicon. **All endpoints require admin authentication.**

### POST /api/admin/upload - Upload File

Upload logo or favicon image (max 1MB).

**Authentication:** Required

**Content-Type:** multipart/form-data

#### Request Body (Form Data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | Image file to upload (PNG, JPG, ICO) |
| `type` | string | Yes | Upload type: `logo` or `favicon` |

#### Example Request

```bash
curl -X POST "https://www.1onlysarkar.shop/api/admin/upload" \
  -H "Cookie: admin_session=xxx" \
  -F "file=@logo.png" \
  -F "type=logo"
```

#### Responses

| Status | Description | Example Response |
|--------|-------------|------------------|
| 200 | File uploaded | `{"success": true, "url": "/uploads/logo/logo-1704067200.png", "filename": "logo-1704067200.png"}` |
| 400 | File too large | `{"error": "File size must be less than 1MB"}` |
| 400 | Invalid type | `{"error": "Invalid file type. Only PNG, JPG, and ICO are allowed."}` |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

| Endpoint | Limit | Description |
|----------|-------|-------------|
| Send Emote | 30 seconds cooldown | Between emote requests per UID |
| Free Users | 10 emotes/day | Daily limit for non-premium users |
| Premium Users | Unlimited | No rate limits or daily restrictions |
| Payment Creation | 5/hour | Maximum payment attempts per UID |
| Admin Login | 5 attempts/15 min | Login attempt throttling |

### Rate Limit Response

When rate limited, endpoints return:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 30,
  "limitType": "cooldown"
}
```

---

## Error Handling

All endpoints return consistent error responses:

### Error Response Format

```json
{
  "error": "Human-readable error message",
  "success": false,
  "code": "ERROR_CODE",
  "details": "Additional context (optional)"
}
```

### Common HTTP Status Codes

| Status | Description | Common Causes |
|--------|-------------|---------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid input, validation errors, malformed JSON |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Blocked UID, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Feature disabled, maintenance |
| 504 | Gateway Timeout | External API timeout |

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_UID` | UID format is invalid |
| `UID_BLOCKED` | UID is blocked from service |
| `DAILY_LIMIT_REACHED` | Free user daily limit exceeded |
| `COOLDOWN_ACTIVE` | Must wait before next request |
| `INVALID_CREDENTIALS` | Wrong username or password |
| `2FA_REQUIRED` | Two-factor authentication needed |
| `PAYMENT_FAILED` | Payment processing error |
| `SIGNATURE_INVALID` | Webhook signature verification failed |

---

## Authentication

### Admin Authentication

Admin endpoints use HTTP-only session cookies for authentication:

1. **Login** - POST `/api/admin/login` with credentials
2. **2FA** (if enabled) - POST `/api/admin/login/verify-2fa` with code
3. **Session** - Cookie `admin_session` is set automatically
4. **Logout** - POST `/api/admin/logout` to end session

### Session Duration

- Admin sessions expire after 24 hours of inactivity
- Sessions are invalidated on logout
- Maximum session duration: 7 days

### Security Headers

All responses include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## SDK Examples

### JavaScript/Node.js

```javascript
// Check whitelist status
const response = await fetch('https://www.1onlysarkar.shop/api/whitelist/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ uid: '1234567890' })
});
const data = await response.json();
console.log(data.whitelisted ? 'Premium user' : 'Free user');
```

### Python

```python
import requests

# Send emote
response = requests.post(
    'https://www.1onlysarkar.shop/api/send-emote',
    json={
        'uid': '1234567890',
        'teamCode': 'TEAM123',
        'emoteCode': '123456789'
    }
)
print(response.json())
```

### cURL

```bash
# Get available plans
curl -X GET "https://www.1onlysarkar.shop/api/razorpay/plans"

# Check daily stats
curl -X POST "https://www.1onlysarkar.shop/api/daily-stats" \
  -H "Content-Type: application/json" \
  -d '{"uid": "1234567890"}'
```

---

## Changelog

### Version 1.0.0
- Initial API release
- Emote sending with rate limiting
- Premium subscriptions via Razorpay
- Admin dashboard and management
- 2FA authentication support
- Blog and custom pages
- Backup and restore functionality

---

**Support:** For API support or issues, contact the FF 1ONLYSARKAR SHOP team.

**Last Updated:** December 2024
