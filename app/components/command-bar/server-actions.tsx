// Dependencies
import * as React from "react";
import { useNavigate } from "@remix-run/react";
import { useRegisterActions } from "kbar";
import type { Action } from "kbar";

type ServerAction = Omit<Action, "perform"> & {
  link: string;
};

function ServerActions() {
  const [customActions, setCustomActions] = React.useState<Action[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadContent = async () => {
      const contentActions = await fetch("/api/kbar");
      const { actions } = (await contentActions.json()) as {
        actions: ServerAction[];
      };

      const newActions: Action[] = actions.map(({ link, ...props }) => ({
        ...props,
        perform: async () => navigate(link),
      }));

      setCustomActions(newActions);
    };

    if (!customActions.length) {
      loadContent().catch((error) => {
        const message = error instanceof Error ? error.message : (error as string);

        console.error(message);
      });
    }
  }, [customActions.length, navigate]);

  useRegisterActions(customActions, [customActions]);

  return null;
}

export { ServerActions };
