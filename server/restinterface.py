#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import Flask, jsonify, abort, request, json
from flask.ext.cors import CORS
import json
import sys
import csv
import random
import yaml
import string
from collections import defaultdict
from birdy.twitter import UserClient

# Connect to Twitter
tokens = yaml.safe_load(open('datapop.yml'))
client = UserClient(tokens['consumer_key'],tokens['consumer_secret'],
    tokens['access_token'],tokens['access_secret'])

print "Starting API"

links = []
words = {}
# read data
filename = 'tweets-v1-2015-12-12.log'
f = open(filename)
for line in f.readlines()[:-1]:
    record = json.loads(line)
    try:
        sn = record['user']['screen_name']
        text = record['text']
        twords = text.lower().split(' ')
        mentions = record['entities']['user_mentions']
        for mention in mentions:
            pp = mention['screen_name']
            if sn not in words:
                words[sn] = defaultdict(int)
            for word in twords:
                words[sn][word] += 1
            if pp not in words:
                words[pp] = defaultdict(int)
            for word in twords:
                words[pp][word] += 1
            link = {'arp':sn,'pp':pp}
            links.append(link)
            #print sn, mention['screen_name']
    except KeyError:
        pass


app = Flask(__name__)
CORS(app) #TODO: refine this so it's not so wide open

###############################################################################
# Create API Interfaces
@app.route("/api/links", methods=['GET'])
def send_links():
    return jsonify({'links':links})

@app.route("/api/words", methods=['GET'])
def send_words():
    return jsonify(words)

@app.route("/api/userinfo", methods=['GET'])
def send_userinfo():
    rsn = request.args.get('sn')
    response = client.api.users.show.get(screen_name=rsn)
    return jsonify(response.data)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=80,debug=True)
    #app.run(host='0.0.0.0',port=port,threaded=True)
    print "App running..."
