// Dependencies
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useRegisterActions } from "kbar";
import { useTranslation } from "react-i18next";
import type { Action } from "kbar";

type ServerAction = Omit<Action, "perform"> & {
  link: string;
};

function ServerActions() {
  const [customActions, setCustomActions] = useState<Action[]>([]);
  const [locale, setLocale] = useState("");
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadContent = async () => {
      const contentActions = await fetch("/_content/get-kbar-actions.json");
      const { actions, locale } = (await contentActions.json()) as {
        actions: ServerAction[];
        locale: string;
      };

      const newActions: Action[] = actions.map(({ link, ...props }) => ({
        ...props,
        perform: async () => navigate(link),
      }));

      setCustomActions(newActions);
      setLocale(locale);
    };

    if (!customActions.length || i18n.language !== locale) {
      loadContent().catch((error) => {
        const message = error instanceof Error ? error.message : (error as string);

        console.error(message);
      });
    }
  }, [customActions.length, navigate, i18n.language, locale]);

  useRegisterActions(customActions, [customActions]);

  return null;
}

export { ServerActions };
