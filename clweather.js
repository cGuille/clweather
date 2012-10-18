#! /usr/bin/env node

(function () {
    'use strict';

    var format = require('util').format,
        request = require('request');

    var apiKey = require('./config').apiKey,
        urlBase = 'http://api.wunderground.com/api/%s/',
        apiURLFormat = format(urlBase, apiKey) + '%s',
        geoApiUrl = format(apiURLFormat, 'geolookup/q/autoip.json'),
        conditionsApiUrlFormat = format(apiURLFormat, 'conditions/forecast/q/%s/%s.json');

    request({ url: geoApiUrl, json: true }, function (error, response, geoData) {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        var countryCode = geoData.location.country_iso3166,
            city        = geoData.location.city,
            conditionsApiUrl = format(conditionsApiUrlFormat, countryCode, city);

        request({ url: conditionsApiUrl, json: true }, function (error, response, weatherData) {
            if (error) {
                console.error(error);
                process.exit(1);
            }

            var forecast = weatherData.forecast.txt_forecast,
                obs = weatherData.current_observation;

            console.info('\nWeather for ' + obs.display_location.full + ':');
            console.info('------------------------------------------');
            console.info('Current temperature: ' + obs.temp_f + '°F / ' + obs.temp_c + '°C\n');

            forecast.forecastday.forEach(function (day) {
                console.info(day.title + ':');
                console.info(day.fcttext, '\n');
            });
        });
    });

}());
