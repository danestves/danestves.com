---
kind: app
category: HealthApplication
pubDate: 2026-04-22
title: Vela
seoTitle: Vela, a private period tracker
subtitle: A private period tracker that encrypts before anything syncs, with keys the server never holds.
live: "https://hellovela.app"
links:
  - label: "hellovela.app"
    url: "https://hellovela.app"
  - label: "App Store"
    url: "https://apps.apple.com/us/app/vela-period-cycle-tracker/id6759990819"
  - label: "Google Play"
    url: "https://play.google.com/store/apps/details?id=com.hellovela.android"
  - label: "Source, AGPL-3.0"
    url: "https://github.com/hellovela/app"
logo:
  url: "/projects/vela-icon.webp"
  alt: "Vela"
screens:
  - url: "/projects/vela-calendar.webp"
    alt: "Vela’s calendar: the cycle by day, with today’s mood and symptoms"
    caption: "Calendar. The cycle by day, with what you logged."
    width: 1600
    height: 1000
  - url: "/projects/vela-report.webp"
    alt: "Vela’s medical report, generated on the device for a healthcare provider"
    caption: "Medical report. Built on the device, for your doctor."
    width: 1600
    height: 1000
---

Vela is a private period tracker for iOS and Android, made by danestves LLC, the software studio of Daniel Esteves.

## What it does

Vela predicts your period, ovulation and fertile window, then learns your own patterns for cramps, mood and energy.

## Private by design

There are no ads and no data selling. Cycle data lives on the phone. If you turn sync on, every record is encrypted on the device first, with keys the server never holds: the server stores a ciphertext, a nonce and two ids, and nothing it can read.

## Open source

The whole app is public under AGPL-3.0 at [github.com/hellovela/app](https://github.com/hellovela/app), so anyone can check those claims.

## Pricing

Period and ovulation predictions are free forever. Premium starts with a 7-day free trial on the yearly plan.

## How it is built

Expo and React Native, for iOS and Android.

## Where to get it

On the App Store since 22 April 2026, and on Google Play.
