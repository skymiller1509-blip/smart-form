# &lt;smart-form&gt; — a Hyper Elements template

One template, one smart-form component, one working flow. Built for the
Hyper Elements Template Challenge.

## What it does

Type a prompt like "book a table for Friday night" and the form builds
itself: name, date, time, number of guests. Try "sign up for the
newsletter" or "report a bug" and you get a different form.

**MOCK:** the fields are picked by simple keyword rules, not by an AI
model. There is no LLM, no API key, no cost, and nothing is sent anywhere.
The MOCK label is on screen in the app and in the rendered template.

## How Hyper Elements is used

The generated form is rendered as a real Hyper Elements template, using
`@hyper-elements/react` (v0.4.6):

- The server builds a `Page` template from the generated fields
  (`rules.mjs`, `templateElement()`): a `Heading` with the form title, a
  `Text` description, and a `Table` listing every field with its type and
  whether it is required.
- The brand is set once with `defineTheme` (colours, fonts, a `card`
  style), and every template uses it.
- `render()` from `@hyper-elements/react` turns the template into HTML,
  and `validate()` checks it first. Both run on the server for every
  prompt, and the rendered page is shown in the app under "Rendered page".
- The generated JSX source is shown next to it under "Template source
  (JSX)", so you can copy the template into your own project.

Hyper Elements is a page and document template library, not a form-input
library, so the template is the printable, shareable page version of the
form. The live, fillable form on the page is plain HTML inputs built
from the same field list, so the two always agree.

## The keyword rules

| Prompt contains | Form built |
|---|---|
| book, table, restaurant, dinner, reservation | Book a table: name, date, time, guests, notes |
| newsletter, subscribe, sign up, mailing list | Newsletter sign-up: name, email, interests |
| bug, report, issue, crash, broken | Report a bug: title, steps, severity, email |
| job, apply, career, hiring | Job application: name, email, portfolio link, cover note |
| feedback, survey, review, rate | Feedback: rating, comments, email |
| contact, message, hello | Contact us: name, email, message |
| anything else | General form: name, email, message |

## Run it

```bash
npm install
npm start
```

Then open http://localhost:4196

No account, no API key, no payment. Node 18+ is enough.

## Files

- `server.js` — static server plus `POST /api/build` (prompt in, form plus rendered Hyper Elements HTML and JSX out) and `GET /api/samples`.
- `rules.mjs` — the keyword rules, the Hyper Elements `Page` template builder, `render()` and `validate()` calls.
- `public/index.html`, `public/app.js`, `public/styles.css` — the prompt box, the live fillable form, and the rendered-template preview.
- `package.json` — dependencies: `@hyper-elements/react` and `react`.

## Screenshot

No screenshot file is included. The build VM's browser cannot start
(it refuses with a domain-policy error), so no real screenshot of the
running app could be captured here, and none was faked. The app is
verified instead by the live API tests below: `GET /` returns HTTP 200
and every sample prompt builds the right fields with a rendered Hyper
Elements page and zero diagnostics. Take a screenshot from the live app
on a phone or a real browser before submitting, and add it as
`screenshot.png`.

## Challenge

Hyper Elements Template Challenge, deadline 29 November 2026. Submission:
this repo link plus a screenshot, posted in Challenge Submissions on
GitHub Discussions, and a star on the hyper-elements/hyper-elements repo.
