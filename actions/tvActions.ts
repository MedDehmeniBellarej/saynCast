// src/actions/tvActions.ts
const getAccessToken = () => {
    const session = localStorage.getItem('session');
    if (!session) {
      console.error('No session found');
      return null;
    }
  
    const parsedSession = JSON.parse(session);
    return parsedSession.accessToken;
  };

export const updateTvName = async (tvId: string, newName: string) => {
    const accessToken = getAccessToken();

    const response = await fetch(`https://idp.sayncast.dubai-app.com/auth/edit/${tvId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ userName: newName }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update TV name');
    }
  
    return response.json();
  };
  