import React from "react";
import {
  Page, Heading, Text, Column, Table, TableRow, TableCell,
  defineTheme, render, validate,
} from "@hyper-elements/react";

// ---------------------------------------------------------------------------
// The mock brain: simple keyword rules, no LLM, no API key, no cost.
// The prompt is matched against keyword lists; the first match wins.
// ---------------------------------------------------------------------------
export const RULES = [
  {
    id: "book-table",
    keywords: ["book", "table", "restaurant", "dinner", "reservation", "lunch"],
    title: "Book a table",
    description: "Reserve a table at the restaurant.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "time", label: "Time", type: "time", required: true },
      { name: "guests", label: "Number of guests", type: "number", required: true },
      { name: "notes", label: "Anything we should know?", type: "textarea", required: false },
    ],
  },
  {
    id: "newsletter",
    keywords: ["newsletter", "subscribe", "sign up", "signup", "mailing list"],
    title: "Newsletter sign-up",
    description: "Join the mailing list.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "email", label: "Email address", type: "email", required: true },
      { name: "interests", label: "What interests you?", type: "select", options: ["Tech", "Design", "News"], required: false },
    ],
  },
  {
    id: "bug-report",
    keywords: ["bug", "report", "issue", "crash", "broken", "error"],
    title: "Report a bug",
    description: "Tell us what went wrong.",
    fields: [
      { name: "title", label: "Bug title", type: "text", required: true },
      { name: "steps", label: "Steps to reproduce", type: "textarea", required: true },
      { name: "severity", label: "Severity", type: "select", options: ["Low", "Medium", "High"], required: true },
      { name: "email", label: "Your email", type: "email", required: false },
    ],
  },
  {
    id: "job-application",
    keywords: ["job", "apply", "career", "vacancy", "hiring"],
    title: "Job application",
    description: "Apply for a role.",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email address", type: "email", required: true },
      { name: "portfolio", label: "Portfolio link", type: "url", required: false },
      { name: "cover", label: "Cover note", type: "textarea", required: true },
    ],
  },
  {
    id: "feedback",
    keywords: ["feedback", "survey", "review", "rate"],
    title: "Feedback",
    description: "Tell us what you think.",
    fields: [
      { name: "rating", label: "Rating", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
      { name: "comments", label: "Your comments", type: "textarea", required: true },
      { name: "email", label: "Email (optional)", type: "email", required: false },
    ],
  },
  {
    id: "contact",
    keywords: ["contact", "message", "hello", "reach"],
    title: "Contact us",
    description: "Send us a message.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "email", label: "Email address", type: "email", required: true },
      { name: "message", label: "Your message", type: "textarea", required: true },
    ],
  },
];

const FALLBACK = {
  id: "general",
  keywords: [],
  title: "General form",
  description: "A simple form built from your prompt.",
  fields: [
    { name: "name", label: "Your name", type: "text", required: true },
    { name: "email", label: "Email address", type: "email", required: true },
    { name: "message", label: "Your message", type: "textarea", required: true },
  ],
};

export function buildForm(prompt) {
  const text = String(prompt || "").toLowerCase();
  const rule = RULES.find((r) => r.keywords.some((k) => text.includes(k))) || FALLBACK;
  return { ...rule, prompt: String(prompt || "").trim(), matched: rule.id !== "general" };
}

const theme = defineTheme({
  colors: {
    background: "#f4f4f5", foreground: "#18181b", primary: "#111827",
    primaryForeground: "#ffffff", muted: "#71717a", border: "#e4e4e7",
  },
  fonts: { body: "Inter, Arial, sans-serif" },
  styles: { card: { backgroundColor: "#ffffff", padding: 24, gap: 12, borderRadius: 8 } },
});

function fieldRow(f) {
  return React.createElement(TableRow, { key: f.name },
    React.createElement(TableCell, null, f.label),
    React.createElement(TableCell, null, f.type),
    React.createElement(TableCell, null, f.required ? "Yes" : "No"));
}

// The Hyper Elements template: a Page that describes the generated form.
// Hyper Elements is a page/document template library, not a form-input
// library, so the template is the printable, shareable page version of
// the form: title, description, a table of its fields, and the mock note.
export function templateElement(form) {
  return React.createElement(Page, { theme, title: form.title },
    React.createElement(Column, { style: { apply: ["card"] } },
      React.createElement(Heading, { level: 1 }, form.title),
      React.createElement(Text, null, form.description),
      React.createElement(Text, null, `Built from the prompt: "${form.prompt}"`),
      React.createElement(Table, { style: { cellPadding: [8, 0], rowBorder: { width: 1, style: "solid", color: "#e4e4e7" } } },
        React.createElement(TableRow, { header: true },
          React.createElement(TableCell, null, "Field"),
          React.createElement(TableCell, null, "Type"),
          React.createElement(TableCell, null, "Required")),
        ...form.fields.map(fieldRow)),
      React.createElement(Text, null, "MOCK: the fields were picked by simple keyword rules, not by an AI model. Fill in the live form on the smart-form page.")));
}

export function templateJsx(form) {
  const rows = form.fields.map((f) =>
    `      <TableRow>\n        <TableCell>${f.label}</TableCell>\n        <TableCell>${f.type}</TableCell>\n        <TableCell>${f.required ? "Yes" : "No"}</TableCell>\n      </TableRow>`).join("\n");
  return `import { Page, Heading, Text, Column, Table, TableRow, TableCell, defineTheme, render } from "@hyper-elements/react";

const theme = defineTheme({ /* brand colours and fonts, once */ });

export default function ${form.title.replace(/[^A-Za-z]/g, "")}Form() {
  return (
    <Page theme={theme} title="${form.title}">
      <Column style={{ apply: ["card"] }}>
        <Heading level={1}>${form.title}</Heading>
        <Text>${form.description}</Text>
        <Text>Built from the prompt: "${form.prompt}"</Text>
        <Table>
          <TableRow header>
            <TableCell>Field</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Required</TableCell>
          </TableRow>
${rows}
        </Table>
        <Text>MOCK: fields picked by simple keyword rules, not by an AI model.</Text>
      </Column>
    </Page>
  );
}

const { html } = await render(<${form.title.replace(/[^A-Za-z]/g, "")}Form />);`;
}

export async function renderForm(form) {
  const el = templateElement(form);
  const { valid, diagnostics } = validate(el);
  if (!valid) throw new Error("Hyper Elements validation failed: " + JSON.stringify(diagnostics));
  const { html, diagnostics: renderDiagnostics } = await render(el);
  return { html, jsx: templateJsx(form), diagnostics: renderDiagnostics };
}
