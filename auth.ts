// auth.ts
export async function auth() {
    // Replace with your actual logic to retrieve the user session from your IDP
    const response = await fetch('/api/session', {
      credentials: 'include',
    });
  
    if (!response.ok) {
      return null;
    }
  
    const session = await response.json();
    return session;
  }
  