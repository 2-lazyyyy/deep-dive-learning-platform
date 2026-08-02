---
name: duolingo-ux-reference
description: "World-class UI/UX reference distilled from Duolingo's PUBLIC design guidelines (design.duolingo.com) — color tokens, typography rules, and UX-writing/microcopy patterns — for frontend devs. Unofficial, not affiliated with Duolingo. Use when building or reviewing UI: choosing colors, type, button/header copy, success/error/empty-state messages, notifications, or when a PR asks 'does this feel friendly / clear / delightful?'. A reference lens to improve your own product, not a way to clone Duolingo."
---

<!-- argument-hint: [color | typography | ux-writing | writing-mechanics | illustration | a specific UI question] -->

# Duolingo Design — for Frontend Devs

**Source**: design.duolingo.com (Brand Guidelines) · captured 2026-07-17 · Duolingo Brand/Design team
**What this is**: the parts of Duolingo's brand system a dev can *apply in code* — visual tokens + copy decision rules. Not marketing theory; decisions you make in a component.

## How to use
- Ask about `color`, `typography`, `ux-writing`, `writing-mechanics`, or `illustration` → I load that reference.
- Ask a concrete UI question ("what should this error say?", "button label style?", "primary CTA color?") → I answer from the rules below, reading the reference if needed.
- Building a component → check **Color** + **Typography** tokens; writing any string a user sees → check **UX-writing decision rules**.

---

## Core decision rules (memorize these)

### Color
- **Feather Green `#58CC02`** = the brand. Primary CTA, primary accent. *When in doubt, lean green.*
- **Eel `#4B4B4B`** = body text. Never pure black `#000`.
- **Snow `#FFFFFF`** = primary background. All apps designed on white.
- **Cardinal `#FF4B4B`** = errors / destructive / "wrong". **Bee `#FFC800`** = warning/highlight. **Macaw `#1CB0F6`** = info/links.
- Neutrals for hierarchy only (Wolf `#777`, Hare `#AFAFAF`, Swan `#E5E5E5`, Polar `#F7F7F7`) — never let them compete with brand colors.
- Backgrounds behind illustrations: **pastels, never gray** (gray reads lifeless/cold).
→ full palette + copy-paste CSS/RN tokens: `references/color.md`

### Typography
- **Display / headline** → Feather Bold (bespoke; dev substitute: a heavy *rounded* display face). lowercase, left-aligned, ≤10 words, never < 30px, tracking -20, leading 100–110%.
- **Body / UI / long copy** → DIN Next Rounded (**free substitute: Nunito**, Google Fonts). leading 140%, tracking 0, never < 14px.
- Headline > 10 words? Switch to the body face.
- Never mix the two faces in one sentence. Never fully justify. Never hyphenate.
→ full rules + type scale guidance: `references/typography.md`

### UX-writing (the highest-value part for a dev)
The voice is **Expressive, Playful, Embracing, Worldly**. Applied as concrete rules:

| Surface | Rule | Do | Don't |
|---|---|---|---|
| **Button** | ALL CAPS, no punctuation | `CHECK`, `DOWNLOAD NOW` | `Check`, `NO, THANKS` |
| **Header/subhead** | sentence case, no end punctuation *except* `!` | `Freeze your streak!` | `Freeze Your Streak.` |
| **Success** | celebrate, exclaim | `You did it!` `Correct!` | `You are correct` |
| **Error/failure** | gentle, encouraging, never blame | `Not quite correct. Try again!` | `Incorrect.` `WRONG` |
| **Person reference** | gender-neutral they/them | `Tell them thanks` | `Tell him or her thanks` |
| **The user** | call them **"learners"**, never "users" | `learners` | `users` (internal-only) |
| **Contractions** | use them | `You're doing great!` | `You are doing great!` |
| **Numbers** | numerals always, even < 10 | `4 day streak` | `four day streak` |
| **Emoji** | ~1 per push, omit ~half the time | `Ready for a break? 🤷` | emoji every message |

Tone **adapts** to the moment (voice never changes): celebrate wins loudly, support stumbles softly, and for serious/emotional stories drop the exuberance and exclamation points.
→ voice qualities + notification/state copy patterns: `references/ux-writing.md`
→ granular mechanics (punctuation, capitalization tables, product term glossary): `references/writing-mechanics.md`

### Illustration (only if building mascot/illustration UI)
- All illustrations from **3 shapes**: rounded rectangle, circle, rounded triangle. Everything rounded — pointy is off-brand.
- Simplicity: fewest shapes that still communicate (~15 is the sweet spot, 30 too many).
- Shadows = **pill shape, never oval** (oval implies perspective; style is flat).
- Duo (the owl mascot): communicates via text only, never talks; day owl; no fingers, no weapons/signs.
→ `references/illustration.md`

---

## Reference index
| File | Load when |
|---|---|
| [references/color.md](references/color.md) | picking colors, defining tokens, states |
| [references/typography.md](references/typography.md) | type choices, scale, font fallback |
| [references/ux-writing.md](references/ux-writing.md) | writing any user-facing string, voice/tone |
| [references/writing-mechanics.md](references/writing-mechanics.md) | punctuation, capitalization, numerals, product terms |
| [references/illustration.md](references/illustration.md) | mascot/illustration/character work |

## Topic index
- **CTA / primary button color** → color.md (Feather Green)
- **error color / error copy** → color.md (Cardinal) + ux-writing.md
- **empty state / loading / notification copy** → ux-writing.md
- **font fallback / free font** → typography.md (Nunito)
- **button label casing** → SKILL.md rules + writing-mechanics.md
- **capitalize this word?** → writing-mechanics.md (capitalization tables)
- **"users" vs "learners"** → writing-mechanics.md (words to avoid)

## Scope & limits
Covers Duolingo's public **brand guidelines**: color, type, voice/tone, illustration. It is **not** a component spec sheet — there are no button/input/spacing-scale/component measurements here (Duolingo doesn't publish those). Use these as principles and map them onto your own design system's components. Font note: Feather Bold and DIN Next Rounded are **proprietary** — ship Nunito (free) as the substitute.
