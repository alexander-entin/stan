import type { HattipHandler } from "@hattip/core";
import { createRouter } from "@hattip/router";
import { telefunc } from "telefunc";
import { renderPage } from "vike/server";

const router = createRouter();

router.post("/_telefunc", async (context) => {
  const httpResponse = await telefunc({
    url: context.url.toString(),
    method: context.method,
    body: await context.request.text(),
    context,
  });
  const { body, statusCode, contentType } = httpResponse;
  return new Response(body, {
    status: statusCode,
    headers: {
      "content-type": contentType,
    },
  });
});

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
router.use(async (context) => {
  const pageContextInit = { urlOriginal: context.request.url };
  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  return new Response(await response?.getBody(), {
    status: response?.statusCode,
    headers: response?.headers,
  });
});

export default router.buildHandler() as HattipHandler;
