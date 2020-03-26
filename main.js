"use strict";

// Global variables 
let json_url = 'https://interactive.guim.co.uk/docsdata/1q5gdePANXci8enuiS4oHUJxcxC13d6bjMRSicakychE.json';


function main() {
    fetch_json()
}

main()

// Fetch JSON and display in UI
function fetch_json() {
    fetch(json_url)
    .then(
        function(response) {
        if (response.status !== 200) {
            console.log('Status Code: ' +
            response.status);
            return;
        }
        // Handle JSON response
        response.json().then(function(data) {
            build_ui(data)
            //console.log(data);
        });
        }
    )
    .catch(function(err) {
        console.log('Error: ', err);
    });
}

// UI building functions go here
function build_ui(data_object) {
    update_national_data(data_object); 
    build_state_cards(data_object)
    build_updates_list(data_object)
}

function update_national_data(data_object) {
    // Get national specific data and get population
    let national_data = data_object["sheets"]["latest totals"][8];
    let national_population = data_object["sheets"]["data validation"][8]["Population"];
    
    // Get individual data values
    let confirmed_val = national_data["Confirmed cases (cumulative)"]
    let deaths_val = national_data["Deaths"]
    let tests_total = national_data["Tests conducted"]
    let tests_per_mil = national_data["Tests per million"]
    let update_time = national_data["Last updated"]
    
    // Build national card using jquery
    let card = $('<div class="card shadow py-2" style="margin: 20px;"></div>');
    let card_body = $('<div class="card-body"></div>');
    let card_row = $('<div class="row align-items-center no-gutters"></div>');
    let card_col = $('<div class="col mr-2"></div>');
    
    let card_title = $('<div class="text-uppercase text-center text-primary font-weight-bold text-xs mb-1"><span class="text-left" style="font-size: 35px;color: rgb(0,0,0);font-family: Nunito, sans-serif;">NATIONAL</span></div>');
    let confirmed = $('<div class="text-center text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;" id="national_confirmed">Confirmed Cases: ' + confirmed_val + '</span></div>');
    let deaths = $('<div class="text-center text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;" id="national_deaths">Deaths: ' + deaths_val + '</span></div>');
    let tests = $('<div class="text-center text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;" id="national_tests">Tests Conducted: ' + tests_total + '</span></div>');
    let per_mil = $('<div class="text-center text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;" id="national_per_mil">Tests per million: ' + tests_per_mil + '</span></div>');
    let population = $('<div class="text-center text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;" id="national_population">Total population: ' + national_population + '</span></div>');
                        
    // Append jquery elements
    card_col.append(card_title);
    card_col.append(confirmed);
    card_col.append(deaths);
    card_col.append(tests);
    card_col.append(per_mil);
    card_col.append(population);
    
    card_row.append(card_col);
    card_body.append(card_row);
    card.append(card_body)
    
    // Append to page
    $('#national_data').append(card);
                                
}

function list_append_jquery(parent_element, element_list) {
    for (let i = element_list.length; i < element_list.length; i++) {
        parent_element.append(element_list);
    }
    return parent_element
}

function zero_data_check(data_object, key) {
    if (data_object[key] == "") {
        return 0
    } else {
        return data_object[key]
    }
}

function build_state_cards(data_object) {
    // Loop over all 8 states to create cards
    for (let i = 0; i <= 7; i++) {
        // Get state and population
        let state_object = data_object["sheets"]["latest totals"][i] 
        let state_population = data_object["sheets"]["data validation"][i]["Population"]
        
        // set data variables that could be empty to 0
        let confirmed = zero_data_check(state_object, "Confirmed cases (cumulative)");
        let deaths = zero_data_check(state_object, "Deaths");
        let tests = zero_data_check(state_object, "Tests conducted");
        let per_mil = zero_data_check(state_object, "Tests per million");
        

        // Build using jquery
        let new_card = $('<div class="col-md-6 col-xl-3 mb-4"></div>')
        let card_shadow = $('<div class="card shadow py-2"></div>')
        let card_body = $('<div class="card-body text-center"></div>')
        let card_row = $('<div class="row align-items-center no-gutters"></div>')
        let card_col = $('<div class="col mr-2"></div>')
        let state_label = $('<div class="text-uppercase text-primary font-weight-bold text-xs mb-1"><span style="font-size: 30px;color: rgb(0,0,0);font-family: Nunito, sans-serif;">' + state_object["State or territory"] + '</span></div>')
        let confirmed_label = $('<div class="text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;">Confirmed Cases: ' + confirmed + '</span></div>')
        let deaths_label = $('<div class="text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;">Deaths: ' + deaths + '</span></div>')
        let tests_label = $('<div class="text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;">Tests Conducted: ' + tests + '</span></div>')
        let per_mil_label = $('<div class="text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;">Tests per million: ' + per_mil + '</span></div>')
        let population_label = $('<div class="text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;">State population: ' + state_population + '</span></div>')
        
        // Append together card elements
        card_col.append(state_label)
        card_col.append(confirmed_label)
        card_col.append(deaths_label)
        card_col.append(tests_label)
        card_col.append(per_mil_label) 
        card_col.append(population_label) 
        card_row.append(card_col)
        card_body.append(card_row)
        card_shadow.append(card_body)
        new_card.append(card_shadow)
        
        // Add to states row
        $('#states_row').append(new_card)
    }
}

function build_updates_list(data_object) {
    let updates_data = data_object["sheets"]["updates"]
    // Reverse iterate since data is backwards
    for (let i = updates_data.length - 1; i > 0; i--) {
        // Get update data
        let update = updates_data[i]
        
        // Data variables
        let state = update["State"];
        let date = update["Date"];
        let time = update["Time"];
        let cumulative_cases = update["Cumulative case count"];
        let cumulative_deaths = update["Cumulative deaths"];
        let negative_tests = update["Tests conducted (negative)"];
        let tests_total = update["Tests conducted (total)"];
        let icu_count = update["Intensive care (count)"];
        let hospitalisations = update["Hospitalisations (count)"]
        let recovered = update["Recovered (cumulative)"];
        let source = update["Update Source"];
        let under_60 = update["Under 60"];
        let over_60 = update["Over 60"];
        let community = update["Community"];
        let travel = update["Travel-related"];
        let investigation = update["Under investigation"];
        let notes = update["Notes"];

        let key_list = ["Cumulative case count", "Cumulative deaths", "Tests conducted (negative)", "Tests conducted (total)", "Intensive care (count)", "Hospitalisations (count)", "Recovered (cumulative)", "Update Source", "Under 60", "Community", "Travel-related", "Under investigation", "Notes"]
        let val_list = Array(key_list.length);
        for (let i = 0; i < key_list.length; i++) {
            val_list[i] = update[key_list[i]]
        }
        
        
        // Build using jquery
        let card_row = $('<div class="row"></div>');
        let card_col = $('<div class="col"></div>');
        let card = $('<div class="card" style="margin-top: 10px;margin-bottom: 10px;"></div>');
        let card_body = $('<div class="card-body"></div>')
        
        let card_title = $('<h4 class="card-title" style="color: rgb(0,0,0);">' + state + ' ' + time + ' ' + date + '</h4>');
        
        let elements_to_append = []
        for (let i = 0; i < val_list.length; i++) {
            if (val_list[i] != "") {
               let element = $('<div class="text-dark font-weight-bold h5 mb-0"><span style="font-size: 16px;">' + key_list[i] + ': ' + val_list[i] + '</span></div>');
                elements_to_append.push(element)
            }
        }
        
        // Append items together
        card_body.append(card_title);
        for (let i = 0; i < elements_to_append.length; i++) {
            card_body.append(elements_to_append[i]);
        }
        card.append(card_body);
        card_col.append(card);
        card_row.append(card_col);
        $('#update_container').append(card_row);
    }
}

function scroll_to_update_feed() {
    let update_feed_heading = document.getElementById('update_feed_heading');
    update_feed_heading.scrollIntoView({behavior: 'smooth', block: 'start'});
}

// Classes and functions for manipulating statistics
function latest_data_in_depth(data_object) {
    let updates_data = data_object["sheets"]["updates"];
    
}

class latest_stats {
    constructor(updates_data) {
        this._updates_data = updates_data;
    }
    
    
}

class state_stats {
    constructor(state) {
        this._state = state;
    }
}
                                    
                                        
                                            
                                                
                                            
                                                
                                            
                                                
                                            
                                                
                                        
                                                
                                            
                                        
                                    
                                
                     
                     









