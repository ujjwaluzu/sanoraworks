import { handlePublicUtility } from '@/lib/public-http';
export const dynamic = 'force-dynamic';
function handle(request: Request) { return handlePublicUtility(request) ?? new Response('Not found', { status: 404 }); }
export { handle as GET, handle as HEAD, handle as POST, handle as PUT, handle as PATCH, handle as DELETE, handle as OPTIONS };
