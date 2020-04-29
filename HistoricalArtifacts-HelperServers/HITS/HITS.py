from flask import Flask, request
import operator
from flask_restful import Resource, Api
import sys
import re
import time
from nltk.stem.porter import *
from nltk.corpus import stopwords
stemmer = PorterStemmer()
stopWords = set(stopwords.words('english'))
dictStopWords = {}
for word in stopWords:
    dictStopWords[word] = 1

app = Flask(__name__)
api = Api(app)

import networkx as nx

def processURLLine(line):
    if len(line) > 0 and line.find('Inlinks:') > 0:
        line=line[0:line.find('Inlinks:')]
        line=line.strip()
    else:
        line = ''
    return line

def processInlinksLine(line):
    if len(line) > 0 and line.find('fromUrl:') > 0 and line.find('anchor:') > 0:
        start = line.find('fromUrl:') + len('fromUrl:')
        end = line.find('anchor:')
        line = line[start:end]
        line=line.strip()
    else:
        line = ''
    return line

def readLinks(f,urlIDs,reverseIDs,inlinks,outlinks,count,parent_ID):
    line=f.readline()
    temp=processInlinksLine(line)
    inlinks.setdefault(parent_ID,[])
    while(len(temp)!=0):
        if temp not in urlIDs:
            urlIDs[temp]=count
            reverseIDs[count]=temp
            count+=1
        curr_id=urlIDs[temp]
        outlinks.setdefault(curr_id,[])
        if parent_ID not in outlinks[curr_id]:
            outlinks[curr_id].append(parent_ID)
        if curr_id not in inlinks[parent_ID]:
            inlinks[parent_ID].append(curr_id)
        line=f.readline()
        temp=processInlinksLine(line)
    return count


def processDump(fileUrl):
    urlIDs={}
    inlinks={}
    outlinks={}
    reverseIDs={}
    f=open(fileUrl,'r',encoding="utf-8")
    count=1
    while True:
        line=f.readline() #read the line
        if not line :break
        temp=processURLLine(line)
        if temp not in urlIDs: #if the url is not in the id mapping, add it to the url mapping
            urlIDs[temp]=count
            reverseIDs[count]=temp
            count+=1
        count=readLinks(f,urlIDs,reverseIDs, inlinks,outlinks,count,urlIDs[temp])
    f.close()
    return inlinks,outlinks,urlIDs,reverseIDs


#urlIDs- array of url ids,outlinks is the dictionary, inlinks is the dictionary
def createGraph(urlIDs,outlinks,inlinks,PageRank):
    G=nx.DiGraph()
    for id in urlIDs:
        if id in outlinks:
            count=0
            for temp in outlinks[id]:
                G.add_edge(id,temp)
                count+=1
                if count>50:
                    break
        if id in inlinks:
            count=0
            for temp in inlinks[id]:
                G.add_edge(temp,id)
                count+=1
                if count>50:
                    break
    if(PageRank== "true"):
        print("I am Hits")
        return nx.hits(G,max_iter=100,tol=0.1)[1]
    else:
        print("I am pagrank")
        return nx.pagerank(G, alpha=0.9)

docs = {}
vocab = {}
def readfile(raw_data, docID):
    global docs, vocab
    docs[docID] = {}
    words = modifytext(raw_data).split()
    i = 0
    for word in words:
        try:
            dictStopWords[word]
        except:
            stem = stemmer.stem(word)
            try:
                docs[docID][stem].append(i)
            except:
                docs[docID][stem] = [i]

            try:
                vocab[stem].append(word)
            except:
                vocab[stem] = [word]
            i += 1

def modifytext(s):
    #removing SGML tags
    s = re.sub("\\<.*?>", " ",s)

    #removing digits
    s = re.sub("[\\d+]", " ", s)

    #removing special characters
    #s = re.sub("[+^:,?;=%#&~`$!@*_)/(}{\\.]", " ",s)
    s = re.sub("[^\w]", " ",s)

    #removing possessives
    s = re.sub("\\'s", " ", s)

    #removing "'"
    s = re.sub("\\'", " ", s)

    #removing """
    s = re.sub("\""," ", s)

    #removing "-"
    s = re.sub("-", " ", s)

    #removing whitespaces
    s = re.sub("\\s+", " ", s)

    #all lowercase
    s = s.lower()
    return s

M = {}

def createMatrix():
    global M
    for word in vocab:
        M[word] = {}
        for docID in docs:
            try:
                M[word][docID] = len(docs[docID][word])
            except:
                M[word][docID] = 0


class welcome(Resource):
    def get(self):
        return "I am Alive"
class parseURL(Resource):
    #get a list of urls separated by commas
    def post(self,pagerank):
        jsonObj = request.get_json(force=True)
        urls = jsonObj["result"].split(',')
        temp_ids=[]

        for url in urls:
            if url in urlIDs:
                temp_ids.append(urlIDs[url])
        # pagerank = True if query_string["PageRank"]=="true" else False
        a_score=createGraph(temp_ids,outlinks,inlinks,pagerank)
        foo={}
        for urlid in temp_ids:
            foo[urlid]=a_score[urlid]
        a_score_new=[]
        sorted_a_score = sorted(foo.items(), key=operator.itemgetter(1),reverse=True) #return  an array of tuples in this format :[(1,1),(2,4)]

        for tupl in sorted_a_score:
            url=reverseIDs[tupl[0]]
            a_score_new.append(url)
        return {'a_score':a_score_new}
    # def get(self,pagerank,** urls):
    #     pagerank = True if pagerank == "true" else False
    #     global inlinks,outlinks,urlIDs,reverseIDs
    #     urls= urls['varargs'].split(',')
    #     temp_ids=[]

    #     for url in urls:
    #         if url in urlIDs:
    #             temp_ids.append(urlIDs[url])
    #     print(urls)
    #     # pagerank = True if query_string["PageRank"]=="true" else False
    #     a_score=createGraph(temp_ids,outlinks,inlinks,pagerank)
    #     foo={}
    #     for urlid in temp_ids:
    #         foo[urlid]=a_score[urlid]
    #     a_score_new=[]
    #     sorted_a_score = sorted(foo.items(), key=operator.itemgetter(1),reverse=True) #return  an array of tuples in this format :[(1,1),(2,4)]

    #     for tupl in sorted_a_score:
    #         url=reverseIDs[tupl[0]]
    #         a_score_new.append(url)
    #     for x in urls:
    #         if x not in a_score_new:
    #             a_score_new.append(x)
    #     return {'a_score':a_score_new}

    def getKey(self,val,d):
        for key in d.keys():
            if d[key]==val:
                return key


api.add_resource(parseURL, '/getHITS/<pagerank>')
api.add_resource(welcome,'/test')

if __name__=='__main__':
    inlinks,outlinks,urlIDs,reverseIDs=processDump(sys.argv[1])
    print("Server started...")
    app.run()
