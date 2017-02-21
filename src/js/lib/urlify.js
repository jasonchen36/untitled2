import React from "react"
import { connect } from "react-redux"
import { Link  } from "react-router"
import _ from "lodash";

const urlify = (text) => {
  // regex to catch links that are http and https.  could also use ftp and file.
  let urlRegex =/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  // sort the http entries found
  // the matches are sorted by length, greatest first, so the longer links are caught before a shorter link that might be part of a longer link will not split the longer link (i.e., do http://abc.com/hello before http://abc.com so that both are caught)
  const matches =_.sortBy(text.match(urlRegex), (m) => { return -1*m.length } );
  let entries = [text];
  let newText = text;

  // find each match and replace each entry with a react Link.
  _.each(matches, (m) => {
    let splitByMatchedEntries = [];

    // go through each entry and put back as an array of strings and links
    _.each(entries,(e,keyE) => {

      // if the current entry has been replaced by a Link, already done, skip this entry
      if(typeof e !== 'string') {
        splitByMatchedEntries.push([e]);  
      } else {
        let newE = [];

        let splitEntry= _.split(e,m);

        // split the strings by the links, and replace those links as react entries 
        _.each(splitEntry,(s,keyS) => {
          newE.push(s);
          // since this is split by each matched link, we put in links.
          // apparently, splitting just the link results in ["",""] so this works.
          // dont put in a link after the last entry. (kind of like string.join(",")
          if(keyS+1<splitEntry.length) {
            // push as a link, that we will parse later
           newE.push({type:"link", to:m, text:m});
          }
        });
        splitByMatchedEntries.push(newE); 
      }

    });

    // flatten all the parsed entries and then go over them again with the next matched link.
    entries = _.flatten(splitByMatchedEntries);
  });

  let finalEntry = _.map(entries,(e, key) => {
    //return e
    if(typeof e ==="string") {
      // it's a string, put it in a span
      return <span key={key}>{e}</span>
    } else if(e && e.type==="link") {
      // it's a link type, let's turn it into a link
      return  <Link to={e.to} target="_blank" key={key}>{e.text}</Link>
    } else {
      // there should only be string and link types
      return null;
    }
  });
  return finalEntry;
};


export {
 urlify
}
