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
tokenfile = "../../.twitterapi/datapop.yml"
logdir = "/data/"

with open(keywordsfile) as f:
    keywords = f.read().splitlines()
keywords_string = ','.join(set(keywords))

print "Tracking tweets with these keywords:", keywords_string

# Connect to Twitter
tokens = yaml.safe_load(open(tokenfile))
client = StreamClient(tokens['consumer_key'],tokens['consumer_secret'],
    tokens['access_token'],tokens['access_secret'])
resource = client.stream.statuses.filter.post(track=keywords_string)

today = strftime("%Y-%m-%d")
tweetlogfilename = logdir + 'tweets-' + keywordsname + '-' + today + '.log'
try:
    print "Opening ", tweetlogfilename
    tweetlog = open(tweetlogfilename, "a")
except:
    print "Unable to open tweet log file."
    sys.exit()
print "Writing tweets to ", tweetlogfilename

for data in resource.stream():
   if today != strftime("%Y-%m-%d"):
       today = strftime("%Y-%m-%d")
       tweetlog.close()
       tweetlogfilename = logdir + 'tweets-' + \
            keywordsname + '-' + today + '.log'
       try:
           print "Opening ", tweetlogfilename
           tweetlog = open(tweetlogfilename, "a")
       except:
           print "Unable to open tweet log file."
           sys.exit()

   tweetlog.write(json.dumps(data) + '\n')
   if 'text' in data:
       print data['text'].encode('utf-8')
