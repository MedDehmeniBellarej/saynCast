// src/actions/musicActions.ts
const API_BASE_URL = 'https://api.sayncast.dubai-app.com/api/dashboard/tv-music';

const getAccessToken = () => {
  const session = localStorage.getItem('session');
  if (!session) {
    console.error('No session found');
    return null;
  }

  const parsedSession = JSON.parse(session);
  return parsedSession.accessToken;
};

export const uploadMusic = async (tvId: string, file: File) => {
  const formData = new FormData();
  formData.append('files', file);

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  console.log(`Uploading music with accessToken: ${accessToken}`); // Debugging log

  try {
    const response = await fetch(`${API_BASE_URL}/upload-music/${tvId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload music');
    }
  } catch (error) {
    console.error('Error uploading music:', error);
  }
};

export const playMusic = async (id: string) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  console.log(`Playing music with accessToken: ${accessToken}`); // Debugging log

  try {
    const response = await fetch(`${API_BASE_URL}/Play/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to play music');
    }
  } catch (error) {
    console.error('Error playing music:', error);
  }
};

export const pauseMusic = async (id: string) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  console.log(`Pausing music with accessToken: ${accessToken}`); // Debugging log

  try {
    const response = await fetch(`${API_BASE_URL}/Pause/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to pause music');
    }
  } catch (error) {
    console.error('Error pausing music:', error);
  }
};

export const deleteMusic = async (id: string) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  console.log(`Deleting music with accessToken: ${accessToken}`); // Debugging log

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete music');
    }
  } catch (error) {
    console.error('Error deleting music:', error);
  }
};

