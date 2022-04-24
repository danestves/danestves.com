// Dependencies
import { ArrowSmRightIcon } from "@heroicons/react/outline";
import { useActionData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useTranslation } from "react-i18next";
import { useHydrated } from "remix-utils";
import { ValidatedForm, useIsSubmitting, validationError } from "remix-validated-form";
import { z } from "zod";
import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import type { HandleStructuredData } from "remix-utils";

// Internals
import { SpinIcon } from "~/components/icons/spin";
import { Input } from "~/components/input";
import { Link } from "~/components/link";
import { TextArea } from "~/components/textarea";
import { externalLinks } from "~/external-links";
import { i18n } from "~/utils/i18n.server";
import { sendContactEmail } from "~/utils/mail.server";
import { getSeoMeta } from "~/utils/seo";
import type { Handle } from "~/types";

export const handle: HandleStructuredData<LoaderData> & Handle = {
  structuredData(data) {
    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: data.seo.title,
      description: data.seo.description,
      url: `${externalLinks.self}/contact`,
    };
  },
  i18n: ["errors"],
};

export const validator = withZod(
  z.object({
    email: z.string().nonempty("nonempty").email("email"),
    name: z.string().nonempty("nonempty"),
    subject: z.string().nonempty("nonempty"),
    message: z.string().nonempty("nonempty"),
  })
);

type ActionData = {
  fieldErrors?: {
    [key: string]: string;
  };
  success?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const data = result.data;

  const emailSent = await sendContactEmail({
    email: data.email,
    name: data.name,
    subject: data.subject,
    text: data.message,
  });

  if (!emailSent.id) {
    return validationError(
      {
        fieldErrors: {
          emailSent: "Cannot send email",
        },
      },
      result.submittedData
    );
  }

  return json<ActionData>({ success: true });
};

type LoaderData = {
  seo: {
    title: string;
    description: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "pages");

  return json<LoaderData>({
    seo: {
      title: t("contact.seo.title"),
      description: t("contact.seo.description"),
    },
  });
};

export const meta: MetaFunction = ({ data }) => {
  const dataLoader = data as LoaderData;
  const title = dataLoader.seo.title;

  return {
    ...getSeoMeta({
      title,
      description: dataLoader.seo.description,
    }),
    "og:image:alt": title,
    "twitter:image:alt": title,
  };
};

function SubmitButton() {
  const { t } = useTranslation("pages");
  const isSubmitting = useIsSubmitting();

  return (
    <button
      aria-disabled={isSubmitting ? "true" : undefined}
      className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-75 dark:text-body-darker"
      disabled={isSubmitting ?? undefined}
      type="submit"
    >
      {isSubmitting ? t("contact.form.submit.sending") : t("contact.form.submit.label")}
      {isSubmitting ? (
        <SpinIcon aria-hidden="true" className="-mr-1 ml-3 h-5 w-5 animate-spin" />
      ) : (
        <ArrowSmRightIcon aria-hidden="true" className="-mr-1 ml-3 h-5 w-5" />
      )}
    </button>
  );
}

function FormError() {
  const { t } = useTranslation("errors");

  return (
    <div
      className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
      id="contact-form-error"
      role="alert"
    >
      <span className="font-medium">
        {t("contactForm.0")}{" "}
        <span aria-label="disapointed face" role="img">
          😞
        </span>
      </span>{" "}
      ! {t("contactForm.1")} {t("contactForm.2")}{" "}
      <Link className="font-medium underline" to={externalLinks.twitterDm}>
        {t("contactForm.3")}{" "}
        <span aria-label="bird" role="img">
          🐦
        </span>
      </Link>
      .
    </div>
  );
}

export default function ContactPage() {
  const actionData = useActionData<ActionData>();
  const { t } = useTranslation("pages");
  const isHydrated = useHydrated();

  return (
    <div className="w-full py-32">
      <div className="container mx-auto mt-5 max-w-xl">
        <h1 className="text-center text-[26px] font-black uppercase text-primary-700 dark:text-primary">
          {t("contact.seo.title")}{" "}
          <span aria-label="victory hand" role="img">
            ✌️
          </span>
        </h1>

        <p className="text-center text-lg text-body/80 dark:text-body-dark/80">{t("contact.seo.description")}</p>

        <ValidatedForm
          aria-describedby={!actionData?.success ? "contact-form-error" : undefined}
          className="mt-8 space-y-6"
          method="post"
          noValidate={isHydrated}
          resetAfterSubmit
          validator={validator}
        >
          <Input
            id="name"
            label={t("contact.form.name.label")}
            name="name"
            placeholder={t("contact.form.name.placeholder")}
          />

          <Input
            id="email"
            label={t("contact.form.email.label")}
            name="email"
            placeholder={t("contact.form.email.placeholder")}
            type="email"
          />

          <Input
            id="subject"
            label={t("contact.form.subject.label")}
            name="subject"
            placeholder={t("contact.form.subject.placeholder")}
          />

          <TextArea
            caption={t("contact.form.message.caption")}
            className="resize-none"
            id="message"
            label={t("contact.form.message.label")}
            name="message"
            placeholder={t("contact.form.message.placeholder")}
            rows={6}
          />

          <div className="flex items-center justify-end">
            {actionData?.success ? (
              <p>
                {t("contact.form.success")}
                <span aria-label="party popper emoji" role="img">
                  🎉
                </span>
              </p>
            ) : (
              <SubmitButton />
            )}
          </div>

          {actionData?.fieldErrors?.emailSent ? <FormError /> : null}
        </ValidatedForm>
      </div>
    </div>
  );
}
