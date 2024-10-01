// src/actions/tickerActions.ts

const getAccessToken = () => {
  const session = localStorage.getItem('session');
  if (!session) {
    console.error('No session found');
    return null;
  }

  const parsedSession = JSON.parse(session);
  return parsedSession.accessToken;
};

export const addTicker = async (tickerData: any) => {

    const accessToken = getAccessToken();

    const response = await fetch('https://api.sayncast.dubai-app.com/api/dashboard/tv-ticker', {
     
     
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },
      body: JSON.stringify(tickerData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to add ticker');
    }
  
    return response.json();
  };
  
export const deleteTicker = async (tickerId: string) => {
  const accessToken = getAccessToken();

    const response = await fetch(`https://api.sayncast.dubai-app.com/api/dashboard/tv-ticker/${tickerId}`, {
      method: 'DELETE',
      headers: {
       
        'Authorization': `Bearer ${accessToken}`

      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete ticker');
    }
  
    return response.json();
  };
  

  