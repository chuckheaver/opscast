// Private field-kit script for one neighborhood: /field/<slug>.
// Server shell — resolves the slug, no-indexes the page, and hands the data
// to the client teleprompter component. Not linked from anywhere public.

import { nameForSlug } from "../lib";
import { SCRIPTS } from "../scripts";
import FieldScript from "../FieldScript";

export async function generateMetadata({ params }) {
  const { hood } = await params;
  const name = nameForSlug(hood);
  return {
    title: name ? `Field Kit — ${name}` : "Field Kit",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }) {
  const { hood } = await params;
  const name = nameForSlug(hood);
  const data = name ? SCRIPTS[name] || null : null;
  return <FieldScript name={name} data={data} />;
}
