// src/actions/documentActions.ts
const API_BASE_URL = 'https://api.sayncast.dubai-app.com/api/dashboard/tv-document';

const getAccessToken = () => {
  const session = localStorage.getItem('session');
  if (!session) {
    console.error('No session found');
    return null;
  }

  const parsedSession = JSON.parse(session);
  return parsedSession.accessToken;
};

export const uploadDocumentMedia = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file); // Ensure the field name is 'files'

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  console.log(`Uploading document media with accessToken: ${accessToken}`); // Debugging log

  try {
    const response = await fetch(`${API_BASE_URL}/upload-document-medias`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload document media');
    }

    return await response.json(); // Assuming the response contains the file path or some useful data
  } catch (error) {
    console.error('Error uploading document media:', error);
  }
};

export const addDocument = async (documentData: {
  tvId: string[];
  displayOrder: number;
  startTime: string;
  displayTime: string;
  recurent: string;
  startAnimation: number;
  endAnimation: number;
  type: number;
  medias: string[];
}) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  console.log(`Adding document with accessToken: ${accessToken}`); // Debugging log

  try {
    const response = await fetch(`${API_BASE_URL}/add-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(documentData)
    });

    if (!response.ok) {
      throw new Error('Failed to add document');
    }

    return await response.json(); // Assuming the response contains the document data or some useful data
  } catch (error) {
    console.error('Error adding document:', error);
  }
};


// src/actions/documentActions.ts
export const uploadDocumentMedias = async (formData: FormData, onUploadProgress: (progressEvent: ProgressEvent<EventTarget>) => void) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }

  try {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/upload-document-medias`);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

      xhr.upload.onprogress = onUploadProgress;

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Failed to upload document media'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during file upload'));
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Error uploading document media:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${API_BASE_URL}/delete-document/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
};



export const uploadAndAddDocument = async (
  files: File[], 
  documentData: any, 
  onUploadProgress: (progress: number) => void
) => {
  return new Promise<void>((resolve, reject) => {
    const formData = new FormData();

    // Append files
    files.forEach(file => formData.append('files', file));

    // Append document data fields individually
    documentData.TvId.forEach((id: string) => formData.append('TvId', id));
    formData.append('DisplayOrder', documentData.DisplayOrder.toString());
    formData.append('StartTime', documentData.StartTime);
    formData.append('DisplayTime', documentData.DisplayTime);
    formData.append('Recurent', documentData.Recurent);
    formData.append('StartAnimation', documentData.StartAnimation.toString());
    formData.append('EndAnimation', documentData.EndAnimation.toString());
    formData.append('Type', documentData.Type.toString());

    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error('No access token available');
      reject('No access token available');
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/upload-and-add-document`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = (event.loaded / event.total) * 100;
        onUploadProgress(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText)); // Assuming the response contains the file paths or some useful data
      } else {
        reject(new Error('Failed to upload document and files'));
      }
    };

    xhr.onerror = () => reject(new Error('Failed to upload document and files'));

    xhr.send(formData);
  });
};
