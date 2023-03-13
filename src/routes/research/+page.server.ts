import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  return {
    tweets: await (queryTweets("#Chess")),
  };
};

async function queryTweets(query: string) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?` + new URLSearchParams({
      query: query + " -is:retweet -is:reply lang:en",
      "expansions": "author_id",
      "tweet.fields": "text,public_metrics",
      "user.fields": "name,username,profile_image_url,url",
      "max_results": "12",
    }),
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TWITTER_BEARER_TOKEN}`,
      },
    },
  );
  const json = await response.json();
  return mapTweets(json);
}

function mapTweets(tweets: any) {
  return tweets.data.map((tweet: any) => ({
    ...tweet,
    author: getIncludedAuthor(tweets, tweet.author_id),
  }));
}

function getIncludedAuthor(tweets: any, authorId: string) {
  return tweets.includes.users.find((user: any) => user.id === authorId);
}
