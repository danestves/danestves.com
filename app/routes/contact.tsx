// Dependencies
import { ArrowSmRightIcon } from "@heroicons/react/outline";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useTranslation } from "react-i18next";
import { useHydrated } from "remix-utils";
import { ValidatedForm, useIsSubmitting, validationError } from "remix-validated-form";
import { z } from "zod";
import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";

// Internals
import { SpinIcon } from "~/components/icons/spin";
import { Input } from "~/components/input";
import { TextArea } from "~/components/textarea";
import { i18n } from "~/utils/i18n.server";
import { sendContactEmail } from "~/utils/mail.server";
import type { Handle } from "~/types";

export const handle: Handle = {
  i18n: ["errors", "pages"],
};

export const validator = withZod(
  z.object({
    email: z.string().nonempty("nonempty").email("email"),
    name: z.string().nonempty("nonempty"),
    subject: z.string().nonempty("nonempty"),
    message: z.string().nonempty("nonempty"),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const data = result.data;

  await sendContactEmail({
    email: data.email,
    name: data.name,
    subject: data.subject,
    text: data.message,
  });

  return json({ success: true });
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

  return {
    title: dataLoader.seo.title,
    description: dataLoader.seo.description,
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

export default function ContactPage() {
  const { t } = useTranslation("pages");
  const isHydrated = useHydrated();

  return (
    <div className="w-full py-32">
      <div className="container mx-auto mt-5 max-w-xl">
        <ValidatedForm
          className="space-y-6"
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

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
}
