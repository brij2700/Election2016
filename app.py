from flask import Flask, render_template, request
from flask import jsonify
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from flask import Flask, jsonify
import csv
import json
app = Flask(__name__,static_url_path='/static')

num_components=None



@app.route('/')
def index():
    # print(state_wage_dict)
    # print(state_acp_counts)
    party_json = json.dumps(state_acp_counts)
    acp_json=json.dumps(acp_types)
    wages_json=json.dumps(state_wage_dict)
    all_data = df.to_json(orient = 'records')
    return render_template('temp_trial.html',data=all_data,party_count=party_json,acp_types=acp_json,state_wages=wages_json,all_data=all_data)

state_acp_counts = {}
state_wage_dict={}

df = pd.read_csv('Election Dataset.csv')



def create_state_party_data():
    
# Group the DataFrame by state and ACP Type and party, and count the number of occurrences
    counts = df.groupby(['state', 'ACP Type', 'party']).size()

    # Iterate over each state and create a dictionary entry for it
    for state in df['state'].unique():
        state_acp_counts[state] = {}
        state_counts = counts[state]
        
        # Iterate over each ACP Type and party and get the count for that ACP Type and party in the state
        for acp_type in df['ACP Type'].unique():
            state_acp_counts[state][acp_type] = []
            for party in df['party'].unique():
                count = state_counts.get((acp_type, party), 0)
                state_acp_counts[state][acp_type].append(int(count))
        total_counts = [sum([x[i] for x in state_acp_counts[state].values()]) for i in range(len(df['party'].unique()))]
        # total_counts = total_counts.tolist()
        state_acp_counts[state]["all_types"] = total_counts
                


    state_acp_counts['USA']={}
    for each_state in state_acp_counts:
        if each_state=='USA':
            break
        for acp_type in state_acp_counts[each_state]:
            if acp_type not in state_acp_counts['USA']:
                state_acp_counts['USA'][acp_type]=[0,0]
            state_acp_counts['USA'][acp_type][0]+=state_acp_counts[each_state][acp_type][0]
            state_acp_counts['USA'][acp_type][1]+=state_acp_counts[each_state][acp_type][1]
        
        


def create_acp_type_data():
    grouped = df.groupby(['state', 'ACP Type']).size().reset_index(name='count')

# convert the grouped DataFrame to a dictionary of dictionaries
    result = {}
    for _, row in grouped.iterrows():
        state = row['state']
        acp_type = row['ACP Type']
        count = row['count']
        
        # if state is not already in the result dictionary, add it
        if state not in result:
            result[state] = {}
        
        # add the count for the acp type to the state's dictionary
        result[state][acp_type] = int(count)

    # acp_types = {outer_key: {k: v for k, v in sorted(inner_dict.items(), key=lambda item: item[1], reverse=True)[:6]} for outer_key, inner_dict in result.items()}
    acp_type_counts = {}
    for acp_type in df["ACP Type"].unique():
        count = (df["ACP Type"] == acp_type).sum()
        acp_type_counts[acp_type] = int(count)
    result['USA']=acp_type_counts    
    acp_types = {outer_key: {k: v for k, v in sorted(inner_dict.items(), key=lambda item: item[1], reverse=True)[:15]} for outer_key, inner_dict in result.items()}
    return acp_types


def create_state_wages():
    
    # Assume your DataFrame is named 'df'
    
    state_wage_dict['USA']={}

    # Iterate over each row in the DataFrame
    for index, row in df.iterrows():
        state = row['state']
        acp_type = row['ACP Type']
        wage = row['Average Weekly Wages']
    #     state_wage_dict=defaultdict(dict)
        # Check if the state already exists in the dictionary
        if state not in state_wage_dict:
            # If it doesn't, create a new dictionary for that state
            state_wage_dict[state] = {}

        # Check if the acp_type already exists in the dictionary for that state
        if acp_type in state_wage_dict[state]:
            # If it does, append the wage to the existing list for that acp_type
            state_wage_dict[state][acp_type].append(wage)
        else:
            # If it doesn't, create a new list for that acp_type and append the wage
            state_wage_dict[state][acp_type] = [wage]
            
        # Append the wage to the list for 'all_types' in the dictionary for that state
        if 'all_types' in state_wage_dict[state]:
            state_wage_dict[state]['all_types'].append(wage)
        else:
            state_wage_dict[state]['all_types'] = [wage]

    #     Append the wage to the list for 'all_types' in the 'USA' dictionary
        if 'all_types' in state_wage_dict['USA']:
            state_wage_dict['USA']['all_types'].append(wage)
        else:
            state_wage_dict['USA']['all_types'] = [wage]

        # Check if the acp_type already exists in the 'USA' dictionary
        if acp_type in state_wage_dict['USA']:
            # If it does, append the wage to the existing list for that acp_type
            state_wage_dict['USA'][acp_type].append(wage)
        else:
            # If it doesn't, create a new list for that acp_type and append the wage
            state_wage_dict['USA'][acp_type] = [wage]


if __name__ == '__main__':
    create_state_party_data()
    acp_types=create_acp_type_data()
    create_state_wages()
    app.run(debug=True)

