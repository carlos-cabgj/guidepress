import Axios from 'axios'
// import {feeds} from '../../dataG1.js';

export const getFeeds = async (inputFeed) => {

  // return feeds;
  let feed = {};

  let response =  await Axios.get("https://api.rss2json.com/v1/api.json?rss_url=" + inputFeed);

  feed["author"]  = response?.data?.author || response?.data?.feed?.author;
  feed["image"]   = response?.data?.image || response?.data?.feed?.image;
  feed["title"]   = response?.data?.title || response?.data?.feed?.title;
  feed["items"]   = response?.data?.items || response?.data?.items;
  feed["created"] = new Date().getTime();
  feed["url"]     = inputFeed;

  return feed;
}