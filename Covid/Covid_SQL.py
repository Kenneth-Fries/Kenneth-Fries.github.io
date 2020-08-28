#!/usr/bin/env python
# coding: utf-8



import pandas as pd

import json
from sqlalchemy import create_engine

# Data Sources
url_deaths = "https://github.com/CSSEGISandData/COVID-19/raw/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
url_confirmed = "https://github.com/CSSEGISandData/COVID-19/raw/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"

# Acquire Data
df_deaths = pd.read_csv(url_deaths)
df_confirmed = pd.read_csv(url_confirmed)

# fill zeros
df_deaths.fillna(0, inplace=True)
df_confirmed.fillna(0, inplace=True)

# Seperate locations from dated data
locations_df = df_deaths[df_deaths.columns[:12]]
locations_df.columns = ["locationid", "iso2", "iso3", "code3", "fips", "county", "state", "country", "lattitude", "longitude", "location", "population"]
locations_df.set_index('locationid', inplace=True)


df_deaths=df_deaths.rename(columns={'UID':"locationid"})
df_deaths.set_index("locationid", inplace=True)

# 
new_deaths = []
for date in df_deaths[df_deaths.columns[11:]]:
    for i, deaths_reported in enumerate(df_deaths[date]):
        new_deaths.append({"date":date, "locationid":df_deaths[date].index[i], "deaths":deaths_reported})
new_deaths_df = pd.DataFrame(new_deaths)

#
new_confirmed = []
for date in df_confirmed[df_confirmed.columns[11:]]:
    for i, confirmed_reported in enumerate(df_confirmed[date]):
        new_confirmed.append({"date":date, "locationid":df_confirmed["UID"][i], "confirmed":confirmed_reported})
new_confirmed_df = pd.DataFrame(new_confirmed)

#
covid_cases_df = new_deaths_df
covid_cases_df["confirmed"] = new_confirmed_df["confirmed"]

# Creates list of df's, one for each location
covid_df_list=[]
for i, location in enumerate(covid_cases_df.locationid.unique()):
    df = covid_cases_df[covid_cases_df.locationid==location]
    df["daily_new_cases"]=df.confirmed.diff(1).fillna(0)
    df["daily_new_deaths"]=df.deaths.diff(1).fillna(0)
    df["daily_new_cases_avg"]=df.confirmed.diff(7).fillna(0)/7
    df["daily_new_deaths_avg"]=df.deaths.diff(7).fillna(0)/7
    covid_df_list.append(df)

# starts the first column of df, the first location.
df = covid_df_list[0]

# continues creating df with each location as a column
for x in covid_df_list[1:]:
    df = df.append(x)

# finding local locationid
# alameda = locations_df[locations_df.county=="Alameda"].index[0]
# alameda
# df[df.locationid==alameda].daily_new_cases_avg.plot()

# remove index column, create replacement unique index
df.set_index(["date","locationid"], inplace=True)

#connect to database
from sqlalchemy import create_engine
engine = create_engine('postgresql://postgres:Qd4+typo@localhost/Covid19')
conn = engine.connect()

# find highest date in DB to compare to new data
x = conn.execute("select max(date) from data_table group by date")
dates = []
for y in x:
    dates.append(y)
max_date_in_sql = pd.to_datetime(max(dates))

# Create list of index for any data not in DB
new_data_indicies = []
for x in df.T:
    if x[0] > max_date_in_sql:
        new_data_indicies.append(x)
# this doesn't do anything?
# df.loc[(new_data_indicies[0][0], new_data_indicies[0][1])]

# create list of new data not in DB
new_data = []
for i in range(len(new_data_indicies)):
    new_data.append((new_data_indicies[i][0], new_data_indicies[i][1], *df.loc[(new_data_indicies[i][0], new_data_indicies[i][1])].values))

# send new data to DB
for x in new_data:
    try:
        stmt = f"INSERT INTO data_table (date, locationid, deaths, confirmed, daily_new_cases, daily_new_deaths, daily_new_cases_avg, daily_new_deaths_avg) VALUES {x};"
        conn.execute(stmt)
    except:
        print("I guess the try/except clause in lines near 100 was important.  Figure out why!")
        #pass
    
print("Finished") 



