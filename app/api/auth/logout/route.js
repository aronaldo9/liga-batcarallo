import { NextResponse } from 'next/server';

export async function POST(request) {
  const url = new URL('/', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete('batcarallo_session');
  return response;
}
