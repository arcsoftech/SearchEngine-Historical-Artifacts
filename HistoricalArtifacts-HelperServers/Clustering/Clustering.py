import re
import json
from flask import Flask, request
from flask_restful import Resource, Api
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import adjusted_rand_score
from sklearn.cluster import AgglomerativeClustering
import numpy as np

app = Flask(__name__)
api = Api(app)

def processData(docs,type):

    documents=[]
    url_name=[]
    
    for i in docs:
        url_name.append(i['url'][0])
        txt=i['content'][0].lower()
        a = txt.replace('\n', ' ')
        rem_tags = re.compile('<.*?>')  # removing html tags
        text_one = re.sub(rem_tags, '', txt)
        text_two = re.sub(r'[^\w\s]', '', text_one)  # removing punctuations
        documents.append(text_two)
    vectorizer = TfidfVectorizer(stop_words='english', use_idf=True, smooth_idf=True, sublinear_tf=True)
    X = vectorizer.fit_transform(documents)
    from sklearn.metrics.pairwise import cosine_similarity
    dist = 1- cosine_similarity(X)
    true_k = 12
    if(len(url_name)<true_k):
        res ={}
        for i in range(len(url_name)):
            res["cluster"+str(i)]=docs[i]
        return res

    print(type)
    if type == "agg":
        model = AgglomerativeClustering(n_clusters=true_k,affinity='cosine',linkage='average')
        fittedModel =model.fit(dist)
    elif type == "kmean":
        model = KMeans(n_clusters=true_k, init='k-means++', max_iter=100, n_init=1)
        fittedModel =model.fit(X)
    elif type == "single":
        model = AgglomerativeClustering(n_clusters=true_k,affinity='cosine',linkage='single')
        fittedModel =model.fit(X.todense())
    elif type == "complete":
        model = AgglomerativeClustering(n_clusters=true_k,affinity='cosine',linkage='complete')
        fittedModel =model.fit(X.todense())
    
    urlDict = {str(fittedModel.labels_[i]):str(url_name[i]) for i in range(len(url_name))}
    data = {}
    for i in range(len(url_name)):
        key = "cluster-"+str(fittedModel.labels_[i])
        if  key not in data:
            data[key] =[]
        data[key].append(docs[i])
    return data



class cluster(Resource):
    def post(self,Ctype):
        jsonObj = request.get_json(force=True)
        resObj = jsonObj['results']
        # temp = getClusters(processData(resObj,Ctype))
        temp = processData(resObj,Ctype)
        data = {k: v for k, v in sorted(temp.items(), key=lambda item: len(item[1]))}
        return {"results":data}
class test(Resource):
    def get(self):
        return "I am Alive"

api.add_resource(cluster, '/getCluster/<Ctype>')
api.add_resource(test, '/test')
    
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001)

