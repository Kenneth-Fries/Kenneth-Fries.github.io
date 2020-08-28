#!/usr/bin/env python
# coding: utf-8

# # This is to be a project on covid 19.  


import pandas as pd
from matplotlib import pyplot as plt
from pprint import pprint
import numpy
import json




url_deaths = "https://github.com/CSSEGISandData/COVID-19/raw/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
url_confirmed = "https://github.com/CSSEGISandData/COVID-19/raw/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"



df_deaths = pd.read_csv(url_deaths)
df_confirmed = pd.read_csv(url_confirmed)



df_deaths.fillna(0, inplace=True)
df_confirmed.fillna(0, inplace=True)

states_list = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
         'Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho', 
         'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
         'Maine' 'Maryland','Massachusetts','Michigan','Minnesota',
         'Mississippi', 'Missouri','Montana','Nebraska','Nevada',
         'New Hampshire','New Jersey','New Mexico','New York',
         'North Carolina','North Dakota','Ohio',    
         'Oklahoma','Oregon','Pennsylvania','Rhode Island',
         'South  Carolina','South Dakota','Tennessee','Texas','Utah',
         'Vermont','Virginia','Washington','West Virginia',
         'Wisconsin','Wyoming']
    



covid_cases = {}                                  #make dictionary for all data
countries = df_deaths.Country_Region.unique()     #get list of countries

for country in countries:                         #If multiple countries
    states = df_deaths.Province_State.unique()
    
    covid_cases.update({country:{}})              #Add the new country name and create a sub-dict
    
    for state in states:
        if state in states_list:
            state_df = df_deaths[df_deaths.Province_State == state]
            counties = state_df.Admin2.to_list()
            covid_cases[country].update({state:{}})
            
            for county in counties:
                df = state_df[state_df.Admin2 == county].T[12:]    #columns start at 12 with one datapoint per column
                                                                #Transpose date columns to row index
                #df.index = pd.to_datetime(df.index)                #Set row index to datetime
                county_data = df.diff(1).fillna(0)                 #Find delta
                
                county_smoothed_7day = df.diff(7).fillna(0) / 7    #Find 7 day avg delta
                
                
                
                
                iso2 = state_df.iso2[state_df.Admin2 == county].values[0]    #State Abbreviation
                population = state_df.Population[state_df.Admin2 == county].values[0]   # population
                covid_cases[country][state].update({
                                                county:{
                                                    "lat" : str(state_df[state_df.Admin2 == county].Lat.values[0]),
                                                    "long" : str(state_df[state_df.Admin2 == county].Long_.values[0]),
                                                    "deaths" : [],
                                                    "deaths_7_day" : [],
                                                    "dates" : [],
                                                    "abbreviation": iso2,
                                                    "population": str(population)
                                            }})
                for m, y in enumerate(county_data):
                    for x in list(zip(county_data[y].index, county_data[y].values)):
                        covid_cases[country][state][county]['deaths'].append(int(x[1]))
                        covid_cases[country][state][county]['dates'].append(x[0])
                        
                for m, y in enumerate(county_smoothed_7day):
                    for x in list(zip(county_smoothed_7day[y].index, county_smoothed_7day[y].values)):
                        if covid_cases[country][state][county]['dates'][m] == x[0]:
                            covid_cases[country][state][county]['deaths_7_day'].append(int(x[1]))
                            
                                                                            
 


countries = df_confirmed.Country_Region.unique()
for country in countries:
    print(country, "{")
    states = df_confirmed.Province_State.unique()
    
    for n, state  in enumerate(states):
        if state in states_list:

            
            if n < 60:      # Useful for allowing only a few states to run.
                state_df = df_confirmed[df_confirmed.Province_State == state]
                counties = state_df.Admin2.to_list()
                print("    ", state, " #", len(counties), " counties.")
                for county in counties:
                    df = state_df[state_df.Admin2 == county].T[11:]    #columns start at 12 with one datapoint per column
                                                                    #Transpose date columns to row index
                    #df.index = pd.to_datetime(df.index)                #Set row index to datetime
                    county_data = df.diff(1).fillna(0)                 #Find delta
                    county_smoothed_7day = df.diff(7).fillna(0) / 7    #Find 7 day avg delta
                    iso2 = state_df.iso2[state_df.Admin2 == county]
                    
                    covid_cases[country][state][county].update({
                            "confirmed" : [],
                            "confirmed_7_day" : [],
                            "county_name_check" : county
                            })
                    for m, y in enumerate(county_data):
                        for x in list(zip(county_data[y].index, county_data[y].values)):
                            covid_cases[country][state][county]['confirmed'].append(int(x[1]))    
                            
                    for m, y in enumerate(county_smoothed_7day):
                        for x in list(zip(county_smoothed_7day[y].index, county_smoothed_7day[y].values)):
                            covid_cases[country][state][county]['confirmed_7_day'].append(int(x[1]))    
                    
    


with open('data.json', 'w') as fp:
    json.dump(covid_cases, fp)

print("Finished " )

print(df_deaths)
