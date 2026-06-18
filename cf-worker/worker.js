const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    // GET /products — public
    if (request.method === 'GET' && url.pathname === '/products') {
      const data = await env.KV.get('products');
      return new Response(data || '[]', {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    // PUT /products — requires Authorization: Bearer <token>
    if (request.method === 'PUT' && url.pathname === '/products') {
      const authHeader = request.headers.get('Authorization') || '';
      if (authHeader !== `Bearer ${env.WRITE_TOKEN}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      }
      const body = await request.text();
      try { JSON.parse(body); } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      }
      await env.KV.put('products', body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404, headers: CORS });
  }
};
