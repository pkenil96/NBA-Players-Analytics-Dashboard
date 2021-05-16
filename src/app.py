from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
from sklearn.manifold import MDS
from scipy import stats
import pandas as pd
import numpy as np



app = Flask(__name__)

app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:port"}})

df = pd.read_csv('clean_data.csv')
df_num = df
df_num.drop(['Country', 'Team', 'Position'], axis=1, inplace=True)

def cleanWeightData(string):
    return (float(string[11:]))

def cleanHeightData(string):
    return (float(string[-4:])*100)

@app.route('/mdscorr', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def mds_corr_home():
	return render_template('mdscorr.html')

@app.route('/fetchMDSCorrData', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def mds_corr():
    mds = MDS(n_components=2, dissimilarity="precomputed", random_state=0)
    mds_corr = 1 - df.corr()
    d = mds.fit_transform(mds_corr)
    d = d[(np.abs(stats.zscore(d)) < 3).all(axis=1)]
    df1 = pd.DataFrame(d, columns=['Component1', 'Component2'])
    df1["name"] = df_num.columns
    data = df1.to_dict("records")
    return jsonify(data)

if __name__ == '__main__':
	app.run(debug=True)