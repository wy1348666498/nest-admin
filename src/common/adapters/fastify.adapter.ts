import FastifyCookie from '@fastify/cookie';
import FastifyMultipart from '@fastify/multipart';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const app: FastifyAdapter = new FastifyAdapter({
  // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
  trustProxy: true, // // 启用代理信任
  logger: false, // 禁用日志记录
  // forceCloseConnections: true, // 强制关闭连接（可选，默认为false）
});
export { app as fastifyApp };

app.register(FastifyMultipart, {
  limits: {
    fields: 10, // 最大非文件字段数
    fileSize: 1024 * 1024 * 6, // 文件大小限制为 6MB
    files: 5, // 最大文件字段数
    headerPairs: 2000, // 请求头键值对的最大数量
  },
});

app.register(FastifyCookie, {
  secret: 'cookie-secret', // 这个 secret 不太重要，不存鉴权相关，无关紧要
});

app.getInstance().addHook('onRequest', (request, reply, done) => {
  // set undefined origin
  const { origin } = request.headers;
  if (!origin) request.headers.origin = request.headers.host;

  // forbidden php

  const { url } = request;

  if (url.endsWith('.php')) {
    reply.raw.statusMessage =
      'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.';

    return reply.code(418).send();
  }

  // skip favicon request
  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/))
    return reply.code(204).send();

  done();
});
