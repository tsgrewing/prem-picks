import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {rapidKey} from "../../config.js"

export function getCurrentRound() {
    const config ={
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures/rounds?season=2022&league=39",
      params: {league: "39", season:"2022", current: "true"},
      headers: {
        'x-rapidapi-key': rapidKey, 
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };
      axios(config)
    .then(response => {
      let week = response.data.response[0];
      setWeek(week);
      console.log(week);
    })
    .catch(err => {
      console.log(err);
    });
  };

  export function getMatches(chosenWeek) {

    const config = {
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures",
      params: {league: 39, season: 2022, round: chosenWeek}, 
      headers: {
        'x-rapidapi-key': rapidKey, 
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

    axios(config)
      .then((response) => {
        // setMatches(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });

    setWeek(chosenWeek);
  };