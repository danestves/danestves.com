// Dependencies
import * as React from "react";
import { useNavigate } from "@remix-run/react";
import { useRegisterActions } from "kbar";
import { useTranslation } from "react-i18next";
import type { Action } from "kbar";

type ServerAction = Omit<Action, "perform"> & {
  link: string;
};

function ServerActions() {
  const [customActions, setCustomActions] = React.useState<Action[]>([]);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const loadContent = async (signal: AbortSignal) => {
      const contentActions = await fetch("_content/get-kbar-actions.json");
      const { actions } = (await contentActions.json()) as {
        actions: ServerAction[];
      };

      const newActions: Action[] = actions.map(({ link, ...props }) => ({
        ...props,
        perform: async () => navigate(link),
      }));

      setCustomActions(newActions);
    };

    loadContent(signal).catch((error) => {
      const message = error instanceof Error ? error.message : (error as string);

      console.error(message);
    });

    return () => {
      abortController.abort();
    };
  }, [customActions.length, navigate, i18n.language]);

  useRegisterActions(customActions, [customActions]);

  return null;
}

export { ServerActions };
