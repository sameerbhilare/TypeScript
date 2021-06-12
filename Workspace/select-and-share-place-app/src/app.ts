import axios from 'axios';

// get access to form
const form = document.querySelector('form')!;
// get entered address
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = '<Your API Key>';

// declare var google: any;

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

// event listener
function searchAddressHandler(event: Event) {
  event.preventDefault(); // prevent form submission. So to prevent HTTP request
  const enteredAddress = addressInput.value;

  // axios provides TS support, bcz it ships with .d.ts file for TS support
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      console.log(response);
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }
      // get first result
      const coordinates = response.data.results[0].geometry.location;

      // render the map
      //'google' is available due to the <script> tag added in index.html
      // And to get TS support, we are using @types/googlemaps npm package
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 16,
      });

      // show marker on the map
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

// form submit event listener
form.addEventListener('submit', searchAddressHandler);
