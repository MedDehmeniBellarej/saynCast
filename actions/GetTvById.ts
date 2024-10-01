// src/actions/GetTvById.ts
import { redirect } from "next/navigation";
import { ApiResponse } from '@/constants/types';



export async function getTvById(tvId: string): Promise<ApiResponse> {
  if (typeof window === 'undefined') {
    return { success: false, message: "This function cannot be run on the server.", resultData: null };
  }

  const session = localStorage.getItem('session');
  if (!session) {
    redirect("/");
    return { success: false, message: "No session found, redirecting to login.", resultData: null };
  }

  const parsedSession = JSON.parse(session);
  const accessToken = parsedSession.accessToken;

  if (!accessToken) {
    redirect("/");
    return { success: false, message: "No access token found, redirecting to login.", resultData: null };
  }

  const apiUrl = `https://api.sayncast.dubai-app.com/api/dashboard/tvs/tv/${tvId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TV:", error);

    // Assert the type of the error as `Error` to access the `message` property
    if (error instanceof Error) {
      return { success: false, message: "Error fetching TV", resultData: null, error: error.message };
    } else {
      return { success: false, message: "Unknown error fetching TV", resultData: null };
    }
  }
}

