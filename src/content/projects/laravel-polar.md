---
pubDate: 2025-02-21
title: laravel-polar
subtitle: A package to easily integrate your Laravel application with Polar.sh
live: "https://github.com/danestves/laravel-polar"
logo:
  url: "projects/github.png"
  alt: "Laravel Polar"
image:
  url: "projects/laravel-polar-og.png"
  alt: "Laravel Polar Integration"
---

## Introduction

**Laravel Polar** is a comprehensive package that seamlessly integrates Polar.sh subscriptions and payments into your Laravel application. It provides an elegant way to handle subscriptions, manage recurring payments, and interact with Polar's API, complete with built-in support for webhooks and subscription management.

### Background

As the Laravel ecosystem continues to grow, developers need reliable solutions for handling subscriptions and payments. Laravel Polar bridges this gap by providing a robust integration with Polar.sh, following the conventions and patterns that Laravel developers are familiar with.

## Features

### Subscription Management

- Complete subscription lifecycle handling
- Multiple subscription types support
- Flexible plan switching
- Grace period management
- Cancellation and resumption capabilities

### Order Management

- Order tracking and management
- Refund handling
- Product and price verification
- Purchase history tracking

### Webhook Integration

Built-in support for various webhook events:

- Subscription events (created, updated, canceled, etc.)
- Order events (created, refunded)
- Benefit grant events (created, updated, revoked)

### Billable Models

- Easy integration with your existing User model
- Flexible subscription queries
- Purchase verification methods
- Subscription status checks

## Implementation

### Basic Setup

1. **Installation**

```bash
composer require danestves/laravel-polar
```

2. **Model Configuration**

```php
use Danestves\LaravelPolar\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

### Subscription Management

#### Creating Subscriptions

```php
Route::get('/subscribe', function (Request $request) {
    return $request->user()->subscribe('product_id_123');
});
```

#### Checking Subscription Status

```php
if ($user->subscribed()) {
    // User has an active subscription
}

if ($user->subscription()->hasProduct('product_id_123')) {
    // User is subscribed to specific product
}
```

### Advanced Features

#### Multiple Subscriptions

```php
// Subscribe to different types
$user->subscribe('product_id_123', 'swimming');
$user->subscribe('product_id_456', 'gym');

// Access specific subscriptions
$swimmingSub = $user->subscription('swimming');
$gymSub = $user->subscription('gym');
```

#### Plan Switching

```php
// Simple plan swap
$user->subscription()->swap('new_product_id');

// Immediate billing
$user->subscription()->swapAndInvoice('new_product_id');
```

#### Webhook Handling

```php
namespace App\Listeners;

use Danestves\LaravelPolar\Events\WebhookHandled;

class PolarEventListener
{
    public function handle(WebhookHandled $event): void
    {
        if ($event->payload['type'] === 'subscription.updated') {
            // Handle subscription update
        }
    }
}
```

## Impact

Laravel Polar has become an essential tool for Laravel developers integrating with Polar.sh:

- 25+ stars on GitHub
- Active development and maintenance
- Growing community adoption
- Comprehensive documentation
- Regular feature updates and bug fixes

## Technical Details

The project is built with:

- PHP 99.8% / Blade 0.2%
- PHPStan for static analysis
- PHPUnit for testing
- Laravel-specific best practices
- MIT licensed for maximum flexibility

## Roadmap

Future development plans include:

- Trial period support
- Enhanced subscription management features
- Additional webhook event handlers
- Expanded documentation and examples

## Conclusion

Laravel Polar represents a significant step forward in integrating Polar.sh with Laravel applications. Its comprehensive feature set, robust implementation, and active development make it the go-to solution for Laravel developers looking to implement Polar.sh subscriptions and payments.

**Package:** [laravel-polar](https://packagist.org/packages/danestves/laravel-polar)
