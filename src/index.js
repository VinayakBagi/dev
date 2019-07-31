const express = require('express')
const request = require('request')
const test = require('supertest')
const mongoose = require('mongoose');
const Weather = require('./model/weather')
const app = express()
const PORT = 3000
const date = new Date().getDate();
const url = 'https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22'

mongoose.connect('mongodb+srv://sride:6K8yopXFA73uQkVd@cluster0-cja9v.mongodb.net/testdb', {useNewUrlParser: true}, () => {
    console.log('Connected to mongodb server');    
});

let isDatePrime = (number) => {
	if (number == 1 || number == 2) {
		return true;
	}
	for (var i=2; i<number; i++) {
		if (number % i == 0) {
			return false;
		}
	} 
	return true;
}

app.get('/', (req, res) => {
    let message
    let isPrime = isDatePrime(date)
    if(!isPrime){        
        message = 'Date is not prime so no date'
        let WeatherData = new Weather({
            date: new Date(),
            day: date,
            isPrime,
            message
        })
        WeatherData.save().then(()=>{
            console.log('Weather data for non prime date added successfully');            
        }).catch((error) => {
            console.log(error);            
        })
        return res.status(200).send({ message })      
    }
    
    request({ url: url, json: true }, (error, response) => {
        if(error){
            return res.status(500).send('Unable to connect to weather service')
        }
        message = `Today temperature is ${response.body.main.temp}`
        let WeatherData = new Weather({
            date: new Date(),
            day: date,
            isPrime,
            message
        })
        WeatherData.save().then(()=>{
            console.log('Weather data for prime date added successfully');            
        }).catch((error) => {
            console.log(error);            
        })
        res.status(200).send({ message})        
    })        
    
})

// test case for above API
test(app)
  .get('/')
  .expect(200)
  .end((err, res) => {
    if (err) throw err;
  });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})