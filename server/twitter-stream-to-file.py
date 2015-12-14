#!/usr/bin/python
import yaml
import os
from birdy.twitter import StreamClient
import json
import re
import sys
from time import strftime

keywordsfile = "keywords-v1.txt"
keywordsname = "v1"
tokenfile = ".twitterapi/datapop.yml"
logdir = "./data/"

with open(keywordsfile) as f:
    keywords = f.read().splitlines()
keywords_string = ','.join(set(keywords))

print "Tracking tweets with these keywords:", keywords_string

# Connect to Twitter
try:
  tokens = yaml.safe_load(open('../../' + tokenfile))
except IOError:
  tokens = yaml.safe_load(open(tokenfile))

client = StreamClient(tokens['consumer_key'],tokens['consumer_secret'],
    tokens['access_token'],tokens['access_secret'])
resource = client.stream.statuses.filter.post(track=keywords_string)

tweetlog = None
today = strftime("%Y-%m-%d")

def openlog():
   global today
   global tweetlog
   if tweetlog is None or today != strftime("%Y-%m-%d"):
       today = strftime("%Y-%m-%d")
       if tweetlog is not None:
          tweetlog.close()
       tweetlogfilename = '/' + logdir + 'tweets-' + keywordsname + '-' + today + '.log'
       print "Opening ", tweetlogfilename
       try:
           tweetlog = open(tweetlogfilename, "a")
       except IOError:
           tweetlogfilename = logdir + 'tweets-' + keywordsname + '-' + today + '.log'
           print "trying again with ", tweetlogfilename
           tweetlog = open(tweetlogfilename, "a")
       except:
           print "Unable to open tweet log file."
           sys.exit()
       print "Writing tweets to ", tweetlogfilename

for data in resource.stream():
   openlog()
   tweetlog.write(json.dumps(data) + '\n')
   if 'text' in data:
       print data['text'].encode('utf-8')
