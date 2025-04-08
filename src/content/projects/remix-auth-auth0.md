---
pubDate: 2021-12-21
title: remix-auth-auth0
subtitle: An Auth0Strategy for Remix Auth, based on the OAuth2Strategy
live: "https://github.com/danestves/remix-auth-auth0"
logo:
  url: "projects/github.png"
  alt: "Remix Auth Auth0"
image:
  url: "projects/remix-auth-auth0-og.png"
  alt: "Remix Auth Auth0 first step"
---

## Introduction

**Remix Auth Auth0** is a powerful authentication strategy for Remix applications that seamlessly integrates with Auth0. Built on top of the OAuth2Strategy, it provides a robust and secure way to handle user authentication in your Remix applications.

### Background

As Remix applications became more popular, the need for a reliable and easy-to-implement authentication solution grew. This strategy was created to bridge the gap between Remix applications and Auth0's powerful authentication platform, making it simple for developers to implement secure authentication in their applications.

## Features

### Cross-Platform Support

The strategy supports multiple runtime environments:

- ✅ Node.js
- ✅ Cloudflare

### Flexible Authentication Flow

The strategy provides a comprehensive authentication flow that includes:

- OAuth2-based authentication
- Token management
- Customizable cookie handling
- Scope-based permissions
- Token refresh capabilities
- Token revocation

### Customizable Implementation

Developers can customize various aspects of the authentication process:

- Cookie configuration
- Scope selection
- Token handling
- User data processing

## Implementation

### Basic Setup

1. **Installation**

```bash
npm add remix-auth remix-auth-auth0
```

2. **Strategy Configuration**

```typescript
import { Auth0Strategy } from "remix-auth-auth0";

export let authenticator = new Authenticator<User>();

authenticator.use(
  new Auth0Strategy(
    {
      domain: "xxx.auth0.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      redirectURI: "https://example.app/auth/callback",
      scopes: ["openid", "email"],
    },
    async ({ tokens, request }) => {
      return await getUser(tokens, request);
    },
  ),
);
```

### Advanced Features

#### Token Refresh

The strategy includes built-in support for token refresh operations:

```typescript
let tokens = await strategy.refreshToken(user.refreshToken);
```

#### Token Revocation

Easily revoke access tokens when needed:

```typescript
await strategy.revokeToken(user.accessToken);
```

#### Custom Cookie Configuration

```typescript
{
  cookie: {
    name: "auth0",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/auth",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  }
}
```

## Impact

Remix Auth Auth0 has become a crucial tool in the Remix ecosystem:

- Over 120 stars on GitHub
- 32+ forks by developers
- Active community contributions
- Regular updates and maintenance
- Comprehensive documentation and examples

## Technical Details

The project is built with:

- TypeScript for type safety
- Comprehensive test coverage
- MIT licensed for maximum flexibility
- Regular security updates
- Community-driven development

## Conclusion

Remix Auth Auth0 represents a significant contribution to the Remix ecosystem, providing developers with a reliable, secure, and easy-to-implement authentication solution. Its continued development and active community support make it an excellent choice for Remix applications requiring Auth0 integration.

**Repository:** [remix-auth-auth0](https://github.com/danestves/remix-auth-auth0)
