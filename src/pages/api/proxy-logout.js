// pages/api/proxy-logout.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Forward cookies
    const backendRes = await axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/logout`, {}, {
      headers: {
        cookie: req.headers.cookie || "",
      },
      withCredentials: true,
    });

    // Forward Set-Cookie from backend to browser
    const setCookies = backendRes.headers['set-cookie'];
    if (setCookies) {
      res.setHeader('Set-Cookie', setCookies);
    }
  } catch (e) {
    // Still try to clear cookies in browser (force expire, just in case)
    res.setHeader('Set-Cookie', [
      `accessToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      `refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ]);
  }

  // Redirect to home
  res.writeHead(302, { Location: '/' });
  res.end();
}
