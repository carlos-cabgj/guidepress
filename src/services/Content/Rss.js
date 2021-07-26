import Axios from 'axios'
// import {feeds} from '../../dataG1.js';

export const getFeeds = async (inputFeeds) => {

  // return feeds;
  let feeds = [];
  for(let a in inputFeeds){

    let response =  await Axios.get("https://api.rss2json.com/v1/api.json?rss_url=" + inputFeeds[a]);
    feeds.push({
      "author" : response.data.author,
      "image" : response.data.image,
      "title" : response.data.title,
      "items" : response.data.items,
      "created" : new Date().getTime(),
      "url" : inputFeeds[a],
    });
  }
  return feeds;
}