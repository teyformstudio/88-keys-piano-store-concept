# Existing design tokens

Preserve these tokens while repairing the concept demo.

## Color

- `ink`: `#0b0a08`
- `coal`: `#100e0a`
- `panel`: `#171410`
- `panel2`: `#1e1a14`
- `line`: `rgba(243, 237, 226, 0.09)`
- `cream`: `#f3ede2`
- `sand`: `#a89f8d`
- `faint`: `#6f675a`
- `brass`: `#d9a648`
- `brass2`: `#f0cd7e`

## Type

- Display: Unbounded, with system sans fallback.
- Body: Manrope, with system sans fallback.

## Layout and interaction

- Existing Tailwind spacing utilities; avoid adding a competing spacing system.
- Existing rounded-card language ranges from rounded-xl to rounded-3xl; preserve the premium storefront feel.
- Motion: existing CSS and Framer Motion; honor `prefers-reduced-motion` for all nonessential motion.
