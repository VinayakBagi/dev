const express = require('express')
const request = require('request')
const test = require('supertest')
const app = express()
const PORT = 3000
const date = new Date().getDate();
const url = 'https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22'

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
    if(!isDatePrime(date)){
        return res.status(200).send('Date is not prime so no date')        
    }
    
    request({ url: url, json: true }, (error, response) => {
        if(error){
            res.status(500).send('Unable to connect to weather service')
        }
        res.status(200).send(response)
    })       
})

// test case for above 
test(app)
  .get('/')
  .expect(200)
  .end((err, res) => {
    if (err) throw err;
  });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})