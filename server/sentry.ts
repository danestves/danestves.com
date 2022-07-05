// Dependencies
import * as Sentry from "@sentry/node";
import { isResponse } from "@remix-run/server-runtime/dist/responses";
import { nanoid } from "nanoid";
import type { ActionFunction, DataFunctionArgs, LoaderFunction, ServerBuild } from "@remix-run/server-runtime";
import type { Transaction } from "@sentry/types";
import type { Request, Response } from "express";

function wrapDataFunc(func: ActionFunction | LoaderFunction, routeId: string, method: string) {
  const ogFunc = func;

  return async (...args: DataFunctionArgs[]) => {
    const parentTransaction: Transaction | undefined = args[0].context && args[0].context.__sentry_transaction;
    const transaction =
      parentTransaction &&
      parentTransaction.startChild({
        op: `${method}:${routeId}`,
        description: `${method}: ${routeId}`,
      });
    transaction && transaction.setStatus("ok");
    transaction && (transaction.transaction = parentTransaction);

    try {
      // @ts-ignore
      return await ogFunc(...args);
    } catch (error) {
      if (isResponse(error)) {
        throw error;
      }

      Sentry.captureException(error, {
        tags: {
          global_id: parentTransaction && parentTransaction.tags["global_id"],
        },
      });

      transaction?.setStatus("internal_error");

      throw error;
    } finally {
      transaction && transaction.finish();
    }
  };
}

export function registerSentry(build: ServerBuild) {
  let routes: Record<string, typeof build["routes"][string]> = {};

  for (let [id, route] of Object.entries(build.routes)) {
    let newRoute: typeof build["routes"][string] = { ...route, module: { ...route.module } };

    if (route.module.action) {
      newRoute.module.action = wrapDataFunc(route.module.action, id, "action");
    }

    if (route.module.loader) {
      newRoute.module.loader = wrapDataFunc(route.module.loader, id, "loader");
    }

    routes[id] = newRoute;
  }

  return {
    ...build,
    routes,
  };
}

export function sentryLoadContext(req: Request, res: Response) {
  const transaction = Sentry.getCurrentHub().startTransaction({
    op: "request",
    name: `${req.method}: ${req.url}`,
    description: `${req.method}: ${req.url}`,
    metadata: {
      requestPath: req.url,
    },
    tags: {
      global_id: nanoid(),
    },
  });

  transaction && transaction.setStatus("internal_error");

  res.once("finish", () => {
    if (transaction) {
      transaction.setHttpStatus(res.statusCode);
      transaction.setTag("http.status_code", res.statusCode);
      transaction.setTag("http.method", req.method);
      transaction.finish();
    }
  });

  return {
    __sentry_transaction: transaction,
  };
}
