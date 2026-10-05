import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Internova team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        title="Contact us"
        description="Have a question or feedback? Send us a message and we will get back to you."
      />
      <Card className="mt-10">
        <CardContent className="py-8">
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
