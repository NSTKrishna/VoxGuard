import axios from "axios";

export async function searchGitHub(query, token) {
  try {
    const res = await axios.get(
      `https://api.github.com/search/code?q=${query}&per_page=100`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      },
    );
    return res.data.items || [];
  } catch (error) {
    console.error(
      "GitHub search error:",
      error.response?.data?.message || error.message,
    );
    return [];
  }
}
