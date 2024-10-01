import { redirect } from "next/navigation";

export async function getTvs(pageNumber: number, pageSize: number) {
  if (typeof window === 'undefined') {
    // This ensures this code only runs in the browser
    return { error: "This function cannot be run on the server." };
  }

  const session = localStorage.getItem('session');
  if (!session) {
    redirect("/");
    return { error: "No session found, redirecting to login." };
  }

  const parsedSession = JSON.parse(session);
  const accessToken = parsedSession.accessToken;

  if (!accessToken) {
    redirect("/");
    return { error: "No access token found, redirecting to login." };
  }

  const apiUrl = `https://api.sayncast.dubai-app.com/api/dashboard/tvs/all-tvs/${pageNumber}/${pageSize}`;

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

    const data = await response.json();
    return {
      tvs: data.resultData.results,
      currentPage: data.resultData.currentPage,
      totalPages: data.resultData.pageCount,
    };
  } catch (error) {
    console.error("Error fetching TVs:", error);
    return { error: "Error fetching TVs" };
  }
}

