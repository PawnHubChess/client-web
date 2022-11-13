import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  return {
    tweets: await(queryTweets("Chess"))
  };
};  

async function queryTweets(query: string) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TWITTER_BEARER_TOKEN}`,
        },
    },
  );
  const json = await response.json();
  return json.data;
}
