import React, { Component } from "react";
import {
  ReactiveBase,
  ResultList,
  MultiList,
  RatingsFilter,
  SelectedFilters,
  SearchBox,
  ReactiveList,
} from "@appbaseio/reactivesearch";

import { getDatabase} from "firebase/database";
import { ReactiveGoogleMap } from "@appbaseio/reactivemaps";
import "./App.css";
const db=getDatabase();



class App extends Component {
  onData(resturant) {
    const stars = [];
    const { rating, cuisine, meal_period, type, location, photo } = resturant;
    for (let x = 0; x < rating; x++) {
      stars.push(
        <span key={x}>
          <i className="fa fa-star" />
        </span>
      );
    }

    return (
      <ReactiveList.ResultListWrapper>
        <ResultList key={resturant._id}>
        <ResultList.Image src={photo} />
          <ResultList.Content>
            <ResultList.Title>{resturant.name}</ResultList.Title>
            <ResultList.Description>
              <div>
                <p>{location}</p>
                <span className="tag">{cuisine}</span>
                <span className="tag">{meal_period}</span>
                <span className="tag">{type}</span>
                <span className="tag">{location}</span>
                <div>Avg. Student Reviews : {stars}</div>
              </div>
            </ResultList.Description>
          </ResultList.Content>
        </ResultList>
      </ReactiveList.ResultListWrapper>
    );
  }

  onPopoverClick(marker) {
    return (
      <div
        className="row"
        style={{ margin: "0", maxWidth: "300px", paddingTop: 10 }}
      >
        <div className="col s12">
          <div>
            <strong>{marker.name}</strong>
          </div>
          <p style={{ margin: "5px 0", lineHeight: "18px" }}>
            {marker.location}
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <ReactiveBase
          app="BruinFoodReview"
          url= "https://cs35l-project-d0556-default-rtdb.firebaseio.com"
          enableAppbase
        >
          <nav className="header">
            <a className="navbar-brand" href="#">
              BruinFoodReview
            </a>

            

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <div className="col-lg-7 dataSearch">
                <SearchBox
                  componentId="nameReactor"
                  placeholder="Search for Restaurants, Bars"
                  dataField="name"
                  searchInputId="NameSearch"
                  iconPosition="left"
                  renderError={(error) => (
                    <div>
                      Something went wrong with SearchBar
                      <br />
                      Error details
                      <br />
                      {error}
                    </div>
                  )}
                  queryFormat="and"
                  autosuggest={true}
                  filterLabel="search"
                  enableRecentSuggestions={true}
                  enablePopularSuggestions={true}
                  enablePredictiveSuggestions={true}
                  popularSuggestionsConfig={{
                    size: 3,
                    minHits: 2,
                    minChars: 4,
                  }}
                  recentSuggestionsConfig={{
                    size: 3,
                    minChars: 4,
                  }}
                  index="BruinFoodReview"
                  size={10}
                  addonAfter={<span className="focus-shortcut">/</span>}
                />
              </div>
              
            </div>
          </nav>

          <div className="row">
            <div className="col-8 col-lg-3 col-md-3 col-sm-4 scroll">

              <div className="box">
                <MultiList
                  dataField="cuisine.keyword"
                  title="Cuisine Options"
                  componentId="cuisineReactor"
                  placeholder="Filter Cuisine"
                  showFilter={true}
                  filterLabel="Cuisine Options"
                  react={{
                    and: [
                      "ratingsReactor",
                      "meal_periodReactor",
                      "typeReactor",
                      "locationReactor",,
                      "nameReactor",
                    ],
                  }}
                  renderError={(error) => (
                    <div>
                      Something went wrong with Cuisine MultiList
                      <br />
                      Error details
                      <br />
                      {error}
                    </div>
                  )}
                />
              </div>

              <div className="box">
                <MultiList
                  dataField="meal_period.keyword"
                  title="Meal Periods"
                  componentId="meal_periodReactor"
                  placeholder="Filter Meal Periods"
                  showFilter={true}
                  filterLabel="Meal Periods"
                  react={{
                    and: [
                      "ratingsReactor",
                      "cuisineReactor",
                      "typeReactor",
                      "locationReactor",
                      "nameReactor",
                    ],
                  }}
                  renderError={(error) => (
                    <div>
                      Something went wrong with Meal Period MultiList
                      <br />
                      Error details
                      <br />
                      {error}
                    </div>
                  )}
                />
              </div>

              <div className="box">
                <MultiList
                  dataField="type.keyword"
                  title="Type Options"
                  componentId="typeReactor"
                  placeholder="Filter Type"
                  showFilter={true}
                  filterLabel="Type Options"
                  react={{
                    and: [
                      "ratingsReactor",
                      "cuisineReactor",
                      "meal_periodReactor",
                      "locationReactor",
                      "nameReactor",
                    ],
                  }}
                  renderError={(error) => (
                    <div>
                      Something went wrong with Type MultiList
                      <br />
                      Error details
                      <br />
                      {error}
                    </div>
                  )}
                />
              </div>

              <div className="box">
                <MultiList
                  dataField="location.keyword"
                  title="Location Options"
                  componentId="locationReactor"
                  placeholder="Filter Location"
                  showFilter={true}
                  filterLabel="Location Options"
                  react={{
                    and: [
                      "ratingsReactor",
                      "cuisineReactor",
                      "meal_periodReactor",
                      "typeReactor",
                      "nameReactor",
                    ],
                  }}
                  renderError={(error) => (
                    <div>
                      Something went wrong with Location MultiList
                      <br />
                      Error details
                      <br />
                      {error}
                    </div>
                  )}
                />
              </div>


              <div className="box">
                <RatingsFilter
                  componentId="ratingsReactor"
                  dataField="rating"
                  title="Avg. Customer Reviews"
                  data={[
                    { start: 4, end: 5, label: ">= 4 stars" },
                    { start: 3, end: 5, label: ">= 3 stars" },
                    { start: 2, end: 5, label: ">= 2 stars" },
                    { start: 1, end: 5, label: "> 1 stars" },
                  ]}
                  showFilter={true}
                  filterLabel="Avg. Customer Reviews"
                  react={{
                    and: [""],
                  }}
                  renderError={(error) => (
                    <div>
                      Something went wrong with RatingsFilter
                      <br />
                      Error details
                      <br />
                      {error}
                    </div>
                  )}
                />
              </div>

            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-8 scroll marginBottom">
              <SelectedFilters />
              <ReactiveList
                componentId="queryResult"
                dataField="name"
                from={0}
                size={15}
                renderItem={this.onData}
                pagination={true}
                react={{
                  and: [
                    "ratingsReactor",
                    "cuisineReactor",
                    "meal_periodReactor",
                    "typeReactor",
                    "locationReactor",
                    "nameReactor",
                  ],
                }}
                renderError={(error) => (
                  <div>
                    Something went wrong with ResultList!
                    <br />
                    Error details
                    <br />
                    {error}
                  </div>
                )}
              />
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6">
              <ReactiveGoogleMap
                dataField="location"
                componentId="maps"
                defaultZoom={3}
                defaultCenter={{ lat: 14.55436, lng: -85.76 }}
                showMapStyles={true}
                showSearchAsMove={true}
                showMarkerClusters={true}
                defaultMapStyle="Light Monochrome"
                onPopoverClick={this.onPopoverClick}
                autoCenter={true}
                size={100}
                react={{
                  and: [
                    "ratingsReactor",
                    "cuisineReactor",
                    "meal_periodReactor",
                    "typeReactor",
                    "locationReactor",
                    "nameReactor",
                  ],
                }}
              />
            </div>
          </div>
        </ReactiveBase>
      </div>
    );
  }
}

export default App;

