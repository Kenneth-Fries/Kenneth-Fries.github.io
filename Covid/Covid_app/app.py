from flask import Flask, render_template, redirect, jsonify
import pandas as pd

# SQLAlchemy
from sqlalchemy import create_engine

# Path to DB
database_path = f'postgresql://postgres:Qd4+typo@localhost/Covid19'
# Create Database Connection
engine = create_engine(database_path)



states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado",
  "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois",
  "Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana",
  "Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York",
  "North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]



# Create an instance of Flask
app = Flask(__name__)

# Route to render index.html template 

@app.route("/")
def index():
    """List all available api routes."""
    conn = engine.connect()

# Create a string list of 50 states for SQL statements
    states_string = str("('")
    states_string += states[0] + "'"
    for state in states[1:]:
        states_string += ", '"
        states_string += state
        states_string += "'"
    states_string += ")"


    # Create state level json data with all states
    state_json = []
    for x in states:
        state_df = pd.read_sql(f"SELECT d.date, SUM(daily_new_cases_avg) daily_new_cases_avg, SUM(daily_new_deaths_avg) daily_new_deaths_avg, SUM(daily_new_cases) daily_new_cases FROM data_table d LEFT JOIN locations l ON l.locationid = d.locationid WHERE l.state = '{x}' GROUP BY d.date", conn)
        population = pd.read_sql(f"SELECT SUM(population) FROM locations WHERE state = '{x}'", conn).values[0][0]
        
        
        state_json.append({
                            "state" : x,
                            "Population" : population,
                            "dates" : state_df.date.tolist(),
                            "cases" : state_df.daily_new_cases_avg.tolist(), 
                            "deaths" : state_df.daily_new_cases_avg.tolist(),
                            "raw" : state_df.daily_new_cases.tolist()   
                            })            
          



    # Add US Total to all state data
    state_df = pd.read_sql(f"SELECT d.date, SUM(daily_new_cases_avg) daily_new_cases_avg, SUM(daily_new_deaths_avg) daily_new_deaths_avg, SUM(daily_new_cases) daily_new_cases FROM data_table d LEFT JOIN locations l ON l.locationid = d.locationid WHERE l.state in {states_string} GROUP BY d.date", conn)
    population = pd.read_sql(f"SELECT SUM(population) FROM locations WHERE state in {states_string}", conn).values[0][0]
    state_json.append({
                        "Country" : "US",
                        "Population" : population,
                        "dates" : state_df.date.tolist(),
                        "cases" : state_df.daily_new_cases_avg.tolist(), 
                        "deaths" : state_df.daily_new_cases_avg.tolist(),
                        "raw" : state_df.daily_new_cases.tolist()   
                        }   )                      
                         

    conn.close()



    return render_template("index.html", state_data = state_json)


@app.route("/results")
def results():
    # gather variables passed from JS
    chosen_state, chosen_county =  {}
    
    
    conn = engine.connect()
    location_df = pd.read_sql("select * from locations", conn)


    
    

    # list (single string) of columns to be read from SQL
    column_list = "d.date,d.locationid,d.deaths,d.confirmed,d.daily_new_cases,d.daily_new_deaths,d.daily_new_cases_avg,d.daily_new_deaths_avg,l.country,l.state,l.county,l.iso2,l.iso3,l.population,l.code3,l.fips,l.lattitude,l.longitude,l.location"
    chosen_locationid = int(pd.read_sql(f"select locationid from locations where (county = {chosen_county} and state = {chosen_state})", conn).iloc[0][0])
    chosen_df = df.loc[df.locationid == chosen_locationid]
    chosen_df.date = chosen_df['date'].astype('datetime64[ns]')
    chosen_df.set_index("date", inplace = True)
    lat = location_df.loc[location_df["locationid"] == chosen_locationid].lattitude.iloc[0]
    long = location_df.loc[location_df["locationid"] == chosen_locationid].longitude.iloc[0]
    
    # use the euclidian distance  offset bewteen coordinates to find nearest counties
    location_df["nearest_to_chosen_lat"] = location_df.lattitude-lat
    location_df.nearest_to_chosen_lat = location_df.nearest_to_chosen_lat.abs()
    location_df["nearest_to_chosen_long"] = location_df.longitude-long
    location_df.nearest_to_chosen_long = location_df.nearest_to_chosen_long.abs()
    location_df["nearest_to_chosen_euclidian"] = ((location_df.nearest_to_chosen_long.astype(float).pow(2)) + (location_df.nearest_to_chosen_lat.astype(float).pow(2))**0.5)
    
    #find locationid of 9 nearest counties, index 0 is chosen county
    nearest_locations = location_df.sort_values(by="nearest_to_chosen_euclidian").head(10).locationid.to_list()
    
    # organize data for JSON
    # Create county level data for nearest counties
    date_list = df[df.locationid == nearest_locations[1]].date.tolist()
    data_to_return = []
    for i, x in enumerate(nearest_locations):
        data_to_return.append({ "rank" : i,
                                "locationid" : x, 
                                "county" : location_df[location_df.locationid == x].county.values[0].strip(),
                                "state" : location_df[location_df.locationid == x].state.values[0].strip(),
                                "population" : location_df[location_df.locationid == x].population.values[0],
                                "lattitude" : location_df[location_df.locationid == x].lattitude.values[0],
                                "longitude" : location_df[location_df.locationid == x].longitude.values[0], 
                                "dates" : date_list,
                                "cases" : df[df.locationid == x].daily_new_cases_avg.tolist(), 
                                "deaths" : df[df.locationid == x].daily_new_cases_avg.tolist(),
                                "raw" : df[df.locationid == x].daily_new_cases.tolist()   
                            }                         
                            )


    # Create a string list of 50 states for SQL statements
    states_string = str("('")
    states_string += states[0] + "'"
    for state in states[1:]:
        states_string += ", '"
        states_string += state
        states_string += "'"
    states_string += ")"


    # Create state level json data with all states
    state_json = []
    for x in states:
        state_df = pd.read_sql(f"SELECT d.date, SUM(daily_new_cases_avg) daily_new_cases_avg, SUM(daily_new_deaths_avg) daily_new_deaths_avg, SUM(daily_new_cases) daily_new_cases FROM data_table d LEFT JOIN locations l ON l.locationid = d.locationid WHERE l.state = '{x}' GROUP BY d.date", conn)
        population = pd.read_sql(f"SELECT SUM(population) FROM locations WHERE state = '{x}'", conn).values[0][0]
        state_json.append({
                            "state" : x,
                            "Population" : population,
                            "dates" : date_list,
                            "cases" : state_df.daily_new_cases_avg.tolist(), 
                            "deaths" : state_df.daily_new_cases_avg.tolist(),
                            "raw" : state_df.daily_new_cases.tolist()   
                            })            
          



    # Add US Total to all state data
    state_df = pd.read_sql(f"SELECT d.date, SUM(daily_new_cases_avg) daily_new_cases_avg, SUM(daily_new_deaths_avg) daily_new_deaths_avg, SUM(daily_new_cases) daily_new_cases FROM data_table d LEFT JOIN locations l ON l.locationid = d.locationid WHERE l.state in {states_string} GROUP BY d.date", conn)
    population = pd.read_sql(f"SELECT SUM(population) FROM locations WHERE state in {states_string}", conn).values[0][0]
    state_json.append({
                        "Country" : "US",
                        "Population" : population,
                        "dates" : date_list,
                        "cases" : state_df.daily_new_cases_avg.tolist(), 
                        "deaths" : state_df.daily_new_cases_avg.tolist(),
                        "raw" : state_df.daily_new_cases.tolist()   
                        }   )                      
                         

    conn.close()

    return render_template("results.html", state_data = state_json, county_data = data_to_return)


if __name__ == "__main__":
    app.run(debug=True)

